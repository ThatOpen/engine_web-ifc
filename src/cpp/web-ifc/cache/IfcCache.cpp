/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.   */

#include <spdlog/spdlog.h>
#include "IfcCache.h"

namespace webifc::cache
{

  IfcCache::IfcCache(const webifc::parsing::IfcLoader &loader)
      : _loader(loader), _relVoids(PopulateRelVoidsMap()), _relNests(PopulateRelNestsMap()), _relAggregates(PopulateRelAggregatesMap()),
        _styledItems(PopulateStyledItemMap()), _relMaterials(PopulateRelMaterialsMap()), _materialDefinitions(PopulateMaterialDefinitionsMap())
  {
    ReadLinearScalingFactor();
  }

  void IfcCache::Reset()
  {
    _relVoids = PopulateRelVoidsMap();
    _relAggregates = PopulateRelAggregatesMap();
    _relNests = PopulateRelNestsMap();
    _styledItems = PopulateStyledItemMap();
    _relMaterials = PopulateRelMaterialsMap();
    _materialDefinitions = PopulateMaterialDefinitionsMap();
  }

  void IfcCache::Clear()
  {
    _expressIDToPlacement.clear();
    std::unordered_map<uint32_t, glm::dmat4>().swap(_expressIDToPlacement);
    _cartesianPoint3DCache.clear();
    std::unordered_map<uint32_t, glm::dvec3>().swap(_cartesianPoint3DCache);
    _cartesianPoint2DCache.clear();
    std::unordered_map<uint32_t, glm::dvec2>().swap(_cartesianPoint2DCache);
  }

  std::unordered_map<uint32_t, std::vector<uint32_t>> IfcCache::PopulateRelVoidsMap()
  {
    std::unordered_map<uint32_t, std::vector<uint32_t>> resultVector;
    auto relVoids = _loader.GetExpressIDsWithType(schema::IFCRELVOIDSELEMENT);

    for (uint32_t relVoidID : relVoids)
    {
      _loader.MoveToArgumentOffset(relVoidID, 4);

      uint32_t relatingBuildingElement = _loader.GetRefArgument();
      uint32_t relatedOpeningElement = _loader.GetRefArgument();

      resultVector[relatingBuildingElement].push_back(relatedOpeningElement);
    }

    return resultVector;
  }

  std::unordered_map<uint32_t, std::vector<uint32_t>> IfcCache::PopulateRelAggregatesMap()
  {
    std::unordered_map<uint32_t, std::vector<uint32_t>> resultVector;
    auto relAggregates = _loader.GetExpressIDsWithType(schema::IFCRELAGGREGATES);

    for (uint32_t relAggregateID : relAggregates)
    {
      _loader.MoveToArgumentOffset(relAggregateID, 4);

      uint32_t relatingBuildingElement = _loader.GetRefArgument();
      auto aggregates = _loader.GetSetArgument();
      auto relVoidsIt2 = _relVoids.find(relatingBuildingElement);

      for (auto &aggregate : aggregates)
      {
        uint32_t aggregateID = _loader.GetRefArgument(aggregate);
        resultVector[relatingBuildingElement].push_back(aggregateID);
        if (relVoidsIt2 != _relVoids.end() && !relVoidsIt2->second.empty())
        {
          auto relVoidsIt1 = _relVoids.find(aggregateID);
          // any any voids that are aggregated to the voids map
          if (relVoidsIt1 == _relVoids.end())
          {
            _relVoids[aggregateID] = std::vector<uint32_t>();
            relVoidsIt1 = _relVoids.find(aggregateID);
          }
          relVoidsIt1->second.insert(relVoidsIt1->second.end(), relVoidsIt2->second.begin(), relVoidsIt2->second.end());
        }
      }
    }
    return resultVector;
  }

  std::unordered_map<uint32_t, std::vector<uint32_t>> IfcCache::PopulateRelNestsMap()
  {
    std::unordered_map<uint32_t, std::vector<uint32_t>> resultVector;
    auto relNests = _loader.GetExpressIDsWithType(schema::IFCRELNESTS);

    for (uint32_t relNestID : relNests)
    {
      _loader.MoveToArgumentOffset(relNestID, 4);

      uint32_t relatingBuildingElement = _loader.GetRefArgument();
      auto nests = _loader.GetSetArgument();

      for (auto &nest : nests)
      {
        uint32_t nestID = _loader.GetRefArgument(nest);
        resultVector[relatingBuildingElement].push_back(nestID);
      }
    }
    return resultVector;
  }

