/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.   */

#include <spdlog/spdlog.h>
#include <iomanip>
#include "IfcGeometryLoader.h"
#include "operations/curve-utils.h"
#include "operations/geometryutils.h"
#ifdef DEBUG_DUMP_SVG
#include "../../test/io_helpers.h"
#include "../../test/dumpToThree.h"
#endif

namespace webifc::geometry
{

  IfcGeometryLoader::IfcGeometryLoader(const webifc::parsing::IfcLoader &loader, const webifc::schema::IfcSchemaManager &schemaManager, uint16_t circleSegments, double TOLERANCE_PLANE_INTERSECTION, double TOLERANCE_PLANE_DEVIATION, double TOLERANCE_BACK_DEVIATION_DISTANCE, double TOLERANCE_INSIDE_OUTSIDE_PERIMETER, double TOLERANCE_SCALAR_EQUALITY, double PLANE_REFIT_ITERATIONS, double BOOLEAN_UNION_THRESHOLD)
      : _loader(loader), _schemaManager(schemaManager), _relVoids(PopulateRelVoidsMap()), _relNests(PopulateRelNestsMap()), _relAggregates(PopulateRelAggregatesMap()),
        _styledItems(PopulateStyledItemMap()), _relMaterials(PopulateRelMaterialsMap()), _materialDefinitions(PopulateMaterialDefinitionsMap()), _circleSegments(circleSegments)
  {
    ReadLinearScalingFactor();
  }

  void IfcGeometryLoader::ResetCache()
  {
    _relVoids = PopulateRelVoidsMap();
    _relAggregates = PopulateRelAggregatesMap();
    _relNests = PopulateRelNestsMap();
    _styledItems = PopulateStyledItemMap();
    _relMaterials = PopulateRelMaterialsMap();
    _materialDefinitions = PopulateMaterialDefinitionsMap();
  }

  void IfcGeometryLoader::Clear() const
  {
    _expressIDToPlacement.clear();
    std::unordered_map<uint32_t, glm::dmat4>().swap(_expressIDToPlacement);
    _cartesianPoint3DCache.clear();
    std::unordered_map<uint32_t, glm::dvec3>().swap(_cartesianPoint3DCache);
    _cartesianPoint2DCache.clear();
    std::unordered_map<uint32_t, glm::dvec2>().swap(_cartesianPoint2DCache);
  }

  IfcCrossSections IfcGeometryLoader::GetCrossSections2D(uint32_t expressID) const
  {
    spdlog::debug("[GetCrossSections2D({})]", expressID);
    auto lineType = _loader.GetLineType(expressID);
    IfcCrossSections sections;
    switch (lineType)
    {
    case schema::IFCSECTIONEDSOLIDHORIZONTAL:
    {
      _loader.MoveToArgumentOffset(expressID, 0);
      auto curveId = _loader.GetRefArgument();

      // faces
      _loader.MoveToArgumentOffset(expressID, 1);
      auto faces = _loader.GetSetArgument();

      // linear position
      _loader.MoveToArgumentOffset(expressID, 2);
      auto linearPositions = _loader.GetSetArgument();

      IfcCurve curve = GetCurve(curveId, 3);

      std::vector<IfcProfile> profiles;
      std::vector<IfcCurve> curves;
      std::vector<uint32_t> expressIds;

      uint32_t id = 0;
      for (auto &face : faces)
      {
        auto expressID = _loader.GetRefArgument(face);
        IfcProfile profile = GetProfile(expressID);
        profiles.push_back(profile);
        curves.push_back(profile.curve);
        expressIds.push_back(expressID);
        id++;
      }

      sections.curves = curves;
      sections.expressID = expressIds;

      return sections;

      break;
    }
    case schema::IFCSECTIONEDSOLID:
    {
      _loader.MoveToArgumentOffset(expressID, 0);
      auto curveId = _loader.GetRefArgument();

      // faces
      _loader.MoveToArgumentOffset(expressID, 1);
      auto faces = _loader.GetSetArgument();

      // linear position
      _loader.MoveToArgumentOffset(expressID, 2);
      auto linearPositions = _loader.GetSetArgument();

      IfcCurve curve = GetCurve(curveId, 3);

      std::vector<IfcProfile> profiles;
      std::vector<IfcCurve> curves;
      std::vector<uint32_t> expressIds;

      uint32_t id = 0;
      for (auto &face : faces)
      {
        auto expressID = _loader.GetRefArgument(face);
        IfcProfile profile = GetProfile(expressID);
        profiles.push_back(profile);
        curves.push_back(profile.curve);
        expressIds.push_back(expressID);
        id++;
      }

      sections.curves = curves;
      sections.expressID = expressIds;

      return sections;

      break;
    }
    case schema::IFCSECTIONEDSURFACE:
    {
      // faces
      _loader.MoveToArgumentOffset(expressID, 1);
      auto linearPositions = _loader.GetSetArgument();

      // linear position
      _loader.MoveToArgumentOffset(expressID, 2);
      auto faces = _loader.GetSetArgument();

      std::vector<IfcProfile> profiles;
      std::vector<IfcCurve> curves;
      std::vector<uint32_t> expressIds;

      uint32_t id = 0;
      for (auto &face : faces)
      {
        auto expressID = _loader.GetRefArgument(face);
        IfcProfile profile = GetProfile(expressID);
        profiles.push_back(profile);
        curves.push_back(profile.curve);
        expressIds.push_back(expressID);
        id++;
      }

      sections.curves = curves;
      sections.expressID = expressIds;
      return sections;
    }
    }
    return sections;
  }

  void IfcGeometryLoader::getPlacementsOnCurvePoints(uint32_t curveID, std::map<double, glm::dmat4>& mapPlacements) const
  {
      if (mapPlacements.size() < 2)
      {
          return;
      }
      double minDistance = mapPlacements.begin()->first;
      double maxDistance = mapPlacements.rbegin()->first;
      
      IfcCurve BasisCurve = GetLocalCurve(curveID);
      if (BasisCurve.points.size() == 0)
      {
          spdlog::error("[getPlacementsOnCurve] BasisCurve has no points {}", curveID);
          return;
      }

      // re-compute placement at existing points
      for (auto& it : mapPlacements)
      {
          it.second = BasisCurve.getPlacementAtDistance(it.first, IfcCurve::CurvePlacementMode::TangentAsZAxis);
      }
      
      if (minDistance <= 0)
      {
          glm::dmat4 result = BasisCurve.getPlacementAtDistance(0, IfcCurve::CurvePlacementMode::TangentAsZAxis);
          mapPlacements.insert({ 0, result });
      }

      // get placement for each point on the curve
      double sumLength = 0;
      glm::dvec3 previousPoint = BasisCurve.points[0];
      for (size_t ii = 1; ii < BasisCurve.points.size(); ++ii)
      {
          glm::dvec3 point1 = BasisCurve.points[ii];
          double length = glm::distance(point1, previousPoint);
          sumLength += length;

          if (sumLength >= minDistance)
          {
              glm::dmat4 result = BasisCurve.getPlacementAtDistance(sumLength, IfcCurve::CurvePlacementMode::TangentAsZAxis);
              mapPlacements.insert({ sumLength, result });
          }
          
          if (sumLength > maxDistance)
          {
              break;
          }
          previousPoint = point1;
      }

      if (maxDistance >= sumLength)
      {
          glm::dmat4 result = BasisCurve.getPlacementAtDistance(sumLength, IfcCurve::CurvePlacementMode::TangentAsZAxis);
          mapPlacements.insert({ sumLength, result });
      }
  }

  IfcCrossSections IfcGeometryLoader::GetCrossSections3D(uint32_t expressID, bool scaled, glm::dmat4 coordination) const
  {
    spdlog::debug("[GetCrossSections3D({})]", expressID);
    auto lineType = _loader.GetLineType(expressID);
    IfcCrossSections sections;
    double scale = 1;
    if (scaled)
    {
      scale = GetLinearScalingFactor();
      glm::dvec4 ps = coordination[3];
      double y = ps[1];
      double z = -ps[2];
      ps[1] = z;
      ps[2] = y;
      coordination[3] = ps;
    }
    switch (lineType)
    {
    case schema::IFCSECTIONEDSOLIDHORIZONTAL:
    {
        // IfcSectionedSolidHorizontal
        //    IfcCurve									Directrix
        //    std::vector<IfcProfileDef>				CrossSections
        //    std::vector<IfcAxis2PlacementLinear>		CrossSectionPositions

      _loader.MoveToArgumentOffset(expressID, 0);
      auto DirectrixId = _loader.GetRefArgument();

      // faces
      _loader.MoveToArgumentOffset(expressID, 1);
      auto CrossSectionsOffsets = _loader.GetSetArgument();

      // linear position
      _loader.MoveToArgumentOffset(expressID, 2);
      auto CrossSectionPositionOffsets = _loader.GetSetArgument();

      IfcCurve Directrix = GetCurve(DirectrixId, 3);

#ifdef DEBUG_DUMP_SVG
      dump::DumpCurveToHtml(Directrix.points, "Directrix.html");
#endif

      std::vector<IfcCurve> curves;
      std::vector<uint32_t> CrossSectionIDs;

      std::map<double, glm::dmat4> mapCrossSectionPositions;  // explicit placements from CrossSectionPositions
      std::unordered_map<uint32_t, std::set<double> > mapCurveToDistanceAlong;
      std::vector<glm::dmat4> vecCrossSectionPositionsFallback;

      for ( uint32_t offset : CrossSectionPositionOffsets)
      {
        auto CrossSectionPositionID = _loader.GetRefArgument(offset);
        // IfcAxis2PlacementLinear
        //    IfcPoint							Location;
        //    IfcDirection						Axis;						//optional
        //    IfcDirection						RefDirection;				//optional

        //glm::dmat4 linearPlacement = GetLocalPlacement(expressID) * scale;

        uint32_t linearPlacementType = _loader.GetLineType(CrossSectionPositionID);
        if (linearPlacementType != schema::IFCAXIS2PLACEMENTLINEAR)
        {
            spdlog::error("[IFCSECTIONEDSOLIDHORIZONTAL] unexpected Location type {}", CrossSectionPositionID, linearPlacementType);
            continue;
        }
    
        glm::dvec3 Axis = glm::dvec3(0, 0, 1);
        
        _loader.MoveToArgumentOffset(CrossSectionPositionID, 0);
        auto tokenTypeLocation = _loader.GetTokenType();
        // Location is not optional, but check anyway:
        if (tokenTypeLocation == parsing::IfcTokenType::REF)
        {
            _loader.StepBack();
            uint32_t LocationID = _loader.GetRefArgument();
            
            // Axis is optional:
            _loader.MoveToArgumentOffset(CrossSectionPositionID, 1);
            auto tokenTypeAxis = _loader.GetTokenType();
            if (tokenTypeAxis == parsing::IfcTokenType::REF)
            {
                _loader.StepBack();
                Axis = GetCartesianPoint3D(_loader.GetRefArgument());
            }

            // IfcPointByDistanceExpression : public IfcPoint
            //    IfcCurveMeasureSelect					DistanceAlong;
            //    IfcLengthMeasure						OffsetLateral;			//optional
            //    IfcLengthMeasure						OffsetVertical;			//optional
            //    IfcLengthMeasure						OffsetLongitudinal;		//optional
            //    IfcCurve								BasisCurve;

            uint32_t locationType = _loader.GetLineType(LocationID);
            std::string locationTypeString = _schemaManager.IfcTypeCodeToType(locationType);
            if (locationType == schema::IFCPOINTBYDISTANCEEXPRESSION)
            {
                _loader.MoveToArgumentOffset(LocationID, 0);
                auto tokenTypeDistanceAlong = _loader.GetTokenType();
                if (tokenTypeDistanceAlong != parsing::LABEL)
                {
                    spdlog::error("[IFCSECTIONEDSOLIDHORIZONTAL] unexpected argument type, expected IFCLENGTHMEASURE", expressID);
                    continue;
                }

                _loader.StepBack();
                std::string_view DistanceAlongLabel = _loader.GetStringArgument();
                if (DistanceAlongLabel.compare("IFCLENGTHMEASURE") != 0)
                {
                    spdlog::error("[IFCSECTIONEDSOLIDHORIZONTAL] unexpected argument type, expected IFCLENGTHMEASURE", expressID);
                    continue;
                }
                _loader.GetTokenType();
                double DistanceAlong = _loader.GetDoubleArgument();
                
                // OffsetLateral, OffsetVertical, OffsetLongitudinal is considered later when the actual matrix is computed

                _loader.MoveToArgumentOffset(LocationID, 5);
                auto tokenTypeBasisCurve = _loader.GetTokenType();
                if (tokenTypeBasisCurve == parsing::REF)
                {
                    _loader.StepBack();
                    uint32_t BasisCurveID = _loader.GetRefArgument();

                    mapCurveToDistanceAlong[BasisCurveID].insert(DistanceAlong);
                    mapCrossSectionPositions.insert({ DistanceAlong, glm::dmat4(1) });
                }
            }
            else
            {
                // fallback to other types of IfcPoint
                glm::dmat4 linearPlacement = GetLocalPlacement(LocationID, Axis);
                linearPlacement *= scale; // check if already applied in GetLocalPlacement
                vecCrossSectionPositionsFallback.push_back(linearPlacement);
            }
        }
      }

      if(mapCrossSectionPositions.size() == 0)
      {
          spdlog::error("[IFCSECTIONEDSOLIDHORIZONTAL] no valid CrossSectionPositions");
          return sections;
	  }

      if (mapCurveToDistanceAlong.size() == 0)
      {
          spdlog::error("[IFCSECTIONEDSOLIDHORIZONTAL] no valid CrossSectionPositions");
          return sections;
      }

      if (CrossSectionsOffsets.size() == 0)
      {
          spdlog::error("[IFCSECTIONEDSOLIDHORIZONTAL] no valid CrossSections");
          return sections;
      }
	  
      std::set<double> distancesWithCrossSection;
      auto it = mapCurveToDistanceAlong.find(DirectrixId);
      if( it != mapCurveToDistanceAlong.end())
      {
          distancesWithCrossSection = it->second;
      }
      else
      {
		  // take any other curve if DirectrixId not found
          distancesWithCrossSection = mapCurveToDistanceAlong.begin()->second;
      }

	  getPlacementsOnCurvePoints(DirectrixId, mapCrossSectionPositions);

      uint32_t crossSectionIndex = 0;
      uint32_t currentCrossSectionID = _loader.GetRefArgument(CrossSectionsOffsets[crossSectionIndex]);
      for (auto& it : mapCrossSectionPositions)
      {
          double distance = it.first;
          glm::dmat4 placement = it.second;
          IfcProfile currentProfile = GetProfile(currentCrossSectionID);

#ifdef DEBUG_DUMP_SVG
          dump::DumpCurveToHtml(currentProfile.curve.points, "dumpCurve.html");
#endif


          // the curve may have more points than we have cross sections. 
          // the cross sections are not directly given with a distance, but we can compute the distance between 

          for (uint32_t i = 0; i < currentProfile.curve.points.size(); i++)
          {
              glm::dvec3 pTemp = placement * glm::dvec4(currentProfile.curve.points[i], 1);
              currentProfile.curve.points[i] = coordination * glm::dvec4(pTemp.x, pTemp.y, pTemp.z, 1);
          }
          //profiles.push_back(currentProfile);
          curves.push_back(currentProfile.curve);
          CrossSectionIDs.push_back(currentCrossSectionID);

          if (distancesWithCrossSection.find(distance) != distancesWithCrossSection.end())
          {
              // go to next cross section
              ++crossSectionIndex;
              if (crossSectionIndex >= CrossSectionsOffsets.size())
              {
                  crossSectionIndex = CrossSectionsOffsets.size() - 1;
              }
              currentCrossSectionID = _loader.GetRefArgument(CrossSectionsOffsets[crossSectionIndex]);
          }
      }

      sections.curves = curves;
      sections.expressID = CrossSectionIDs;
      return sections;
    }
    case schema::IFCSECTIONEDSOLID:
    {
      _loader.MoveToArgumentOffset(expressID, 0);
      auto curveId = _loader.GetRefArgument();

      // faces
      _loader.MoveToArgumentOffset(expressID, 1);
      auto faces = _loader.GetSetArgument();

      // linear position
      _loader.MoveToArgumentOffset(expressID, 2);
      auto linearPositions = _loader.GetSetArgument();

      IfcCurve curve = GetCurve(curveId, 3);

      std::vector<IfcProfile> profiles;
      std::vector<IfcCurve> curves;
      std::vector<uint32_t> expressIds;

      std::vector<glm::dmat4> transform;
      for (auto &linearPosition : linearPositions)
      {
        auto expressID = _loader.GetRefArgument(linearPosition);
        glm::dmat4 linearPlacement = GetLocalPlacement(expressID) * scale;
        transform.push_back(linearPlacement);
      }

      uint32_t id = 0;
      for (auto &face : faces)
      {
        auto expressID = _loader.GetRefArgument(face);
        IfcProfile profile = GetProfile(expressID);
        for (uint32_t i = 0; i < profile.curve.points.size(); i++)
        {
          glm::dvec3 pTemp = transform[id] * glm::dvec4(profile.curve.points[i], 1);
          profile.curve.points[i] = coordination * glm::dvec4(pTemp.x, pTemp.y, pTemp.z, 1);
        }
        profiles.push_back(profile);
        curves.push_back(profile.curve);
        expressIds.push_back(expressID);
        id++;
      }

      sections.curves = curves;
      sections.expressID = expressIds;
      return sections;

      break;
    }
    case schema::IFCSECTIONEDSURFACE:
    {
      // faces
      _loader.MoveToArgumentOffset(expressID, 1);
      auto linearPositions = _loader.GetSetArgument();

      // linear position
      _loader.MoveToArgumentOffset(expressID, 2);
      auto faces = _loader.GetSetArgument();

      std::vector<glm::dmat4> transform;
      for (auto &linearPosition : linearPositions)
      {
        auto expressID = _loader.GetRefArgument(linearPosition);
        glm::dmat4 linearPlacement = GetLocalPlacement(expressID) * scale;
        transform.push_back(linearPlacement);
      }

      uint32_t id = 0;
      std::vector<IfcProfile> profiles;
      std::vector<IfcCurve> curves;
      std::vector<uint32_t> expressIds;

      for (auto &face : faces)
      {
        auto expressID = _loader.GetRefArgument(face);
        IfcProfile profile = GetProfile(expressID);
        for (uint32_t i = 0; i < profile.curve.points.size(); i++)
        {
          glm::dvec3 pTemp = transform[id] * glm::dvec4(profile.curve.points[i], 1);
          profile.curve.points[i] = coordination * glm::dvec4(pTemp.x, pTemp.y, pTemp.z, 1);
        }
        profiles.push_back(profile);
        curves.push_back(profile.curve);
        expressIds.push_back(expressID);
        id++;
      }

      sections.curves = curves;
      sections.expressID = expressIds;
      return sections;
    }
    }
    return sections;
  }

