# cython: language_level=3
# distutils: language = c++
"""Cython bindings over the native web-ifc core (no WASM involved).

Argument marshalling mirrors the web-ifc JS API's GetLine shapes so backend
code can migrate from the Node/WASM pipeline with minimal changes:
entity lines come back as {"ID", "type", "arguments"} where leaf values are
{"type": <IfcTokenType>, "value": ...} wrappers, LABEL values additionally
carry "typecode". Divergences from the JS layer, both deliberate:
REAL values are Python floats (the wasm layer returns strings for JS
precision reasons), and nothing is ever excluded from geometry iteration —
pass exclude_types explicitly if you want the upstream viewer behaviour.
"""

from libc.stdint cimport int64_t, uint8_t, uint32_t, uint64_t
from libcpp cimport bool as cbool
from libcpp.string cimport string
from libcpp.vector cimport vector

cimport cython

import numpy as np
import threading
import weakref

# IfcTokenType values (enum IfcTokenType in IfcTokenStream.h)
DEF TOKEN_UNKNOWN = 0
DEF TOKEN_STRING = 1
DEF TOKEN_LABEL = 2
DEF TOKEN_ENUM = 3
DEF TOKEN_REAL = 4
DEF TOKEN_REF = 5
DEF TOKEN_EMPTY = 6
DEF TOKEN_SET_BEGIN = 7
DEF TOKEN_SET_END = 8
DEF TOKEN_LINE_END = 9
DEF TOKEN_INTEGER = 10

UNKNOWN = TOKEN_UNKNOWN
STRING = TOKEN_STRING
LABEL = TOKEN_LABEL
ENUM = TOKEN_ENUM
REAL = TOKEN_REAL
REF = TOKEN_REF
EMPTY = TOKEN_EMPTY
SET_BEGIN = TOKEN_SET_BEGIN
SET_END = TOKEN_SET_END
LINE_END = TOKEN_LINE_END
INTEGER = TOKEN_INTEGER


cdef extern from "IfcTokenStream.h" namespace "webifc::parsing":
    cdef enum IfcTokenType:
        pass


cdef extern from "IfcLoader.h" namespace "webifc::parsing":
    cdef cppclass IfcLoader:
        const vector[uint32_t] GetExpressIDsWithType(const uint32_t type) except +
        const vector[uint32_t] GetHeaderLinesWithType(const uint32_t type) except +
        uint32_t GetMaxExpressId() except +
        cbool IsValidExpressID(const uint32_t expressID) except +
        uint32_t GetLineType(const uint32_t expressID) except +
        cbool IsAtEnd() except +
        void MoveToLineArgument(const uint32_t expressID, const uint32_t argumentIndex) except +
        void MoveToHeaderLineArgument(const uint32_t lineID, const uint32_t argumentIndex) except +
        string GetDecodedStringArgument() except +
        double GetDoubleArgument() except +
        long GetIntArgument() except +
        uint32_t GetRefArgument() except +
        char GetTokenType "GetTokenType"() except +
        void MoveToArgumentOffset(const uint32_t expressID, const uint32_t argumentIndex) except +
        uint32_t GetNoLineArguments(uint32_t expressID) except +
        void StepBack() except +
        vector[uint32_t] GetAllLines() except +
        uint32_t GetNextExpressID(uint32_t expressId) except +


cdef extern from "ModelManager.h" namespace "webifc::manager":
    cdef cppclass LoaderSettings:
        LoaderSettings() except +
        cbool COORDINATE_TO_ORIGIN
        cbool INCLUDE_SPACES_AND_OPENINGS
        unsigned short CIRCLE_SEGMENTS
        uint32_t TAPE_SIZE
        uint64_t MEMORY_LIMIT
        unsigned short LINEWRITER_BUFFER
        double TOLERANCE_PLANE_INTERSECTION
        double TOLERANCE_PLANE_DEVIATION
        double TOLERANCE_BACK_DEVIATION_DISTANCE
        double TOLERANCE_INSIDE_OUTSIDE_PERIMETER
        double TOLERANCE_SCALAR_EQUALITY
        unsigned short PLANE_REFIT_ITERATIONS
        unsigned short BOOLEAN_UNION_THRESHOLD


