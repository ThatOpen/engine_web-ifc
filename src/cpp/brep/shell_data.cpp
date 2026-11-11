// Faithful port of fragments Utils/shells (index.ts, points.ts, point.ts, edge.ts, face.ts, faces.ts,
// plane.ts, profile.ts, profiles.ts). TS string keys become keys on the same rounded doubles
// (JS number->string is injective except -0/0, which are folded here as in the strings).
#include "shell_data.h"

#include <cmath>
#include <cstring>
#include <deque>
#include <limits>
#include <memory>
#include <stdexcept>
#include <string>

namespace brep::shells {

namespace {

// Bits of a double as JS `${x}` would distinguish it: -0 folds into 0, every NaN is one key.
inline uint64_t keyBits(double x) {
  if (x == 0) return 0;
  if (std::isnan(x)) return 0x7ff8000000000000ull;
  uint64_t b;
  std::memcpy(&b, &x, sizeof b);
  return b;
}

inline uint64_t mix(uint64_t h, uint64_t v) {
  v *= 0x9E3779B97F4A7C15ull;
  v ^= v >> 29;
  return (h ^ v) * 0xBF58476D1CE4E5B9ull + 0x94D049BB133111EBull;
}

struct Key3 {
  uint64_t a, b, c;
  bool operator==(const Key3&) const = default;
};
struct Key3Hash {
  size_t operator()(const Key3& k) const { return (size_t)mix(mix(mix(0, k.a), k.b), k.c); }
};
struct Key4 {
  uint64_t a, b, c, d;
  bool operator==(const Key4&) const = default;
};
struct Key4Hash {
  size_t operator()(const Key4& k) const {
    return (size_t)mix(mix(mix(mix(0, k.a), k.b), k.c), k.d);
  }
};
struct U64Hash {
  size_t operator()(uint64_t v) const { return (size_t)mix(0, v); }
};

// Insertion-ordered Set with delete (TS Set<string> semantics: delete + add moves to the end).
struct OrderedSet {
  std::vector<uint64_t> keys;
  std::vector<uint8_t> alive;
  std::unordered_map<uint64_t, uint32_t, U64Hash> pos;
  size_t live = 0;

  bool has(uint64_t k) const { return pos.find(k) != pos.end(); }
  void add(uint64_t k) {
    if (has(k)) return;
    pos.emplace(k, (uint32_t)keys.size());
    keys.push_back(k);
    alive.push_back(1);
    live++;
  }
  void erase(uint64_t k) {
    auto it = pos.find(k);
    if (it == pos.end()) return;
    alive[it->second] = 0;
    pos.erase(it);
    live--;
  }
};

// ---- plane.ts
struct Plane {
  double nx, ny, nz, constant;
  std::vector<int32_t> faces;
};

// ---- point.ts / points.ts
struct PointRec {
  double x, y, z;
};

class Points {
 public:
  std::vector<PointRec> list;
  std::unordered_map<Key3, int32_t, Key3Hash> ids;
  double precission;

  explicit Points(double p) : precission(p) {}

  int32_t create(const float* vertices, uint32_t index) {
    const double x = round(vertices[index * 3], precission);
    const double y = round(vertices[index * 3 + 1], precission);
    const double z = round(vertices[index * 3 + 2], precission);
    Key3 k{keyBits(x), keyBits(y), keyBits(z)};
    auto it = ids.find(k);
    if (it != ids.end()) return it->second;
    const int32_t id = (int32_t)list.size();
    ids.emplace(k, id);
    list.push_back({x, y, z});
    return id;
  }