  IfcAlignment IfcGeometryLoader::GetAlignment(uint32_t expressID, IfcAlignment alignment, glm::dmat4 transform, uint32_t sourceExpressID) const
  {
    spdlog::debug("[GetAlignment({})]", expressID);
    auto lineType = _loader.GetLineType(expressID);

    // TODO: Add support for IFCREFERENT

    switch (lineType)
    {
    case schema::IFCALIGNMENT:
    {
      _loader.MoveToArgumentOffset(expressID, 5);
      uint32_t localPlacement = 0;
      if (_loader.GetTokenType() == parsing::IfcTokenType::REF)
      {
        _loader.StepBack();
        localPlacement = _loader.GetRefArgument();
      }

      glm::dmat4 transform_t = glm::dmat4(1);
      if (localPlacement != 0 && _loader.IsValidExpressID(localPlacement))
      {
        transform_t = GetLocalPlacement(localPlacement);
        alignment.PlacementExpressId = localPlacement;
      }

      if (_relAggregates.count(expressID) == 1)
      {
        auto &relAgg = _relAggregates.at(expressID);
        for (auto expressID : relAgg)
        {
          alignment = GetAlignment(expressID, alignment, transform * transform_t, expressID);
        }
      }

      if (_relNests.count(expressID) == 1)
      {
        auto &relNest = _relNests.at(expressID);
        for (auto expressID : relNest)
        {
          alignment = GetAlignment(expressID, alignment, transform * transform_t, expressID);
        }
      }

      break;
    }
    case schema::IFCALIGNMENTHORIZONTAL:
    {
      _loader.MoveToArgumentOffset(expressID, 5);
      uint32_t localPlacement = 0;
      if (_loader.GetTokenType() == parsing::IfcTokenType::REF)
      {
        _loader.StepBack();
        localPlacement = _loader.GetRefArgument();
      }

      glm::dmat4 transform_t = glm::dmat4(1);
      if (localPlacement != 0 && _loader.IsValidExpressID(localPlacement))
      {
        transform_t = GetLocalPlacement(localPlacement);
      }

      if (_relAggregates.count(expressID) == 1)
      {
        auto &relAgg = _relAggregates.at(expressID);
        for (auto expressID : relAgg)
        {
          alignment.Horizontal.curves.push_back(GetAlignmentCurve(expressID, sourceExpressID));
        }

        for (size_t i = 0; i < alignment.Horizontal.curves.size(); i++)
        {
          for (size_t j = 0; j < alignment.Horizontal.curves[i].points.size(); j++)
          {
            alignment.Horizontal.curves[i].points[j] =
                glm::dvec4(alignment.Horizontal.curves[i].points[j].x, alignment.Horizontal.curves[i].points[j].y, 0, 1) * transform * transform_t;
          }
        }
      }

      if (_relNests.count(expressID) == 1)
      {
        auto &relNest = _relNests.at(expressID);
        for (auto expressID : relNest)
        {
          alignment.Horizontal.curves.push_back(GetAlignmentCurve(expressID, sourceExpressID));
        }

        for (size_t i = 0; i < alignment.Horizontal.curves.size(); i++)
        {
          for (size_t j = 0; j < alignment.Horizontal.curves[i].points.size(); j++)
          {
            alignment.Horizontal.curves[i].points[j] =
                glm::dvec4(alignment.Horizontal.curves[i].points[j].x, alignment.Horizontal.curves[i].points[j].y, 0, 1) * transform * transform_t;
          }
        }
      }

      break;
    }
    case schema::IFCALIGNMENTVERTICAL:
    {
      _loader.MoveToArgumentOffset(expressID, 5);
      uint32_t localPlacement = 0;
      if (_loader.GetTokenType() == parsing::IfcTokenType::REF)
      {
        _loader.StepBack();
        localPlacement = _loader.GetRefArgument();
      }

      glm::dmat4 transform_t = glm::dmat4(1);
      if (localPlacement != 0 && _loader.IsValidExpressID(localPlacement))
      {
        transform_t = GetLocalPlacement(localPlacement);
      }

      if (_relAggregates.count(expressID) == 1)
      {
        auto &relAgg = _relAggregates.at(expressID);
        for (auto expressID : relAgg)
        {
          alignment.Vertical.curves.push_back(GetAlignmentCurve(expressID, sourceExpressID));
        }

        for (size_t i = 0; i < alignment.Vertical.curves.size(); i++)
        {
          for (size_t j = 0; j < alignment.Vertical.curves[i].points.size(); j++)
          {
            alignment.Vertical.curves[i].points[j] =
                glm::dvec4(alignment.Vertical.curves[i].points[j].x, alignment.Vertical.curves[i].points[j].y, 0, 1) * transform * transform_t;
          }
        }
      }

      if (_relNests.count(expressID) == 1)
      {
        auto &relNest = _relNests.at(expressID);
        for (auto expressID : relNest)
        {
          alignment.Vertical.curves.push_back(GetAlignmentCurve(expressID, sourceExpressID));
        }

        for (size_t i = 0; i < alignment.Vertical.curves.size(); i++)
        {
          for (size_t j = 0; j < alignment.Vertical.curves[i].points.size(); j++)
          {
            alignment.Vertical.curves[i].points[j] =
                glm::dvec4(alignment.Vertical.curves[i].points[j].x, alignment.Vertical.curves[i].points[j].y, 0, 1) * transform * transform_t;
          }
        }
      }

      break;
    }
    default:
    {
      break;
    }
    }
    return alignment;
  }

  IfcCurve IfcGeometryLoader::GetAlignmentCurve(uint32_t expressID, uint32_t parentExpressID) const
  {
    spdlog::debug("[GetAlignmentCurve({})]", expressID);
    auto lineType = _loader.GetLineType(expressID);

    IfcCurve alignmentCurve;

    switch (lineType)
    {
    case schema::IFCALIGNMENTSEGMENT:
    {

      _loader.MoveToArgumentOffset(expressID, 5);
      uint32_t localPlacement = 0;
      if (_loader.GetTokenType() == parsing::IfcTokenType::REF)
      {
        _loader.StepBack();
        localPlacement = _loader.GetRefArgument();
      }

      glm::dmat4 transform_t = glm::dmat4(1);
      if (localPlacement != 0 && _loader.IsValidExpressID(localPlacement))
      {
        transform_t = GetLocalPlacement(localPlacement);
      }

      _loader.MoveToArgumentOffset(expressID, 7);
      uint32_t curveID = 0;
      if (_loader.GetTokenType() == parsing::IfcTokenType::REF)
      {
        _loader.StepBack();
        curveID = _loader.GetRefArgument();
      }
      if (curveID != 0 && _loader.IsValidExpressID(curveID))
      {
        IfcCurve temp = GetAlignmentCurve(curveID, parentExpressID);
        alignmentCurve = temp;
      }

      for (size_t i = 0; i < alignmentCurve.points.size(); i++)
      {
        alignmentCurve.points[i] = glm::dvec4(alignmentCurve.points[i].x, alignmentCurve.points[i].y, 0, 1) * transform_t;
      }

      break;
    }
    case schema::IFCALIGNMENTHORIZONTALSEGMENT:
    {

      _loader.MoveToArgumentOffset(expressID, 8);
      std::string_view type = _loader.GetStringArgument();

      _loader.MoveToArgumentOffset(expressID, 2);
      uint32_t ifcStartPoint = _loader.GetRefArgument();
      glm::dvec2 StartPoint = GetCartesianPoint2D(ifcStartPoint);

      _loader.MoveToArgumentOffset(expressID, 3);
      double ifcStartDirection = _loader.GetDoubleArgument();

      _loader.MoveToArgumentOffset(expressID, 4);
      double StartRadiusOfCurvature = _loader.GetDoubleArgument();

      _loader.MoveToArgumentOffset(expressID, 5);
      double EndRadiusOfCurvature = _loader.GetDoubleArgument();

      _loader.MoveToArgumentOffset(expressID, 6);
      double SegmentLength = _loader.GetDoubleArgument();

      _loader.MoveToArgumentOffset(expressID, 7);
      double GravityCenterLineHeight = _loader.GetDoubleArgument();

      std::string str(type);

      switch (Horizontal_alignment_type.at(type))
      {
      default:
      {
        break;
      }
      case 1: // LINE
      {

        IfcCurve curve;
        glm::dvec2 Direction(
            glm::cos(ifcStartDirection),
            glm::sin(ifcStartDirection));
        glm::dvec2 EndPoint = StartPoint + Direction * SegmentLength;

        curve.Add(StartPoint);
        curve.Add(EndPoint);

        alignmentCurve = curve;
        alignmentCurve.userData.push_back("ID: " + std::to_string(parentExpressID));
        alignmentCurve.userData.push_back("TYPE: " + str);
        alignmentCurve.userData.push_back("LENGHT: " + std::to_string(SegmentLength));
        alignmentCurve.userData.push_back("DIRECTION: " + std::to_string(ifcStartDirection));

        break;
      }
      case 2: // ARC
      {
        IfcCurve curve;
        double span = (SegmentLength / StartRadiusOfCurvature);
        ifcStartDirection = ifcStartDirection - (CONST_PI / 2);

        bool sw = true;
        auto curve2D = GetEllipseCurve(StartRadiusOfCurvature, StartRadiusOfCurvature, 20, glm::dmat3(1), ifcStartDirection, ifcStartDirection + span, sw);
        glm::dvec2 desp = glm::dvec2(StartPoint.x - curve2D.points[0].x, StartPoint.y - curve2D.points[0].y);

        for (size_t i = 0; i < curve2D.points.size(); i++)
        {
          curve.Add(curve2D.Get2d(i) + desp);
        }

        alignmentCurve = curve;
        alignmentCurve.userData.push_back("ID: " + std::to_string(parentExpressID));
        alignmentCurve.userData.push_back("TYPE: " + str);
        alignmentCurve.userData.push_back("RADIUS: " + std::to_string(StartRadiusOfCurvature));
        alignmentCurve.userData.push_back("STARTRAD: " + std::to_string(ifcStartDirection));
        alignmentCurve.userData.push_back("ENDRAD: " + std::to_string(ifcStartDirection + span));

        break;
      }
      case 3: // CLOTHOID
      {
        IfcCurve curve;

        std::vector<glm::dvec2> points = bimGeometry::SolveClothoid(_circleSegments, StartPoint, ifcStartDirection, StartRadiusOfCurvature, EndRadiusOfCurvature, SegmentLength);

        for (auto &pt2D : points)
        {
          curve.Add(pt2D);
        }

        alignmentCurve = curve;
        alignmentCurve.userData.push_back("ID: " + std::to_string(parentExpressID));
        alignmentCurve.userData.push_back("TYPE: " + str);
        alignmentCurve.userData.push_back("STARTRAD: " + std::to_string(ifcStartDirection));
        alignmentCurve.userData.push_back("START RADIUS: " + std::to_string(StartRadiusOfCurvature));
        alignmentCurve.userData.push_back("END RADIUS: " + std::to_string(EndRadiusOfCurvature));
        alignmentCurve.userData.push_back("SEGMENTLENGHT: " + std::to_string(SegmentLength));

        break;
      }
      case 4: // CUBIC
      {
        break;
      }
      case 5:
      {
        break;
      }
      case 6:
      {
        break;
      }
      case 7:
      {
        break;
      }
      case 8:
      {
        break;
      }
      case 9:
      {
        break;
      }
      }

      break;
    }
    case schema::IFCALIGNMENTVERTICALSEGMENT:
    {
      _loader.MoveToArgumentOffset(expressID, 2);
      double StartDistAlong = _loader.GetDoubleArgument();

      _loader.MoveToArgumentOffset(expressID, 3);
      double HorizontalLength = _loader.GetDoubleArgument();

      _loader.MoveToArgumentOffset(expressID, 4);
      double StartHeight = _loader.GetDoubleArgument();

      _loader.MoveToArgumentOffset(expressID, 5);
      double StartGradient = _loader.GetDoubleArgument();

      _loader.MoveToArgumentOffset(expressID, 6);
      double EndGradient = _loader.GetDoubleArgument();

      _loader.MoveToArgumentOffset(expressID, 7);
      double RadiusOfCurvature = _loader.GetDoubleArgument();

      _loader.MoveToArgumentOffset(expressID, 8);
      std::string_view type = _loader.GetStringArgument();

      IfcProfile profile;

      std::string str(type);

      switch (Vertical_alignment_type.at(type))
      {
      default:
      {
        break;
      }
      case 1: // CONSTANTGRADIENT
      {
        IfcCurve curve;

        glm::dvec3 iPoint = glm::dvec3(StartDistAlong, StartHeight, 1);
        glm::dvec3 jPoint = glm::dvec3(StartDistAlong + HorizontalLength, StartHeight + HorizontalLength * StartGradient, 1);
        glm::dvec3 Normal = glm::dvec3(0, 0, 1);

        curve.Add(iPoint);
        curve.Add(jPoint);

        alignmentCurve = curve;
        alignmentCurve.userData.push_back("ID: " + std::to_string(parentExpressID));
        alignmentCurve.userData.push_back("TYPE: " + str);
        alignmentCurve.userData.push_back("START HEIGHT: " + std::to_string(StartHeight));
        alignmentCurve.userData.push_back("START GRADIENT: " + std::to_string(StartGradient));
        break;
      }
      case 2: // ARC
      {
        IfcCurve curve;

        double ifcStartDirection = atan(StartGradient);
        double ifcEndDirection = atan(EndGradient);

        ifcStartDirection = ifcStartDirection - (CONST_PI / 2);
        ifcEndDirection = ifcEndDirection - (CONST_PI / 2);

        glm::dvec2 StartPoint(StartDistAlong, StartHeight);

        bool sw = true;
        if (ifcStartDirection > ifcEndDirection)
        {
          ifcStartDirection = ifcStartDirection + CONST_PI;
          ifcEndDirection = ifcEndDirection + CONST_PI;
        }
        auto curve2D = GetEllipseCurve(RadiusOfCurvature, RadiusOfCurvature, _circleSegments, glm::dmat3(1), ifcStartDirection, ifcEndDirection, sw);
        glm::dvec2 desp = glm::dvec2(StartPoint.x - curve2D.points[0].x, StartPoint.y - curve2D.points[0].y);

        for (size_t i = 0; i < curve2D.points.size(); i++)
        {

          curve.Add(curve2D.Get2d(i) + desp);
        }

        alignmentCurve = curve;
        alignmentCurve.userData.push_back("ID: " + std::to_string(parentExpressID));
        alignmentCurve.userData.push_back("TYPE: " + str);
        alignmentCurve.userData.push_back("RADIUS: " + std::to_string(RadiusOfCurvature));
        alignmentCurve.userData.push_back("STARTRAD: " + std::to_string(ifcStartDirection));
        alignmentCurve.userData.push_back("ENDRAD: " + std::to_string(ifcEndDirection));

        break;
      }
      case 3: // PARABOLIC
      {
        IfcCurve curve;

        glm::dvec2 StartPoint(StartDistAlong, StartHeight);

        std::vector<glm::dvec2> points = bimGeometry::SolveParabola(_circleSegments, StartPoint, HorizontalLength, StartHeight, StartGradient, EndGradient);

        glm::dvec2 desp = glm::dvec2(StartPoint.x - points[0].x, StartPoint.y - points[0].y);

        for (auto &pt2D : points)
        {
          curve.Add(pt2D + desp);
        }

        alignmentCurve = curve;
        alignmentCurve.userData.push_back("ID: " + std::to_string(parentExpressID));
        alignmentCurve.userData.push_back("TYPE: " + str);
        alignmentCurve.userData.push_back("LENGHT: " + std::to_string(HorizontalLength));
        alignmentCurve.userData.push_back("START HEIGHT: " + std::to_string(StartHeight));
        alignmentCurve.userData.push_back("START GRADIENT: " + std::to_string(StartGradient));
        alignmentCurve.userData.push_back("END GRADIENT: " + std::to_string(EndGradient));

        break;
      }
      }
      break;
    }
    }

    return alignmentCurve;
  }