  std::unordered_map<uint32_t, std::vector<std::pair<uint32_t, uint32_t>>> IfcCache::PopulateStyledItemMap()
  {
    std::unordered_map<uint32_t, std::vector<std::pair<uint32_t, uint32_t>>> returnVector;
    auto styledItems = _loader.GetExpressIDsWithType(schema::IFCSTYLEDITEM);

    for (uint32_t styledItemID : styledItems)
    {
      _loader.MoveToArgumentOffset(styledItemID, 0);

      if (_loader.GetTokenType() == parsing::IfcTokenType::REF)
      {
        _loader.StepBack();
        uint32_t representationItem = _loader.GetRefArgument();

        auto styleAssignments = _loader.GetSetArgument();

        for (auto &styleAssignment : styleAssignments)
        {
          uint32_t styleAssignmentID = _loader.GetRefArgument(styleAssignment);
          returnVector[representationItem].emplace_back(styledItemID, styleAssignmentID);
        }
      }
    }
    return returnVector;
  }

  std::unordered_map<uint32_t, std::vector<std::pair<uint32_t, uint32_t>>> IfcCache::PopulateRelMaterialsMap()
  {
    std::unordered_map<uint32_t, std::vector<std::pair<uint32_t, uint32_t>>> resultVector;
    auto styledItems = _loader.GetExpressIDsWithType(schema::IFCRELASSOCIATESMATERIAL);

    for (uint32_t styledItemID : styledItems)
    {
      _loader.MoveToArgumentOffset(styledItemID, 5);

      uint32_t materialSelect = _loader.GetRefArgument();

      _loader.MoveToArgumentOffset(styledItemID, 4);

      auto RelatedObjects = _loader.GetSetArgument();

      for (auto &ifcRoot : RelatedObjects)
      {
        uint32_t ifcRootID = _loader.GetRefArgument(ifcRoot);
        resultVector[ifcRootID].emplace_back(styledItemID, materialSelect);
      }
    }
    return resultVector;
  }

  std::unordered_map<uint32_t, std::vector<std::pair<uint32_t, uint32_t>>> IfcCache::PopulateMaterialDefinitionsMap()
  {
    std::unordered_map<uint32_t, std::vector<std::pair<uint32_t, uint32_t>>> resultVector;
    auto matDefs = _loader.GetExpressIDsWithType(schema::IFCMATERIALDEFINITIONREPRESENTATION);

    for (uint32_t styledItemID : matDefs)
    {
      _loader.MoveToArgumentOffset(styledItemID, 2);

      auto representations = _loader.GetSetArgument();

      _loader.MoveToArgumentOffset(styledItemID, 3);

      uint32_t material = _loader.GetRefArgument();

      for (auto &representation : representations)
      {
        uint32_t representationID = _loader.GetRefArgument(representation);
        resultVector[material].emplace_back(styledItemID, representationID);
      }
    }
    return resultVector;
  }

