/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.  */

#pragma once

#include <map>
#include <unordered_map>
#include <vector>
#include <optional>
#include <cstdint>
#include <glm/glm.hpp>

#include "../parsing/IfcLoader.h"
#include "../schema/IfcSchemaManager.h"

#include "representation/geometry.h"
#include "representation/IfcGeometry.h"
#include "representation/IfcCurve.h"

// This class takes care of loading raw unprocessed geometry data from the IFC loader

namespace webifc::geometry
{

  class IfcGeometryLoader
  {
  public:
    IfcGeometryLoader(const webifc::parsing::IfcLoader &loader, const webifc::schema::IfcSchemaManager &schemaManager, uint16_t circleSegments, double TOLERANCE_PLANE_INTERSECTION, double TOLERANCE_PLANE_DEVIATION, double TOLERANCE_BACK_DEVIATION_DISTANCE, double TOLERANCE_INSIDE_OUTSIDE_PERIMETER, double TOLERANCE_SCALAR_EQUALITY, double, double BOOLEAN_UNION_THRESHOLD);
    void ResetCache();
    std::array<glm::dvec3, 2> GetAxis1Placement(const uint32_t expressID) const;
    glm::dmat3 GetAxis2Placement2D(const uint32_t expressID) const;
    glm::dmat4 GetLocalPlacement(const uint32_t expressID, glm::dvec3 vector = glm::dvec3(1)) const;
    glm::dvec3 GetCartesianPoint3D(const uint32_t expressID) const;
    glm::dvec2 GetCartesianPoint2D(const uint32_t expressID) const;
    glm::dvec3 GetVector(const uint32_t expressID) const;
    IfcProfile GetProfile(uint32_t expressID) const;
    IfcProfile GetProfile3D(uint32_t expressID) const;
    IfcCurve GetLocalCurve(uint32_t expressID) const;
    IfcCurve GetCurve(uint32_t expressID, uint8_t dimensions, bool edge = false) const;

    // Helper function to compute the total length of the curve
    double ComputeCurveLength(const IfcCurve& curve) const;

    // Helper function to compute the length along the curve up to a specific point
    double ComputeLengthToPoint(const IfcCurve& curve, const glm::dvec3& targetPoint) const;

    // Helper function to compute parameter for a point on the base curve
    double GetParameterForPoint(const IfcCurve& curve, double totalLength, const glm::dvec3& point) const;

    bool ReadIfcCartesianPointList(const uint32_t expressID) const;
    std::vector<glm::dvec3> ReadIfcCartesianPointList3D(const uint32_t expressID) const;
    std::vector<glm::dvec2> ReadIfcCartesianPointList2D(const uint32_t expressID) const;
    IfcCurve GetOrientedEdge(uint32_t expressID) const;
    IfcCurve GetEdge(uint32_t expressID) const;
    IfcBound3D GetBound(const uint32_t expressID) const;
    IfcCurve GetLoop(const uint32_t expressID) const;
    std::optional<glm::dvec4> GetColor(uint32_t expressID) const;
    IfcCrossSections GetCrossSections2D(uint32_t expressID) const;
    IfcCrossSections GetCrossSections3D(uint32_t expressID, bool scaled = false, glm::dmat4 coordination = glm::dmat4(1)) const;
    void getPlacementsOnCurvePoints(uint32_t curveID, std::map<double, glm::dmat4>& mapPlacements) const;
    IfcAlignment GetAlignment(uint32_t expressID, IfcAlignment alignment = IfcAlignment(), glm::dmat4 transform = glm::dmat4(1), uint32_t sourceExpressID = -1) const;
    bool GetColor(const uint32_t expressID, const glm::dvec4 &outputColor) const;
    const std::unordered_map<uint32_t, std::vector<uint32_t>> &GetRelVoids() const;
    const std::unordered_map<uint32_t, std::vector<std::pair<uint32_t, uint32_t>>> &GetStyledItems() const;
    const std::unordered_map<uint32_t, std::vector<std::pair<uint32_t, uint32_t>>> &GetRelMaterials() const;
    const std::unordered_map<uint32_t, std::vector<std::pair<uint32_t, uint32_t>>> &GetMaterialDefinitions() const;
    double GetLinearScalingFactor() const;
    std::string GetAngleUnits() const;
    void Clear() const;
    IfcGeometryLoader *Clone(const webifc::parsing::IfcLoader &loader) const;