  std::optional<glm::dvec4> IfcGeometryLoader::GetColor(uint32_t expressID) const
  {
    spdlog::debug("[GetColor({})]", expressID);
    auto lineType = _loader.GetLineType(expressID);
    switch (lineType)
    {
    case schema::IFCPRESENTATIONSTYLEASSIGNMENT:
    {
      _loader.MoveToArgumentOffset(expressID, 0);
      auto ifcPresentationStyleSelects = _loader.GetSetArgument();

      for (auto &styleSelect : ifcPresentationStyleSelects)
      {
        uint32_t styleSelectID = _loader.GetRefArgument(styleSelect);
        auto foundColor = GetColor(styleSelectID);
        if (foundColor)
          return foundColor;
      }

      return {};
    }
    case schema::IFCDRAUGHTINGPREDEFINEDCOLOUR:
    {
      _loader.MoveToArgumentOffset(expressID, 0);
      std::string_view color = _loader.GetStringArgument();
      if (color == "black")
        return glm::dvec4(0.0, 0.0, 0.0, 1.0);
      else if (color == "red")
        return glm::dvec4(1.0, 0, 0, 1.0);
      else if (color == "green")
        return glm::dvec4(0, 1.0, 0, 1.0);
      else if (color == "blue")
        return glm::dvec4(0, 0, 1.0, 1.0);
      else if (color == "yellow")
        return glm::dvec4(1.0, 1.0, 0, 1.0);
      else if (color == "magenta")
        return glm::dvec4(1.0, 0, 1.0, 1.0);
      else if (color == "cyan")
        return glm::dvec4(0, 1.0, 1.0, 1.0);
      else if (color == "white")
        return glm::dvec4(1.0, 1.0, 1.0, 1.0);
      return {};
    }
    case schema::IFCCURVESTYLE:
    {
      _loader.MoveToArgumentOffset(expressID, 3);
      // argument 3 (CurveColour) is optional, so check if it is set
      auto tt = _loader.GetTokenType();
      if (tt == parsing::REF)
      {
        _loader.StepBack();
        auto foundColor = GetColor(_loader.GetRefArgument());
        if (foundColor)
          return foundColor;
      }
      return {};
    }
    case schema::IFCFILLAREASTYLEHATCHING:
    {
      // we cannot properly support this but for now use its colour as solid
      _loader.MoveToArgumentOffset(expressID, 0);
      auto foundColor = GetColor(_loader.GetRefArgument());
      if (foundColor)
        return foundColor;
      return {};
    }
    case schema::IFCSURFACESTYLE:
    {
      _loader.MoveToArgumentOffset(expressID, 2);
      auto ifcSurfaceStyleElementSelects = _loader.GetSetArgument();

      for (auto &styleElementSelect : ifcSurfaceStyleElementSelects)
      {
        uint32_t styleElementSelectID = _loader.GetRefArgument(styleElementSelect);
        auto foundColor = GetColor(styleElementSelectID);
        if (foundColor)
          return foundColor;
      }

      return {};
    }
    case schema::IFCSURFACESTYLERENDERING:
    {
      _loader.MoveToArgumentOffset(expressID, 0);
      auto outputColor = GetColor(_loader.GetRefArgument());
      _loader.MoveToArgumentOffset(expressID, 1);

      if (_loader.GetTokenType() == parsing::IfcTokenType::REAL)
      {
        _loader.StepBack();
        outputColor.value().a = 1 - _loader.GetDoubleArgument();
      }

      return outputColor;
    }
    case schema::IFCSURFACESTYLESHADING:
    {
      _loader.MoveToArgumentOffset(expressID, 0);
      return GetColor(_loader.GetRefArgument());
    }
    case schema::IFCSTYLEDREPRESENTATION:
    {
      _loader.MoveToArgumentOffset(expressID, 3);
      auto repItems = _loader.GetSetArgument();

      for (auto &repItem : repItems)
      {
        uint32_t repItemID = _loader.GetRefArgument(repItem);
        auto foundColor = GetColor(repItemID);
        if (foundColor)
          return foundColor;
      }

      return {};
    }
    case schema::IFCSTYLEDITEM:
    {
      _loader.MoveToArgumentOffset(expressID, 1);
      auto styledItems = _loader.GetSetArgument();

      for (auto &styledItem : styledItems)
      {
        uint32_t styledItemID = _loader.GetRefArgument(styledItem);
        auto foundColor = GetColor(styledItemID);
        if (foundColor)
          return foundColor;
      }

      return {};
    }
    case schema::IFCCOLOURRGB:
    {
      _loader.MoveToArgumentOffset(expressID, 1);
      glm::dvec4 outputColor;
      outputColor.r = _loader.GetDoubleArgument();
      outputColor.g = _loader.GetDoubleArgument();
      outputColor.b = _loader.GetDoubleArgument();
      outputColor.a = 1;

      return outputColor;
    }
    case schema::IFCMATERIALLAYERSETUSAGE:
    {
      _loader.MoveToArgumentOffset(expressID, 0);
      uint32_t layerSetID = _loader.GetRefArgument();
      return GetColor(layerSetID);
    }
    case schema::IFCMATERIALLAYERSET:
    {
      _loader.MoveToArgumentOffset(expressID, 0);
      auto layers = _loader.GetSetArgument();

      for (auto &layer : layers)
      {
        uint32_t layerID = _loader.GetRefArgument(layer);
        auto foundColor = GetColor(layerID);
        if (foundColor)
          return foundColor;
      }

      return {};
    }
    case schema::IFCMATERIALLAYER:
    {
      _loader.MoveToArgumentOffset(expressID, 0);
      uint32_t matRepID = _loader.GetRefArgument();
      return GetColor(matRepID);
    }
    case schema::IFCMATERIAL:
    {
      if (GetMaterialDefinitions().count(expressID) != 0)
      {
        auto &defs = GetMaterialDefinitions().at(expressID);
        for (auto def : defs)
        {
          auto success = GetColor(def.second);
          if (success)
            return success;
        }

        return {};
      }
      return {};
    }
    case schema::IFCFILLAREASTYLE:
    {
      _loader.MoveToArgumentOffset(expressID, 1);
      auto ifcFillStyleSelects = _loader.GetSetArgument();

      for (auto &styleSelect : ifcFillStyleSelects)
      {
        uint32_t styleSelectID = _loader.GetRefArgument(styleSelect);
        auto foundColor = GetColor(styleSelectID);
        if (foundColor)
          return foundColor;
      }

      return {};
    }
    case schema::IFCMATERIALLIST:
    {
      _loader.MoveToArgumentOffset(expressID, 0);
      auto materials = _loader.GetSetArgument();

      std::optional<glm::dvec4> lastColor;
      bool result = false;
      for (auto &material : materials)
      {
        uint32_t materialID = _loader.GetRefArgument(material);
        auto foundColor = GetColor(materialID);
        if (foundColor)
          lastColor = foundColor;
        result = true;
      }
      if (result)
      {
        return lastColor;
      }
      else
      {
        return {};
      }
    }
    case schema::IFCMATERIALCONSTITUENTSET:
    {
      _loader.MoveToArgumentOffset(expressID, 2);
      auto materialContituents = _loader.GetSetArgument();

      for (auto &materialContituent : materialContituents)
      {
        uint32_t materialContituentID = _loader.GetRefArgument(materialContituent);
        auto foundColor = GetColor(materialContituentID);
        if (foundColor)
          return foundColor;
      }
      return {};
    }
    case schema::IFCMATERIALCONSTITUENT:
    {
      _loader.MoveToArgumentOffset(expressID, 2);
      auto material = _loader.GetRefArgument();
      auto foundColor = GetColor(material);
      if (foundColor)
        return foundColor;
      return {};
    }
    case schema::IFCMATERIALPROFILESETUSAGE:
    {
      _loader.MoveToArgumentOffset(expressID, 0);
      auto profileSet = _loader.GetRefArgument();
      auto foundColor = GetColor(profileSet);
      if (foundColor)
        return foundColor;
      return {};
    }
    case schema::IFCMATERIALPROFILE:
    {
      _loader.MoveToArgumentOffset(expressID, 2);
      auto profileSet = _loader.GetRefArgument();
      auto foundColor = GetColor(profileSet);
      if (foundColor)
        return foundColor;
      return {};
    }
    case schema::IFCMATERIALPROFILESET:
    {
      _loader.MoveToArgumentOffset(expressID, 2);
      auto materialProfiles = _loader.GetSetArgument();

      for (auto &materialProfile : materialProfiles)
      {
        uint32_t materialProfileID = _loader.GetRefArgument(materialProfile);
        auto foundColor = GetColor(materialProfileID);
        if (foundColor)
          return foundColor;
      }
      return {};
    }
    default:
      spdlog::error("[GetColor()] unexpected style type {}", expressID, lineType);
      break;
    }

    return {};
  }

  IfcBound3D IfcGeometryLoader::GetBound(uint32_t expressID) const
  {
    spdlog::debug("[GetBound({})]", expressID);
    auto lineType = _loader.GetLineType(expressID);

    switch (lineType)
    {
    case schema::IFCFACEOUTERBOUND:
    {
      _loader.MoveToArgumentOffset(expressID, 0);
      uint32_t loop = _loader.GetRefArgument();
      _loader.MoveToArgumentOffset(expressID, 1);
      std::string_view orientValue = _loader.GetStringArgument();
      bool orient = orientValue == "T";

      IfcBound3D bound;
      bound.curve = GetLoop(loop);
      bound.orientation = orient;
      bound.type = IfcBoundType::OUTERBOUND;

      if (!orient)
      {
        std::reverse(bound.curve.points.begin(), bound.curve.points.end());
      }

      return bound;
    }
    case schema::IFCFACEBOUND:
    {
      _loader.MoveToArgumentOffset(expressID, 0);
      uint32_t loop = _loader.GetRefArgument();
      _loader.MoveToArgumentOffset(expressID, 1);
      std::string_view orientValue = _loader.GetStringArgument();
      bool orient = orientValue == "T";

      IfcBound3D bound;
      bound.curve = GetLoop(loop);
      bound.orientation = orient;
      bound.type = IfcBoundType::BOUND;

      if (!orient)
      {
        std::reverse(bound.curve.points.begin(), bound.curve.points.end());
      }

      return bound;
    }
    default:
      spdlog::error("[(GetBounds)] unexpected bound type {}", expressID, lineType);
      break;
    }

    return IfcBound3D();
  }

  IfcCurve IfcGeometryLoader::GetLoop(uint32_t expressID) const
  {
    spdlog::debug("[GetLoop({})]", expressID);
    auto lineType = _loader.GetLineType(expressID);

    switch (lineType)
    {
    case schema::IFCPOLYLOOP:
    {
      IfcCurve curve;

      _loader.MoveToArgumentOffset(expressID, 0);
      auto points = _loader.GetSetArgument();

      curve.points.reserve(points.size());

      uint32_t prevID = 0;
      for (auto &token : points)
      {
        uint32_t pointId = _loader.GetRefArgument(token);

        // trim out consecutive equal points
        if (pointId != prevID)
        {
          curve.points.push_back(GetCartesianPoint3D(pointId));
        }

        prevID = pointId;
      }

      return curve;
    }
    case schema::IFCEDGELOOP:
    {
      IfcCurve curve;

      _loader.MoveToArgumentOffset(expressID, 0);
      auto edges = _loader.GetSetArgument();
      int id = 0;

      for (auto &token : edges)
      {
        uint32_t edgeId = _loader.GetRefArgument(token);
        IfcCurve edgeCurve = GetOrientedEdge(edgeId);

        // Important not to repeat the last point otherwise triangulation fails
        // if the list has zero points this is initial, no repetition is possible, otherwise we must check
        if (curve.points.size() == 0)
        {
          for (auto &pt : edgeCurve.points)
          {
            curve.points.push_back(pt);
            curve.indices.push_back(id);
          }
        }
        else
        {
          for (auto &pt : edgeCurve.points)
          {
            if (notPresent(pt, curve.points))
            {
              curve.points.push_back(pt);
              curve.indices.push_back(id);
            }
          }
        }
        id++;
      }

      return curve;
    }
    default:
      spdlog::error("[GetLoop()] unexpected loop type {}", expressID, lineType);
      break;
    }

    IfcCurve curve;
    return curve;
  }

  IfcCurve IfcGeometryLoader::GetOrientedEdge(uint32_t expressID) const
  {
    spdlog::debug("[GetOrientedEdge({})]", expressID);
    _loader.MoveToArgumentOffset(expressID, 3);
    std::string_view orientValue = _loader.GetStringArgument();
    bool orient = orientValue == "T";
    _loader.MoveToArgumentOffset(expressID, 2);
    uint32_t edgeCurveRef = _loader.GetRefArgument();
    IfcCurve curveEdge = GetEdge(edgeCurveRef);

    // Read edgeCurve

    if (orient)
    {
      std::reverse(curveEdge.points.begin(), curveEdge.points.end());
    }

    return curveEdge;
  }

  glm::dvec3 IfcGeometryLoader::GetVertexPoint(uint32_t expressID) const
  {
    spdlog::debug("[GetVertexPoint({})]", expressID);
    _loader.MoveToArgumentOffset(expressID, 0);
    uint32_t pointRef = _loader.GetRefArgument();
    auto point = _loader.GetLineType(pointRef);
    if (point == schema::IFCCARTESIANPOINT)
    {
      return GetCartesianPoint3D(pointRef);
    }
    else
    {
      spdlog::error("[GetVertexPoint()] unexpected vertxpoint type {}", pointRef, point);
      return {};
    }
  }

  IfcCurve IfcGeometryLoader::GetEdge(uint32_t expressID) const
  {
    spdlog::debug("[GetEdge({})]", expressID);
    auto lineType = _loader.GetLineType(expressID);

    switch (lineType)
    {

    case schema::IFCEDGE:
    {
      _loader.MoveToArgumentOffset(expressID, 0);
      glm::dvec3 p1 = GetVertexPoint(_loader.GetRefArgument());
      _loader.MoveToArgumentOffset(expressID, 1);
      glm::dvec3 p2 = GetVertexPoint(_loader.GetRefArgument());

      IfcCurve curve;
      curve.points.push_back(p1);
      curve.points.push_back(p2);

      return curve;
    }
    case schema::IFCEDGECURVE:
    {
      ComputeCurveParams edgeParams;
      edgeParams.hasTrim = true;
      _loader.MoveToArgumentOffset(expressID, 0);
      glm::dvec3 p1 = GetVertexPoint(_loader.GetRefArgument());
      _loader.MoveToArgumentOffset(expressID, 1);
      glm::dvec3 p2 = GetVertexPoint(_loader.GetRefArgument());
      edgeParams.trimStart.pos3D = p1;
      edgeParams.trimStart.trimType = TRIM_BY_POSITION;
      edgeParams.trimEnd.pos3D = p2;
      edgeParams.trimEnd.trimType = TRIM_BY_POSITION;

      _loader.MoveToArgumentOffset(expressID, 2);
      uint32_t CurveRef = _loader.GetRefArgument();
      IfcCurve curve;
      
      edgeParams.dimensions = 3;
      edgeParams.edge = true;
      edgeParams.sameSense = -1;
      edgeParams.trimSense = TRIM_SENSE_SAME;
      
      ComputeCurve(CurveRef, curve, edgeParams);

      return curve;
    }
    default:
      spdlog::error("[GetEdge())] unexpected edgecurve type {}", expressID, lineType);
      break;
    }
    return IfcCurve();
  }

  IfcTrimmingSelect IfcGeometryLoader::GetTrimSelect(uint32_t DIM, std::vector<uint32_t> &tapeOffsets) const
  {
    IfcTrimmingSelect ts;

    for (size_t i = 0; i < tapeOffsets.size(); i++)
    {
      auto tokenType = _loader.GetTokenType(tapeOffsets[i]);

      _loader.StepBack();
      if (tokenType == parsing::IfcTokenType::REF)
      {
        // caresian point
        uint32_t cartesianPointRef = _loader.GetRefArgument();
        ts.trimType = TRIM_BY_POSITION;
        if (DIM == 2)
        {
          ts.pos = GetCartesianPoint2D(cartesianPointRef);
          ts.pos3D.x = ts.pos.x;
          ts.pos3D.y = ts.pos.y;
          ts.pos3D.z = 0;
        }
        if (DIM == 3)
        {
          ts.pos3D = GetCartesianPoint3D(cartesianPointRef);
          ts.pos.x = ts.pos3D.x;
          ts.pos.y = ts.pos3D.y;
        }
      }
      else if (tokenType == parsing::IfcTokenType::LABEL)
      {
        // parametervalue
        std::string_view type = _loader.GetStringArgument();

        if (type == "IFCPARAMETERVALUE")
        {
          ts.trimType = TRIM_BY_PARAMETER;
          i++;
          ts.value = _loader.GetDoubleArgument(tapeOffsets[i]);
        }
      }
    }

    return ts;
  }

  glm::dvec3 IfcGeometryLoader::GetCartesianPoint3D(const uint32_t expressID) const
  {
    spdlog::debug("[GetCartesianPoint3D({})]", expressID);
    if (auto it = _cartesianPoint3DCache.find(expressID); it != _cartesianPoint3DCache.end())
    {
      return it->second;
    }
    _loader.MoveToArgumentOffset(expressID, 0);
    _loader.GetTokenType();
    // because these calls cannot be reordered we have to use intermediate variables
    double x = _loader.GetDoubleArgument();
    double y = _loader.GetDoubleArgument();
    double z = _loader.GetOptionalDoubleParam(0);
    glm::dvec3 point(x, y, z);
    _cartesianPoint3DCache.emplace(expressID, point);
    return point;
  }

  glm::dvec2 IfcGeometryLoader::GetCartesianPoint2D(const uint32_t expressID) const
  {
    spdlog::debug("[GetCartesianPoint2D({})]", expressID);
    if (auto it = _cartesianPoint2DCache.find(expressID); it != _cartesianPoint2DCache.end())
    {
      return it->second;
    }
    _loader.MoveToArgumentOffset(expressID, 0);
    _loader.GetTokenType();
    // because these calls cannot be reordered we have to use intermediate variables
    double x = _loader.GetDoubleArgument();
    double y = _loader.GetDoubleArgument();
    glm::dvec2 point(x, y);
    _cartesianPoint2DCache.emplace(expressID, point);
    return point;
  }

  bool IfcGeometryLoader::ReadIfcCartesianPointList(uint32_t expressID) const
  {
    spdlog::debug("[ReadIfcCartesianPointList({})]", expressID);
    auto listType = _loader.GetLineType(expressID);
    _loader.MoveToArgumentOffset(expressID, 0);

    if (listType == schema::IFCCARTESIANPOINTLIST3D)
    {
      return false;
    }
    if (listType == schema::IFCCARTESIANPOINTLIST2D)
    {
      return true;
    }
    return false;
  }

  std::vector<glm::dvec3> IfcGeometryLoader::ReadIfcCartesianPointList3D(uint32_t expressID) const
  {
    spdlog::debug("[ReadIfcCartesianPointList3D({})]", expressID);
    _loader.MoveToArgumentOffset(expressID, 0);

    std::vector<glm::dvec3> result;

    _loader.GetTokenType();

    // while we have point set begin
    while (_loader.GetTokenType() == parsing::IfcTokenType::SET_BEGIN)
    {
      // because these calls cannot be reordered we have to use intermediate variables
      double x = _loader.GetDoubleArgument();
      double y = _loader.GetDoubleArgument();
      double z = _loader.GetDoubleArgument();

      /*
              Round all coordinates, after they are read, to a specified number of decimal places.
              For example, if the rounding is to be in the fourth decimal place, then set
                  ROUNDING = 1.0E-04
              and
                  ROUNDING_RECIPROCAL = 1.0E+04.

              To disable/enable rounding, set ROUNDING_ENABLE to 0/1.  This value is set in EPS.h.
      */
      if (ROUNDING_ENABLE == 1)
      {
        int q = 0;
        q = (int)(x * ROUNDING_RECIPROCAL + 0.5);
        x = q * ROUNDING;
        q = (int)(y * ROUNDING_RECIPROCAL + 0.5);
        y = q * ROUNDING;
        q = (int)(z * ROUNDING_RECIPROCAL + 0.5);
        z = q * ROUNDING;
      }

      result.emplace_back(x, y, z);

      // read point set end
      _loader.GetTokenType();
    }

    return result;
  }

  std::vector<glm::dvec2> IfcGeometryLoader::ReadIfcCartesianPointList2D(uint32_t expressID) const
  {
    spdlog::debug("[ReadIfcCartesianPointList2D({})]", expressID);
    _loader.MoveToArgumentOffset(expressID, 0);

    std::vector<glm::dvec2> result;

    _loader.GetTokenType();

    // while we have point set begin
    while (_loader.GetTokenType() == parsing::IfcTokenType::SET_BEGIN)
    {
      // because these calls cannot be reordered we have to use intermediate variables
      double x = _loader.GetDoubleArgument();
      double y = _loader.GetDoubleArgument();
      result.emplace_back(x, y);

      // read point set end
      _loader.GetTokenType();
    }

    return result;
  }


  // Helper function to compute the total length of the curve
  double IfcGeometryLoader::ComputeCurveLength(const IfcCurve& curve)const
  {
      double totalLength = 0.0;
      if (curve.points.size() < 2)
          return totalLength;

      for (size_t i = 1; i < curve.points.size(); ++i)
      {
          const auto& p1 = curve.points[i - 1];
          const auto& p2 = curve.points[i];
          totalLength += glm::distance(p1, p2);
      }
      return totalLength;
  }

  // Helper function to compute the length along the curve up to a specific point
  double IfcGeometryLoader::ComputeLengthToPoint(const IfcCurve& curve, const glm::dvec3& targetPoint)const
  {
      double length = 0.0;
      if (curve.points.size() < 2)
          return length;

      for (size_t i = 1; i < curve.points.size(); ++i)
      {
          const auto& p1 = curve.points[i - 1];
          const auto& p2 = curve.points[i];

          // Check if targetPoint matches p1 or p2 (within a small tolerance)
          if (glm::distance(targetPoint, p1) < 1e-6)
              return length;
          if (glm::distance(targetPoint, p2) < 1e-6)
              return length + glm::distance(p1, p2);

          length += glm::distance(p1, p2);
      }
      return length;
  }

  // Helper function to compute parameter for a point on the base curve
  double IfcGeometryLoader::GetParameterForPoint(const IfcCurve& curve, double totalLength, const glm::dvec3& point) const
  {
      if (curve.points.empty())
          return 0.0;
            
      double lengthToPoint = ComputeLengthToPoint(curve, point);
      return (totalLength > 0.0) ? (lengthToPoint / totalLength) : 0.0;
  }

  IfcCurve IfcGeometryLoader::GetCurve(uint32_t expressID, uint8_t dimensions, bool edge) const
  {
    spdlog::debug("[GetCurve({})]", expressID);
    IfcCurve curve;
    ComputeCurveParams params;
    params.dimensions = dimensions;
    params.edge = edge;
    ComputeCurve(expressID, curve, params);
    return curve;
  }

