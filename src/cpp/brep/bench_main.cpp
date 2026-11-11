// brep-bench: the IfcImporter's geometry stage done two ways, natively, on the same opened model.
//
//   A  web-ifc builds a mesh per product (GetFlatMesh) -> getShellData re-merges triangles into faces.
//   B  the brep kernel builds each body item -> its faces are the shell; refused items fall back to A.
//
//   brep-bench <file.ifc> [--rounds N] [--only A|B] [--dump <expressID>]
//
// Prints one JSON line prefixed RESULT:.

#include <array>
#include <chrono>
#include <cmath>
#include <cstdio>
#include <fstream>
#include <iostream>
#include <sstream>
#include <string>
#include <unordered_set>
#include <vector>

#include "../web-ifc/geometry/IfcGeometryProcessor.h"
#include "../web-ifc/parsing/IfcLoader.h"
#include "../web-ifc/schema/IfcSchemaManager.h"
#include "../web-ifc/schema/ifc-schema.h"
#include <spdlog/spdlog.h>
#include "ifc_entity.h"
#include "shell_data.h"
#include "sampler.h"
#include <cstdlib>
#ifdef _WIN32
#include <windows.h>
#include <psapi.h>
#include <timeapi.h>
#include <atomic>
#include <thread>
#endif
#ifdef BREP_HAVE_KERNEL
#include "ifc_reader.h"
#endif

using Clock = std::chrono::steady_clock;
static double msSince(Clock::time_point t) { return std::chrono::duration<double, std::milli>(Clock::now() - t).count(); }

static std::string readFile(const std::string& path) {
  std::ifstream f(path, std::ios::binary);
  if (!f) throw std::runtime_error("cannot open " + path);
  std::ostringstream ss;
  ss << f.rdbuf();
  return ss.str();
}

static void dumpValue(const brep::ifc::Value& v, std::ostream& o) {
  using K = brep::ifc::Value::Kind;
  switch (v.kind) {
    case K::Null: o << "null"; break;
    case K::Number: o << v.num; break;
    case K::String: o << '"' << v.str << '"'; break;
    case K::Enum: o << '.' << v.str << '.'; break;
    case K::Bool: o << (v.flag ? "T" : "F"); break;
    case K::Ref: o << '#' << v.ref; break;
    case K::List: o << '('; for (size_t i = 0; i < v.list.size(); i++) { if (i) o << ','; dumpValue(v.list[i], o); } o << ')'; break;
    case K::Typed: o << "typed" << v.typeCode << '['; if (!v.list.empty()) dumpValue(v.list[0], o); o << ']'; break;
  }
}

struct PassA {
  double totalMs = 0, meshMs = 0, shellMs = 0;
  long items = 0, profiles = 0, failed = 0;
};