  bool isValidTriangle(const float* position, uint32_t i1, uint32_t i2, uint32_t i3) const {
    const double v1x = position[i1 * 3], v1y = position[i1 * 3 + 1], v1z = position[i1 * 3 + 2];
    const double v2x = position[i2 * 3], v2y = position[i2 * 3 + 1], v2z = position[i2 * 3 + 2];
    const double v3x = position[i3 * 3], v3y = position[i3 * 3 + 1], v3z = position[i3 * 3 + 2];
    auto dist = [](double ax, double ay, double az, double bx, double by, double bz) {
      const double dx = ax - bx, dy = ay - by, dz = az - bz;
      return std::sqrt(dx * dx + dy * dy + dz * dz);
    };
    const double pointPrecision = (1 / precission) * 10;
    const bool d1Valid = dist(v1x, v1y, v1z, v2x, v2y, v2z) > pointPrecision;
    const bool d2Valid = dist(v1x, v1y, v1z, v3x, v3y, v3z) > pointPrecision;
    const bool d3Valid = dist(v2x, v2y, v2z, v3x, v3y, v3z) > pointPrecision;
    return d1Valid && d2Valid && d3Valid;
  }
};

// ---- edge.ts
struct Edge {
  int32_t p1, p2;
  uint64_t hash;
};

inline bool truthy(double d) { return d != 0 && !std::isnan(d); }

// points.sort((a, b) => a.x - b.x || a.y - b.y || a.z - b.z) on [p1, p2]: V8 swaps iff cmp(p2, p1) < 0.
inline Edge makeEdge(const std::vector<PointRec>& pts, int32_t p1, int32_t p2) {
  const PointRec& a = pts[p1];
  const PointRec& b = pts[p2];
  double d = b.x - a.x;
  if (!truthy(d)) {
    d = b.y - a.y;
    if (!truthy(d)) d = b.z - a.z;
  }
  int32_t first = p1, second = p2;
  if (d < 0) std::swap(first, second);
  return {p1, p2, ((uint64_t)(uint32_t)first << 32) | (uint32_t)second};
}

// ---- face.ts
struct Face {
  int32_t id;
  int32_t plane;
  std::unordered_map<uint64_t, std::pair<int32_t, int32_t>, U64Hash> edges;
  OrderedSet openEdges;

  Face(int32_t i, int32_t p) : id(i), plane(p) {}

  void add(const Edge* triangle) {
    if (edges.empty()) {
      for (int k = 0; k < 3; k++) {
        openEdges.add(triangle[k].hash);
        edges[triangle[k].hash] = {triangle[k].p1, triangle[k].p2};
      }
      return;
    }
    for (int k = 0; k < 3; k++) {
      const Edge& e = triangle[k];
      if (openEdges.has(e.hash)) {
        openEdges.erase(e.hash);
      } else {
        openEdges.add(e.hash);
      }
      edges[e.hash] = {e.p1, e.p2};
    }
  }

  bool match(const Edge* triangle, int32_t p) const {
    if (p != plane) return false;
    for (int k = 0; k < 3; k++) {
      if (openEdges.has(triangle[k].hash)) return true;
    }
    return false;
  }

  std::vector<Edge> getOpenEdges() const {
    std::vector<Edge> result;
    result.reserve(openEdges.live);
    for (size_t i = 0; i < openEdges.keys.size(); i++) {
      if (!openEdges.alive[i]) continue;
      const uint64_t h = openEdges.keys[i];
      const auto& pe = edges.at(h);
      result.push_back({pe.first, pe.second, h});
    }
    return result;
  }

  void merge(const Face& face) {
    for (const auto& [edgeID, edge] : face.edges) edges[edgeID] = edge;
    for (size_t i = 0; i < face.openEdges.keys.size(); i++) {
      if (!face.openEdges.alive[i]) continue;
      const uint64_t edgeID = face.openEdges.keys[i];
      if (openEdges.has(edgeID)) {
        openEdges.erase(edgeID);
      } else {
        openEdges.add(edgeID);
      }
    }
  }
};

// ---- faces.ts (Map<number, Face> with monotonic ids: a vector indexed by id, null when deleted)
class Faces {
 public:
  std::vector<std::unique_ptr<Face>> list;
  int32_t nextFaceID = 0;