  void IfcGeometryLoader::ComputeCurve(uint32_t expressID, IfcCurve &curve, const ComputeCurveParams& params) const
  {
    spdlog::debug("[ComputeCurve({})]", expressID);
    auto lineType = _loader.GetLineType(expressID);
    switch (lineType)
    {
    case schema::IFCPOLYLINE:
    {
      _loader.MoveToArgumentOffset(expressID, 0);
      auto points = _loader.GetSetArgument();

      for (auto &token : points)
      {
        uint32_t pointId = _loader.GetRefArgument(token);
        if (params.dimensions == 2)
          curve.Add(GetCartesianPoint2D(pointId));
        else
          curve.Add(GetCartesianPoint3D(pointId));
      }

      if (params.edge)
      {
        if (params.sameSense == 1 || params.sameSense == -1)
        {
          std::reverse(curve.points.begin(), curve.points.end());
        }
      }

      break;
    }
    case schema::IFCCOMPOSITECURVE:
    {
        // IfcCompositeCurve
        //      std::vector<IfcSegment>			Segments;
        //      IfcLogical						SelfIntersect;

      _loader.MoveToArgumentOffset(expressID, 0);
      auto segments = _loader.GetSetArgument();
      auto selfIntersects = _loader.GetStringArgument();

      if (selfIntersects == "T")
      {
        // TODO: this is probably bad news
        spdlog::error("[ComputeCurve()] Self intersecting composite curve {}", expressID);
      }

      for (size_t ii = 0; ii < segments.size(); ++ii)
      {
          uint32_t segmentId = _loader.GetRefArgument(segments[ii]);
          ComputeCurve(segmentId, curve, params);
          
        #ifdef DEBUG_DUMP_SVG
          dump::DumpCurveToHtml(curve.points, "dumpCurve.html");
        #endif
      }

      break;
    }
    case schema::IFCCOMPOSITECURVESEGMENT:
    {
      _loader.MoveToArgumentOffset(expressID, 0);
      auto transition = _loader.GetStringArgument();
      auto sameSenseS = _loader.GetStringArgument();
      auto parentID = _loader.GetRefArgument();

	  ComputeCurveParams segmentParams( params );
      segmentParams.sameSense = sameSenseS == "T";
      ComputeCurve(parentID, curve, segmentParams);

      break;
    }

      // TODO: review and simplify
    case schema::IFCLINE:
    {
      bool condition = params.sameSense == 1 || params.sameSense == -1;
      if (params.edge)
      {
        condition = !condition;
      }
      if (params.dimensions == 2 && params.hasTrim)
      {
        if (params.trimStart.trimType == TRIM_BY_POSITION && params.trimEnd.trimType == TRIM_BY_POSITION)
        {

          if (condition)
          {
            curve.Add(params.trimStart.pos);
            curve.Add(params.trimEnd.pos);
          }
          else
          {
            curve.Add(params.trimEnd.pos);
            curve.Add(params.trimStart.pos);
          }
        }
        else if (params.trimStart.trimType == TRIM_BY_PARAMETER && params.trimEnd.trimType == TRIM_BY_PARAMETER)
        {
          _loader.MoveToArgumentOffset(expressID, 0);
          auto positionID = _loader.GetRefArgument();
          auto vectorID = _loader.GetRefArgument();
          glm::dvec3 placement = glm::dvec3(GetCartesianPoint2D(positionID), 0);
          glm::dvec3 vector;
          vector = GetVector(vectorID);

          if (params.ignorePlacement)
          {
              vector = glm::dvec3(1, 0, 0);
              placement = glm::dvec3(0, 0, 0);
          }

          if (condition)
          {
            glm::dvec3 p1 = placement + vector * params.trimStart.value;
            glm::dvec3 p2 = placement + vector * params.trimEnd.value;
            curve.Add(p1);
            curve.Add(p2);
          }
          else
          {
            glm::dvec3 p2 = placement + vector * params.trimStart.value;
            glm::dvec3 p1 = placement + vector * params.trimEnd.value;
            curve.Add(p1);
            curve.Add(p2);
          }
        }
        else
        {
          spdlog::error("[ComputeCurve()] Unsupported trimmingselect 2D IFCLINE {}", expressID, lineType);
        }
      }
      else if (params.dimensions == 3 && params.hasTrim)
      {
        if (params.trimStart.trimType == TRIM_BY_POSITION && params.trimEnd.trimType == TRIM_BY_POSITION)
        {
          if (condition)
          {
            curve.Add(params.trimStart.pos3D);
            curve.Add(params.trimEnd.pos3D);
          }
          else
          {
            curve.Add(params.trimEnd.pos3D);
            curve.Add(params.trimStart.pos3D);
          }
        }
        else if ((params.trimStart.trimType == TRIM_BY_PARAMETER && params.trimEnd.trimType == TRIM_BY_PARAMETER)
            || (params.trimStart.trimType == TRIM_BY_LENGTH && params.trimEnd.trimType == TRIM_BY_LENGTH))
        {
          _loader.MoveToArgumentOffset(expressID, 0);
          auto positionID = _loader.GetRefArgument();
          auto vectorID = _loader.GetRefArgument();
          glm::dvec3 placement = GetCartesianPoint3D(positionID);
          glm::dvec3 vector;
          vector = GetVector(vectorID);

          if (params.ignorePlacement)
          {
              vector = glm::dvec3(1, 0, 0);
              placement = glm::dvec3(0, 0, 0);
          }
          if (condition)
          {
            glm::dvec3 p1 = placement + vector * params.trimStart.value;
            curve.Add(p1);

            if (params.trimStart.value != params.trimEnd.value)
            {
                glm::dvec3 p2 = placement + vector * params.trimEnd.value;
                curve.Add(p2);
            }
          }
          else
          {
              glm::dvec3 p1 = placement + vector * params.trimEnd.value;
              curve.Add(p1);

              if (params.trimStart.value != params.trimEnd.value)
              {
                  glm::dvec3 p2 = placement + vector * params.trimStart.value;
                  curve.Add(p2);
              }
          }
          curve.endTangent = glm::normalize(vector);
          curve.segmentStartTangents.push_back( glm::normalize(vector) );
        }
        else
        {
          spdlog::error("[ComputeCurve()] Unsupported trimmingselect 3D IFCLINE {}", expressID, lineType);
        }
      }
      break;
    }
    case schema::IFCTRIMMEDCURVE:
    {
      _loader.MoveToArgumentOffset(expressID, 0);
      auto basisCurveID = _loader.GetRefArgument();
      auto trim1Set = _loader.GetSetArgument();
      auto trim2Set = _loader.GetSetArgument();

      auto senseAgreementS = _loader.GetStringArgument();
      auto trimmingPreference = _loader.GetStringArgument();

      auto trim1 = GetTrimSelect(params.dimensions, trim1Set);
      auto trim2 = GetTrimSelect(params.dimensions, trim2Set);

      ComputeCurveParams basisCurveParams(params);
      basisCurveParams.hasTrim = true;
      basisCurveParams.trimStart = trim1;
      basisCurveParams.trimEnd = trim2;

      TrimSense senseAgreement = senseAgreementS == "T" ? TRIM_SENSE_SAME : TRIM_SENSE_REVERSE;
      if (params.trimSense == TRIM_SENSE_REVERSE)
      {
          if (senseAgreement == TRIM_SENSE_SAME)
          {
              senseAgreement = TRIM_SENSE_REVERSE;
          }
          else if (senseAgreement == TRIM_SENSE_REVERSE)
          {
              senseAgreement = TRIM_SENSE_SAME;
          }
      }

      basisCurveParams.trimSense = senseAgreement;
      ComputeCurve(basisCurveID, curve, basisCurveParams);

      break;
    }
    case schema::IFCINDEXEDPOLYCURVE:
    {
      _loader.MoveToArgumentOffset(expressID, 0);
      auto ptsRef = _loader.GetRefArgument();

      _loader.MoveToArgumentOffset(expressID, 2);

      if (_loader.GetTokenType() != parsing::IfcTokenType::EMPTY)
      {
        _loader.StepBack();
        auto selfIntersects = _loader.GetStringArgument();

        if (selfIntersects == "T")
        {
          // TODO: this is probably bad news
          spdlog::error("[ComputeCurve()] Self intersecting ifcindexedpolycurve {}", expressID);
        }
      }

      if (ReadIfcCartesianPointList(ptsRef))
      {
        _loader.MoveToArgumentOffset(expressID, 1);
        if (_loader.GetTokenType() != parsing::IfcTokenType::EMPTY)
        {
          auto pnSegment = ReadCurveIndices();
          for (auto &sg : pnSegment)
          {
            if (sg.type == "IFCLINEINDEX")
            {

              auto pts = ReadIfcCartesianPointList2D(ptsRef);
              for (auto &pt : sg.indexs)
              {
                curve.Add(pts[pt - 1]);
              }
            }
            if (sg.type == "IFCARCINDEX")
            {
              auto pts = ReadIfcCartesianPointList2D(ptsRef);
              IfcCurve arc = BuildArc3Pt(pts[sg.indexs[0] - 1], pts[sg.indexs[1] - 1], pts[sg.indexs[2] - 1], _circleSegments);
              for (auto &pt : arc.points)
              {
                curve.Add(pt);
              }
              curve.arcSegments.push_back(curve.points.size() - 1 - arc.points.size());
              curve.arcSegments.push_back(curve.points.size() - 1);
            }
          }
        }
        else
        {
          auto pts = ReadIfcCartesianPointList2D(ptsRef);
          for (auto &pt : pts)
          {
            curve.Add(pt);
          }
        }
      }
      else if (!ReadIfcCartesianPointList(ptsRef))
      {
        _loader.MoveToArgumentOffset(expressID, 1);
        if (_loader.GetTokenType() != parsing::IfcTokenType::EMPTY)
        {
          auto pnSegment = ReadCurveIndices();
          for (auto &sg : pnSegment)
          {
            if (sg.type == "IFCLINEINDEX")
            {
              auto pts = ReadIfcCartesianPointList3D(ptsRef);
              for (auto &pt : sg.indexs)
              {
                // Fragments -> Issue #89 -> requires not to skip overlapped points, this is why "removeCoincident" is set to false
                curve.Add(pts[pt - 1], false);
              }
            }
            if (sg.type == "IFCARCINDEX")
            {
              auto pts = ReadIfcCartesianPointList3D(ptsRef);
              IfcCurve arc = Build3DArc3Pt(pts[sg.indexs[0] - 1], pts[sg.indexs[1] - 1], pts[sg.indexs[2] - 1], _circleSegments, EPS_MINISCULE);
              for (auto &pt : arc.points)
              {
                // Fragments -> Issue #89 -> requires not to skip overlapped points, this is why "removeCoincident" is set to false
                curve.Add(pt, false);
              }
              curve.arcSegments.push_back(curve.points.size() - 1 - arc.points.size());
              curve.arcSegments.push_back(curve.points.size() - 1);
            }
          }
        }
        else
        {
          auto pts = ReadIfcCartesianPointList3D(ptsRef);
          for (auto &pt : pts)
          {
            curve.Add(pt);
          }
        }
      }
      else
      {
        spdlog::error("[ComputeCurve()] Parsing ifcindexedpolycurve in 3D is not possible {}", expressID);
      }

      break;
    }

    case schema::IFCCIRCLE:
    case schema::IFCELLIPSE:
    {
        // Read position and determine dimensions
        _loader.MoveToArgumentOffset(expressID, 0);
        uint32_t positionID = _loader.GetRefArgument();
        auto typePlacement = _loader.GetLineType(positionID);
        int dimensions = 2; // Default to 2D
        if (typePlacement == schema::IFCAXIS2PLACEMENT3D)
        {
            dimensions = 3;
        }
        else if (typePlacement == schema::IFCAXIS2PLACEMENT2D)
        {
            dimensions = 2;
        }

        // Read radius
        _loader.MoveToArgumentOffset(expressID, 1);
        double radius1 = _loader.GetDoubleArgument();
        double radius2 = radius1; // Circle has equal radii
        if (schema::IFCELLIPSE == lineType)
        {
            _loader.MoveToArgumentOffset(expressID, 2);
            auto tokenType = _loader.GetTokenType();
            if (tokenType == parsing::IfcTokenType::REAL)
            {
              _loader.StepBack();
              radius2 = _loader.GetDoubleArgument();
            }
        }

        // Initialize trimming parameters
        double startRad = 0.0;
        double endRad = 2.0 * CONST_PI;
        bool byPos = false;
        TrimSense trimSense = params.trimSense;
        if (params.hasTrim)
        {
            if (params.trimStart.trimType == TRIM_BY_PARAMETER && params.trimEnd.trimType == TRIM_BY_PARAMETER)
            {
                startRad = params.trimStart.value * _angularScalingFactor;
                endRad = params.trimEnd.value * _angularScalingFactor;
            }
            else if (params.trimStart.trimType == TRIM_BY_LENGTH && params.trimEnd.trimType == TRIM_BY_LENGTH)
            {
                double startLength = params.trimStart.value;
                double endLength = params.trimEnd.value;
                if (radius1 > 0)
                {
                    startRad = startLength / radius1;
                    endRad = endLength / radius1;
                }
                else
                {
                    spdlog::error("IFCCIRCLE (ID: {}) has zero radius1, cannot compute angles from length.", expressID);
                    return;
                }
            }
            else if (params.trimStart.trimType == TRIM_BY_POSITION && params.trimEnd.trimType == TRIM_BY_POSITION)
            {
                byPos = true;
                if (dimensions == 2)
                {
                    glm::dmat3 placement = glm::dmat3(1);
                    if (!params.ignorePlacement)
                    {
                        placement = GetAxis2Placement2D(positionID);
                    }
                    double xx = params.trimStart.pos.x - placement[2].x;  // not sure if rotation can be ignored here...
                    double yy = params.trimStart.pos.y - placement[2].y;
                    startRad = VectorToAngle2D(xx, yy) * CONST_PI / 180.0;  // VectorToAngle2D returns degrees
                    xx = params.trimEnd.pos.x - placement[2].x;
                    yy = params.trimEnd.pos.y - placement[2].y;
                    endRad = VectorToAngle2D(xx, yy) * CONST_PI / 180.0;  // VectorToAngle2D returns degrees
                }
                else if (dimensions == 3)
                {
                    glm::dmat4 placement = glm::dmat4(1);
                    if (!params.ignorePlacement)
                    {
                        placement = GetLocalPlacement(positionID);
                    }
                    glm::dvec4 vecX = placement[0];
                    glm::dvec4 vecY = placement[1];
                    glm::dvec3 v1 = glm::dvec3(params.trimStart.pos3D.x - placement[3].x, params.trimStart.pos3D.y - placement[3].y, params.trimStart.pos3D.z - placement[3].z);
                    glm::dvec3 v2 = glm::dvec3(params.trimEnd.pos3D.x - placement[3].x, params.trimEnd.pos3D.y - placement[3].y, params.trimEnd.pos3D.z - placement[3].z);
                    double dxS = vecX.x * v1.x + vecX.y * v1.y + vecX.z * v1.z;
                    double dyS = vecY.x * v1.x + vecY.y * v1.y + vecY.z * v1.z;
                    double dxE = vecX.x * v2.x + vecX.y * v2.y + vecX.z * v2.z;
                    double dyE = vecY.x * v2.x + vecY.y * v2.y + vecY.z * v2.z;
                    startRad = VectorToAngle2D(dxS, dyS) * CONST_PI / 180.0;  // VectorToAngle2D returns degrees
                    endRad = VectorToAngle2D(dxE, dyE) * CONST_PI / 180.0;  // VectorToAngle2D returns degrees
                }
            }
        }

        while (startRad < -2.0 * CONST_PI) {
            startRad += 2.0 * CONST_PI;
        }
        while (endRad < -2.0 * CONST_PI) {
            endRad += 2.0 * CONST_PI;
        }
        while (startRad > 2.0 * CONST_PI) {
            startRad -= 2.0 * CONST_PI;
        }
        while (endRad > 2.0 * CONST_PI) {
            endRad -= 2.0 * CONST_PI;
        }

        // Handle trim sense
        double openingAngleRad = endRad - startRad;
        if (params.trimStart.trimType != TRIM_BY_LENGTH)
        {
            // flipping to the other part of the circle does only apply to parameter and cartesian trimming
            if (trimSense == TRIM_SENSE_SAME)
            {
                if (startRad >= endRad)
                {
                    endRad += 2 * CONST_PI;
                }
                openingAngleRad = endRad - startRad;
            }
            if (trimSense == TRIM_SENSE_REVERSE)
            {
                if (startRad <= endRad)
                {
                    startRad += 2 * CONST_PI;
                }
                openingAngleRad = endRad - startRad;
            }
        }
        else {
            // with TRIM_BY_LENGTH (coming from IfcCurveSegment, which uses IfcCurveMeasureSelect= SELECT(IfcLengthMeasure, IfcParameterValue))
            if (trimSense == TRIM_SENSE_REVERSE)
            {
                std::swap(startRad, endRad);
                openingAngleRad = endRad - startRad;
            }
        }

        // Generate points
        size_t startIndex = curve.points.size();
        glm::dmat4 position3D(1);
        glm::dmat3 position2D(1);
        if (!params.ignorePlacement)
        {
            if (dimensions == 3)
            {
                position3D = GetLocalPlacement(positionID);
            }
            else
            {
                position2D = GetAxis2Placement2D(positionID);
            }
        }
        curve.arcSegments.push_back(curve.points.size());
        const int numPointsCurrentArc = _circleSegments;
        double deltaAngle = openingAngleRad / (numPointsCurrentArc - 1);
        double angle = startRad;
        std::vector<glm::dvec3> points;
        for (int i = 0; i < numPointsCurrentArc; i++)
        {
            if (dimensions == 2)
            {
                glm::dvec2 vec(0);
                vec[0] = radius1 * std::cos(angle);
                vec[1] = radius2 * std::sin(angle);
                glm::dmat3 dmat = position2D;
                if (byPos)
                {
                    dmat[0] = glm::dvec3(1.0, 0.0, 0.0);
                    dmat[1] = glm::dvec3(0.0, 1.0, 0.0);
                }
                glm::dvec3 pos = dmat * glm::dvec3(vec, 1);
                points.push_back(glm::dvec3(pos.x, pos.y, 0));
            }
            else
            {
                glm::dvec3 vec(0);
                vec[0] = radius1 * std::cos(angle);
                vec[1] = radius2 * std::sin(angle);
                glm::dvec4 pos = position3D * glm::dvec4(vec, 1);
                points.push_back(pos);
            }
            angle += deltaAngle;
        }

        // Compute exact endpoint at endRad
        glm::dvec3 exactEndPos;
        if (dimensions == 2)
        {
            glm::dvec2 vec(radius1 * std::cos(endRad), radius2 * std::sin(endRad));
            glm::dmat3 dmat = position2D;
            if (byPos)
            {
                dmat[0] = glm::dvec3(1.0, 0.0, 0.0);
                dmat[1] = glm::dvec3(0.0, 1.0, 0.0);
            }
            glm::dvec3 pos = dmat * glm::dvec3(vec, 1);
            exactEndPos = glm::dvec3(pos.x, pos.y, 0);
        }
        else
        {
            glm::dvec3 vec(radius1 * std::cos(endRad), radius2 * std::sin(endRad), 0);
            glm::dvec4 pos = position3D * glm::dvec4(vec, 1);
            exactEndPos = glm::dvec3(pos);
        }
        points.back() = exactEndPos; // Overwrite last point with exact endpoint

        // Compute exact tangent at startRad
        glm::dvec3 startTangent;
        double dx = -radius1 * std::sin(startRad);
        double dy = radius2 * std::cos(startRad);
        if (dimensions == 2)
        {
            glm::dvec3 local(dx, dy, 0.0);
            glm::dmat3 dmat = position2D;
            if (byPos)
            {
                dmat[0] = glm::dvec3(1.0, 0.0, 0.0);
                dmat[1] = glm::dvec3(0.0, 1.0, 0.0);
            }
            glm::dvec3 world = dmat * glm::dvec3(local);
            startTangent = glm::normalize(glm::dvec3(world.x, world.y, 0.0));
        }
        else
        {
            glm::dvec4 local(dx, dy, 0.0, 0.0);
            glm::dvec4 world = position3D * local;
            startTangent = glm::normalize(glm::dvec3(world));
        }

        // Compute exact tangent at endRad
        dx = -radius1 * std::sin(endRad);
        dy = radius2 * std::cos(endRad);
        if (dimensions == 2)
        {
            glm::dvec3 local(dx, dy, 0.0);
            glm::dmat3 dmat = position2D;
            if (byPos)
            {
                dmat[0] = glm::dvec3(1.0, 0.0, 0.0);
                dmat[1] = glm::dvec3(0.0, 1.0, 0.0);
            }
            glm::dvec3 world = dmat * glm::dvec3(local);
            curve.endTangent = glm::normalize(glm::dvec3(world.x, world.y, 0.0));
        }
        else
        {
            glm::dvec4 local(dx, dy, 0.0, 0.0);
            glm::dvec4 world = position3D * local;
            curve.endTangent = glm::normalize(glm::dvec3(world));
        }
        double tangentSign = (deltaAngle >= 0) ? 1.0 : -1.0;
        if (params.sameSense == TRIM_SENSE_REVERSE)
        {
            tangentSign *= -1.0;
        }
        curve.endTangent = tangentSign * curve.endTangent;
        startTangent = tangentSign * startTangent;
        
        curve.segmentStartTangents.push_back(startTangent);

        if (params.sameSense == TRIM_SENSE_REVERSE)
        {
            // reverse current segment
            std::reverse(points.begin(), points.end());
        }
        for (auto& pt : points)
        {
            curve.Add(pt);
        }

        curve.arcSegments.push_back(curve.points.size() - 1);
        if (!params.hasTrim)
        {
            curve.Add(curve.points[startIndex]);
        }
        break;
    }

    
    case schema::IFCGRADIENTCURVE:
    {
        // IfcGradientCurve -----------------------------------------------------------
        //   std::vector<IfcSegment>				Segments;                   height defined by gradient segments
        //   IfcLogical								SelfIntersect;
        //   IfcBoundedCurve     					BaseCurve;                  2D projection
        //   IfcPlacement							EndPoint;					optional

        _loader.MoveToArgumentOffset(expressID, 0);
        auto segmentTokens = _loader.GetSetArgument();   // Gradient segments
        auto u = _loader.GetStringArgument();            // SelfIntersect attribute
        uint32_t BaseCurveID = _loader.GetRefArgument(); // BaseCurve reference
        
        // Get the 2D base curve (projection)
        curve = GetCurve(BaseCurveID, 2, false); // BaseCurve is 2D
               

        IfcCurve gradientCurve;  // Segments have to be in one curve, otherwise transition like CONTSAMEGRADIENT does not work
        for (size_t ii = 0; ii < segmentTokens.size(); ++ii)
        {
            uint32_t segmentId = _loader.GetRefArgument(segmentTokens[ii]);
            ComputeCurve(segmentId, gradientCurve, params);// dimensions, edge, sameSense, trimSense);
        }
#ifdef DEBUG_DUMP_SVG
        dump::DumpCurveToHtml(gradientCurve.points, "GradientCurve.html");
#endif

        // Apply gradient segment data to adjust the base curve's z-coordinates
        if (!gradientCurve.points.empty() && !curve.points.empty())
        {
            std::vector<glm::dvec3> adjustedPoints;
            std::map<double, IfcCurve*> mapGradientSegmentStartPoints;
            double cumulativeLengthOfSegments = 0;
            double curveLength = 0;
            if (gradientCurve.points.size() > 1)
            {
                glm::dvec3 previousPoint = gradientCurve.points[0];
                for (size_t jj = 1; jj < gradientCurve.points.size(); ++jj)
                {
                    const glm::dvec3& point = gradientCurve.points[jj];
                    double length = glm::length(point - previousPoint);
                    curveLength += length;
                    previousPoint = point;
                }
            }
            mapGradientSegmentStartPoints[cumulativeLengthOfSegments] = &gradientCurve;
            cumulativeLengthOfSegments += curveLength;

            if (curve.points.size() > 0)
            {
                double cumulativeBaseCurveLength = 0;
                glm::dvec3 previousBasePoint = curve.points[0];
                adjustedPoints.reserve(curve.points.size());

                for (size_t ii = 0; ii < curve.points.size(); ++ii)
                {
                    const auto& basePoint = curve.points[ii];
                    if (ii > 0)
                    {
                        cumulativeBaseCurveLength += glm::length(basePoint - previousBasePoint);
                        previousBasePoint = basePoint;
                    }

                    // Find the gradient segment active at this length
                    auto it = mapGradientSegmentStartPoints.upper_bound(cumulativeBaseCurveLength);
                    if (it == mapGradientSegmentStartPoints.begin())
                    {
                        // Before the first segment: use starting height of first segment
                        adjustedPoints.push_back(glm::dvec3(basePoint.x, basePoint.y, it->second->points.front().y));
                        continue;
                    }
                    --it; // Use the last valid segment

                    IfcCurve* segCurve = it->second;

                    // Compute relative distance within this gradient segment
                    double segmentStartLength = it->first;
                    double localLength = cumulativeBaseCurveLength - segmentStartLength;

                    // Find which two points in segCurve this length lies between
                    double segCumulative = 0;
                    glm::dvec3 prevSegPoint = segCurve->points[0];
                    double zValue = prevSegPoint.y; // default if degenerate

                    bool interpolated = false;
                    for (size_t jj = 1; jj < segCurve->points.size(); ++jj)
                    {
                        const auto& segPoint = segCurve->points[jj];
                        double d = glm::length(segPoint - prevSegPoint);

                        if (localLength <= segCumulative + d)
                        {
                            // Interpolate
                            double t = (localLength - segCumulative) / d;
                            double yInterp = prevSegPoint.y + t * (segPoint.y - prevSegPoint.y);
                            zValue = yInterp;
                            interpolated = true;
                            break;
                        }

                        segCumulative += d;
                        prevSegPoint = segPoint;
                    }

                    // If localLength exceeds segment length, use the end height
                    if (!interpolated)
                    {
                        zValue = prevSegPoint.y;
                    }

                    adjustedPoints.push_back(glm::dvec3(basePoint.x, basePoint.y, zValue));
                }
                curve.points = adjustedPoints; // Update curve with 3D points
                
            }
        }
        else
        {
            spdlog::error("IFCGRADIENTCURVE (ID: {}) has no gradient segments or empty base curve.", expressID);
        }

        // #ifdef DEBUG_DUMP_SVG
        //     webifc::io::DumpGradientCurve(gradientSegments, curve, "V_gradient.obj", "H_gradient.obj");
        // #endif
        break;
    }
    case schema::IFCCURVESEGMENT:
    {
        // IfcCurveSegment -----------------------------------------------------------
        //    IfcTransitionCode						Transition;
        //    IfcPlacement							Placement;
        //    IfcCurveMeasureSelect					SegmentStart;
        //    IfcCurveMeasureSelect					SegmentLength;
        //    IfcCurve								ParentCurve;

      _loader.MoveToArgumentOffset(expressID, 0);
      std::string_view Transition = _loader.GetStringArgument();

      _loader.MoveToArgumentOffset(expressID, 1);
      uint32_t placementID = _loader.GetRefArgument();
      
      // SegmentStart:    TYPE IfcCurveMeasureSelect = SELECT(IfcLengthMeasure, IfcParameterValue);
      _loader.MoveToArgumentOffset(expressID, 2);

      IfcTrimmingSelect startTrim;
      ReadCurveMeasureSelect(startTrim);

      // SegmentLength
      _loader.MoveToArgumentOffset(expressID, 4);
      IfcTrimmingSelect lengthTrim;
      ReadCurveMeasureSelect(lengthTrim);

      IfcTrimmingSelect endTrim;
      endTrim.trimType = TRIM_BY_POSITION;
      endTrim.value = startTrim.value + lengthTrim.value;  // convert start/length into start/end
      TrimSense trimSense = TRIM_SENSE_SAME;
      if(lengthTrim.trimType == TRIM_BY_LENGTH )
      {
		  endTrim.trimType = TRIM_BY_LENGTH;
      }
      else if(lengthTrim.trimType == TRIM_BY_PARAMETER )
      {
          endTrim.trimType = TRIM_BY_PARAMETER;
      }

      _loader.MoveToArgumentOffset(expressID, 6);
      uint32_t ParentCurveID = _loader.GetRefArgument();
      
      ComputeCurveParams segmentParams;
      segmentParams.trimStart = startTrim;
      segmentParams.trimEnd = endTrim;
      segmentParams.hasTrim = true;
      size_t curvePointsOffset = curve.points.size();
      glm::dvec3 previousEndTangent = curve.endTangent;
      
      segmentParams.ignorePlacement = true;
      segmentParams.dimensions = 3;
      segmentParams.edge = false;
      segmentParams.sameSense = -1;
      segmentParams.trimSense = trimSense;

      if (expressID == 192475)
      {
          int wait = 0;
}

      ComputeCurve(ParentCurveID, curve, segmentParams);
      
      bool applyOwnPlacement = true;
      if (params.ignorePlacement) {
          applyOwnPlacement = false;
      }

      std::vector<glm::dvec3> currentSegmentPoints(curve.points.begin() + curvePointsOffset, curve.points.end());
      if (curvePointsOffset > 0)
      {
          // previous segment's end point for continuity check
          glm::dvec3 previousSegmentEndPoint = curve.points[curvePointsOffset - 1];
                    
          bool connectTranslate = false;
          if ((Transition.compare("CONTSAMEGRADIENTSAMECURVATURE") == 0 || Transition.compare("CONTSAMEGRADIENT") == 0))
          {
              // apply Transition Logic (Enforcing G1/G2 Continuity)
              applyOwnPlacement = false;
              connectTranslate = true;
              if (currentSegmentPoints.size() > 1)
              {
                  // Compute the tangent of the current segment
                  glm::dvec3 currentSegmentStart = currentSegmentPoints[0];
                  glm::dvec3 currentStartTangent = glm::normalize(currentSegmentPoints[1] - currentSegmentPoints[0]);  // this is not precise enough
                  if (curve.segmentStartTangents.size() > 0)
                  {
                      currentStartTangent = curve.segmentStartTangents.back();  // exact start tangent
                  }

                  // Calculate Rotation Angle (in 2D, assuming Z=0/Z-axis is rotation axis)
                  double angle_prev = std::atan2(previousEndTangent.y, previousEndTangent.x);
                  double angle_curr = std::atan2(currentStartTangent.y, currentStartTangent.x);
                  double rotation_angle = angle_prev - angle_curr;

                  // Ensure rotation matrix is 3x3 for 2D curve points (with Z=1.0)
                  glm::dmat3 rotation_matrix = glm::dmat3(1.0);
                  rotation_matrix[0].x = std::cos(rotation_angle);
                  rotation_matrix[0].y = std::sin(rotation_angle);
                  rotation_matrix[1].x = -std::sin(rotation_angle);
                  rotation_matrix[1].y = std::cos(rotation_angle);

                  // Apply Rotation and Translation to all points
                  for (size_t i = 0; i < currentSegmentPoints.size(); ++i)
                  {
                      glm::dvec3& point = currentSegmentPoints[i];

                      // TRANSLATE points to the origin for rotation (Rotation must be around currentSegmentStart)
                      glm::dvec3 relativePoint = point - currentSegmentStart;

                      // ROTATE the points with dmat3 multiplication, assuming relativePoint is (x, y, 0). 
                      // We need to convert relativePoint to a homogeneous vector (x, y, 1) for dmat3.
                      glm::dvec3 rotatedPoint = rotation_matrix * glm::dvec3(relativePoint.x, relativePoint.y, 1.0);

                      // TRANSLATE back from origin (move the rotated point back to P_curr_start)
                      glm::dvec3 rotatedPointGlobal = glm::dvec3(rotatedPoint.x, rotatedPoint.y, 0.0) + currentSegmentStart;

                      // TRANSLATE to final position (snap start point to P_prev)
                      point = rotatedPointGlobal + (previousSegmentEndPoint - currentSegmentStart);
                  }

                  // Update the end tangent of the composite curve
                  // The new end tangent is simply the original end tangent rotated by rotation_angle
                  double angle_end = std::atan2(curve.endTangent.y, curve.endTangent.x);
                  double angle_end_aligned = angle_end + rotation_angle;
                  curve.endTangent.x = std::cos(angle_end_aligned);
                  curve.endTangent.y = std::sin(angle_end_aligned);
                  curve.endTangent.z = 0.0;
              }
          }

		  if ((Transition.compare("CONTINUOUS") == 0 || connectTranslate) )  // will be done below anyway
          {
              applyOwnPlacement = false;
              // Connect previous segment's end point to current segments start point
              glm::dvec3 currentSegmentStartPoint = currentSegmentPoints[0];

              // Compute the necessary translation to align the current segment's start point with the previous segment's end point.
              glm::dvec3 translation = previousSegmentEndPoint - currentSegmentStartPoint;

              // Apply translation to all points of the current segment
              for (size_t i = 0; i < currentSegmentPoints.size(); ++i)
              {
                  currentSegmentPoints[i] += translation;
              }
          }
      }

      if (applyOwnPlacement)
      {
          // apply placementID
          glm::dmat3 placement = GetAxis2Placement2D(placementID);
          for (size_t i = 0; i < currentSegmentPoints.size(); ++i)
          {
              glm::dvec3& point = currentSegmentPoints[i];
              double zCoord = point.z;
              // ensure homogeneous coordinate
              glm::dvec3 pointHomogenious(point.x, point.y, 1.0);
              pointHomogenious = placement * pointHomogenious;
              point.x = pointHomogenious.x;
              point.y = pointHomogenious.y;
              point.z = zCoord;  // restore z coordinate, in case it is a 3D curve
          }

          // Update the end tangent of the composite curve
          glm::dvec3& tangent = curve.endTangent;
          glm::dvec2 tangent2D(tangent.x, tangent.y);

          // extract 2x2 rotation part of placement
          glm::dmat2 rotation(
              placement[0][0], placement[0][1],
              placement[1][0], placement[1][1]);

          // apply only rotation
          tangent2D = rotation * tangent2D;

          // assign back, dropping translation
          tangent = glm::dvec3(tangent2D, 0);

      }
      
      // Re-write the globally aligned points back into the main curve storage
      for (size_t i = 0; i < currentSegmentPoints.size(); ++i)
      {
          curve.points[curvePointsOffset + i] = currentSegmentPoints[i];
      }

      break;
    }
    case schema::IFCBSPLINECURVE:
    {
      bool condition = params.sameSense == 0;
      if (params.edge)
      {
        condition = !condition;
      }
      std::vector<uint32_t> knotMultiplicities;
      std::vector<glm::f64> distinctKnots;
      std::vector<glm::f64> knots;
      std::vector<glm::f64> indexes;
      std::vector<glm::f64> weights;

      _loader.MoveToArgumentOffset(expressID, 0);
      int degree = _loader.GetIntArgument();
      auto points = _loader.GetSetArgument();
      auto curveType = _loader.GetStringArgument();
      auto closed = _loader.GetStringArgument();
      auto selfIntersect = _loader.GetStringArgument();

      // build default knots
      for (size_t k = 0; k < points.size() + degree + 1; k++)
      {
        knots.push_back(k);
      }

      if (knots.size() != points.size() + degree + 1)
      {
        std::cout << "Error: Knots and control points do not match" << std::endl;
      }

      // build default weights vector
      for (size_t i = 0; i < points.size(); i++)
      {
        weights.push_back(1);
      }

      if (params.dimensions == 2)
      {
        std::vector<glm::dvec2> ctrolPts;
        for (auto &token : points)
        {
          uint32_t pointId = _loader.GetRefArgument(token);
          ctrolPts.push_back(GetCartesianPoint2D(pointId));
        }

        std::vector<glm::dvec2> tempPoints = GetRationalBSplineCurveWithKnots(degree, ctrolPts, knots, weights);
        for (size_t i = 0; i < tempPoints.size(); i++)
          curve.Add(tempPoints[i]);
      }
      else if (params.dimensions == 3)
      {
        std::vector<glm::dvec3> ctrolPts;
        for (auto &token : points)
        {
          uint32_t pointId = _loader.GetRefArgument(token);
          ctrolPts.push_back(GetCartesianPoint3D(pointId));
        }

        double numCurvePoints = ctrolPts.size();
        std::vector<glm::dvec3> tempPoints = GetRationalBSplineCurveWithKnots(degree, ctrolPts, knots, weights, numCurvePoints);
        for (size_t i = 0; i < tempPoints.size(); i++)
          curve.Add(tempPoints[i]);
      }

      if (condition)
      {
        std::reverse(curve.points.begin(), curve.points.end());
      }

      break;
    }
    case schema::IFCBSPLINECURVEWITHKNOTS:
    {
      bool condition = params.sameSense == 0;
      if (params.edge)
      {
        condition = !condition;
      }

      // The IfcBSplineCurveWithKnots is a spline curve parameterized by spline functions for which the knot values are explicitly given.
      // This is the type of b-spline curve for which the knot values are explicitly given. This subtype shall be used to represent non-uniform B-spline curves and may be used for other knot types.
      // Let L denote the number of distinct values amongst the d+k+2 knots in the knot list; L will be referred to as the ‘upper index on knots’. Let mj denote the multiplicity (i.e., number of repetitions) of the _j_th distinct knot.

      // All knot multiplicities except the first and the last shall be in the range 1,...,d; the first and last may have a maximum value of d + 1. In evaluating the basis functions, a knot u of, e.g., multiplicity 3 is interpreted as a sequence u, u, u,; in the knot array.
      std::vector<uint32_t> knotMultiplicities;
      std::vector<glm::f64> distinctKnots;
      std::vector<glm::f64> knots;
      std::vector<glm::f64> indexes;
      std::vector<glm::f64> weights;

      _loader.MoveToArgumentOffset(expressID, 0);
      int degree = _loader.GetIntArgument();
      auto points = _loader.GetSetArgument();
      auto curveType = _loader.GetStringArgument();
      auto closed = _loader.GetStringArgument();
      auto selfIntersect = _loader.GetStringArgument();
      auto knotMultiplicitiesSet = _loader.GetSetArgument(); // The multiplicities of the knots. This list defines the number of times each knot in the knots list is to be repeated in constructing the knot array.
      auto knotSet = _loader.GetSetArgument();               // The list of distinct knots used to define the B-spline basis functions.

      for (auto &token : knotMultiplicitiesSet)
      {
        knotMultiplicities.push_back(_loader.GetIntArgument(token));
      }

      for (auto &token : knotSet)
      {
        distinctKnots.push_back(_loader.GetDoubleArgument(token));
      }

      for (size_t k = 0; k < distinctKnots.size(); k++)
      {
        double knot = distinctKnots[k];
        for (size_t i = 0; i < knotMultiplicities[k]; i++)
        {
          knots.push_back(knot);
        }
      }

      if (knots.size() != points.size() + degree + 1)
      {
        std::cout << "Error: Knots and control points do not match" << std::endl;
      }

      // build default weights vector
      for (size_t i = 0; i < points.size(); i++)
      {
        weights.push_back(1);
      }

      if (params.dimensions == 2)
      {
        std::vector<glm::dvec2> ctrolPts;
        for (auto &token : points)
        {
          uint32_t pointId = _loader.GetRefArgument(token);
          ctrolPts.push_back(GetCartesianPoint3D(pointId));
        }
        std::vector<glm::dvec2> tempPoints = GetRationalBSplineCurveWithKnots(degree, ctrolPts, knots, weights);
        for (size_t i = 0; i < tempPoints.size(); i++)
          curve.Add(tempPoints[i]);
      }
      else if (params.dimensions == 3)
      {
        std::vector<glm::dvec3> ctrolPts;
        for (auto &token : points)
        {
          uint32_t pointId = _loader.GetRefArgument(token);
          ctrolPts.push_back(GetCartesianPoint3D(pointId));
        }
        double numCurvePoints = ctrolPts.size();
        std::vector<glm::dvec3> tempPoints = GetRationalBSplineCurveWithKnots(degree, ctrolPts, knots, weights, numCurvePoints);
        for (size_t i = 0; i < tempPoints.size(); i++)
          curve.Add(tempPoints[i]);
      }

      if (condition)
      {
        std::reverse(curve.points.begin(), curve.points.end());
      }

      break;
    }
    case schema::IFCRATIONALBSPLINECURVEWITHKNOTS:
    {

      bool condition = params.sameSense == 0;
      if (params.edge)
      {
        condition = !condition;
      }

      std::vector<glm::f64> distinctKnots;
      std::vector<uint32_t> knotMultiplicities;
      std::vector<glm::f64> knots;
      std::vector<glm::f64> weights;
      _loader.MoveToArgumentOffset(expressID, 0);
      int degree = _loader.GetIntArgument();
      auto points = _loader.GetSetArgument();
      auto curveType = _loader.GetStringArgument();
      auto closed = _loader.GetStringArgument();
      auto selfIntersect = _loader.GetStringArgument();
      auto knotMultiplicitiesSet = _loader.GetSetArgument(); // The multiplicities of the knots. This list defines the number of times each knot in the knots list is to be repeated in constructing the knot array.
      auto knotSet = _loader.GetSetArgument();
      auto knotSpec = _loader.GetStringArgument(); // The description of the knot type. This is for information only.
      auto weightsSet = _loader.GetSetArgument();

      for (auto &token : knotMultiplicitiesSet)
      {
        knotMultiplicities.push_back(_loader.GetIntArgument(token));
      }

      for (auto &token : knotSet)
      {
        distinctKnots.push_back(_loader.GetDoubleArgument(token));
      }

      for (auto &token : weightsSet)
      {
        weights.push_back(_loader.GetDoubleArgument(token));
      }

      for (size_t k = 0; k < distinctKnots.size(); k++)
      {
        double knot = distinctKnots[k];
        for (size_t i = 0; i < knotMultiplicities[k]; i++)
        {
          knots.push_back(knot);
        }
      }

      if (knots.size() != points.size() + degree + 1)
      {
        std::cout << "Error: Knots and control points do not match" << std::endl;
      }

      if (params.dimensions == 2)
      {
        std::vector<glm::dvec2> ctrolPts;
        for (auto &token : points)
        {
          uint32_t pointId = _loader.GetRefArgument(token);
          ctrolPts.push_back(GetCartesianPoint3D(pointId));
        }

        std::vector<glm::dvec2> tempPoints = GetRationalBSplineCurveWithKnots(degree, ctrolPts, knots, weights);
        for (size_t i = 0; i < tempPoints.size(); i++)
          curve.Add(tempPoints[i]);
      }
      else if (params.dimensions == 3)
      {
        std::vector<glm::dvec3> ctrolPts;
        for (auto &token : points)
        {
          uint32_t pointId = _loader.GetRefArgument(token);
          ctrolPts.push_back(GetCartesianPoint3D(pointId));
        }

        double numCurvePoints = ctrolPts.size();
        std::vector<glm::dvec3> tempPoints = GetRationalBSplineCurveWithKnots(degree, ctrolPts, knots, weights, numCurvePoints);
        for (size_t i = 0; i < tempPoints.size(); i++)
          curve.Add(tempPoints[i]);
      }

      if (condition)
      {
        std::reverse(curve.points.begin(), curve.points.end());
      }

      break;
    }
    case schema::IFCCLOTHOID:
    {
        // we need numSegments points along the clothoid. 
        // But we also need the exact end point and tangent, because roads and railways need a precise transition between segments
        _loader.MoveToArgumentOffset(expressID, 0);
        uint32_t positionID = _loader.GetRefArgument();
        double A = _loader.GetDoubleArgument();
        double A_sq = A * A;
        double sign_A = (A >= 0) ? 1.0 : -1.0;  // negative A are allowed in IFC!
        if (A_sq < 1e-9) {
            spdlog::error("[ComputeCurve()] IFCCLOTHOID: invalid A parameter {}", A, lineType);
            break;
        }

        glm::dmat3 placement = glm::dmat3(1);
        if (!params.ignorePlacement)
        {
            placement = GetAxis2Placement2D(positionID);
        }
        double s1 = 0, s2 = 0; // default
        bool sense = true; // default
        TrimSense trimSense = params.trimSense;
        if (params.hasTrim && params.trimStart.trimType == TRIM_BY_PARAMETER && params.trimEnd.trimType == TRIM_BY_PARAMETER)
        {
            s1 = params.trimStart.value;
            s2 = params.trimEnd.value;
            if (trimSense == TRIM_SENSE_REVERSE) { // reverse
                std::swap(s1, s2);
                sense = false;
            }
        }
        else if (params.hasTrim && params.trimStart.trimType == TRIM_BY_LENGTH && params.trimEnd.trimType == TRIM_BY_LENGTH)
        {
            s1 = params.trimStart.value;
            s2 = params.trimEnd.value;
            if (trimSense == TRIM_SENSE_REVERSE) { // reverse
                std::swap(s1, s2);
                sense = false;
            }
        }
        else {
            // if no trim, use default range
            s1 = 0;
            s2 = A * sqrt(2 * CONST_PI);
            sense = true;
        }
        if (s1 > s2) std::swap(s1, s2); // ensure s1 < s2

        // Helper function for accurate position at any s (fine integration from 0 to s)
        auto compute_clothoid_pos = [&](double s) -> glm::dvec2 {
            if (std::abs(s) < 1e-9) return glm::dvec2(0, 0);
            const int fine_steps = 1000;
            double fine_ds = s / fine_steps;
            double curr_s = 0.0;
            double curr_theta = 0.0;
            glm::dvec2 curr_pos(0, 0);
            for (int i = 0; i < fine_steps; ++i) {
                double dtheta = sign_A * (curr_s * fine_ds / A_sq + fine_ds * fine_ds / (2 * A_sq));
                double theta_mid = curr_theta + dtheta / 2.0;  // Midpoint for better accuracy
                double dx = fine_ds * std::cos(theta_mid);
                double dy = fine_ds * std::sin(theta_mid);
                curr_pos += glm::dvec2(dx, dy);
                curr_theta += dtheta;
                curr_s += fine_ds;
            }
            return curr_pos;
            };

        // Compute accurate start position at s1
        glm::dvec2 current_pos = compute_clothoid_pos(s1);
        double current_s = s1;
        double current_theta = sign_A * (current_s * current_s) / (2 * A_sq);

        // Generate rendering points with midpoint Euler (coarse, numSegments)
        const int numSegments = _circleSegments;
        double ds = (s2 - s1) / (numSegments - 1);
        for (int i = 0; i < numSegments; ++i) {
            glm::dvec2 p = current_pos;
            curve.Add(placement * glm::dvec3(p, 1));
            if (i == numSegments - 1) break;
            double dtheta = sign_A * (current_s * ds / A_sq + ds * ds / (2 * A_sq));
            double theta_mid = current_theta + dtheta / 2.0;  // Midpoint for better accuracy
            double dx = ds * std::cos(theta_mid);
            double dy = ds * std::sin(theta_mid);
            current_pos += glm::dvec2(dx, dy);
            current_theta += dtheta;
            current_s += ds;
        }

        // Overwrite the last point with exact position at s2
        glm::dvec2 exact_end_pos = compute_clothoid_pos(s2);
        curve.points.back() = placement * glm::dvec3(exact_end_pos, 1);

        glm::dmat2 rotation_part(
            placement[0][0], placement[0][1], // Local X direction (Column 0)
            placement[1][0], placement[1][1]  // Local Y direction (Column 1)
        );

        double tangentSign = 1.0;
        if (!sense)
        {
            std::reverse(curve.points.begin(), curve.points.end());
            current_theta = sign_A * (s1 * s1) / (2 * A_sq); // recompute for tangent
            tangentSign = -1.0;
        }

        glm::dvec2 localTangent(std::cos(current_theta), std::sin(current_theta));
        glm::dvec2 worldTangent = rotation_part * localTangent;
        curve.endTangent = tangentSign * glm::normalize(glm::dvec3(worldTangent.x, worldTangent.y, 0 ));

		// start tangent
        double start_theta = sign_A * (s1 * s1) / (2 * A_sq);
        glm::dvec2 localStartTangent2D(std::cos(start_theta), std::sin(start_theta));
        glm::dvec2 worldStartTangent2D = rotation_part * localStartTangent2D;
        glm::dvec3 startTangent(worldStartTangent2D.x, worldStartTangent2D.y, 0.0);
        curve.segmentStartTangents.push_back(tangentSign * glm::normalize(startTangent) );
        break;
    }

    default:

      spdlog::error("[ComputeCurve()] Unsupported curve type {}", expressID, lineType);
      break;
    }
    // DEBUG
    // #ifdef DEBUG_DUMP_SVG
    //     io::DumpSVGCurve(curve.points, "partial_curve.html");
    // #endif
  }

