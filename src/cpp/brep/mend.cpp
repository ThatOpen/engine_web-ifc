// mend.cpp — the last chance for a body that came out of the kernel not quite closed. Port of mend.ts.
#include "mend.h"

#include <algorithm>
#include <cmath>
#include <cstring>
#include <limits>
#include <unordered_map>
#include <unordered_set>
#include <vector>

#include "tessellate.h"

namespace brep {

namespace {

inline int64_t edgeKey(int32_t a, int32_t b) {
  return static_cast<int64_t>((static_cast<uint64_t>(static_cast<uint32_t>(a)) << 32) |
                              static_cast<uint32_t>(b));
}

// Every undirected edge used exactly twice, once in each direction.
bool isClosed(const std::vector<int32_t>& tris) {
  std::unordered_map<int64_t, int32_t> uses;
  uses.reserve(tris.size() * 2);
  for (size_t i = 0; i < tris.size(); i += 3)
    for (int e = 0; e < 3; e++) uses[edgeKey(tris[i + e], tris[i + (e + 1) % 3])]++;
  for (const auto& [k, n] : uses) {
    if (n != 1) return false;
    const int32_t a = static_cast<int32_t>(static_cast<uint64_t>(k) >> 32);
    const int32_t b = static_cast<int32_t>(static_cast<uint64_t>(k) & 0xffffffffu);
    const auto back = uses.find(edgeKey(b, a));
    if (back == uses.end() || back->second != 1) return false;
  }
  return true;
}

// Grid cell key as TS `${i}|${j}|${k}` sees it: -0 is 0.
struct CellKey {
  uint64_t i, j, k;
  bool operator==(const CellKey& o) const { return i == o.i && j == o.j && k == o.k; }
};
struct CellKeyHash {
  size_t operator()(const CellKey& c) const {
    uint64_t h = c.i * 0x9E3779B97F4A7C15ULL;
    h ^= c.j + 0x7F4A7C159E3779B9ULL + (h << 6) + (h >> 2);
    h ^= c.k + 0x94D049BB133111EBULL + (h << 6) + (h >> 2);
    return static_cast<size_t>(h);
  }
};
inline uint64_t numberKey(double v) {
  if (v == 0) v = 0;
  if (std::isnan(v)) v = std::numeric_limits<double>::quiet_NaN();
  uint64_t b;
  std::memcpy(&b, &v, 8);
  return b;
}

struct TripleKey {
  int32_t a, b, c;
  bool operator==(const TripleKey& o) const { return a == o.a && b == o.b && c == o.c; }
};
struct TripleKeyHash {
  size_t operator()(const TripleKey& t) const {
    uint64_t h = static_cast<uint32_t>(t.a) * 0x9E3779B97F4A7C15ULL;
    h ^= static_cast<uint32_t>(t.b) + 0x7F4A7C159E3779B9ULL + (h << 6) + (h >> 2);
    h ^= static_cast<uint32_t>(t.c) + 0x94D049BB133111EBULL + (h << 6) + (h >> 2);
    return static_cast<size_t>(h);
  }
};

}  // namespace

MendResult mendMesh(const TriangleBatch& input, double tolerance, double maxFilledShare) {
  auto refuse = [](const char* refused) {
    MendResult r;
    r.refused = refused;
    return r;
  };
  const auto& positions = input.positions;
  const auto& indices = input.indices;
  const size_t cornerCount = positions.size() / 3;
  if (indices.size() < 12 || cornerCount < 4) return refuse("too small to be a solid");

  // Corners within the tolerance become one, found through cells as wide as the tolerance.
  const double side = tolerance > 0 ? tolerance : 1e-12;
  std::unordered_map<CellKey, std::vector<int32_t>, CellKeyHash> cells;
  cells.reserve(cornerCount);
  std::vector<int32_t> merged(cornerCount);
  std::vector<int32_t> kept;
  for (size_t v = 0; v < cornerCount; v++) {
    const double x = positions[v * 3], y = positions[v * 3 + 1], z = positions[v * 3 + 2];
    const double ci = std::floor(x / side), cj = std::floor(y / side), ck = std::floor(z / side);
    int32_t found = -1;
    for (int di = -1; di <= 1 && found < 0; di++) {
      for (int dj = -1; dj <= 1 && found < 0; dj++) {
        for (int dk = -1; dk <= 1 && found < 0; dk++) {
          const auto bucket =
              cells.find(CellKey{numberKey(ci + di), numberKey(cj + dj), numberKey(ck + dk)});
          if (bucket == cells.end()) continue;
          for (int32_t w : bucket->second) {
            const double dx = positions[kept[w] * 3] - x;
            const double dy = positions[kept[w] * 3 + 1] - y;
            const double dz = positions[kept[w] * 3 + 2] - z;
            if (dx * dx + dy * dy + dz * dz <= tolerance * tolerance) {
              found = w;
              break;
            }
          }
        }
      }
    }
    if (found < 0) {
      found = static_cast<int32_t>(kept.size());
      kept.push_back(static_cast<int32_t>(v));
      cells[CellKey{numberKey(ci), numberKey(cj), numberKey(ck)}].push_back(found);
    }
    merged[v] = found;
  }
  auto xOf = [&](int32_t c) { return positions[kept[c] * 3]; };
  auto yOf = [&](int32_t c) { return positions[kept[c] * 3 + 1]; };
  auto zOf = [&](int32_t c) { return positions[kept[c] * 3 + 2]; };

  // Degenerate triangles cover nothing; a triangle twice the same way is one; once each way is none.
  std::unordered_map<TripleKey, int32_t, TripleKeyHash> byCornersIndex;
  std::vector<std::vector<int32_t>> byCorners;  // in `order`
  int32_t dropped = 0;
  for (size_t i = 0; i + 2 < indices.size(); i += 3) {
    const int32_t a = merged[indices[i]], b = merged[indices[i + 1]], c = merged[indices[i + 2]];
    if (a == b || b == c || c == a) {
      dropped++;
      continue;
    }
    int32_t s[3] = {a, b, c};
    std::sort(s, s + 3);
    auto [it, inserted] =
        byCornersIndex.try_emplace(TripleKey{s[0], s[1], s[2]}, static_cast<int32_t>(byCorners.size()));
    if (inserted) byCorners.push_back({a, b, c});
    else byCorners[it->second].insert(byCorners[it->second].end(), {a, b, c});
  }
  std::vector<int32_t> tris;
  tris.reserve(byCorners.size() * 3);
  auto sameTurn = [](const std::vector<int32_t>& t, size_t o) {
    int at = -1;
    for (int q = 0; q < 3; q++)
      if (t[o + q] == t[0]) {
        at = q;
        break;
      }
    // TS indexOf -1 reads t[o + 0] here, which is the same as at = -1 + 1 = 0.
    return t[o + static_cast<size_t>((at + 1) % 3)] == t[1];
  };
  for (const auto& list : byCorners) {
    int32_t forward = 0, backward = 0;
    for (size_t o = 0; o < list.size(); o += 3) {
      if (sameTurn(list, o)) forward++;
      else backward++;
    }
    if (forward == backward) {
      dropped += forward + backward;
      continue;
    }
    if (forward > backward) tris.insert(tris.end(), {list[0], list[1], list[2]});
    else tris.insert(tris.end(), {list[0], list[2], list[1]});
    dropped += forward + backward - 1;
  }

  // The unpaired edges, chained into rings. A corner with two ways out abandons the repair.
  std::vector<int64_t> directedOrder;
  std::unordered_set<int64_t> directed;
  directed.reserve(tris.size() * 2);
  for (size_t i = 0; i < tris.size(); i += 3)
    for (int e = 0; e < 3; e++) {
      const int64_t k = edgeKey(tris[i + e], tris[i + (e + 1) % 3]);
      if (directed.insert(k).second) directedOrder.push_back(k);
    }
  std::vector<int32_t> nextOrder;
  std::unordered_map<int32_t, int32_t> next;
  for (int64_t k : directedOrder) {
    const int32_t a = static_cast<int32_t>(static_cast<uint64_t>(k) >> 32);
    const int32_t b = static_cast<int32_t>(static_cast<uint64_t>(k) & 0xffffffffu);
    if (directed.count(edgeKey(b, a))) continue;
    if (next.count(a)) return refuse("a corner with two open ways out");
    next.emplace(a, b);
    nextOrder.push_back(a);
  }
  int32_t filled = 0;
  double filledArea = 0;
  std::unordered_set<int32_t> visited;
  std::vector<int32_t> loop;
  for (int32_t start : nextOrder) {
    if (visited.count(start)) continue;
    loop.clear();
    int32_t v = start;
    while (!visited.count(v)) {
      visited.insert(v);
      loop.push_back(v);
      const auto w = next.find(v);
      if (w == next.end()) return refuse("an open chain that does not close");
      v = w->second;
    }
    if (v != start || loop.size() < 3) return refuse("an open chain that does not close");

    // Planar within the tolerance, or this is not one missing face.
    double nx = 0, ny = 0, nz = 0, cx = 0, cy = 0, cz = 0;
    for (size_t i = 0; i < loop.size(); i++) {
      const int32_t p = loop[i], q = loop[(i + 1) % loop.size()];
      nx += (yOf(p) - yOf(q)) * (zOf(p) + zOf(q));
      ny += (zOf(p) - zOf(q)) * (xOf(p) + xOf(q));
      nz += (xOf(p) - xOf(q)) * (yOf(p) + yOf(q));
      cx += xOf(p);
      cy += yOf(p);
      cz += zOf(p);
    }
    const double length = jsHypot3(nx, ny, nz);
    if (!(length > 0)) return refuse("a degenerate ring");
    nx /= length;
    ny /= length;
    nz /= length;
    const double ln = static_cast<double>(loop.size());
    cx /= ln;
    cy /= ln;
    cz /= ln;
    for (int32_t p : loop) {
      const double off = std::fabs(nx * (xOf(p) - cx) + ny * (yOf(p) - cy) + nz * (zOf(p) - cz));
      if (off > tolerance) return refuse("a ring that is not planar");
    }

    // The face goes round the other way from the edges it closes.
    std::vector<int32_t> ring(loop.rbegin(), loop.rend());
    const std::vector<int32_t> pieces = triangleRing(projectRingWith(ring, xOf, yOf, zOf));
    if (pieces.size() != (ring.size() - 2) * 3) return refuse("a ring the triangulator could not fill");
    for (size_t i = 0; i < pieces.size(); i += 3) {
      const int32_t a = pieces[i], b = pieces[i + 1], c = pieces[i + 2];
      const double tx = (yOf(b) - yOf(a)) * (zOf(c) - zOf(a)) - (zOf(b) - zOf(a)) * (yOf(c) - yOf(a));
      const double ty = (zOf(b) - zOf(a)) * (xOf(c) - xOf(a)) - (xOf(b) - xOf(a)) * (zOf(c) - zOf(a));
      const double tz = (xOf(b) - xOf(a)) * (yOf(c) - yOf(a)) - (yOf(b) - yOf(a)) * (xOf(c) - xOf(a));
      filledArea += jsHypot3(tx, ty, tz) / 2;
      if (tx * nx + ty * ny + tz * nz > 0) tris.insert(tris.end(), {a, c, b});
      else tris.insert(tris.end(), {a, b, c});
    }
    filled++;
  }

  if (!isClosed(tris)) return refuse("still open or pinched after repair");
  if (filledArea > 0) {
    double total = 0;
    for (size_t i = 0; i < tris.size(); i += 3) {
      const int32_t a = tris[i], b = tris[i + 1], c = tris[i + 2];
      const double ux = xOf(b) - xOf(a), uy = yOf(b) - yOf(a), uz = zOf(b) - zOf(a);
      const double vx = xOf(c) - xOf(a), vy = yOf(c) - yOf(a), vz = zOf(c) - zOf(a);
      total += jsHypot3(uy * vz - uz * vy, uz * vx - ux * vz, ux * vy - uy * vx) / 2;
    }
    if (filledArea > maxFilledShare * total) return refuse("a fill larger than the allowed share");
  }
  MendResult result;
  if (dropped == 0 && filled == 0) return result;

  TriangleBatch out;
  out.positions.resize(kept.size() * 3);
  for (size_t c = 0; c < kept.size(); c++) {
    out.positions[c * 3] = xOf(static_cast<int32_t>(c));
    out.positions[c * 3 + 1] = yOf(static_cast<int32_t>(c));
    out.positions[c * 3 + 2] = zOf(static_cast<int32_t>(c));
  }
  out.indices.assign(tris.begin(), tris.end());
  result.mesh = std::move(out);
  result.mended = std::to_string(dropped) + " triangles dropped, " + std::to_string(filled) +
                  " faces filled";
  return result;
}

}  // namespace brep