  void IfcCache::ReadLinearScalingFactor()
  {
    auto projects = _loader.GetExpressIDsWithType(schema::IFCPROJECT);

    if (projects.size() != 1)
    {
      spdlog::error("[ReadLinearScalingFactor()] unexpected empty ifc project");
      return;
    }

    auto projectEID = projects[0];
    _loader.MoveToArgumentOffset(projectEID, 8);
    auto tk = _loader.GetTokenType();
    _loader.StepBack();
    if (tk != parsing::REF)
    {
        // IfcProject::UnitsInContext is an optional argument, no error or warning
        return;
    }

    auto unitsID = _loader.GetRefArgument();
    _loader.MoveToArgumentOffset(unitsID, 0);

    tk = _loader.GetTokenType();
    _loader.StepBack();
    if (tk != parsing::SET_BEGIN)
    {
        // IfcUnitAssignment::Units vector can be empty. Avoid infinite loop in _loader.GetSetArgument()
        return;
    }
    auto unitIds = _loader.GetSetArgument();

    for (auto &unitID : unitIds)
    {
      auto unitRef = _loader.GetRefArgument(unitID);
      auto lineType = _loader.GetLineType(unitRef);

      if (lineType == schema::IFCSIUNIT)
      {
        _loader.MoveToArgumentOffset(unitRef, 1);
        std::string_view unitType = _loader.GetStringArgument();

        std::string_view unitPrefix;

        _loader.MoveToArgumentOffset(unitRef, 2);
        if (_loader.GetTokenType() == parsing::IfcTokenType::ENUM)
        {
          _loader.StepBack();
          unitPrefix = _loader.GetStringArgument();
        }

        _loader.MoveToArgumentOffset(unitRef, 3);
        std::string_view unitName = _loader.GetStringArgument();

        if (unitType == "LENGTHUNIT" && unitName == "METRE")
        {
          double prefix = ConvertPrefix(unitPrefix);
          _linearScalingFactor *= prefix;
        }
        if (unitType == "PLANEANGLEUNIT")
        {
          _angleUnits = unitName;
        }
      }
      if (lineType == schema::IFCCONVERSIONBASEDUNIT)
      {
        _loader.MoveToArgumentOffset(unitRef, 1);
        std::string_view unitType = _loader.GetStringArgument();
        _loader.MoveToArgumentOffset(unitRef, 3);
        auto unitRefLine = _loader.GetRefArgument();

        _loader.MoveToArgumentOffset(unitRefLine, 1);
        auto ratios = _loader.GetSetArgument();

        /// Scale Correction

        _loader.MoveToArgumentOffset(unitRefLine, 2);
        auto scaleRefLine = _loader.GetRefArgument();

        _loader.MoveToArgumentOffset(scaleRefLine, 1);
        std::string_view unitTypeScale = _loader.GetStringArgument();

        std::string_view unitPrefix;

        _loader.MoveToArgumentOffset(scaleRefLine, 2);
        if (_loader.GetTokenType() == parsing::IfcTokenType::ENUM)
        {
          _loader.StepBack();
          unitPrefix = _loader.GetStringArgument();
        }

        _loader.MoveToArgumentOffset(scaleRefLine, 3);
        std::string_view unitName = _loader.GetStringArgument();

        if (unitTypeScale == "LENGTHUNIT" && unitName == "METRE")
        {
          double prefix = ConvertPrefix(unitPrefix);
          _linearScalingFactor *= prefix;
        }

        double ratio = _loader.GetDoubleArgument(ratios[0]);
        if (unitType == "LENGTHUNIT")
        {
          _linearScalingFactor *= ratio;
        }
        else if (unitType == "AREAUNIT")
        {
          _squaredScalingFactor *= ratio;
        }
        else if (unitType == "VOLUMEUNIT")
        {
          _cubicScalingFactor *= ratio;
        }
        else if (unitType == "PLANEANGLEUNIT")
        {
          _angularScalingFactor *= ratio;
        }
      }
    }
  }

  double IfcCache::ConvertPrefix(const std::string_view &prefix)
  {
    if (prefix == "")
      return 1;
    else if (prefix == "EXA")
      return 1e18;
    else if (prefix == "PETA")
      return 1e15;
    else if (prefix == "TERA")
      return 1e12;
    else if (prefix == "GIGA")
      return 1e9;
    else if (prefix == "MEGA")
      return 1e6;
    else if (prefix == "KILO")
      return 1e3;
    else if (prefix == "HECTO")
      return 1e2;
    else if (prefix == "DECA")
      return 10;
    else if (prefix == "DECI")
      return 1e-1;
    else if (prefix == "CENTI")
      return 1e-2;
    else if (prefix == "MILLI")
      return 1e-3;
    else if (prefix == "MICRO")
      return 1e-6;
    else if (prefix == "NANO")
      return 1e-9;
    else if (prefix == "PICO")
      return 1e-12;
    else if (prefix == "FEMTO")
      return 1e-15;
    else if (prefix == "ATTO")
      return 1e-18;
    else
      return 1;
  }