  void add(const Edge* triangle, int32_t plane) {
    std::vector<int32_t> matches = match(triangle, plane);
    if (matches.empty()) {
      const int32_t newFaceID = nextFaceID++;
      auto face = std::make_unique<Face>(newFaceID, plane);
      face->add(triangle);
      if ((int32_t)list.size() <= newFaceID) list.resize(newFaceID + 1);
      list[newFaceID] = std::move(face);
      return;
    }
    if (matches.size() == 1) {
      list[matches[0]]->add(triangle);
      return;
    }
    Face& baseFace = *list[matches[0]];
    baseFace.add(triangle);
    for (size_t i = 1; i < matches.size(); i++) {
      baseFace.merge(*list[matches[i]]);
      list[matches[i]].reset();
    }
  }

 private:
  std::vector<int32_t> match(const Edge* triangle, int32_t plane) const {
    std::vector<int32_t> ids;
    for (const auto& face : list) {
      if (face && face->match(triangle, plane)) ids.push_back(face->id);
    }
    return ids;
  }
};

// ---- profile.ts
class Profile {
 public:
  bool closed = false;
  int32_t openStartPoint = -1;  // -1 = null
  int32_t openEndPoint = -1;
  const Plane* plane;
  std::deque<int32_t> orderedPoints;

  explicit Profile(const Plane* p) : plane(p) {}

  std::vector<std::pair<int32_t, int32_t>> getEdges(bool reverse) const {
    std::vector<std::pair<int32_t, int32_t>> edges;
    const int64_t n = (int64_t)orderedPoints.size();
    if (reverse) {
      for (int64_t i = n - 1; i > 0; i--) edges.push_back({orderedPoints[i], orderedPoints[i - 1]});
    } else {
      for (int64_t i = 0; i < n - 1; i++) edges.push_back({orderedPoints[i], orderedPoints[i + 1]});
    }
    return edges;
  }

  std::vector<int32_t> getIndices() const {
    return std::vector<int32_t>(orderedPoints.begin(), orderedPoints.end());
  }

  void add(int32_t p1, int32_t p2) {
    if (orderedPoints.empty()) {
      openStartPoint = p1;
      openEndPoint = p2;
      orderedPoints.push_back(p1);
      orderedPoints.push_back(p2);
      return;
    }
    const int m = match(p1, p2);
    if (m == 0) throw std::runtime_error("Fragments: Edge doesn't match with any open point");
    if (m > 2) throw std::runtime_error("Fragments: Edge matches with more than 2 open points");
    if (m == 2) {
      closed = true;
      openEndPoint = -1;
      openStartPoint = -1;
      return;
    }
    if (openStartPoint == p1) {
      orderedPoints.push_front(p2);
      openStartPoint = p2;
    } else if (openEndPoint == p1) {
      orderedPoints.push_back(p2);
      openEndPoint = p2;
    } else if (openStartPoint == p2) {
      orderedPoints.push_front(p1);
      openStartPoint = p1;
    } else if (openEndPoint == p2) {
      orderedPoints.push_back(p1);
      openEndPoint = p1;
    }
  }

  int match(int32_t p1, int32_t p2) const {
    if (closed) return 0;
    int matchNumber = 0;
    if (openStartPoint == p1) matchNumber++;
    if (openStartPoint == p2) matchNumber++;
    if (openEndPoint == p1) matchNumber++;
    if (openEndPoint == p2) matchNumber++;
    return matchNumber;
  }

  void merge(const Profile& newProfile) {
    if (newProfile.closed || closed) throw std::runtime_error("Fragments: Cannot merge closed profiles");
    if (newProfile.openStartPoint == openEndPoint && newProfile.openEndPoint == openStartPoint) {
      throw std::runtime_error("Fragments: Cannot merge profiles that close each other");
    }
    if (newProfile.openEndPoint == openEndPoint && newProfile.openStartPoint == openStartPoint) {
      throw std::runtime_error("Fragments: Cannot merge profiles that close each other");
    }
    bool reverse = false;
    if (newProfile.openEndPoint == openStartPoint || newProfile.openEndPoint == openEndPoint) {
      reverse = true;
    }
    const auto newEdges = newProfile.getEdges(reverse);
    for (const auto& [a, b] : newEdges) add(a, b);
  }