// The importer's loadShellGeometry, minus its bookkeeping (dedupe hash, transforms): buffers out of
// web-ifc, units applied, then getShellData.
// BENCH_HASHFILE=path: per geometry id, an order-free fingerprint of its points (quantized to 0.1 mm,
// deduplicated, sorted), from web-ifc (pass A) and from the kernel (pass E), so which items each
// engine can share is countable outside. Lines: "A|E <geoID> <points> <hash>".
#include <algorithm>
static std::ofstream* hashOut() {
  static std::ofstream* f = [] { const char* p = std::getenv("BENCH_HASHFILE"); return p ? new std::ofstream(p) : nullptr; }();
  return f;
}
static void hashPoints(char tag, uint32_t geo, const double* xyz, size_t n, size_t stride) {
  if (const char* d = std::getenv("BENCH_DUMPGEO")) { std::string ids = std::string(",") + d + ","; if (ids.find("," + std::to_string(geo) + ",") != std::string::npos) { std::cerr << tag << " " << geo << ":"; for (size_t i = 0; i < n && i < 8; i++) std::cerr << " (" << xyz[i*stride] << "," << xyz[i*stride+1] << "," << xyz[i*stride+2] << ")"; std::cerr << '\n'; } }
  std::vector<std::array<long long, 3>> q(n);
  for (size_t i = 0; i < n; i++) for (int k = 0; k < 3; k++) q[i][k] = std::llround(xyz[i * stride + k] * 10000.0);
  std::sort(q.begin(), q.end());
  q.erase(std::unique(q.begin(), q.end()), q.end());
  unsigned long long h = 1469598103934665603ull;
  for (auto& p : q) for (int k = 0; k < 3; k++) { h ^= (unsigned long long)p[k]; h *= 1099511628211ull; }
  *hashOut() << tag << " " << geo << " " << q.size() << " " << h << '\n';
}
// BENCH_COLORS=path: the colour of every placed geometry, "A|E <product> <geo> r g b a", per engine.
static std::ofstream* colorOut() {
  static std::ofstream* f = [] { const char* p = std::getenv("BENCH_COLORS"); return p ? new std::ofstream(p) : nullptr; }();
  return f;
}
static void colorLine(char tag, uint32_t pid, const webifc::geometry::IfcPlacedGeometry& g) {
  if (colorOut()) *colorOut() << tag << " " << pid << " " << g.geometryExpressID << " " << g.color.x << " " << g.color.y << " " << g.color.z << " " << g.color.w << '\n';
}
static bool shellFromWebIfc(webifc::geometry::IfcGeometryProcessor& gp, const webifc::geometry::IfcPlacedGeometry& placed,
                            const brep::shells::GeometryProcessSettings& settings, PassA& s) {
  auto t0 = Clock::now();
  auto& geom = gp.GetGeometry(placed.geometryExpressID);
  const float* vd = reinterpret_cast<const float*>(geom.GetVertexData());
  uint32_t vn = geom.GetVertexDataSize();
  const uint32_t* id = reinterpret_cast<const uint32_t*>(geom.GetIndexData());
  uint32_t in = geom.GetIndexDataSize();
  if (vn == 0 || in == 0) { s.meshMs += msSince(t0); return false; }
  if (hashOut()) { std::vector<double> p(vn / 6 * 3); for (uint32_t i = 0; i < vn / 6; i++) for (int k = 0; k < 3; k++) p[i * 3 + k] = vd[i * 6 + k]; hashPoints('A', placed.geometryExpressID, p.data(), vn / 6, 3); }
  // Scale per axis from the placement, as removeScale does.
  const auto& m = placed.flatTransformation;
  double sx = std::sqrt(m[0] * m[0] + m[1] * m[1] + m[2] * m[2]);
  double sy = std::sqrt(m[4] * m[4] + m[5] * m[5] + m[6] * m[6]);
  double sz = std::sqrt(m[8] * m[8] + m[9] * m[9] + m[10] * m[10]);
  std::vector<float> pos(vn / 2), nor(vn / 2);
  for (uint32_t i = 0; i < vn; i += 6) {
    pos[i / 2] = (float)(vd[i] * sx); pos[i / 2 + 1] = (float)(vd[i + 1] * sy); pos[i / 2 + 2] = (float)(vd[i + 2] * sz);
    nor[i / 2] = vd[i + 3]; nor[i / 2 + 1] = vd[i + 4]; nor[i / 2 + 2] = vd[i + 5];
  }
  auto t1 = Clock::now();
  s.meshMs += std::chrono::duration<double, std::milli>(t1 - t0).count();
  try {
    auto shell = brep::shells::getShellData(pos.data(), nor.data(), pos.size(), id, in, false, settings);
    s.shellMs += msSince(t1);
    s.profiles += (long)shell.profilesFaceIds.size();
    return true;
  } catch (...) {
    s.shellMs += msSince(t1);
    return false;
  }
}