  void IfcGeometryLoader::convertAngleUnits(double &Degrees, double &Rad) const
  {
    if (_angleUnits == "RADIAN")
    {
      Degrees = (Rad / CONST_PI) * 180.0;
    }
    else
    {
      Rad = Degrees / 180.0 * CONST_PI;
    }
  }

  IfcProfile IfcGeometryLoader::GetProfile(uint32_t expressID) const
  {
    spdlog::debug("[GetProfile({})]", expressID);
    auto profile = GetProfileByLine(expressID);

    if (!profile.isComposite)
    {
      if (!profile.curve.IsCCW())
      {
        profile.curve.Invert();
      }
      for (auto &hole : profile.holes)
      {
        if (hole.IsCCW())
        {
          hole.Invert();
        }
      }
    }
    else
    {
      for (uint32_t i = 0; i < profile.profiles.size(); i++)
      {
        if (!profile.profiles[i].curve.IsCCW())
        {
          profile.profiles[i].curve.Invert();
        }
        for (auto &hole : profile.profiles[i].holes)
        {
          if (hole.IsCCW())
          {
            hole.Invert();
          }
        }
      }
    }

    return profile;
  }

  IfcProfile IfcGeometryLoader::GetProfileByLine(uint32_t expressID) const
  {
    spdlog::debug("[GetProfileByLine({})]", expressID);
    auto lineType = _loader.GetLineType(expressID);
    switch (lineType)
    {
    case schema::IFCARBITRARYOPENPROFILEDEF:
    case schema::IFCARBITRARYCLOSEDPROFILEDEF:
    {
      IfcProfile profile;

      _loader.MoveToArgumentOffset(expressID, 0);
      profile.type = _loader.GetStringArgument();
      _loader.MoveToArgumentOffset(expressID, 2);
      uint32_t curveID = _loader.GetRefArgument();
      // ISSUE 765 requires dimension 3, not sure how to solve it without a stopgap
      profile.curve = GetCurve(curveID, 2);
      profile.isConvex = IsCurveConvex(profile.curve);

      return profile;
    }
    case schema::IFCARBITRARYPROFILEDEFWITHVOIDS:
    {
      IfcProfile profile;

      _loader.MoveToArgumentOffset(expressID, 0);
      profile.type = _loader.GetStringArgument();
      _loader.MoveToArgumentOffset(expressID, 2);
      profile.curve = GetCurve(_loader.GetRefArgument(), 2);
      profile.isConvex = IsCurveConvex(profile.curve);

      _loader.MoveToArgumentOffset(expressID, 3);
      auto holes = _loader.GetSetArgument();

      for (auto &hole : holes)
      {
        IfcCurve holeCurve = GetCurve(_loader.GetRefArgument(hole), 2);
        profile.holes.push_back(holeCurve);
      }

      return profile;
    }
    case schema::IFCRECTANGLEPROFILEDEF:
    case schema::IFCROUNDEDRECTANGLEPROFILEDEF:
    {
      IfcProfile profile;

      _loader.MoveToArgumentOffset(expressID, 0);
      profile.type = _loader.GetStringArgument();
      profile.isConvex = true;

      _loader.MoveToArgumentOffset(expressID, 2);
      uint32_t placementID = _loader.GetRefArgument();
      double xdim = _loader.GetDoubleArgument();
      double ydim = _loader.GetDoubleArgument();

      if (placementID != 0)
      {
        glm::dmat3 placement = GetAxis2Placement2D(placementID);
        profile.curve = GetRectangleCurve(xdim, ydim, placement);
      }
      else
      {
        glm::dmat3 placement = glm::dmat3(
            glm::dvec3(1, 0, 0),
            glm::dvec3(0, 1, 0),
            glm::dvec3(0, 0, 1));
        profile.curve = GetRectangleCurve(xdim, ydim, placement);
      }
      return profile;
    }
    case schema::IFCRECTANGLEHOLLOWPROFILEDEF:
    {
      IfcProfile profile;

      _loader.MoveToArgumentOffset(expressID, 0);
      profile.type = _loader.GetStringArgument();
      profile.isConvex = true;

      _loader.MoveToArgumentOffset(expressID, 2);
      uint32_t placementID = _loader.GetRefArgument();
      double xdim = _loader.GetDoubleArgument();
      double ydim = _loader.GetDoubleArgument();
      double thickness = _loader.GetDoubleArgument();
      double innerRadius = 0;
      double outerRadius = 0;
      if (_loader.GetTokenType() == parsing::IfcTokenType::REAL)
      {
        _loader.StepBack();
        innerRadius = _loader.GetDoubleArgument();
      }
            if (_loader.GetTokenType() == parsing::IfcTokenType::REAL)
      {
        _loader.StepBack();
        outerRadius = _loader.GetDoubleArgument();
      }

      // fillets not implemented yet

      glm::dmat3 placement = GetAxis2Placement2D(placementID);

      profile.curve = GetRectangleCurve(xdim, ydim, placement, _circleSegments, outerRadius);
      profile.holes.push_back(GetRectangleCurve(xdim - thickness, ydim - thickness, placement, _circleSegments, innerRadius));

      std::reverse(profile.holes[0].points.begin(), profile.holes[0].points.end());

      return profile;
    }
    case schema::IFCCIRCLEPROFILEDEF:
    {
      IfcProfile profile;

      _loader.MoveToArgumentOffset(expressID, 0);
      profile.type = _loader.GetStringArgument();
      profile.isConvex = true;

      _loader.MoveToArgumentOffset(expressID, 2);
      uint32_t placementID = _loader.GetOptionalRefArgument();
      double radius = _loader.GetDoubleArgument();

      glm::dmat3 placement(1);

      if (placementID)
      {
        placement = GetAxis2Placement2D(placementID);
      }

      profile.curve = GetCircleCurve(radius, _circleSegments, placement);

      return profile;
    }
    case schema::IFCELLIPSEPROFILEDEF:
    {
      IfcProfile profile;

      _loader.MoveToArgumentOffset(expressID, 0);
      profile.type = _loader.GetStringArgument();
      profile.isConvex = true;

      _loader.MoveToArgumentOffset(expressID, 2);
      uint32_t placementID = _loader.GetRefArgument();
      double radiusX = _loader.GetDoubleArgument();
      double radiusY = _loader.GetDoubleArgument();

      glm::dmat3 placement = GetAxis2Placement2D(placementID);

      profile.curve = GetEllipseCurve(radiusX, radiusY, _circleSegments, placement);

      return profile;
    }
    case schema::IFCCIRCLEHOLLOWPROFILEDEF:
    {
      IfcProfile profile;

      _loader.MoveToArgumentOffset(expressID, 0);
      profile.type = _loader.GetStringArgument();
      profile.isConvex = true;

      _loader.MoveToArgumentOffset(expressID, 2);
      uint32_t placementID = _loader.GetOptionalRefArgument();
      double radius = _loader.GetDoubleArgument();
      double thickness = _loader.GetDoubleArgument();

      glm::dmat3 placement = glm::dmat3(1.0);

      if (placementID)
      {
        placement = GetAxis2Placement2D(placementID);
      }

      profile.curve = GetCircleCurve(radius, _circleSegments, placement);
      profile.holes.push_back(GetCircleCurve(radius - thickness, _circleSegments, placement));
      std::reverse(profile.holes[0].points.begin(), profile.holes[0].points.end());

      return profile;
    }
    case schema::IFCISHAPEPROFILEDEF:
    {
      IfcProfile profile;

      _loader.MoveToArgumentOffset(expressID, 0);
      profile.type = _loader.GetStringArgument();
      profile.isConvex = true;

      _loader.MoveToArgumentOffset(expressID, 2);

      glm::dmat3 placement(1);

      if (_loader.GetTokenType() == parsing::IfcTokenType::REF)
      {
        _loader.StepBack();

        uint32_t placementID = _loader.GetRefArgument();
        placement = GetAxis2Placement2D(placementID);
      }

      _loader.MoveToArgumentOffset(expressID, 3);

      double width = _loader.GetDoubleArgument();
      double depth = _loader.GetDoubleArgument();
      double webThickness = _loader.GetDoubleArgument();
      double flangeThickness = _loader.GetDoubleArgument();

      // optional fillet
      double filletRadius = _loader.GetOptionalDoubleParam(0);
      bool hasFillet = filletRadius > 0;

      profile.curve = GetIShapedCurve(width, depth, webThickness, flangeThickness, hasFillet, filletRadius, placement);

      return profile;
    }
    case schema::IFCLSHAPEPROFILEDEF:
    {
      IfcProfile profile;

      _loader.MoveToArgumentOffset(expressID, 0);
      profile.type = _loader.GetStringArgument();
      profile.isConvex = false;

      _loader.MoveToArgumentOffset(expressID, 2);

      glm::dmat3 placement(1);

      if (_loader.GetTokenType() == parsing::IfcTokenType::REF)
      {
        _loader.StepBack();

        uint32_t placementID = _loader.GetRefArgument();
        placement = GetAxis2Placement2D(placementID);
      }

      _loader.MoveToArgumentOffset(expressID, 3);
      double depth = _loader.GetDoubleArgument();
      double width = _loader.GetOptionalDoubleParam(0);
      if (width == 0) { width = depth;}
      double thickness = _loader.GetDoubleArgument();
      double filletRadius = _loader.GetOptionalDoubleParam(0);
      bool hasFillet = filletRadius > 0;
      double edgeRadius = _loader.GetOptionalDoubleParam(0);
      double legSlope = _loader.GetOptionalDoubleParam(0);
      // double centreOfGravityInX =
      _loader.GetOptionalDoubleParam(0);
      // double centreOfGravityInY =
      _loader.GetOptionalDoubleParam(0);

      profile.curve = GetLShapedCurve(width, depth, thickness, hasFillet, filletRadius, edgeRadius, legSlope, _circleSegments, placement);

      return profile;
    }
    case schema::IFCTSHAPEPROFILEDEF:
    {
      IfcProfile profile;

      _loader.MoveToArgumentOffset(expressID, 0);
      profile.type = _loader.GetStringArgument();
      profile.isConvex = false;

      _loader.MoveToArgumentOffset(expressID, 2);

      glm::dmat3 placement(1);

      if (_loader.GetTokenType() == parsing::IfcTokenType::REF)
      {
        _loader.StepBack();

        uint32_t placementID = _loader.GetRefArgument();
        placement = GetAxis2Placement2D(placementID);
      }

      _loader.MoveToArgumentOffset(expressID, 3);
      double depth = _loader.GetDoubleArgument();
      double width = _loader.GetDoubleArgument();
      double webThickness = _loader.GetDoubleArgument();
      // double flangeThickness =
      _loader.GetDoubleArgument();
      double filletRadius = _loader.GetOptionalDoubleParam(0);
      bool hasFillet = filletRadius != 0;
      double flangeEdgeRadius = _loader.GetOptionalDoubleParam(0);
      // double webEdgeRadius =
      _loader.GetOptionalDoubleParam(0);
      // double webSlope =
      _loader.GetOptionalDoubleParam(0);
      double flangeSlope = _loader.GetOptionalDoubleParam(0);

      profile.curve = GetTShapedCurve(width, depth, webThickness, hasFillet, filletRadius, flangeEdgeRadius, flangeSlope, placement);

      return profile;
    }
    case schema::IFCUSHAPEPROFILEDEF:
    {
      IfcProfile profile;

      _loader.MoveToArgumentOffset(expressID, 0);
      profile.type = _loader.GetStringArgument();
      profile.isConvex = true;

      _loader.MoveToArgumentOffset(expressID, 2);

      glm::dmat3 placement(1);

      if (_loader.GetTokenType() == parsing::IfcTokenType::REF)
      {
        _loader.StepBack();

        uint32_t placementID = _loader.GetRefArgument();
        placement = GetAxis2Placement2D(placementID);
      }

      _loader.MoveToArgumentOffset(expressID, 3);

      double depth = _loader.GetDoubleArgument();
      double flangeWidth = _loader.GetDoubleArgument();
      double webThickness = _loader.GetDoubleArgument();
      double flangeThickness = _loader.GetDoubleArgument();

      // optional parameters
      double filletRadius = _loader.GetOptionalDoubleParam(0);
      bool hasFillet = filletRadius > 0;
      // double edgeRadius = GetOptionalDoubleParam();
      // double flangeSlope = GetOptionalDoubleParam();
      double edgeRadius = 0;
      double flangeSlope = 0;

      profile.curve = GetUShapedCurve(depth, flangeWidth, webThickness, flangeThickness, filletRadius, edgeRadius, flangeSlope, placement);

      return profile;
    }
    case schema::IFCCSHAPEPROFILEDEF:
    {
      IfcProfile profile;

      _loader.MoveToArgumentOffset(expressID, 0);
      profile.type = _loader.GetStringArgument();
      profile.isConvex = true;

      _loader.MoveToArgumentOffset(expressID, 2);

      glm::dmat3 placement(1);

      if (_loader.GetTokenType() == parsing::IfcTokenType::REF)
      {
        _loader.StepBack();

        uint32_t placementID = _loader.GetRefArgument();
        placement = GetAxis2Placement2D(placementID);
      }

      _loader.MoveToArgumentOffset(expressID, 3);

      double depth = _loader.GetDoubleArgument();
      double Width = _loader.GetDoubleArgument();
      double Thickness = _loader.GetDoubleArgument();
      double girth = _loader.GetDoubleArgument();
      double filletRadius = _loader.GetOptionalDoubleParam(0);
      bool hasFillet = filletRadius > 0;
      // double ventreOfGravityInX =
      _loader.GetOptionalDoubleParam(0);

      profile.curve = GetCShapedCurve(Width, depth, girth, Thickness, hasFillet, filletRadius, placement);

      return profile;
    }
    case schema::IFCZSHAPEPROFILEDEF:
    {
      IfcProfile profile;

      _loader.MoveToArgumentOffset(expressID, 0);
      profile.type = _loader.GetStringArgument();
      profile.isConvex = true;

      _loader.MoveToArgumentOffset(expressID, 2);

      glm::dmat3 placement(1);

      if (_loader.GetTokenType() == parsing::IfcTokenType::REF)
      {
        _loader.StepBack();

        uint32_t placementID = _loader.GetRefArgument();
        glm::dmat3 placement = GetAxis2Placement2D(placementID);
      }

      _loader.MoveToArgumentOffset(expressID, 3);

      double depth = _loader.GetDoubleArgument();
      double flangeWidth = _loader.GetDoubleArgument();
      double webThickness = _loader.GetDoubleArgument();
      double flangeThickness = _loader.GetDoubleArgument();
      double filletRadius = _loader.GetOptionalDoubleParam(0);
      bool hasFillet = filletRadius > 0;
      double edgeRadius = _loader.GetOptionalDoubleParam(0);

      profile.curve = GetZShapedCurve(depth, flangeWidth, webThickness, flangeThickness, filletRadius, edgeRadius, placement);

      return profile;
    }
    case schema::IFCDERIVEDPROFILEDEF:
    {
      _loader.MoveToArgumentOffset(expressID, 2);
      uint32_t profileID = _loader.GetRefArgument();
      IfcProfile profile = GetProfileByLine(profileID);

      _loader.MoveToArgumentOffset(expressID, 3);
      uint32_t transformID = _loader.GetRefArgument();
      glm::dmat3 transformation = GetAxis2Placement2D(transformID);

      if (!profile.isComposite)
      {
        for (uint32_t i = 0; i < profile.curve.points.size(); i++)
        {
          profile.curve.points[i] = transformation * glm::dvec3(profile.curve.points[i].x, profile.curve.points[i].y, 1);
        }
      }
      else
      {
        for (uint32_t j = 0; j < profile.profiles.size(); j++)
        {
          for (uint32_t i = 0; i < profile.profiles[j].curve.points.size(); i++)
          {
            profile.profiles[j].curve.points[i] = transformation * glm::dvec3(profile.profiles[j].curve.points[i].x, profile.profiles[j].curve.points[i].y, 1);
          }
        }
      }

      return profile;
    }
    case schema::IFCCOMPOSITEPROFILEDEF:
    {
      IfcProfile profile = IfcProfile();

      std::vector<uint32_t> lst;

      _loader.MoveToArgumentOffset(expressID, 2);
      parsing::IfcTokenType t = _loader.GetTokenType();
      if (t == parsing::IfcTokenType::SET_BEGIN)
      {
        while (_loader.GetTokenType() == parsing::IfcTokenType::REF)
        {
          _loader.StepBack();
          uint32_t profileID = _loader.GetRefArgument();
          lst.push_back(profileID);
        }
      }

      profile.isComposite = true;

      for (uint32_t i = 0; i < lst.size(); i++)
      {
        IfcProfile profile_t = GetProfileByLine(lst[i]);
        profile.profiles.push_back(profile_t);
      }

      return profile;
    }
    case schema::IFCOPENCROSSPROFILEDEF:
    {
      IfcProfile profile = IfcProfile();

      _loader.MoveToArgumentOffset(expressID, 2);
      auto horizontalWidth = _loader.GetStringArgument();
      _loader.MoveToArgumentOffset(expressID, 3);
      auto widthsTokens = _loader.GetSetListArgument();
      _loader.MoveToArgumentOffset(expressID, 4);
      auto slopesTokens = _loader.GetSetListArgument();
      _loader.MoveToArgumentOffset(expressID, 5);
      auto tagsTokens = _loader.GetSetListArgument();

      std::vector<double> listWidths;
      for (auto &set : widthsTokens)
      {
        for (auto &token : set)
        {
          listWidths.push_back(_loader.GetDoubleArgument(token));
        }
      }

      std::vector<double> listSlopes;
      for (auto &set : slopesTokens)
      {
        for (auto &token : set)
        {
          listSlopes.push_back(_loader.GetDoubleArgument(token));
        }
      }

      std::vector<double> listTags;
      for (auto &set : tagsTokens)
      {
        for (auto &token : set)
        {
          listTags.push_back(_loader.GetDoubleArgument(token));
        }
      }

      // Initialize starting point of profile curve at origin
      double x = 0.0;
      double y = 0.0;

      // Iterate over each width and slope in the lists
      for (size_t i = 0; i < listWidths.size(); ++i)
      {
        double width = listWidths[i];
        double slope_degrees = listSlopes[i];

        // Convert slope from degrees to radians

        double slope_radians = slope_degrees;

        convertAngleUnits(slope_degrees, slope_radians);

        // Calculate the change in x and y based on the width and slope
        double dx = width * cos(slope_radians);
        double dy = width * sin(slope_radians);

        // Add the new (x,y) coordinate to the profile curve vector
        profile.curve.Add(glm::dvec2(x, y));

        // Update the (x,y) coordinates for the next line segment
        x += dx;
        y += dy;
      }

      return profile;
    }
    case schema::IFCTRAPEZIUMPROFILEDEF:
    {
      IfcProfile profile;

      _loader.MoveToArgumentOffset(expressID, 0);
      profile.type = _loader.GetStringArgument();
      profile.isConvex = true;

      _loader.MoveToArgumentOffset(expressID, 2);
      uint32_t placementID = _loader.GetRefArgument();
      double bottomXDim = _loader.GetDoubleArgument();
      double topXDim = _loader.GetDoubleArgument();
      double yDim = _loader.GetDoubleArgument();
      double topXOffset = _loader.GetDoubleArgument();

      glm::dmat3 placement;
      if (placementID != 0)
      {
        placement = GetAxis2Placement2D(placementID);
      }
      else
      {
        placement = glm::dmat3(
            glm::dvec3(1, 0, 0),
            glm::dvec3(0, 1, 0),
            glm::dvec3(0, 0, 1));
      }
      profile.curve = GetTrapeziumCurve(bottomXDim, topXDim, yDim, topXOffset, placement);
      return profile;
    }
    default:
      spdlog::error("[GetProfileByLine()] unexpected profile type {}", expressID, lineType);
      break;
    }

    return IfcProfile();
  }

