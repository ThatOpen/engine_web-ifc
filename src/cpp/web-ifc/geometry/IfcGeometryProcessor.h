/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

#pragma once

#include <glm/glm.hpp>
#include <string>
#include <cstdint>
#include "representation/geometry.h"
#include "../parsing/IfcLoader.h"
#include "../schema/IfcSchemaManager.h"
#include "IfcGeometryLoader.h"

namespace fuzzybools
{
  struct Geometry;
}

namespace webifc::geometry
{

  // this class performs the processing of raw geometry data from the geometry loader to produce meshes

  struct IfcGeometrySettings
  {
    bool _coordinateToOrigin = false;
    bool _optimize_profiles = true;
    bool _exportPolylines = false;
    uint16_t _circleSegments = 12;
    double TOLERANCE_PLANE_INTERSECTION = 1.0E-04;
    double TOLERANCE_PLANE_DEVIATION = 1.0E-04;
    double TOLERANCE_BACK_DEVIATION_DISTANCE = 1.0E-04;
    double TOLERANCE_INSIDE_OUTSIDE_PERIMETER = 1.0E-10;
    double TOLERANCE_BOUNDING_BOX = 1.0E-02;
    uint16_t _BOOLEAN_UNION_THRESHOLD = 150;
  };

  class booleanManager
  {
  public:
    IfcGeometry BoolProcess(const std::vector<IfcGeometry> &firstGeoms, std::vector<IfcGeometry> &secondGeoms, std::string op, IfcGeometrySettings _settings);

  private:
    fuzzybools::Geometry convertToEngine(Geometry geom);
    IfcGeometry convertToWebIfc(fuzzybools::Geometry geom);
    IfcGeometry Union(IfcGeometry firstOperator, IfcGeometry secondOperator);
    IfcGeometry Subtract(IfcGeometry firstOperator, IfcGeometry secondOperator);
  };

  class IfcGeometryProcessor
  {
  public:
    IfcGeometryProcessor(webifc::parsing::IfcLoader &loader, const webifc::schema::IfcSchemaManager &schemaManager, uint16_t circleSegments, bool coordinateToOrigin, double TOLERANCE_PLANE_INTERSECTION, double TOLERANCE_PLANE_DEVIATION, double TOLERANCE_BACK_DEVIATION_DISTANCE, double TOLERANCE_INSIDE_OUTSIDE_PERIMETER, double TOLERANCE_SCALAR_EQUALITY, double PLANE_REFIT_ITERATIONS, double BOOLEAN_UNION_THRESHOLD);
    IfcGeometry &GetGeometry(uint32_t expressID);
    IfcGeometryLoader& GetLoader();
    IfcFlatMesh GetFlatMesh(uint32_t expressID, bool applyLinearScalingFactor = true);
    IfcComposedMesh GetMesh(uint32_t expressID);
    void SetTransformation(const std::array<double, 16> &val);
    std::array<double, 16> GetFlatCoordinationMatrix() const;
    glm::dmat4 GetCoordinationMatrix() const;
    void Clear();
    IfcGeometryProcessor *Clone(const webifc::parsing::IfcLoader &loader) const;

  protected:
    IfcGeometryProcessor(const IfcGeometrySettings &settings, std::unordered_map<uint32_t, IfcGeometry> expressIDToGeometry, const IfcGeometryLoader &geometryLoader, glm::dmat4 transformation, const parsing::IfcLoader &loader, booleanManager boolEngine, const schema::IfcSchemaManager &schemaManager, bool isCoordinated, uint32_t expressIdCyl, uint32_t expressIdRect, glm::dmat4 coordinationMatrix, IfcGeometry predefinedCylinder, IfcGeometry predefinedCube);
    IfcGeometrySettings _settings;
    std::optional<glm::dvec4> GetStyleItemFromExpressId(uint32_t expressID);
    void AddFaceToGeometry(uint32_t expressID, IfcGeometry &geometry);
    IfcGeometry GetBrep(uint32_t expressID);
    IfcGeometry BoolProcess(const std::vector<IfcGeometry> &firstGroups, std::vector<IfcGeometry> &secondGroups, std::string op, IfcGeometrySettings _settings);
    std::unordered_map<uint32_t, IfcGeometry> _expressIDToGeometry;
    IfcSurface GetSurface(uint32_t expressID);
    IfcGeometryLoader _geometryLoader;
    glm::dmat4 _transformation = glm::dmat4(1.0);
    const parsing::IfcLoader &_loader;
    booleanManager _boolEngine;
    const schema::IfcSchemaManager &_schemaManager;
    bool _isCoordinated = false;
    uint32_t _expressIdCyl = 0;
    uint32_t _expressIdRect = 0;
    glm::dmat4 _coordinationMatrix = glm::dmat4(1.0);
    void AddComposedMeshToFlatMesh(IfcFlatMesh &flatMesh, const IfcComposedMesh &composedMesh, const glm::dmat4 &parentMatrix = glm::dmat4(1), const glm::dvec4 &color = glm::dvec4(1, 1, 1, 1), bool hasColor = false);
    std::vector<uint32_t> Read2DArrayOfThreeIndices();
    void ReadIndexedPolygonalFace(uint32_t expressID, std::vector<IfcBound3D> &bounds, const std::vector<glm::dvec3> &points);
    void ApplyBooleanToMeshChildren(IfcComposedMesh &composedMesh, std::vector<IfcGeometry> &secondGroups, std::string op, IfcGeometrySettings _settings, glm::dmat4 mat);
    IfcGeometry _predefinedCylinder;
    IfcGeometry _predefinedCube;
  };
}