static PassA runA(webifc::geometry::IfcGeometryProcessor& gp, const std::vector<uint32_t>& products,
                  const brep::shells::GeometryProcessSettings& settings) {
  PassA s;
  std::unordered_set<uint32_t> done;
  auto t0 = Clock::now();
  // BENCH_TRACE=1: each product's id before it is meshed and its time after, on stderr, so a product
  // that never returns is named by the last line.
  static const bool trace = std::getenv("BENCH_TRACE") != nullptr;
  for (uint32_t pid : products) {
    auto tm = Clock::now();
    if (trace) std::cerr << "A " << pid << std::flush;
    webifc::geometry::IfcFlatMesh mesh = gp.GetFlatMesh(pid);
    const double took = msSince(tm);
    if (trace) std::cerr << ' ' << took << "\n";
    s.meshMs += took;
    // BENCH_GEOMSTATS=path: per product, the volume, world box and closedness of web-ifc's mesh,
    // so two builds can be compared element by element. "pid volume lx ly lz hx hy hz open".
    static std::ofstream* stats = [] { const char* p = std::getenv("BENCH_GEOMSTATS"); return p ? new std::ofstream(p) : nullptr; }();
    if (stats) {
      double vol = 0, lo[3] = {1e300, 1e300, 1e300}, hi[3] = {-1e300, -1e300, -1e300};
      long open = 0;
      for (auto& placed : mesh.geometries) {
        auto& g = gp.GetGeometry(placed.geometryExpressID);
        const float* vd = reinterpret_cast<const float*>(g.GetVertexData());
        const uint32_t* ix = reinterpret_cast<const uint32_t*>(g.GetIndexData());
        const uint32_t in = g.GetIndexDataSize();
        const auto& m = placed.flatTransformation;
        auto world = [&](uint32_t v, double* o) {
          const double x = vd[v * 6], y = vd[v * 6 + 1], z = vd[v * 6 + 2];
          o[0] = m[0] * x + m[4] * y + m[8] * z + m[12];
          o[1] = m[1] * x + m[5] * y + m[9] * z + m[13];
          o[2] = m[2] * x + m[6] * y + m[10] * z + m[14];
        };
        std::unordered_map<std::string, int> darts;
        auto key = [&](const double* p) { char b[96]; std::snprintf(b, sizeof b, "%.5f,%.5f,%.5f", p[0], p[1], p[2]); return std::string(b); };
        for (uint32_t t = 0; t + 2 < in; t += 3) {
          double a[3], b[3], c[3];
          world(ix[t], a); world(ix[t + 1], b); world(ix[t + 2], c);
          vol += (a[0] * (b[1] * c[2] - b[2] * c[1]) - a[1] * (b[0] * c[2] - b[2] * c[0]) + a[2] * (b[0] * c[1] - b[1] * c[0])) / 6;
          for (const double* p : {a, b, c}) for (int k = 0; k < 3; k++) { lo[k] = std::min(lo[k], p[k]); hi[k] = std::max(hi[k], p[k]); }
          const std::string ka = key(a), kb = key(b), kc = key(c);
          if (ka == kb || kb == kc || kc == ka) continue;
          darts[ka + ">" + kb]++; darts[kb + ">" + kc]++; darts[kc + ">" + ka]++;
        }
        for (const auto& [d, n] : darts) {
          const size_t at = d.find('>');
          auto it = darts.find(d.substr(at + 1) + ">" + d.substr(0, at));
          if (n != 1 || it == darts.end() || it->second != 1) open++;
        }
      }
      *stats << pid << ' ' << vol << ' ' << lo[0] << ' ' << lo[1] << ' ' << lo[2] << ' ' << hi[0] << ' ' << hi[1] << ' ' << hi[2] << ' ' << open << '\n';
    }
    for (auto& placed : mesh.geometries) colorLine('A', pid, placed);
    for (auto& placed : mesh.geometries) {
      if (!done.insert(placed.geometryExpressID).second) continue;
      if (shellFromWebIfc(gp, placed, settings, s)) s.items++; else s.failed++;
    }
    gp.Clear();
  }
  s.totalMs = msSince(t0);
  return s;
}