  IfcProfile IfcGeometryLoader::GetProfile3D(uint32_t expressID) const
  {
    spdlog::debug("[GetProfile3D({})]", expressID);
    auto lineType = _loader.GetLineType(expressID);
    switch (lineType)
    {
    case schema::IFCARBITRARYOPENPROFILEDEF:
    {
      IfcProfile profile;

      _loader.MoveToArgumentOffset(expressID, 0);
      profile.type = _loader.GetStringArgument();
      _loader.MoveToArgumentOffset(expressID, 2);
      profile.curve = GetCurve(_loader.GetRefArgument(), 3);

      return profile;
    }
    default:
      spdlog::error("[GetProfilebyLine()] unexpected 3D profile type {}", expressID, lineType);
      break;
    }

    return IfcProfile();
  }

  glm::dvec3 IfcGeometryLoader::GetVector(uint32_t expressID) const
  {
    spdlog::debug("[GetVector({})]", expressID);
    _loader.MoveToArgumentOffset(expressID, 0);
    auto positionID = _loader.GetRefArgument();
    double length = _loader.GetDoubleArgument();

    glm::dvec3 direction = GetCartesianPoint3D(positionID);
    direction.x = direction.x * length;
    direction.y = direction.y * length;
    direction.z = direction.z * length;

    return direction;
  }