  double getArea(const std::vector<PointRec>& pts) const {
    int dimension1 = 0;
    int dimension2 = 1;
    const double absX = std::fabs(plane->nx);
    const double absY = std::fabs(plane->ny);
    const double absZ = std::fabs(plane->nz);
    if (absX >= absY && absX >= absZ) {
      dimension1 = 1;
      dimension2 = 2;
    } else if (absY >= absX && absY >= absZ) {
      dimension1 = 0;
      dimension2 = 2;
    } else {
      dimension1 = 0;
      dimension2 = 1;
    }
    auto coord = [&](int32_t id, int d) {
      const PointRec& p = pts[id];
      return d == 0 ? p.x : (d == 1 ? p.y : p.z);
    };
    double total = 0;
    const size_t l = orderedPoints.size();
    for (size_t i = 0; i < l; i++) {
      const size_t next = i == l - 1 ? 0 : i + 1;
      const double addX = coord(orderedPoints[i], dimension1);
      const double addY = coord(orderedPoints[next], dimension2);
      const double subX = coord(orderedPoints[next], dimension1);
      const double subY = coord(orderedPoints[i], dimension2);
      total += addX * addY * 0.5;
      total -= subX * subY * 0.5;
    }
    return std::fabs(total);
  }
};

// ---- profiles.ts (Map<number, Profile> with monotonic ids)
class Profiles {
 public:
  std::vector<std::unique_ptr<Profile>> list;
  const Plane* plane;
  int32_t nextProfileID = 0;

  explicit Profiles(const Plane* p) : plane(p) {}

  void add(const Edge& edge) {
    std::vector<int32_t> matches = match(edge);
    if (matches.empty()) {
      const int32_t profileId = nextProfileID++;
      auto profile = std::make_unique<Profile>(plane);
      profile->add(edge.p1, edge.p2);
      if ((int32_t)list.size() <= profileId) list.resize(profileId + 1);
      list[profileId] = std::move(profile);
      return;
    }
    if (matches.size() == 1) {
      list[matches[0]]->add(edge.p1, edge.p2);
      return;
    }
    Profile& profile = *list[matches[0]];
    profile.add(edge.p1, edge.p2);
    profile.merge(*list[matches[1]]);
    list[matches[1]].reset();
  }

  // Returns false when TS returns null.
  bool getProfiles(const std::vector<PointRec>& pts, std::vector<int32_t>& outProfile,
                   std::vector<std::vector<int32_t>>& outHoles) const {
    int32_t biggestProfile = -1;
    double biggestProfileSize = 0;
    for (size_t id = 0; id < list.size(); id++) {
      if (!list[id]) continue;
      const double area = list[id]->getArea(pts);
      if (area > biggestProfileSize) {
        biggestProfileSize = area;
        biggestProfile = (int32_t)id;
      }
    }
    if (biggestProfile == -1) return false;
    outProfile = list[biggestProfile]->getIndices();
    for (size_t id = 0; id < list.size(); id++) {
      if (!list[id] || (int32_t)id == biggestProfile) continue;
      outHoles.push_back(list[id]->getIndices());
    }
    return true;
  }

