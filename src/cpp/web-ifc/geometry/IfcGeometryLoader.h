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
#include "../cache/IfcCache.h"

#include "representation/geometry.h"
#include "representation/IfcGeometry.h"
#include "representation/IfcCurve.h"

// This class takes care of loading raw unprocessed geometry data from the IFC loader

namespace webifc::geometry
{

  class IfcGeometryLoader
  {
  public:
    IfcGeometryLoader(const webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache, uint16_t circleSegments);
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

  private:
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
    webifc::cache::IfcCache &_cache;
    uint16_t _circleSegments;
  };

}