#ifdef BREP_HAVE_KERNEL
// The kernel as web-ifc's engine (BrepEngine), timed like runA: web-ifc's flat mesh with the kernel's
// items left out, their shells handed over, everything else through getShellData.
struct PassE {
  double totalMs = 0;
  long kernelGeoms = 0, webifcGeoms = 0, failed = 0;
  brep::ifc::BrepEngine::Stats stats;
};
static PassE runEngine(webifc::parsing::IfcLoader& loader, const webifc::schema::IfcSchemaManager& schemas,
                       const std::vector<uint32_t>& products, const brep::shells::GeometryProcessSettings& settings) {
  PassE e;
  webifc::geometry::IfcGeometryProcessor gp(loader, schemas, 12, true, 1.0E-04, 1.0E-04, 1.0E-04, 1.0E-10, 1.0E-04, 1, 150);
  auto t0 = Clock::now();
  brep::ifc::BrepEngine engine(loader, schemas, gp);
  std::unordered_set<uint32_t> done;
  std::vector<brep::ifc::EngineShell> shells;
  PassA a;
  // BENCH_MEMTRACE=1: each product whose run raised the process's peak working set by > 20 MB, on
  // stderr ("MEM pid ms peakMB +deltaMB"), so a memory spike is named by its product.
  static const bool memTrace = std::getenv("BENCH_MEMTRACE") != nullptr;
  size_t lastPeak = 0;
  for (uint32_t pid : products) {
    webifc::geometry::IfcFlatMesh mesh;
    const auto tp = Clock::now();
    engine.flatMesh(pid, &mesh, shells);
#ifdef _WIN32
    if (memTrace) {
      PROCESS_MEMORY_COUNTERS pmc{};
      if (K32GetProcessMemoryInfo(GetCurrentProcess(), &pmc, sizeof pmc)) {
        if (pmc.PeakWorkingSetSize > lastPeak + (20u << 20))
          std::cerr << "MEM " << pid << ' ' << msSince(tp) << ' ' << (pmc.PeakWorkingSetSize >> 20) << " +" << ((pmc.PeakWorkingSetSize - lastPeak) >> 20) << '\n';
        if (pmc.PeakWorkingSetSize > lastPeak) lastPeak = pmc.PeakWorkingSetSize;
      }
    }
#else
    (void)memTrace; (void)lastPeak; (void)tp;
#endif
    std::unordered_set<uint32_t> fromKernel;
    for (const auto& s : shells) fromKernel.insert(s.geometryExpressID);
    for (auto& placed : mesh.geometries) colorLine('E', pid, placed);
    for (auto& placed : mesh.geometries) {
      if (!done.insert(placed.geometryExpressID).second) continue;
      if (fromKernel.count(placed.geometryExpressID)) {
        e.kernelGeoms++;
        if (hashOut()) for (const auto& sh : shells) if (sh.geometryExpressID == placed.geometryExpressID) hashPoints('E', sh.geometryExpressID, sh.points.data(), sh.points.size() / 3, 3);
        continue;
      }
      if (shellFromWebIfc(gp, placed, settings, a)) e.webifcGeoms++; else e.failed++;
    }
    gp.Clear();
  }
  e.totalMs = msSince(t0);
  e.stats = engine.stats;
  return e;
}

