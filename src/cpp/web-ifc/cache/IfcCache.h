/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.  */

#pragma once

#include <unordered_map>
#include <vector>
#include <cstdint>
#include <glm/glm.hpp>

#include "../parsing/IfcLoader.h"
#include "../geometry/representation/IfcCurve.h"

namespace webifc::cache
{

  class IfcCache
  {
  public:
    IfcCache(const webifc::parsing::IfcLoader &loader);
    void Clear();
    void Reset();
    const std::unordered_map<uint32_t, std::vector<uint32_t>> &GetRelVoids() const;
    const std::unordered_map<uint32_t, std::vector<uint32_t>> &GetRelAggregates() const;
    const std::unordered_map<uint32_t, std::vector<uint32_t>> &GetRelNests() const;
    const std::unordered_map<uint32_t, std::vector<std::pair<uint32_t, uint32_t>>> &GetStyledItems() const;
    const std::unordered_map<uint32_t, std::vector<std::pair<uint32_t, uint32_t>>> &GetRelMaterials() const;
    const std::unordered_map<uint32_t, std::vector<std::pair<uint32_t, uint32_t>>> &GetMaterialDefinitions() const;
    std::vector<geometry::IfcCurve> &GetLocalCurvesList();
    std::vector<uint32_t> &GetLocalCurvesIndices();
    std::unordered_map<uint32_t, glm::dvec3> &GetCartesianPoint3DCache();
    std::unordered_map<uint32_t, glm::dvec2> &GetCartesianPoint2DCache();
    std::unordered_map<uint32_t, glm::dmat4> &GetExpressIDToPlacement();
    double GetLinearScalingFactor() const;
    double GetAngularScalingFactor() const;
    std::string GetAngleUnits() const;
    IfcCache *Clone(const webifc::parsing::IfcLoader &loader) const;
  private:
    IfcCache(const webifc::parsing::IfcLoader &loader, const std::unordered_map<uint32_t, std::vector<uint32_t>> &relVoids, const std::unordered_map<uint32_t, std::vector<uint32_t>> &relNests, const std::unordered_map<uint32_t, std::vector<uint32_t>> &relAggregates, const std::unordered_map<uint32_t, std::vector<std::pair<uint32_t, uint32_t>>> &styledItems, const std::unordered_map<uint32_t, std::vector<std::pair<uint32_t, uint32_t>>> &relMaterials, const std::unordered_map<uint32_t, std::vector<std::pair<uint32_t, uint32_t>>> &materialDefinitions, double linearScalingFactor, double squaredScalingFactor, double cubicScalingFactor, double angularScalingFactor, std::string angleUnits, const std::vector<geometry::IfcCurve> &localCurvesList, const std::vector<uint32_t> &localcurvesIndices, std::unordered_map<uint32_t, glm::dmat4> expressIDToPlacement);
    //variables 
    const webifc::parsing::IfcLoader &_loader;
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
    std::vector<geometry::IfcCurve> _localCurvesList;
    std::vector<uint32_t> _localcurvesIndices;
    std::unordered_map<uint32_t, glm::dvec3> _cartesianPoint3DCache;
    std::unordered_map<uint32_t, glm::dvec2> _cartesianPoint2DCache;
    std::unordered_map<uint32_t, glm::dmat4> _expressIDToPlacement;
    //helper methods 
    double ReadLenghtMeasure() const;
    std::unordered_map<uint32_t, std::vector<uint32_t>> PopulateRelVoidsMap();
    std::unordered_map<uint32_t, std::vector<uint32_t>> PopulateRelNestsMap();
    std::unordered_map<uint32_t, std::vector<uint32_t>> PopulateRelAggregatesMap();
    std::unordered_map<uint32_t, std::vector<std::pair<uint32_t, uint32_t>>> PopulateStyledItemMap();
    std::unordered_map<uint32_t, std::vector<std::pair<uint32_t, uint32_t>>> PopulateRelMaterialsMap();
    std::unordered_map<uint32_t, std::vector<std::pair<uint32_t, uint32_t>>> PopulateMaterialDefinitionsMap();
    void ReadLinearScalingFactor();
    double ConvertPrefix(const std::string_view &prefix);
  };

}