  // Helper function to convert glm::dmat4 to string for logging
  std::string matrixToString(const glm::dmat4& matrix) {
      std::ostringstream oss;
      oss << std::fixed << std::setprecision(6);
      oss << "mat4(";
      for (int i = 0; i < 4; ++i) {
          for (int j = 0; j < 4; ++j) {
              oss << matrix[j][i]; // GLM is column-major
              if (i < 3 || j < 3) oss << ", ";
          }
      }
      oss << ")";
      return oss.str();
  }

  glm::dmat3 IfcGeometryLoader::GetAxis2Placement2D(uint32_t expressID) const
  {
    // TODO: Bad solution
    if (expressID < 1)
    {
      return glm::dmat3(1.0);
    }

    spdlog::debug("[GetAxis2Placement2D({})]", expressID);
    auto lineType = _loader.GetLineType(expressID);
    switch (lineType)
    {
    case schema::IFCAXIS2PLACEMENT2D:
    {
      _loader.MoveToArgumentOffset(expressID, 0);
      uint32_t locationID = _loader.GetRefArgument();
      parsing::IfcTokenType dirToken = _loader.GetTokenType();

      glm::dvec2 xAxis = glm::dvec2(1, 0);
      if (dirToken == parsing::IfcTokenType::REF)
      {
        _loader.StepBack();
        xAxis = glm::normalize(GetCartesianPoint2D(_loader.GetRefArgument()));
      }

      glm::dvec2 pos = GetCartesianPoint2D(locationID);

      glm::dvec2 yAxis = glm::dvec2(-xAxis.y, xAxis.x); // Perpendicular, no need to normalize

      return glm::dmat3(
          glm::dvec3(xAxis.x, xAxis.y, 0), // X-axis
          glm::dvec3(yAxis.x, yAxis.y, 0), // Y-axis
          glm::dvec3(pos.x, pos.y, 1));    // Position
    }
    case schema::IFCCARTESIANTRANSFORMATIONOPERATOR2D:
    case schema::IFCCARTESIANTRANSFORMATIONOPERATOR2DNONUNIFORM:
    {
      double scale1 = 1.0;
      double scale2 = 1.0;

      glm::dvec2 Axis1(1, 0);
      glm::dvec2 Axis2(0, 1);

      _loader.MoveToArgumentOffset(expressID, 0);
      if (_loader.GetTokenType() == parsing::IfcTokenType::REF)
      {
        _loader.StepBack();
        Axis1 = glm::normalize(GetCartesianPoint3D(_loader.GetRefArgument()));
      }
      _loader.MoveToArgumentOffset(expressID, 1);
      if (_loader.GetTokenType() == parsing::IfcTokenType::REF)
      {
        _loader.StepBack();
        Axis2 = glm::normalize(GetCartesianPoint3D(_loader.GetRefArgument()));
      }

      _loader.MoveToArgumentOffset(expressID, 2);
      uint32_t posID = _loader.GetRefArgument();
      glm::dvec2 pos = GetCartesianPoint2D(posID);

      _loader.MoveToArgumentOffset(expressID, 3);
      if (_loader.GetTokenType() == parsing::IfcTokenType::REAL)
      {
        _loader.StepBack();
        scale1 = _loader.GetDoubleArgument();
      }

      if (lineType == schema::IFCCARTESIANTRANSFORMATIONOPERATOR2DNONUNIFORM)
      {
        _loader.MoveToArgumentOffset(expressID, 4);
        if (_loader.GetTokenType() == parsing::IfcTokenType::REAL)
        {
          _loader.StepBack();
          scale2 = _loader.GetDoubleArgument();
        }
      }

      if (lineType == schema::IFCCARTESIANTRANSFORMATIONOPERATOR2D)
      {
        scale2 = scale1;
      }

      return glm::dmat3(
          glm::dvec3(Axis1 * scale1, 0),
          glm::dvec3(Axis2 * scale2, 0),
          glm::dvec3(pos, 1));
    }
    default:
      spdlog::error("[GetAxis2DPlacement()] unexpected 2D placement type {}", expressID, lineType);
      break;
    }
    return glm::dmat3();
  }

  IfcCurve IfcGeometryLoader::GetLocalCurve(uint32_t expressID) const
  {
    spdlog::debug("[GetLocalCurve({})]", expressID);
    for (uint32_t i = 0; i < _localcurvesIndices.size(); i++)
    {
      if (_localcurvesIndices[i] == expressID)
      {
        return _localCurvesList[i];
      }
    }
    IfcCurve curve = GetCurve(expressID, 3, false);
    _localcurvesIndices.push_back(expressID);
    _localCurvesList.push_back(curve);
    return curve;
  }