// Does every kernel shell land where web-ifc puts the same geometry? World boxes, both without
// COORDINATE_TO_ORIGIN, compared per geometry id.
static void frameCheck(webifc::parsing::IfcLoader& loader, const webifc::schema::IfcSchemaManager& schemas,
                       const std::vector<uint32_t>& products, std::ostream& o) {
  using Box = std::array<double, 6>;
  auto empty = [] { return Box{1e300, 1e300, 1e300, -1e300, -1e300, -1e300}; };
  auto add = [](Box& b, const std::array<double, 16>& m, double x, double y, double z) {
    const double p[3] = {m[0] * x + m[4] * y + m[8] * z + m[12], m[1] * x + m[5] * y + m[9] * z + m[13], m[2] * x + m[6] * y + m[10] * z + m[14]};
    for (int k = 0; k < 3; k++) { b[k] = std::min(b[k], p[k]); b[k + 3] = std::max(b[k + 3], p[k]); }
  };
  webifc::geometry::IfcGeometryProcessor ref(loader, schemas, 12, false, 1.0E-01, 3.0E-04, 3.0E-04, 1.0E-10, 1.0E-04, 10, 150);
  webifc::geometry::IfcGeometryProcessor gp(loader, schemas, 12, false, 1.0E-01, 3.0E-04, 3.0E-04, 1.0E-10, 1.0E-04, 10, 150);
  brep::ifc::BrepEngine engine(loader, schemas, gp);
  long checked = 0, bad = 0, missing = 0;
  std::vector<std::string> worst;
  std::vector<brep::ifc::EngineShell> shells;
  for (uint32_t pid : products) {
    webifc::geometry::IfcFlatMesh mesh;
    engine.flatMesh(pid, &mesh, shells);
    if (shells.empty()) { gp.Clear(); continue; }
    webifc::geometry::IfcFlatMesh refMesh = ref.GetFlatMesh(pid);
    // Placement by placement, in order: one item can be placed several times in one product.
    std::unordered_map<uint32_t, const brep::ifc::EngineShell*> shellOf;
    for (const auto& s : shells) shellOf[s.geometryExpressID] = &s;
    for (auto& [id, sp] : shellOf) {
      bool placed = false;
      for (auto& pg : mesh.geometries) if (pg.geometryExpressID == id) placed = true;
      if (!placed) missing++;
    }
    const size_t n = std::min(mesh.geometries.size(), refMesh.geometries.size());
    for (size_t gi = 0; gi < n; gi++) {
      const auto& mine = mesh.geometries[gi];
      const auto& theirs = refMesh.geometries[gi];
      auto found = shellOf.find(mine.geometryExpressID);
      if (found == shellOf.end() || theirs.geometryExpressID != mine.geometryExpressID) continue;
      const brep::ifc::EngineShell& s = *found->second;
      Box kb = empty(), wb = empty();
      for (size_t i = 0; i + 2 < s.points.size(); i += 3) add(kb, mine.flatTransformation, s.points[i], s.points[i + 1], s.points[i + 2]);
      auto& g = ref.GetGeometry(theirs.geometryExpressID);
      const float* vd = reinterpret_cast<const float*>(g.GetVertexData());
      for (uint32_t i = 0; i + 5 < g.GetVertexDataSize(); i += 6) add(wb, theirs.flatTransformation, vd[i], vd[i + 1], vd[i + 2]);
      if (wb[0] > wb[3]) continue;  // web-ifc made nothing of it: nothing to compare against
      checked++;
      double diag = 0, off = 0;
      for (int k = 0; k < 3; k++) diag = std::max(diag, wb[k + 3] - wb[k]);
      for (int k = 0; k < 6; k++) off = std::max(off, std::fabs(kb[k] - wb[k]));
      if (off > 1e-3 * diag + 1e-3) {
        bad++;
        if (worst.size() < 8) worst.push_back(std::to_string(s.geometryExpressID) + ":" + std::to_string(off / std::max(diag, 1e-9)));
        if (std::getenv("BREP_FRAMELOG"))
          std::fprintf(stderr, "FRAME %u %s off %.6g diag %.6g\n", s.geometryExpressID,
                       schemas.IfcTypeCodeToType(loader.GetLineType(s.geometryExpressID)).c_str(), off, diag);
      }
    }
    gp.Clear();
    ref.Clear();
  }
  o << ",\"frame\":{\"checked\":" << checked << ",\"bad\":" << bad << ",\"missing\":" << missing << ",\"worst\":\"";
  for (size_t i = 0; i < worst.size(); i++) o << (i ? " " : "") << worst[i];
  o << "\"}";
}
#endif

