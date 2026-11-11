// Mesh -> shell reconversion (path A): faithful port of fragments' Utils/shells (GeomsFbUtils.getShellData).
#pragma once

#include <array>
#include <cstddef>
#include <cstdint>
#include <optional>
#include <unordered_map>
#include <utility>
#include <vector>

namespace brep::shells {

struct GeometryProcessSettings {
  int threshold = 3000;
  double precision = 1000000;
  double normalPrecision = 10000000;
  double planePrecision = 1000;
  double faceThreshold = 0.6;
  // Overrides faceThreshold per category (only membership + value are read, never iterated).
  std::optional<std::unordered_map<uint32_t, double>> categoryFaceThresholds;
  bool forceTransparentSpaces = true;
  std::optional<bool> processIfcRelSpaceBoundarySecondLevel;
};

struct BBox {
  std::array<double, 3> min;
  std::array<double, 3> max;
};

struct ShellData {
  std::vector<std::array<double, 3>> points;
  // Insertion-ordered maps (TS Map<number, ...>), kept as (key, value) pairs in insertion order.
  std::vector<std::pair<int32_t, std::vector<int32_t>>> profiles;
  std::vector<std::pair<int32_t, std::vector<std::vector<int32_t>>>> holes;
  std::vector<int32_t> profilesFaceIds;
  BBox bbox;
};

// Math.round(value * precission) / precission, with JS Math.round semantics.
double round(double value, double precission);

BBox getAABB(const float* vertices, size_t length);

ShellData getRawShellData(const uint32_t* index, size_t indexCount, const float* position,
                          const BBox& bbox, const GeometryProcessSettings& settings,
                          std::optional<uint32_t> category = {});

// Throws std::runtime_error where the TS throws.
ShellData getShellData(const float* position, const float* normals, size_t vertexFloatCount,
                       const uint32_t* index, size_t indexCount, bool raw,
                       const GeometryProcessSettings& settings,
                       std::optional<uint32_t> category = {});

void computeShellFaceIds(ShellData& shell, const GeometryProcessSettings& settings,
                         std::optional<uint32_t> category = {});

}  // namespace brep::shells