  private:
    IfcGeometryLoader(const webifc::parsing::IfcLoader &loader, const webifc::schema::IfcSchemaManager &schemaManager, const std::unordered_map<uint32_t, std::vector<uint32_t>> &relVoids, const std::unordered_map<uint32_t, std::vector<uint32_t>> &relNests, const std::unordered_map<uint32_t, std::vector<uint32_t>> &relAggregates, const std::unordered_map<uint32_t, std::vector<std::pair<uint32_t, uint32_t>>> &styledItems, const std::unordered_map<uint32_t, std::vector<std::pair<uint32_t, uint32_t>>> &relMaterials, const std::unordered_map<uint32_t, std::vector<std::pair<uint32_t, uint32_t>>> &materialDefinitions, double linearScalingFactor, double squaredScalingFactor, double cubicScalingFactor, double angularScalingFactor, std::string angleUnits, uint16_t circleSegments, std::vector<IfcCurve> &localCurvesList, std::vector<uint32_t> &localcurvesIndices, std::unordered_map<uint32_t, glm::dmat4> expressIDToPlacement);
    IfcCurve GetAlignmentCurve(uint32_t expressID, uint32_t parentExpressID = -1) const;
    IfcProfile GetProfileByLine(uint32_t expressID) const;
    glm::dvec3 GetVertexPoint(uint32_t expressID) const;
    IfcTrimmingSelect GetTrimSelect(uint32_t DIM, std::vector<uint32_t> &tapeOffsets) const;

    struct ComputeCurveParams {
		ComputeCurveParams() = default;
        ComputeCurveParams(const ComputeCurveParams& other) {
			dimensions = other.dimensions;
			ignorePlacement = other.ignorePlacement;
			edge = other.edge;
			sameSense = other.sameSense;
			hasTrim = other.hasTrim;
            trimStart = other.trimStart;
            trimEnd = other.trimEnd;
            trimSense = other.trimSense;
        }
        uint8_t dimensions = 2;
        bool ignorePlacement = false;
        bool edge = false;
        int sameSense = -1;
       	bool hasTrim = false;
       	IfcTrimmingSelect trimStart;
       	IfcTrimmingSelect trimEnd;
        TrimSense trimSense = TRIM_SENSE_SAME;
    };
    void ComputeCurve(uint32_t expressID, IfcCurve &curve, const ComputeCurveParams& params) const;
    void convertAngleUnits(double &Degrees, double &Rad) const;
    double ReadLenghtMeasure() const;
    void ReadCurveMeasureSelect(IfcTrimmingSelect& trim) const;
    std::vector<IfcSegmentIndexSelect> ReadCurveIndices() const;
    const webifc::parsing::IfcLoader &_loader;
    const webifc::schema::IfcSchemaManager &_schemaManager;
    std::unordered_map<uint32_t, std::vector<uint32_t>> _relVoids;
    std::unordered_map<uint32_t, std::vector<uint32_t>> _relNests;
    std::unordered_map<uint32_t, std::vector<uint32_t>> _relAggregates;
    std::unordered_map<uint32_t, std::vector<std::pair<uint32_t, uint32_t>>> _styledItems;
    std::unordered_map<uint32_t, std::vector<std::pair<uint32_t, uint32_t>>> _relMaterials;
    std::unordered_map<uint32_t, std::vector<std::pair<uint32_t, uint32_t>>> _materialDefinitions;
    double _linearScalingFactor = 1;
    double _squaredScalingFactor = 1;
    double _cubicScalingFactor = 1;
    double _angularScalingFactor = 1;
    std::string _angleUnits;
    uint16_t _circleSegments;
    mutable std::vector<IfcCurve> _localCurvesList;
    mutable std::vector<uint32_t> _localcurvesIndices;
    // Caches to avoid repeatedly decoding the same points
    mutable std::unordered_map<uint32_t, glm::dvec3> _cartesianPoint3DCache;
    mutable std::unordered_map<uint32_t, glm::dvec2> _cartesianPoint2DCache;
    std::unordered_map<uint32_t, std::vector<uint32_t>> PopulateRelVoidsMap();
    std::unordered_map<uint32_t, std::vector<uint32_t>> PopulateRelNestsMap();
    std::unordered_map<uint32_t, std::vector<uint32_t>> PopulateRelAggregatesMap();
    std::unordered_map<uint32_t, std::vector<std::pair<uint32_t, uint32_t>>> PopulateStyledItemMap();
    std::unordered_map<uint32_t, std::vector<std::pair<uint32_t, uint32_t>>> PopulateRelMaterialsMap();
    std::unordered_map<uint32_t, std::vector<std::pair<uint32_t, uint32_t>>> PopulateMaterialDefinitionsMap();
    void ReadLinearScalingFactor();
    double ConvertPrefix(const std::string_view &prefix);
    mutable std::unordered_map<uint32_t, glm::dmat4> _expressIDToPlacement;
  };

}