cdef extern from "pybridge.h" namespace "webifc::pybridge":
    cdef cppclass FlatMeshData:
        uint32_t expressID
        vector[uint32_t] geometryExpressIDs
        vector[double] transformations
        vector[double] colors

    cdef cppclass Session:
        Session() except +
        int64_t OpenFromPath(const string &path, const LoaderSettings &settings, string &errorOut) except + nogil
        void Close(uint32_t modelID) except +
        void CloseAll() except +
        cbool IsOpen(uint32_t modelID) const
        cbool SaveToPath(uint32_t modelID, const string &path, cbool orderLinesByExpressID) except + nogil
        IfcLoader *Loader(uint32_t modelID) const
        uint64_t GetTotalSize(uint32_t modelID) const
        string SchemaName(uint32_t modelID) except +
        FlatMeshData GetFlatMesh(uint32_t modelID, uint32_t expressID) except + nogil
        const double *VertexData(uint32_t modelID, uint32_t geometryExpressID, size_t &countOut) except +
        const uint32_t *IndexData(uint32_t modelID, uint32_t geometryExpressID, size_t &countOut) except +
        void ClearGeometry(uint32_t modelID) except +
        vector[uint32_t] ElementTypes() const
        uint32_t TypeNameToCode(const string &name) except +
        string TypeCodeToName(uint32_t typeCode) except +
        cbool IsIfcElement(uint32_t typeCode) const
        void SetLogLevel(uint8_t level)

    string GetStringArgumentCopy(IfcLoader &loader) except +


class WebIfcError(RuntimeError):
    pass


cdef class Geometry:
    """Triangle geometry of one geometryExpressID.

    vertices: (N, 6) float64 — x, y, z, nx, ny, nz (double precision, richer
    than the WASM float32 path). indices: (M,) uint32, M % 3 == 0.
    """
    cdef readonly object vertices
    cdef readonly object indices
    cdef readonly uint32_t geometry_express_id
    cdef readonly object owner  # keeps the Model (and its session) alive for zero-copy views

    def __repr__(self):
        return f"Geometry(#{self.geometry_express_id}, {len(self.vertices)} vertices, {len(self.indices)//3} faces)"


cdef class PlacedGeometry:
    """One placed instance inside a FlatMesh."""
    cdef readonly uint32_t geometry_express_id
    cdef readonly object transformation  # (4, 4) float64, ready to right-multiply column vectors
    cdef readonly object color           # (4,) float64 RGBA

    def __repr__(self):
        return f"PlacedGeometry(geometry=#{self.geometry_express_id})"


cdef class FlatMesh:
    cdef readonly uint32_t express_id
    cdef readonly list geometries  # list[PlacedGeometry]

    def __repr__(self):
        return f"FlatMesh(#{self.express_id}, {len(self.geometries)} placed geometries)"


cdef _make_flat_mesh(FlatMeshData &data):
    cdef FlatMesh mesh = FlatMesh.__new__(FlatMesh)
    mesh.express_id = data.expressID
    mesh.geometries = []
    cdef size_t n = data.geometryExpressIDs.size()
    cdef size_t i, j
    cdef PlacedGeometry pg
    for i in range(n):
        pg = PlacedGeometry.__new__(PlacedGeometry)
        pg.geometry_express_id = data.geometryExpressIDs[i]
        # flatTransformation is column-major; numpy wants row-major, so build
        # the (4,4) with F-order semantics.
        t = np.empty(16, dtype=np.float64)
        for j in range(16):
            t[j] = data.transformations[i * 16 + j]
        pg.transformation = t.reshape(4, 4, order="F")
        c = np.empty(4, dtype=np.float64)
        for j in range(4):
            c[j] = data.colors[i * 4 + j]
        pg.color = c
        mesh.geometries.append(pg)
    return mesh


