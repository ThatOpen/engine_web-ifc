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

  class booleanManager
  {
    public:
      IfcGeometry BoolProcess(const std::vector<IfcGeometry> &firstGeoms, std::vector<IfcGeometry> &secondGeoms, std::string op);
    private:
      fuzzybools::Geometry convertToEngine(Geometry geom);
      IfcGeometry convertToWebIfc(fuzzybools::Geometry geom);
      IfcGeometry Union(IfcGeometry firstOperator, IfcGeometry secondOperator);
      IfcGeometry Subtract(IfcGeometry firstOperator, IfcGeometry secondOperator);
  };

  class IfcGeometryProcessor 
  {
      public:
        IfcGeometryProcessor(const webifc::parsing::IfcLoader &loader,const webifc::schema::IfcSchemaManager &schemaManager,uint16_t circleSegments,bool coordinateToOrigin);
        IfcGeometry &GetGeometry(uint32_t expressID);
        IfcGeometryLoader GetLoader() const;
        IfcFlatMesh GetFlatMesh(uint32_t expressID);
        IfcComposedMesh GetMesh(uint32_t expressID);
        void SetTransformation(const std::array<double, 16> &val);
        std::array<double, 16> GetFlatCoordinationMatrix() const;
        glm::dmat4 GetCoordinationMatrix() const;
        void Clear();
        
        private:
        std::optional<glm::dvec4> GetStyleItemFromExpressId(uint32_t expressID);
        void AddFaceToGeometry(uint32_t expressID, IfcGeometry &geometry);
        IfcGeometry GetBrep(uint32_t expressID);
        IfcGeometry BoolProcess(const std::vector<IfcGeometry> &firstGroups, std::vector<IfcGeometry> &secondGroups, std::string op);
        std::unordered_map<uint32_t, IfcGeometry> _expressIDToGeometry;
        IfcSurface GetSurface(uint32_t expressID);
        const IfcGeometryLoader _geometryLoader;
        glm::dmat4 _transformation = glm::dmat4(1.0);
        const parsing::IfcLoader &_loader;
        booleanManager boolEngine;
        const schema::IfcSchemaManager &_schemaManager;
        bool _isCoordinated = false;
        bool _coordinateToOrigin;
        bool _optimize_profiles;
        uint32_t expressIdCyl = 0;
        uint32_t expressIdRect = 0;
        uint16_t _circleSegments;
        glm::dmat4 _coordinationMatrix = glm::dmat4(1.0);
        void AddComposedMeshToFlatMesh(IfcFlatMesh &flatMesh, const IfcComposedMesh &composedMesh, const glm::dmat4 &parentMatrix = glm::dmat4(1), const glm::dvec4 &color = glm::dvec4(1, 1, 1, 1), bool hasColor = false);
        std::vector<uint32_t> Read2DArrayOfThreeIndices();
        void ReadIndexedPolygonalFace(uint32_t expressID, std::vector<IfcBound3D> &bounds, const std::vector<glm::dvec3> &points);
        IfcGeometry predefinedCylinder;
        IfcGeometry predefinedCube;
  };
}