#ifdef _WIN32
// BENCH_SAMPLE=path: a sampling profiler. A thread suspends the main thread every ~1 ms, unwinds its
// stack (x64 unwind tables) and writes one line per sample: the frames' addresses relative to the
// image base, innermost first. Symbolize with llvm-symbolizer on a build with line tables.
struct Sampler {
  std::thread worker;
  std::atomic<bool> stop{false};
  std::FILE* out = nullptr;
  void start(const char* path) {
    out = std::fopen(path, "w");
    if (!out) return;
    HANDLE self = nullptr;
    DuplicateHandle(GetCurrentProcess(), GetCurrentThread(), GetCurrentProcess(), &self, 0, FALSE, DUPLICATE_SAME_ACCESS);
    const DWORD64 base = (DWORD64)GetModuleHandleW(nullptr);
    worker = std::thread([this, self, base] {
      timeBeginPeriod(1);
      while (!stop.load()) {
        Sleep(1);
        if (SuspendThread(self) == (DWORD)-1) break;
        CONTEXT ctx{};
        ctx.ContextFlags = CONTEXT_FULL;
        if (GetThreadContext(self, &ctx)) {
          DWORD64 frames[32];
          int n = 0;
          for (; n < 32 && ctx.Rip; n++) {
            frames[n] = ctx.Rip;
            DWORD64 imageBase = 0;
            PRUNTIME_FUNCTION fn = RtlLookupFunctionEntry(ctx.Rip, &imageBase, nullptr);
            if (!fn) { ctx.Rip = *(DWORD64*)ctx.Rsp; ctx.Rsp += 8; continue; }
            void* handlerData = nullptr;
            DWORD64 establisher = 0;
            RtlVirtualUnwind(UNW_FLAG_NHANDLER, imageBase, ctx.Rip, fn, &ctx, &handlerData, &establisher, nullptr);
          }
          ResumeThread(self);
          for (int i = 0; i < n; i++) std::fprintf(out, i ? " %llx" : "%llx", (unsigned long long)(frames[i] - base));
          std::fputc('\n', out);
        } else {
          ResumeThread(self);
        }
      }
      timeEndPeriod(1);
    });
  }
  ~Sampler() {
    stop = true;
    if (worker.joinable()) worker.join();
    if (out) std::fclose(out);
  }
};
#endif

