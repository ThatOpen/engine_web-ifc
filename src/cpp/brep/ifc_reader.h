#pragma once
// Port of the brep kernel's IFC reader (ifc.ts) plus the bench driver that uses it (path B).
// The reader functions keep their TS names; see ifc_reader.cpp.

#include <array>
#include <cstdint>
#include <memory>
#include <optional>
#include <string>
#include <tuple>
#include <utility>
#include <variant>
#include <vector>

#include "curves.h"
#include "ifc_entity.h"
#include "shell_data.h"

namespace webifc::geometry { class IfcGeometryProcessor; }

namespace brep {
class LinkedShellGraph;
#ifndef BREP_DECLINE_DEFINED
#define BREP_DECLINE_DEFINED
struct Decline {
  std::string reason;
};
#endif
}  // namespace brep

namespace brep::ifc {

using Row = std::array<double, 4>;
using Placement4x4 = std::array<Row, 4>;

/** The identity; passing this very object (by reference) means "no transform", as TS `=== IDENTITY`. */
extern const Placement4x4 IDENTITY;

/** Radians per plane-angle unit, nullopt when it could not be established (TS MakeSettings). */
struct MakeSettings {
  std::optional<double> angleToRadians;
};

/** A built solid or the reason it was not (TS `LinkedShellGraph | Decline`). */
using Solid = std::variant<std::unique_ptr<LinkedShellGraph>, Decline>;

// Reader (ifc.ts).
Placement4x4 compose(const Placement4x4& outer, const Placement4x4& inner);
Placement4x4 undoRigid(const Placement4x4& m);
P3 place(const Placement4x4& m, const P3& p);
P3 turn(const Placement4x4& m, const P3& d);
Placement4x4 axisFrame(Model& api, const Value& ref);
Placement4x4 placeOf(Model& api, const Value& ref, int depth = 0);
struct AngleScale { std::optional<double> scale; std::string source; };
AngleScale readPlaneAngleScale(Model& api);
Solid buildAnySolid(Model& api, uint32_t itemIdent, const Placement4x4& into = IDENTITY,
                    const MakeSettings& ctx = MakeSettings{}, int depth = 0);
Solid buildFaceSet(Model& api, uint32_t itemIdent, const Placement4x4& into = IDENTITY);
Solid buildSweptSolid(Model& api, uint32_t itemIdent, const Placement4x4& into = IDENTITY,
                      const MakeSettings& ctx = MakeSettings{});

// Knobs (module-level state in TS).
void setDirectVoids(bool on);
void setChainOrder(int order);  // 0 = null, 1 = forward, 2 = reverse
void setGrowSubtrahends(double fraction);
void setClearBoundedSides(bool on);
void setFlattenBoundedHalfSpaces(bool on);

// Bench helpers (units.mjs, repmap.mjs).
struct LengthScale { double scale = 1; std::string source; };
LengthScale unitLengthFactor(Model& api);
struct RepInfo { std::string rep; std::string type; };
/** geometry id -> representation, in TS Map insertion order. */
std::vector<std::pair<uint32_t, RepInfo>> buildRepMap(Model& api, const std::vector<uint32_t>& productIDs);

/** Timings and counts of one path-B pass. */
struct PassB {
  double totalMs = 0;     // whole pass
  double setupMs = 0;     // units, weld tolerance, voids map
  double mapMs = 0;       // representation walk (repmap)
  double kernelMs = 0;    // buildAnySolid + openings + cutAway + acceptance test
  double kernelGcycles = 0;  // kernel phase in CPU cycles (1e9), immune to other processes
  double buildMs = 0;     // of which: the body item itself (incl. boolean trees inside it)
  double toolMs = 0;      // of which: building the opening tools
  double cutMs = 0;       // of which: cutAway of the openings
  std::vector<std::tuple<std::string, double, long>> buildByKind;
  uint64_t digest = 1469598103934665603ull;  // FNV-1a over every accepted shell (BREP_DIGEST=1 only)  // item class -> ms, count
  double shellMs = 0;     // graph -> shell (points, profiles, holes)
  double fallbackMs = 0;  // web-ifc mesh + getShellData for items the kernel handed back
  long attempted = 0;     // distinct Body items tried by the kernel
  long items = 0;         // built by the kernel and accepted
  long coveredGeoms = 0;  // web-ifc geometries those items stand for (a surface model: one per shell)
  long profiles = 0;      // faces emitted (kernel + fallback)
  long kernelProfiles = 0;
  long fallback = 0;          // web-ifc geometries served by the fallback (A's unit)
  long fallbackFailed = 0;    // fallback geometries with no triangles or that getShellData refused
  long fallbackProducts = 0;  // GetFlatMesh calls
  long fallbackThrew = 0;     // GetFlatMesh calls that threw
  long ladderTries = 0;       // retry-ladder rebuilds (BREP_LADDER=1)
  long ladderRescued = 0;     // bodies a rung made acceptable
  double lengthScale = 1;
  std::optional<double> angleScale;
  std::vector<std::pair<std::string, long>> declines;  // reason -> count, first-seen order
};

/**
 * Path B over the products: for each product's Body items, build with the kernel (openings cut),
 * accept when the graph is watertight with no excess edges, emit the shell from the graph's faces;
 * anything else is built by web-ifc (GetFlatMesh of that product) and run through getShellData.
 */
PassB runB(Model& model, webifc::geometry::IfcGeometryProcessor& gp, const std::vector<uint32_t>& products,
           const brep::shells::GeometryProcessSettings& settings);

/** JSON object for a pass, with the first round's total for the warm-up comparison. */
std::string toJson(const PassB& pass, double firstTotalMs);

// ── The kernel as web-ifc's alternative geometry engine ─────────────────────────────────────────

/** One Body item the kernel built: points in file units, in the frame web-ifc's flat transformation
 *  for this geometry places (the item's own placement is in the points). `rings` per facet:
 *  ringCount, then per ring its length and its point indices; the first ring is the outer one. */
struct EngineShell {
  uint32_t geometryExpressID = 0;
  std::vector<double> points;
  std::vector<int32_t> rings;
  double firstPoint[3] = {0, 0, 0};  // the solid's first corner, for COORDINATE_TO_ORIGIN
  // Points are stored about the centre of their box, as web-ifc's IfcGeometry::Normalize stores a
  // mesh, and the placed geometry carries the centre in its transformation. Without it two copies of
  // one item at different places in the file (1,451 identical clips on one 130 MB part) are two
  // geometries to everything downstream, where web-ifc's are one.
  double center[3] = {0, 0, 0};
};

/** What the engine hands over for a product. */
struct EngineProduct;

class BrepEngine {
 public:
  BrepEngine(webifc::parsing::IfcLoader& loader, const webifc::schema::IfcSchemaManager& schemas,
             webifc::geometry::IfcGeometryProcessor& processor);
  ~BrepEngine();
  /** web-ifc's flat mesh of the product, with every item the kernel built left empty, and those
   *  items' shells. A product with openings is all or nothing: if the kernel refuses one of its Body
   *  items, web-ifc does the whole product (its openings are one boolean over all of them). */
  void flatMesh(uint32_t productID, void* flatMeshOut, std::vector<EngineShell>& shells);
  /** Only Body items that are booleans (IfcBooleanResult / IfcBooleanClippingResult), or belong to a
   *  product with openings, go to the kernel; web-ifc meshes everything else as with the mesh engine,
   *  keeping its shared geometries. The kernel is twice web-ifc's speed on booleans and slower on
   *  plain faceted breps, and it does not share repeated items, so this is where it pays. */
  bool booleansOnly = false;
  struct Stats {
    long products = 0, kernelItems = 0, refusedItems = 0, productsToWebIfc = 0;
    double kernelMs = 0, meshMs = 0;
    double mapMs = 0, buildMs = 0, mergeMs = 0, cacheMs = 0;  // parts of kernelMs
    long slivers = 0;  // closed results with no thickness, emitted as nothing
  } stats;

 private:
  struct Impl;
  std::unique_ptr<Impl> impl;
};

}  // namespace brep::ifc
