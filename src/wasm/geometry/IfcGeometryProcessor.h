/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
 
#pragma once
 
#include <glm/glm.hpp>
#include <string>
#include "representation/geometry.h"
#include "../parsing/IfcLoader.h"
#include "../utility/LoaderError.h"
#include "../schema/IfcSchemaManager.h"
#include "IfcGeometryLoader.h"

namespace fuzzybools
{
  struct Geometry;
}

namespace webifc::geometry
{

  // this class performs the processing of raw geometry data from the geometry loader to produce meshes

  class IfcGeometryProcessor 
  {
      public:
        IfcGeometryProcessor(const webifc::parsing::IfcLoader &loader, webifc::utility::LoaderErrorHandler &errorHandler,const webifc::schema::IfcSchemaManager &schemaManager,uint16_t circleSegments,bool coordinateToOrigin, bool optimizeprofiles);
        IfcGeometry &GetGeometry(uint32_t expressID);
        IfcGeometryLoader GetLoader() const;
        IfcFlatMesh GetFlatMesh(uint32_t expressID);
        IfcComposedMesh GetMesh(uint32_t expressID);
        void SetTransformation(const glm::dmat4 &val);
        glm::dmat4 GetCoordinationMatrix();
        void Clear();
        
      private:
        void AddFaceToGeometry(uint32_t expressID, IfcGeometry &geometry);
        IfcGeometry GetBrep(uint32_t expressID);
        IfcGeometry BoolSubtract(const std::vector<IfcGeometry> &firstGroups, std::vector<IfcGeometry> &secondGroups);
        std::unordered_map<uint32_t, IfcGeometry> _expressIDToGeometry;
        std::unordered_map<uint32_t, IfcComposedMesh> _expressIDToMesh;
        IfcSurface GetSurface(uint32_t expressID);
        const IfcGeometryLoader _geometryLoader;
        glm::dmat4 _transformation = glm::dmat4(1.0);
        const parsing::IfcLoader &_loader;
        utility::LoaderErrorHandler &_errorHandler;
        const schema::IfcSchemaManager &_schemaManager;
        bool _isCoordinated = false;
        bool _coordinateToOrigin;
        bool _optimize_profiles;
        uint16_t _circleSegments;
        glm::dmat4 _coordinationMatrix = glm::dmat4(1.0);
        void AddComposedMeshToFlatMesh(IfcFlatMesh &flatMesh, const IfcComposedMesh &composedMesh, const glm::dmat4 &parentMatrix = glm::dmat4(1), const glm::dvec4 &color = glm::dvec4(1, 1, 1, 1), bool hasColor = false);
        std::vector<uint32_t> Read2DArrayOfThreeIndices();
        void ReadIndexedPolygonalFace(uint32_t expressID, std::vector<IfcBound3D> &bounds, const std::vector<glm::dvec3> &points);
        IfcGeometry predefinedCylinder;
        IfcGeometry predefinedCube;
  };
  
}