cdef class Model:
    """One open IFC model. Obtain via webifc.open()."""
    cdef ModelSession _session
    cdef uint32_t _model_id
    cdef cbool _closed
    cdef object __weakref__

    @property
    def model_id(self):
        return self._model_id

    @property
    def schema(self):
        with self._session._lock:
            self._check()
            return self._session._session.SchemaName(self._model_id).decode("utf-8")

    @property
    def max_express_id(self):
        with self._session._lock:
            self._check()
            return self._session._session.Loader(self._model_id).GetMaxExpressId()

    @property
    def tape_size(self):
        """Total token-tape size in bytes (uint64; unbounded by wasm limits)."""
        with self._session._lock:
            self._check()
            return self._session._session.GetTotalSize(self._model_id)

    cdef _check(self):
        if self._closed or not self._session._session.IsOpen(self._model_id):
            raise WebIfcError("model is closed")

    def close(self):
        with self._session._lock:
            if not self._closed:
                self._session._session.Close(self._model_id)
                self._closed = True

    def __enter__(self):
        return self

    def __exit__(self, *exc):
        self.close()
        return False

    def save(self, path, order_by_express_id=False):
        """Write the model back out as SPF (streaming, no size limit)."""
        cdef string cpath = str(path).encode("utf-8")
        cdef cbool order = order_by_express_id
        cdef cbool ok
        with self._session._lock:
            self._check()
            ok = self._session._session.SaveToPath(self._model_id, cpath, order)
        if not ok:
            raise WebIfcError(f"failed to save model to {path}")

    # ---- entity access ----------------------------------------------------

    def ids_of_type(self, type_spec):
        """express IDs with the given type (name like 'IFCWALL' or type code)."""
        cdef uint32_t code = self._type_code(type_spec)
        cdef vector[uint32_t] ids
        with self._session._lock:
            self._check()
            ids = self._session._session.Loader(self._model_id).GetExpressIDsWithType(code)
        return np.asarray(<uint32_t[:ids.size()]> ids.data()).copy() if ids.size() else np.empty(0, dtype=np.uint32)

    def all_ids(self):
        cdef vector[uint32_t] ids
        with self._session._lock:
            self._check()
            ids = self._session._session.Loader(self._model_id).GetAllLines()
        return np.asarray(<uint32_t[:ids.size()]> ids.data()).copy() if ids.size() else np.empty(0, dtype=np.uint32)

    def line_type(self, uint32_t express_id):
        with self._session._lock:
            self._check()
            return self._session._session.Loader(self._model_id).GetLineType(express_id)

    def is_valid_id(self, uint32_t express_id):
        with self._session._lock:
            self._check()
            return bool(self._session._session.Loader(self._model_id).IsValidExpressID(express_id))

    def get_line(self, uint32_t express_id):
        """{'ID', 'type', 'arguments'} — same shape as the web-ifc JS API."""
        cdef IfcLoader *loader
        cdef uint32_t line_type
        with self._session._lock:
            self._check()
            loader = self._session._session.Loader(self._model_id)
            if not loader.IsValidExpressID(express_id):
                raise WebIfcError(f"invalid expressID #{express_id}")
            line_type = loader.GetLineType(express_id)
            if line_type == 0:
                raise WebIfcError(f"expressID #{express_id} has no type")
            loader.MoveToArgumentOffset(express_id, 0)
            args = self._get_args(loader, False, False)
        return {"ID": express_id, "type": line_type, "arguments": args}

    def get_header_line(self, type_spec):
        cdef uint32_t code = self._type_code(type_spec)
        cdef IfcLoader *loader
        cdef vector[uint32_t] lines
        with self._session._lock:
            self._check()
            loader = self._session._session.Loader(self._model_id)
            lines = loader.GetHeaderLinesWithType(code)
            if lines.size() == 0:
                return None
            loader.MoveToHeaderLineArgument(lines[0], 0)
            args = self._get_args(loader, False, False)
        return {"ID": lines[0], "type": self._session.type_name(code), "arguments": args}

    cdef _read_value(self, IfcLoader *loader, char t):
        if t == TOKEN_STRING:
            return loader.GetDecodedStringArgument().decode("utf-8", "replace")
        elif t == TOKEN_ENUM:
            s = GetStringArgumentCopy(loader[0]).decode("ascii", "replace")
            if s == "T":
                return True
            if s == "F":
                return False
            if s == "U":
                return None
            return s
        elif t == TOKEN_REAL:
            return loader.GetDoubleArgument()
        elif t == TOKEN_INTEGER:
            return loader.GetIntArgument()
        elif t == TOKEN_REF:
            return loader.GetRefArgument()
        return None

    cdef _get_args(self, IfcLoader *loader, cbool in_object, cbool in_list):
        # Port of the wasm layer's GetArgs (web-ifc-wasm.cpp).
        cdef list arguments = []
        cdef cbool end_of_line = False
        cdef char t
        while not loader.IsAtEnd() and not end_of_line:
            t = loader.GetTokenType()
            if t == TOKEN_LINE_END or t == TOKEN_SET_END:
                end_of_line = True
            elif t == TOKEN_EMPTY:
                arguments.append(None)
            elif t == TOKEN_SET_BEGIN:
                arguments.append(self._get_args(loader, False, True))
            elif t == TOKEN_LABEL:
                loader.StepBack()
                label = GetStringArgumentCopy(loader[0]).decode("ascii", "replace")
                typecode = self._session._session.TypeNameToCode(label.encode("ascii"))
                loader.GetTokenType()  # consume set open
                value = self._get_args(loader, True, False)
                arguments.append({"type": TOKEN_LABEL, "typecode": typecode, "label": label, "value": value})
            elif t in (TOKEN_STRING, TOKEN_ENUM, TOKEN_REAL, TOKEN_INTEGER, TOKEN_REF):
                loader.StepBack()
                if in_object:
                    arguments.append(self._read_value(loader, t))
                else:
                    arguments.append({"type": t, "value": self._read_value(loader, t)})
            # TOKEN_UNKNOWN and anything else: skip, like upstream
        if len(arguments) == 0 and not in_list:
            return None
        if len(arguments) == 1 and in_object:
            return arguments[0]
        return arguments

    # ---- geometry ---------------------------------------------------------

    def flat_mesh(self, uint32_t express_id):
        """Generate (or fetch cached) geometry for one element.

        Buffers referenced by the returned FlatMesh stay valid until
        clear_geometry()/close(); fetch them with geometry().
        """
        cdef FlatMeshData data
        cdef uint32_t mid = self._model_id
        with self._session._lock:
            self._check()
            with nogil:
                data = self._session._session.GetFlatMesh(mid, express_id)
        return _make_flat_mesh(data)

    def geometry(self, uint32_t geometry_express_id, copy=True):
        """Buffers for one geometryExpressID from a prior flat_mesh call.

        copy=True (default) returns owned arrays. copy=False returns zero-copy
        views that are INVALIDATED by clear_geometry(), further flat_mesh
        calls that regenerate the same id, and close().
        """
        cdef size_t vcount = 0, icount = 0
        cdef const double *vptr
        cdef const uint32_t *iptr
        cdef Geometry geom = Geometry.__new__(Geometry)
        with self._session._lock:
            self._check()
            vptr = self._session._session.VertexData(self._model_id, geometry_express_id, vcount)
            iptr = self._session._session.IndexData(self._model_id, geometry_express_id, icount)
            geom.geometry_express_id = geometry_express_id
            geom.owner = self
            if vcount == 0:
                geom.vertices = np.empty((0, 6), dtype=np.float64)
            else:
                v = np.asarray(<const double[:vcount]> vptr).reshape(-1, 6)
                geom.vertices = v.copy() if copy else v
            if icount == 0:
                geom.indices = np.empty(0, dtype=np.uint32)
            else:
                ind = np.asarray(<const uint32_t[:icount]> iptr)
                geom.indices = ind.copy() if copy else ind
        return geom

    def clear_geometry(self):
        """Free the per-model geometry cache (invalidates zero-copy views)."""
        with self._session._lock:
            self._check()
            self._session._session.ClearGeometry(self._model_id)

    def iter_meshes(self, types=None, exclude_types=(), clear_per_element=True):
        """Stream (FlatMesh, dict[geometry_express_id, Geometry]) per element.

        Includes EVERY element type by default — IfcSpace and IfcOpeningElement
        are not special-cased here, unlike the upstream wasm layer. Memory
        stays bounded when clear_per_element=True (geometries are copies).
        """
        self._check()
        if types is None:
            type_codes = sorted(self._session._session.ElementTypes())
        else:
            type_codes = [self._type_code(t) for t in types]
        excluded = {self._type_code(t) for t in exclude_types}
        for code in type_codes:
            if code in excluded:
                continue
            for express_id in self.ids_of_type(code):
                mesh = self.flat_mesh(express_id)
                if not mesh.geometries:
                    continue
                geoms = {}
                for placed in mesh.geometries:
                    gid = placed.geometry_express_id
                    if gid not in geoms:
                        geoms[gid] = self.geometry(gid, copy=True)
                yield mesh, geoms
                if clear_per_element:
                    self.clear_geometry()

    # ---- helpers ----------------------------------------------------------

    cdef uint32_t _type_code(self, type_spec) except? 0:
        if isinstance(type_spec, str):
            return self._session._session.TypeNameToCode(type_spec.upper().encode("ascii"))
        return <uint32_t> type_spec