 private:
  std::vector<int32_t> match(const Edge& edge) const {
    std::vector<int32_t> ids;
    for (size_t id = 0; id < list.size(); id++) {
      if (list[id] && list[id]->match(edge.p1, edge.p2) > 0) ids.push_back((int32_t)id);
    }
    return ids;
  }
};

double makeDecimal(double value) {
  double num = 1;
  while (num <= value) num *= 10;
  return value / num;
}

bool hasCategoryThreshold(const GeometryProcessSettings& settings, std::optional<uint32_t> category) {
  // `category && settings.categoryFaceThresholds?.has(category)`: 0 is falsy.
  return category.has_value() && *category != 0 && settings.categoryFaceThresholds.has_value() &&
         settings.categoryFaceThresholds->count(*category) > 0;
}

}  // namespace

double round(double value, double precission) {
  const double x = value * precission;
  double r = x;
  if (std::isfinite(x)) {
    r = std::floor(x);
    if (x - r >= 0.5) r += 1.0;
    if (r == 0 && std::signbit(x)) r = -0.0;  // Math.round(-0.3) === -0
  }
  return r / precission;
}

BBox getAABB(const float* vertices, size_t length) {
  double minX = std::numeric_limits<double>::infinity();
  double minY = minX, minZ = minX;
  double maxX = -minX, maxY = -minX, maxZ = -minX;
  for (size_t i = 0; i < length; i += 3) {
    const double x = vertices[i];
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (i + 1 < length) {
      const double y = vertices[i + 1];
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
    if (i + 2 < length) {
      const double z = vertices[i + 2];
      if (z < minZ) minZ = z;
      if (z > maxZ) maxZ = z;
    }
  }
  return {{minX, minY, minZ}, {maxX, maxY, maxZ}};
}

ShellData getRawShellData(const uint32_t* index, size_t indexCount, const float* position,
                          const BBox& bbox, const GeometryProcessSettings& settings,
                          std::optional<uint32_t> category) {
  ShellData result;
  result.bbox = bbox;
  std::unordered_map<Key3, int32_t, Key3Hash> pointsMap;

  auto getPointIndex = [&](double x, double y, double z) -> int32_t {
    Key3 k{keyBits(x), keyBits(y), keyBits(z)};
    auto it = pointsMap.find(k);
    if (it != pointsMap.end()) return it->second;
    const int32_t idx = (int32_t)pointsMap.size();
    pointsMap.emplace(k, idx);
    result.points.push_back({x, y, z});
    return idx;
  };

  for (int64_t i = 0; i < (int64_t)indexCount - 2; i += 3) {
    const uint32_t v1 = index[i], v2 = index[i + 1], v3 = index[i + 2];
    const int32_t i1 = getPointIndex(position[v1 * 3], position[v1 * 3 + 1], position[v1 * 3 + 2]);
    const int32_t i2 = getPointIndex(position[v2 * 3], position[v2 * 3 + 1], position[v2 * 3 + 2]);
    const int32_t i3 = getPointIndex(position[v3 * 3], position[v3 * 3 + 1], position[v3 * 3 + 2]);
    result.profiles.push_back({(int32_t)result.profiles.size(), {i1, i2, i3}});
  }

  if (hasCategoryThreshold(settings, category)) {
    computeShellFaceIds(result, settings, category);
  } else {
    result.profilesFaceIds.assign(result.profiles.size(), 0);
  }
  return result;
}

ShellData getShellData(const float* position, const float* normals, size_t vertexFloatCount,
                       const uint32_t* index, size_t indexCount, bool raw,
                       const GeometryProcessSettings& settings, std::optional<uint32_t> category) {
  const double precision = settings.precision;
  const double normalPrecision = settings.normalPrecision;
  const double planePrecision = settings.planePrecision;

  const double vertexCount = (double)vertexFloatCount / 3;
  const bool tooBigToShell = vertexCount > settings.threshold;

  const BBox bbox = getAABB(position, vertexFloatCount);
  if (bbox.min[0] == 0 && bbox.min[1] == 0 && bbox.min[2] == 0 && bbox.max[0] == 0 &&
      bbox.max[1] == 0 && bbox.max[2] == 0) {
    throw std::runtime_error("Fragments: Bbox is not valid");
  }

  if (raw || tooBigToShell) {
    return getRawShellData(index, indexCount, position, bbox, settings, category);
  }

  // 1. Group triangles in planes (insertion-ordered by plane id).
  std::vector<Plane> coplanarTriangles;
  std::unordered_map<Key4, int32_t, Key4Hash> planeIds;

  for (int64_t i = 0; i < (int64_t)indexCount - 2; i += 3) {
    const uint32_t v1 = index[i];
    const double nx0 = normals[v1 * 3], ny0 = normals[v1 * 3 + 1], nz0 = normals[v1 * 3 + 2];
    const double px = position[v1 * 3], py = position[v1 * 3 + 1], pz = position[v1 * 3 + 2];
    const double constant = -(px * nx0 + py * ny0 + pz * nz0);

    const double nx = round(nx0, normalPrecision);
    const double ny = round(ny0, normalPrecision);
    const double nz = round(nz0, normalPrecision);
    const double c = round(constant, planePrecision);
    Key4 k{keyBits(nx), keyBits(ny), keyBits(nz), keyBits(c)};
    auto it = planeIds.find(k);
    int32_t pid;
    if (it == planeIds.end()) {
      pid = (int32_t)coplanarTriangles.size();
      planeIds.emplace(k, pid);
      coplanarTriangles.push_back({nx, ny, nz, c, {}});
    } else {
      pid = it->second;
    }
    coplanarTriangles[pid].faces.push_back((int32_t)i);
  }

  // 2. Group coplanar triangles in faces, deduplicate vertices and get open edges.
  Points points(precision);
  Faces faces;

  for (int32_t pid = 0; pid < (int32_t)coplanarTriangles.size(); pid++) {
    for (const int32_t triangleIndex : coplanarTriangles[pid].faces) {
      const uint32_t v1 = index[triangleIndex];
      const uint32_t v2 = index[triangleIndex + 1];
      const uint32_t v3 = index[triangleIndex + 2];
      if (!points.isValidTriangle(position, v1, v2, v3)) continue;
      const int32_t p1 = points.create(position, v1);
      const int32_t p2 = points.create(position, v2);
      const int32_t p3 = points.create(position, v3);
      const Edge triangle[3] = {makeEdge(points.list, p1, p2), makeEdge(points.list, p2, p3),
                                makeEdge(points.list, p3, p1)};
      faces.add(triangle, pid);
    }
  }

  // 3. Get all the profiles.
  std::vector<std::vector<int32_t>> profiles;
  std::vector<std::vector<std::vector<int32_t>>> holes;

  for (const auto& facePtr : faces.list) {
    if (!facePtr) continue;
    const Face& face = *facePtr;
    Profiles profile(&coplanarTriangles[face.plane]);
    const std::vector<Edge> openEdges = face.getOpenEdges();
    if (openEdges.empty()) {
      return getRawShellData(index, indexCount, position, bbox, settings, category);
    }
    for (const Edge& edge : openEdges) profile.add(edge);

    std::vector<int32_t> outProfile;
    std::vector<std::vector<int32_t>> outHoles;
    profile.getProfiles(points.list, outProfile, outHoles);
    profiles.push_back(std::move(outProfile));
    holes.push_back(std::move(outHoles));
  }

  ShellData result;
  result.bbox = bbox;
  std::vector<int32_t> profileIndexMap(profiles.size(), -1);
  int32_t profileCounter = 0;
  for (size_t id = 0; id < profiles.size(); id++) {
    if (!profiles[id].empty()) {
      profileIndexMap[id] = profileCounter;
      result.profiles.push_back({profileCounter, std::move(profiles[id])});
      profileCounter++;
    }
  }
  for (size_t id = 0; id < holes.size(); id++) {
    if (!holes[id].empty()) {
      result.holes.push_back({profileIndexMap[id], std::move(holes[id])});
    }
  }

  result.points.reserve(points.list.size());
  for (const PointRec& p : points.list) result.points.push_back({p.x, p.y, p.z});

  computeShellFaceIds(result, settings, category);
  return result;
}

void computeShellFaceIds(ShellData& shell, const GeometryProcessSettings& settings,
                         std::optional<uint32_t> category) {
  double faceThreshold = settings.faceThreshold;
  if (hasCategoryThreshold(settings, category)) {
    faceThreshold = settings.categoryFaceThresholds->at(*category);
  }

  const size_t profilesLength = shell.profiles.size();
  std::vector<int32_t> faceIdPerProfile(profilesLength, -1);  // -1 = absent
  int32_t nextFaceId = 0;

  // edgeId is a double (min + max as decimals); the Map keys on its exact value.
  std::unordered_map<uint64_t, std::vector<int32_t>, U64Hash> edgeFacePair;
  std::vector<std::vector<uint64_t>> edgesPerProfile(profilesLength);
  std::vector<uint8_t> hasEdges(profilesLength, 0);
  std::vector<std::array<double, 3>> profilesNormal(profilesLength);

  double nX = 0, nY = 0, nZ = 0;  // shared across profiles, as the TS temp vector

  for (size_t i = 0; i < profilesLength; i++) {
    const std::vector<int32_t>& profile = shell.profiles[i].second;
    const size_t indicesLength = profile.size();

    for (size_t j = 0; j < indicesLength; j++) {
      const int32_t p1Index = profile[j];
      const bool isLast = j == indicesLength - 1;
      const int32_t p2Index = isLast ? profile[0] : profile[j + 1];
      const int32_t minIndex = std::min(p1Index, p2Index);
      const int32_t maxIndex = std::max(p1Index, p2Index);
      const double edgeId = (double)minIndex + makeDecimal((double)maxIndex);
      const uint64_t key = keyBits(edgeId);
      edgesPerProfile[i].push_back(key);
      hasEdges[i] = 1;
      edgeFacePair[key].push_back((int32_t)i);
    }

    size_t index1 = 0, index2 = 1, index3 = 2;
    while (index3 < indicesLength) {
      const auto& a = shell.points[profile[index1]];
      const auto& b = shell.points[profile[index2]];
      const auto& c = shell.points[profile[index3]];
      // Triangle.getNormal: (c - b) x (a - b), normalised.
      const double tx = c[0] - b[0], ty = c[1] - b[1], tz = c[2] - b[2];
      const double vx = a[0] - b[0], vy = a[1] - b[1], vz = a[2] - b[2];
      nX = ty * vz - tz * vy;
      nY = tz * vx - tx * vz;
      nZ = tx * vy - ty * vx;
      const double lengthSq = nX * nX + nY * nY + nZ * nZ;
      if (lengthSq > 0) {
        const double s = 1 / std::sqrt(lengthSq);
        nX *= s;
        nY *= s;
        nZ *= s;
      } else {
        nX = 0;
        nY = 0;
        nZ = 0;
      }
      if (nX != 0 || nY != 0 || nZ != 0) break;
      index1++;
      index2++;
      index3++;
    }
    profilesNormal[i] = {nX, nY, nZ};
  }

  for (size_t profile = 0; profile < profilesLength; profile++) {
    if (!hasEdges[profile]) continue;
    int32_t faceId = faceIdPerProfile[profile];
    if (faceId == -1) {
      faceId = nextFaceId++;
      faceIdPerProfile[profile] = faceId;
    }
    const auto& n1 = profilesNormal[profile];
    for (const uint64_t edge : edgesPerProfile[profile]) {
      const std::vector<int32_t>& facePair = edgeFacePair.at(edge);
      for (const int32_t currentProfile : facePair) {
        if (currentProfile == (int32_t)profile) continue;
        const auto& n2 = profilesNormal[currentProfile];
        const double dot = std::fabs(n1[0] * n2[0] + n1[1] * n2[1] + n1[2] * n2[2]);
        const bool isHard = dot < faceThreshold;
        if (faceIdPerProfile[currentProfile] != -1) {
          if (!isHard) {
            const int32_t currentFaceId = faceIdPerProfile[currentProfile];
            for (int32_t& value : faceIdPerProfile) {
              if (value == currentFaceId) value = faceId;
            }
          }
        } else {
          faceIdPerProfile[currentProfile] = isHard ? nextFaceId++ : faceId;
        }
      }
    }
  }

  for (size_t i = 0; i < profilesLength; i++) {
    if (faceIdPerProfile[i] == -1) {
      throw std::runtime_error("Face id not found for profile " + std::to_string(i));
    }
  }
  for (size_t i = 0; i < profilesLength; i++) shell.profilesFaceIds.push_back(faceIdPerProfile[i]);
}

}  // namespace brep::shells