  const std::unordered_map<uint32_t, std::vector<uint32_t>> &IfcCache::GetRelVoids() const
  {
    return _relVoids;
  }

  const std::unordered_map<uint32_t, std::vector<std::pair<uint32_t, uint32_t>>> &IfcCache::GetStyledItems() const
  {
    return _styledItems;
  }

  const std::unordered_map<uint32_t, std::vector<std::pair<uint32_t, uint32_t>>> &IfcCache::GetRelMaterials() const
  {
    return _relMaterials;
  }

  const std::unordered_map<uint32_t, std::vector<std::pair<uint32_t, uint32_t>>> &IfcCache::GetMaterialDefinitions() const
  {
    return _materialDefinitions;
  }

  double IfcCache::GetLinearScalingFactor() const
  {
    return _linearScalingFactor;
  }

  std::string IfcCache::GetAngleUnits() const
  {
    return _angleUnits;
  }

  double IfcCache::GetAngularScalingFactor() const {
    return _angularScalingFactor;
  }

  const std::unordered_map<uint32_t, std::vector<uint32_t>> &IfcCache::GetRelAggregates() const {
    return _relAggregates;
  }

  const std::unordered_map<uint32_t, std::vector<uint32_t>> &IfcCache::GetRelNests() const {
    return _relNests;
  }

  std::unordered_map<uint32_t, glm::dvec3> &IfcCache::GetCartesianPoint3DCache() {
    return _cartesianPoint3DCache;
  }
  
  std::unordered_map<uint32_t, glm::dvec2> &IfcCache::GetCartesianPoint2DCache() {
    return _cartesianPoint2DCache;
  }
  
  std::unordered_map<uint32_t, glm::dmat4> &IfcCache::GetExpressIDToPlacement() {
    return _expressIDToPlacement;
  }

  std::vector<geometry::IfcCurve> &IfcCache::GetLocalCurvesList() {
    return _localCurvesList;
  }
  
  std::vector<uint32_t> &IfcCache::GetLocalCurvesIndices() {
    return _localcurvesIndices;
  }

  IfcCache *IfcCache::Clone(const webifc::parsing::IfcLoader &newLoader) const
  {
    IfcCache *newCache = new IfcCache(newLoader, _relVoids, _relNests, _relAggregates, _styledItems, _relMaterials, _materialDefinitions, _linearScalingFactor, _squaredScalingFactor, _cubicScalingFactor, _angularScalingFactor, _angleUnits, _localCurvesList, _localcurvesIndices, _expressIDToPlacement);
    return newCache;
  }

  IfcCache::IfcCache(const webifc::parsing::IfcLoader &loader, const std::unordered_map<uint32_t, std::vector<uint32_t>> &relVoids, const std::unordered_map<uint32_t, std::vector<uint32_t>> &relNests, const std::unordered_map<uint32_t, std::vector<uint32_t>> &relAggregates, const std::unordered_map<uint32_t, std::vector<std::pair<uint32_t, uint32_t>>> &styledItems, const std::unordered_map<uint32_t, std::vector<std::pair<uint32_t, uint32_t>>> &relMaterials, const std::unordered_map<uint32_t, std::vector<std::pair<uint32_t, uint32_t>>> &materialDefinitions, double linearScalingFactor, double squaredScalingFactor, double cubicScalingFactor, double angularScalingFactor, std::string angleUnits, const std::vector<geometry::IfcCurve> &localCurvesList, const std::vector<uint32_t> &localcurvesIndices, std::unordered_map<uint32_t, glm::dmat4> expressIDToPlacement)
      : _loader(loader), _relVoids(relVoids), _relNests(relNests), _relAggregates(relAggregates), _styledItems(styledItems), _relMaterials(relMaterials), _materialDefinitions(materialDefinitions), _linearScalingFactor(linearScalingFactor), _squaredScalingFactor(squaredScalingFactor), _cubicScalingFactor(cubicScalingFactor), _angularScalingFactor(angularScalingFactor), _angleUnits(angleUnits), _localCurvesList(localCurvesList), _localcurvesIndices(localcurvesIndices), _expressIDToPlacement(expressIDToPlacement)
  {
  }
}