cdef class ModelSession:
    """Owns the native ModelManager. Safe for multi-threaded use: every
    operation on the same session is serialized by an internal lock."""
    cdef Session _session
    cdef object _lock
    cdef object _models  # weakrefs of issued Model handles

    def __cinit__(self):
        self._lock = threading.Lock()
        self._models = []

    def open(self, path,
             coordinate_to_origin=False,
             circle_segments=12,
             tape_size=67108864,
             memory_limit=2147483648,
             tolerance_plane_intersection=1.0e-4,
             tolerance_plane_deviation=1.0e-4,
             tolerance_back_deviation_distance=1.0e-4,
             tolerance_inside_outside_perimeter=1.0e-10,
             tolerance_scalar_equality=1.0e-4,
             plane_refit_iterations=1,
             boolean_union_threshold=150):
        """Open an IFC file from disk (streamed; bounded by memory_limit)."""
        cdef LoaderSettings settings
        settings.COORDINATE_TO_ORIGIN = coordinate_to_origin
        # Native bindings never filter; the flag only matters for the wasm API.
        settings.INCLUDE_SPACES_AND_OPENINGS = True
        settings.CIRCLE_SEGMENTS = circle_segments
        settings.TAPE_SIZE = tape_size
        settings.MEMORY_LIMIT = memory_limit
        settings.TOLERANCE_PLANE_INTERSECTION = tolerance_plane_intersection
        settings.TOLERANCE_PLANE_DEVIATION = tolerance_plane_deviation
        settings.TOLERANCE_BACK_DEVIATION_DISTANCE = tolerance_back_deviation_distance
        settings.TOLERANCE_INSIDE_OUTSIDE_PERIMETER = tolerance_inside_outside_perimeter
        settings.TOLERANCE_SCALAR_EQUALITY = tolerance_scalar_equality
        settings.PLANE_REFIT_ITERATIONS = plane_refit_iterations
        settings.BOOLEAN_UNION_THRESHOLD = boolean_union_threshold

        cdef string cpath = str(path).encode("utf-8")
        cdef string error
        cdef int64_t model_id
        with self._lock:
            with nogil:
                model_id = self._session.OpenFromPath(cpath, settings, error)
        if model_id < 0:
            raise WebIfcError(error.decode("utf-8"))
        cdef Model model = Model.__new__(Model)
        model._session = self
        model._model_id = <uint32_t> model_id
        model._closed = False
        self._models.append(weakref.ref(model))
        return model

    def close_all(self):
        with self._lock:
            self._session.CloseAll()
            # native model IDs restart from zero after CloseAllModels: without
            # this, stale handles would silently alias future models
            for ref in self._models:
                model = ref()
                if model is not None:
                    (<Model> model)._closed = True
            self._models = []

    def set_log_level(self, int level):
        """0=trace ... 4=error, 6=off (spdlog levels)."""
        self._session.SetLogLevel(<uint8_t> level)

    def element_types(self):
        cdef vector[uint32_t] types = self._session.ElementTypes()
        return sorted(types[i] for i in range(types.size()))

    def type_code(self, name):
        return self._session.TypeNameToCode(str(name).upper().encode("ascii"))

    def type_name(self, uint32_t code):
        return self._session.TypeCodeToName(code).decode("ascii")

    def is_ifc_element(self, uint32_t code):
        return bool(self._session.IsIfcElement(code))