  glm::dmat4 IfcGeometryLoader::GetLocalPlacement(uint32_t expressID, glm::dvec3 vector) const
  {
    if (_expressIDToPlacement.contains(expressID))
    {
      return _expressIDToPlacement[expressID];
    }
    else
    {
      spdlog::debug("[GetLocalPlacement({})]", expressID);
      auto lineType = _loader.GetLineType(expressID);
      switch (lineType)
      {
      case schema::IFCPOINTBYDISTANCEEXPRESSION:
      {
        // IfcPointByDistanceExpression : public IfcPoint
        //    IfcCurveMeasureSelect					DistanceAlong;
        //    IfcLengthMeasure						OffsetLateral;			//optional
        //    IfcLengthMeasure						OffsetVertical;			//optional
        //    IfcLengthMeasure						OffsetLongitudinal;		//optional
        //    IfcCurve								BasisCurve;

        _loader.MoveToArgumentOffset(expressID, 0);
        IfcCurve curve;
        double DistanceAlong = 0;
        double OffsetLateral = 0;
        double OffsetVertical = 0;
        double OffsetLongitudinal = 0;

        if (_loader.GetTokenType() != parsing::IfcTokenType::EMPTY)
        {
          _loader.StepBack();
          DistanceAlong = ReadLenghtMeasure();
        }

        _loader.MoveToArgumentOffset(expressID, 2);
        auto tokenTypeOffsetLateral = _loader.GetTokenType();
        if (tokenTypeOffsetLateral == parsing::LABEL)
        {
            OffsetLateral = ReadLenghtMeasure();
        }
        else if (tokenTypeOffsetLateral == parsing::REAL)
        {
            _loader.StepBack();
            OffsetLateral = _loader.GetDoubleArgument();
        }

        _loader.MoveToArgumentOffset(expressID, 3);
        auto tokenTypeOffsetVertical = _loader.GetTokenType();
        if (tokenTypeOffsetVertical == parsing::LABEL)
        {
            OffsetVertical = ReadLenghtMeasure();
        }
        else if (tokenTypeOffsetVertical == parsing::REAL)
        {
            _loader.StepBack();
            OffsetVertical = _loader.GetDoubleArgument();
        }

        _loader.MoveToArgumentOffset(expressID, 4);
        auto tokenTypeOffsetLongitudinal = _loader.GetTokenType();
        if (tokenTypeOffsetLongitudinal == parsing::LABEL)
        {
            OffsetLongitudinal = ReadLenghtMeasure();
        }
        else if (tokenTypeOffsetLongitudinal == parsing::REAL)
        {
            _loader.StepBack();
            OffsetLongitudinal = _loader.GetDoubleArgument();
        }

        glm::dmat4 result;
        _loader.MoveToArgumentOffset(expressID, 5);
        auto t = _loader.GetTokenType();
        if (t == parsing::IfcTokenType::REF)
        {
            _loader.StepBack();
            auto curveId = _loader.GetRefArgument();
            curve = GetLocalCurve(curveId);
            result = curve.getPlacementAtDistance(DistanceAlong, IfcCurve::CurvePlacementMode::GlobalZAxis);
        }
        else
        {
            result = curve.getPlacementAtDistance(DistanceAlong, IfcCurve::CurvePlacementMode::GlobalZAxis);
        }

        if (std::abs(OffsetLateral) > EPS_SMALL || std::abs(OffsetVertical) > EPS_SMALL || std::abs(OffsetLongitudinal) > EPS_SMALL)
        {
            glm::dmat4 localTranslation = glm::translate(glm::dmat4(1), glm::dvec3(OffsetLongitudinal, OffsetLateral, 0));
            glm::dmat4 globalVerticalTranslation = glm::translate(glm::dmat4(1), glm::dvec3(0, 0, OffsetVertical));
            result = globalVerticalTranslation * (result * localTranslation);
        }
        _expressIDToPlacement[expressID] = result;
        return result;
      }
      case schema::IFCAXIS1PLACEMENT:
      {
        glm::dvec3 zAxis(0, 0, 1);
        glm::dvec3 xAxis(1, 0, 0);
        _loader.MoveToArgumentOffset(expressID, 0);
        uint32_t posID = _loader.GetRefArgument();
        parsing::IfcTokenType zID = _loader.GetTokenType();
        if (zID == parsing::IfcTokenType::REF)
        {
          _loader.StepBack();
          zAxis = glm::normalize(GetCartesianPoint3D(_loader.GetRefArgument()));
        }
        glm::dvec3 pos = GetCartesianPoint3D(posID);
        if (std::abs(glm::dot(xAxis, zAxis)) > 0.9)
        {
          xAxis = glm::dvec3(0, 1, 0);
        }
        glm::dvec3 yAxis = glm::normalize(glm::cross(zAxis, xAxis));
        xAxis = glm::normalize(glm::cross(zAxis, yAxis));

        glm::dmat4 result = glm::dmat4(
            glm::dvec4(xAxis, 0),
            glm::dvec4(yAxis, 0),
            glm::dvec4(zAxis, 0),
            glm::dvec4(pos, 1));

        _expressIDToPlacement[expressID] = result;
        return result;
      }
      case schema::IFCAXIS2PLACEMENT3D:
      {
        glm::dvec3 zAxis(0, 0, 1);
        glm::dvec3 xAxis(1, 0, 0);

        _loader.MoveToArgumentOffset(expressID, 0);
        uint32_t posID = _loader.GetRefArgument();
        parsing::IfcTokenType zID = _loader.GetTokenType();
        if (zID == parsing::IfcTokenType::REF)
        {
          _loader.StepBack();
          auto tmpVec = glm::normalize(GetCartesianPoint3D(_loader.GetRefArgument()));
          if (glm::length(tmpVec) > 0)
            zAxis = tmpVec;
        }

        _loader.MoveToArgumentOffset(expressID, 2);
        parsing::IfcTokenType xID = _loader.GetTokenType();
        if (xID == parsing::IfcTokenType::REF)
        {
          _loader.StepBack();
          auto tmpVec = glm::normalize(GetCartesianPoint3D(_loader.GetRefArgument()));
          if (glm::length(tmpVec) > 0)
            xAxis = tmpVec;
        }

        glm::dvec3 pos = GetCartesianPoint3D(posID);

        glm::dvec3 yAxis = glm::normalize(glm::cross(zAxis, xAxis));
        xAxis = glm::normalize(glm::cross(yAxis, zAxis));

        glm::dmat4 result = glm::dmat4(
            glm::dvec4(xAxis, 0),
            glm::dvec4(yAxis, 0),
            glm::dvec4(zAxis, 0),
            glm::dvec4(pos, 1));

        _expressIDToPlacement[expressID] = result;

        return result;
      }
      case schema::IFCAXIS2PLACEMENT2D:
      {
        glm::dvec3 xAxis(1, 0, 0);
        glm::dvec3 zAxis(0, 0, 1);

        _loader.MoveToArgumentOffset(expressID, 0);
        uint32_t posID = _loader.GetRefArgument();

        _loader.MoveToArgumentOffset(expressID, 1);
        parsing::IfcTokenType xID = _loader.GetTokenType();
        if (xID == parsing::IfcTokenType::REF)
        {
          _loader.StepBack();
          auto tmpVec = glm::normalize(GetCartesianPoint3D(_loader.GetRefArgument()));
          if (glm::length(tmpVec) > 0)
            xAxis = tmpVec;
        }

        glm::dvec3 pos = GetCartesianPoint3D(posID);

        glm::dvec3 yAxis = glm::normalize(glm::cross(zAxis, xAxis));
        xAxis = glm::normalize(glm::cross(yAxis, zAxis));

        glm::dmat4 result = glm::dmat4(
            glm::dvec4(xAxis, 0),
            glm::dvec4(yAxis, 0),
            glm::dvec4(zAxis, 0),
            glm::dvec4(pos, 1));

        _expressIDToPlacement[expressID] = result;
        return result;
      }
      case schema::IFCLOCALPLACEMENT:
      {
        glm::dmat4 relPlacement(1);

        _loader.MoveToArgumentOffset(expressID, 0);
        parsing::IfcTokenType relPlacementToken = _loader.GetTokenType();
        if (relPlacementToken == parsing::IfcTokenType::REF)
        {
          _loader.StepBack();
          relPlacement = GetLocalPlacement(_loader.GetRefArgument());
        }

        _loader.MoveToArgumentOffset(expressID, 1);
        uint32_t axis2PlacementID = _loader.GetRefArgument();

        glm::dmat4 axis2Placement = GetLocalPlacement(axis2PlacementID);

        auto result = relPlacement * axis2Placement;

        _expressIDToPlacement[expressID] = result;
        return result;
      }
      case schema::IFCCARTESIANTRANSFORMATIONOPERATOR3D:
      case schema::IFCCARTESIANTRANSFORMATIONOPERATOR3DNONUNIFORM:
      {
          // IfcCartesianTransformationOperator3D
          //  IfcDirection								Axis1;					//optional
          //  IfcDirection								Axis2;					//optional
          //  IfcCartesianPoint							LocalOrigin;
          //  IfcReal									Scale;					//optional
          //  IfcDirection								Axis3;					//optional
  
          // IfcCartesianTransformationOperator3DnonUniform:
          //IfcReal										Scale2;					//optional
          //IfcReal										Scale3;					//optional

        double scale1 = 1.0;
        double scale2 = 1.0;
        double scale3 = 1.0;

        glm::dvec3 Axis1(1, 0, 0);
        glm::dvec3 Axis2(0, 1, 0);
        glm::dvec3 Axis3(0, 0, 1);

        _loader.MoveToArgumentOffset(expressID, 0);
        if (_loader.GetTokenType() == parsing::IfcTokenType::REF)
        {
          _loader.StepBack();
          Axis1 = glm::normalize(GetCartesianPoint3D(_loader.GetRefArgument()));
        }
        _loader.MoveToArgumentOffset(expressID, 1);
        if (_loader.GetTokenType() == parsing::IfcTokenType::REF)
        {
          _loader.StepBack();
          Axis2 = glm::normalize(GetCartesianPoint3D(_loader.GetRefArgument()));
        }

        _loader.MoveToArgumentOffset(expressID, 2);
        uint32_t LocalOriginID = _loader.GetRefArgument();
        glm::dvec3 LocalOrigin = GetCartesianPoint3D(LocalOriginID);

        _loader.MoveToArgumentOffset(expressID, 3);
        if (_loader.GetTokenType() == parsing::IfcTokenType::REAL)
        {
          _loader.StepBack();
          scale1 = _loader.GetDoubleArgument();
        }

        _loader.MoveToArgumentOffset(expressID, 4);
        if (_loader.GetTokenType() == parsing::IfcTokenType::REF)
        {
          _loader.StepBack();
          Axis3 = glm::normalize(GetCartesianPoint3D(_loader.GetRefArgument()));
        }

        if (lineType == schema::IFCCARTESIANTRANSFORMATIONOPERATOR3DNONUNIFORM)
        {
          _loader.MoveToArgumentOffset(expressID, 5);
          if (_loader.GetTokenType() == parsing::IfcTokenType::REAL)
          {
            _loader.StepBack();
            scale2 = _loader.GetDoubleArgument();
          }

          _loader.MoveToArgumentOffset(expressID, 6);
          if (_loader.GetTokenType() == parsing::IfcTokenType::REAL)
          {
            _loader.StepBack();
            scale3 = _loader.GetDoubleArgument();
          }
        }

        if (lineType == schema::IFCCARTESIANTRANSFORMATIONOPERATOR3D)
        {
          scale2 = scale1;
          scale3 = scale1;
        }

        glm::dmat4 result = glm::dmat4(
            glm::dvec4(Axis1 * scale1, 0),
            glm::dvec4(Axis2 * scale2, 0),
            glm::dvec4(Axis3 * scale3, 0),
            glm::dvec4(LocalOrigin, 1));

        _expressIDToPlacement[expressID] = result;
        return result;
      }
      case schema::IFCAXIS2PLACEMENTLINEAR:
      {
        glm::dvec3 vector = glm::dvec3(0, 0, 1);
        glm::dmat4 result = glm::dmat4(1);
        _loader.MoveToArgumentOffset(expressID, 0);
        auto tokenTypeLocation = _loader.GetTokenType();
        // Location is not optional, but check anyway:
        if (tokenTypeLocation == parsing::IfcTokenType::REF)
        {
            _loader.StepBack();
            uint32_t posID = _loader.GetRefArgument();

            // Axis is optional:
            _loader.MoveToArgumentOffset(expressID, 1);
            auto tokenTypeAxis = _loader.GetTokenType();
            if (tokenTypeAxis == parsing::IfcTokenType::REF)
            {
                _loader.StepBack();
                vector = GetCartesianPoint3D(_loader.GetRefArgument());
            }
            result = GetLocalPlacement(posID, vector);
        }

        _expressIDToPlacement[expressID] = result;
        return result;
      }
      case schema::IFCLINEARPLACEMENT:
      {
        _loader.MoveToArgumentOffset(expressID, 1);
        uint32_t posID = _loader.GetRefArgument();
        glm::dmat4 result = GetLocalPlacement(posID);

        _expressIDToPlacement[expressID] = result;
        return result;
      }
      default:
        spdlog::error("[GetLocalPlacement()] unexpected placement type {}", expressID, lineType);
        break;
      }

      return glm::dmat4(1);
    }
  }

  std::array<glm::dvec3, 2> IfcGeometryLoader::GetAxis1Placement(const uint32_t expressID) const
  {
    spdlog::debug("[GetAxis1Placement({})]", expressID);
    _loader.MoveToArgumentOffset(expressID, 0);
    uint32_t locationID = _loader.GetRefArgument();
    parsing::IfcTokenType dirToken = _loader.GetTokenType();

    glm::dvec3 axis = glm::dvec3(0, 0, 1);
    if (dirToken == parsing::IfcTokenType::REF)
    {
      _loader.StepBack();
      axis = GetCartesianPoint3D(_loader.GetRefArgument());
    }

    glm::dvec3 pos = GetCartesianPoint3D(locationID);

    return {axis, pos};
  }

  std::unordered_map<uint32_t, std::vector<uint32_t>> IfcGeometryLoader::PopulateRelVoidsMap()
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

  std::unordered_map<uint32_t, std::vector<uint32_t>> IfcGeometryLoader::PopulateRelAggregatesMap()
  {
    std::unordered_map<uint32_t, std::vector<uint32_t>> resultVector;
    auto relAggregates = _loader.GetExpressIDsWithType(schema::IFCRELAGGREGATES);

    for (uint32_t relAggregateID : relAggregates)
    {
      _loader.MoveToArgumentOffset(relAggregateID, 4);

      uint32_t relatingBuildingElement = _loader.GetRefArgument();
      auto aggregates = _loader.GetSetArgument();
      auto lineType2 = _loader.GetLineType(relatingBuildingElement);
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

  std::unordered_map<uint32_t, std::vector<uint32_t>> IfcGeometryLoader::PopulateRelNestsMap()
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

  std::unordered_map<uint32_t, std::vector<std::pair<uint32_t, uint32_t>>> IfcGeometryLoader::PopulateStyledItemMap()
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

  std::unordered_map<uint32_t, std::vector<std::pair<uint32_t, uint32_t>>> IfcGeometryLoader::PopulateRelMaterialsMap()
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

  std::unordered_map<uint32_t, std::vector<std::pair<uint32_t, uint32_t>>> IfcGeometryLoader::PopulateMaterialDefinitionsMap()
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

  void IfcGeometryLoader::ReadLinearScalingFactor()
  {
    auto projects = _loader.GetExpressIDsWithType(schema::IFCPROJECT);

    if (projects.size() != 1)
    {
      spdlog::error("[ReadLinearScalingFactor()] unexpected empty ifc project");
      return;
    }

    auto projectEID = projects[0];
    _loader.MoveToArgumentOffset(projectEID, 8);

    auto unitsID = _loader.GetRefArgument();
    _loader.MoveToArgumentOffset(unitsID, 0);

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

  double IfcGeometryLoader::ConvertPrefix(const std::string_view &prefix)
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

  const std::unordered_map<uint32_t, std::vector<uint32_t>> &IfcGeometryLoader::GetRelVoids() const
  {
    return _relVoids;
  }

  const std::unordered_map<uint32_t, std::vector<std::pair<uint32_t, uint32_t>>> &IfcGeometryLoader::GetStyledItems() const
  {
    return _styledItems;
  }

  const std::unordered_map<uint32_t, std::vector<std::pair<uint32_t, uint32_t>>> &IfcGeometryLoader::GetRelMaterials() const
  {
    return _relMaterials;
  }

  const std::unordered_map<uint32_t, std::vector<std::pair<uint32_t, uint32_t>>> &IfcGeometryLoader::GetMaterialDefinitions() const
  {
    return _materialDefinitions;
  }

  double IfcGeometryLoader::GetLinearScalingFactor() const
  {
    return _linearScalingFactor;
  }

  std::string IfcGeometryLoader::GetAngleUnits() const
  {
    return _angleUnits;
  }

  double IfcGeometryLoader::ReadLenghtMeasure() const
  {
    parsing::IfcTokenType t = _loader.GetTokenType();
    if (t == parsing::IfcTokenType::LABEL)
    {
      _loader.StepBack();
      std::string_view LengthMeasureLabel = _loader.GetStringArgument();
      if (LengthMeasureLabel == "IFCNONNEGATIVELENGTHMEASURE")
      {
        _loader.GetTokenType();
        return _loader.GetDoubleArgument();
      }
      if (LengthMeasureLabel == "IFCLENGTHMEASURE")
      {
        _loader.GetTokenType();
        return _loader.GetDoubleArgument();
      }
      spdlog::warn("[ReadLenghtMeasure()] Unrecognised type {}", LengthMeasureLabel);
    }
    return 0.0;
  }

  void IfcGeometryLoader::ReadCurveMeasureSelect(IfcTrimmingSelect& trim) const
  {
      // TYPE IfcCurveMeasureSelect = SELECT(IfcLengthMeasure, IfcParameterValue);
      parsing::IfcTokenType t = _loader.GetTokenType();
      if (t == parsing::IfcTokenType::LABEL)
      {
          _loader.StepBack();
          std::string_view CurveMeasureLabel = _loader.GetStringArgument();
          if (CurveMeasureLabel == "IFCPARAMETERVALUE")
          {
              _loader.GetTokenType();
              trim.trimType = TRIM_BY_PARAMETER;
              trim.value = _loader.GetDoubleArgument();
          }
          else if (CurveMeasureLabel == "IFCLENGTHMEASURE")
          {
              _loader.GetTokenType();
              trim.trimType = TRIM_BY_LENGTH;
              trim.value = _loader.GetDoubleArgument();
          }
          else {
              spdlog::warn("[ReadCurveMeasureSelect()] Unrecognised type {}", CurveMeasureLabel);
          }
      }
  }

  std::vector<IfcSegmentIndexSelect> IfcGeometryLoader::ReadCurveIndices() const
  {
    std::vector<IfcSegmentIndexSelect> result;

    parsing::IfcTokenType t = _loader.GetTokenType();
    // If you receive a reference then go to the reference
    if (t == parsing::IfcTokenType::REF)
    {
      _loader.StepBack();
      _loader.MoveToArgumentOffset(_loader.GetRefArgument(), 0);
    }

    _loader.StepBack();
    while (_loader.GetTokenType() != parsing::IfcTokenType::SET_END)
    {
      _loader.StepBack();
      if (_loader.GetTokenType() == parsing::IfcTokenType::LABEL)
      {
        IfcSegmentIndexSelect segment;
        _loader.StepBack();
        segment.type = _loader.GetStringArgument();
        while (_loader.GetTokenType() != parsing::IfcTokenType::SET_END)
        {
          _loader.StepBack();
          while (_loader.GetTokenType() != parsing::IfcTokenType::SET_END)
          {
            _loader.StepBack();
            t = _loader.GetTokenType();
            // If you receive a real then add the real to the list
            if (t == parsing::IfcTokenType::INTEGER)
            {
              _loader.StepBack();
              segment.indexs.push_back(static_cast<uint32_t>(_loader.GetIntArgument()));
            }
          }
        }
        result.push_back(segment);
      }
    }

    return result;
  }

  IfcGeometryLoader *IfcGeometryLoader::Clone(const webifc::parsing::IfcLoader &newLoader) const
  {
    IfcGeometryLoader *newGeomLoader = new IfcGeometryLoader(newLoader, _schemaManager, _relVoids, _relNests, _relAggregates, _styledItems, _relMaterials, _materialDefinitions, _linearScalingFactor, _squaredScalingFactor, _cubicScalingFactor, _angularScalingFactor, _angleUnits, _circleSegments, _localCurvesList, _localcurvesIndices, _expressIDToPlacement);
    return newGeomLoader;
  }

  IfcGeometryLoader::IfcGeometryLoader(const webifc::parsing::IfcLoader &loader, const webifc::schema::IfcSchemaManager &schemaManager, const std::unordered_map<uint32_t, std::vector<uint32_t>> &relVoids, const std::unordered_map<uint32_t, std::vector<uint32_t>> &relNests, const std::unordered_map<uint32_t, std::vector<uint32_t>> &relAggregates, const std::unordered_map<uint32_t, std::vector<std::pair<uint32_t, uint32_t>>> &styledItems, const std::unordered_map<uint32_t, std::vector<std::pair<uint32_t, uint32_t>>> &relMaterials, const std::unordered_map<uint32_t, std::vector<std::pair<uint32_t, uint32_t>>> &materialDefinitions, double linearScalingFactor, double squaredScalingFactor, double cubicScalingFactor, double angularScalingFactor, std::string angleUnits, uint16_t circleSegments, std::vector<IfcCurve> &localCurvesList, std::vector<uint32_t> &localcurvesIndices, std::unordered_map<uint32_t, glm::dmat4> expressIDToPlacement)
      : _loader(loader), _schemaManager(schemaManager), _relVoids(relVoids), _relNests(relNests), _relAggregates(relAggregates), _styledItems(styledItems), _relMaterials(relMaterials), _materialDefinitions(materialDefinitions), _linearScalingFactor(linearScalingFactor), _squaredScalingFactor(squaredScalingFactor), _cubicScalingFactor(cubicScalingFactor), _angularScalingFactor(angularScalingFactor), _angleUnits(angleUnits), _circleSegments(circleSegments), _localCurvesList(localCurvesList), _localcurvesIndices(localcurvesIndices), _expressIDToPlacement(expressIDToPlacement)
  {
  }

}