int main(int argc, char** argv) {
  if (argc < 2) { std::cerr << "usage: brep-bench <file.ifc> [--rounds N] [--only A|B] [--dump id]\n"; return 2; }
#ifdef _WIN32
  static Sampler sampler;
  if (const char* p = std::getenv("BENCH_SAMPLE")) sampler.start(p);
#endif
  std::string path = argv[1];
  int rounds = 2;
  std::string only;
  long dumpId = -1;
  bool engineMode = false, checkFrames = false;
  for (int i = 2; i < argc; i++) {
    std::string a = argv[i];
    if (a == "--rounds" && i + 1 < argc) rounds = std::stoi(argv[++i]);
    else if (a == "--only" && i + 1 < argc) only = argv[++i];
    else if (a == "--dump" && i + 1 < argc) dumpId = std::stol(argv[++i]);
    else if (a == "--engine") engineMode = true;
    else if (a == "--frames") checkFrames = true;
  }

  spdlog::set_level(spdlog::level::off);
  std::string content = readFile(path);
  webifc::schema::IfcSchemaManager schemas;
  webifc::parsing::IfcLoader loader(67108864, 2147483648u, 10000, schemas);
  auto tp = Clock::now();
  loader.LoadFile([&](char* dest, size_t off, size_t size) {
    uint32_t len = (uint32_t)std::min(content.size() - off, size);
    std::copy(content.data() + off, content.data() + off + len, dest);
    return len;
  });
  double parseMs = msSince(tp);

  brep::ifc::Model model(loader, schemas);
  if (dumpId >= 0) {
    const auto* e = model.line((uint32_t)dumpId);
    if (!e) { std::cout << "no line\n"; return 1; }
    std::cout << '#' << e->id << " = " << e->kind() << " (" << e->type << ")\n";
    for (size_t i = 0; i < e->args.size(); i++) {
      std::cout << "  " << (e->info && i < e->info->attrs.size() ? e->info->attrs[i] : std::string("?")) << " = ";
      dumpValue(e->args[i], std::cout);
      std::cout << '\n';
    }
    return 0;
  }

  // Products the kernel bake lists: every IfcProduct except the subtraction features.
  std::unordered_set<uint32_t> cutouts;
  for (uint32_t id : model.idsWithType(webifc::schema::IFCFEATUREELEMENTSUBTRACTION, true)) cutouts.insert(id);
  std::vector<uint32_t> products;
  for (uint32_t id : model.idsWithType(webifc::schema::IFCPRODUCT, true)) if (!cutouts.count(id)) products.push_back(id);

  // The importer's settings: COORDINATE_TO_ORIGIN true, everything else web-ifc's default.
  webifc::geometry::IfcGeometryProcessor gp(loader, schemas, 12, true, 1.0E-04, 1.0E-04, 1.0E-04, 1.0E-10, 1.0E-04, 1, 150);
  brep::shells::GeometryProcessSettings settings;

  std::vector<PassA> as;
#ifdef BREP_HAVE_KERNEL
  std::vector<brep::ifc::PassB> bs;
  std::vector<PassE> es;
#endif
  { const char* pp = std::getenv("BREP_PROF"); brep::prof::start(pp ? pp : ""); }
  for (int r = 0; r < rounds; r++) {
    if (only != "B") as.push_back(runA(gp, products, settings));
#ifdef BREP_HAVE_KERNEL
    if (only != "A" && !engineMode) bs.push_back(brep::ifc::runB(model, gp, products, settings));
    if (engineMode) es.push_back(runEngine(loader, schemas, products, settings));
#endif
  }

  brep::prof::stop();
  std::ostringstream o;
  o << "RESULT:{\"file\":\"" << path.substr(path.find_last_of("/\\") + 1) << "\",\"mb\":" << content.size() / 1e6
    << ",\"parseMs\":" << parseMs << ",\"products\":" << products.size();
  if (!as.empty()) {
    const auto& a = as.back();
    o << ",\"A\":{\"totalMs\":" << a.totalMs << ",\"meshMs\":" << a.meshMs << ",\"shellMs\":" << a.shellMs
      << ",\"items\":" << a.items << ",\"profiles\":" << a.profiles << ",\"failed\":" << a.failed
      << ",\"firstMs\":" << as.front().totalMs << "}";
  }
#ifdef BREP_HAVE_KERNEL
  if (!bs.empty()) {
    // The fastest round: on a loaded machine the minimum is the least contaminated estimate.
    size_t best = bs.size() - 1;
    for (size_t i = 1; i < bs.size(); i++) if (bs[i].kernelGcycles < bs[best].kernelGcycles) best = i;
    o << ",\"B\":" << brep::ifc::toJson(bs[best], bs.front().totalMs);
  }
  if (!es.empty()) {
    size_t best = 0;
    for (size_t i = 1; i < es.size(); i++) if (es[i].totalMs < es[best].totalMs) best = i;
    const PassE& e = es[best];
    o << ",\"E\":{\"totalMs\":" << e.totalMs << ",\"kernelGeoms\":" << e.kernelGeoms << ",\"webifcGeoms\":" << e.webifcGeoms << ",\"failed\":" << e.failed
      << ",\"kernelMs\":" << e.stats.kernelMs << ",\"meshMs\":" << e.stats.meshMs << ",\"refusedItems\":" << e.stats.refusedItems
      << ",\"productsToWebIfc\":" << e.stats.productsToWebIfc << ",\"mapMs\":" << e.stats.mapMs << ",\"buildMs\":" << e.stats.buildMs << ",\"mergeMs\":" << e.stats.mergeMs << ",\"cacheMs\":" << e.stats.cacheMs << ",\"slivers\":" << e.stats.slivers << "}";
  }
  if (checkFrames) frameCheck(loader, schemas, products, o);
#endif
  o << "}";
  std::cout << o.str() << std::endl;
  return 0;
}
