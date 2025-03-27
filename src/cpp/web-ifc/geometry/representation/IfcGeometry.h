/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.  */

// Represents a single piece of IFC Geometry

#pragma once

#include <vector>
#include <string>
#include <cstdint>
#include <glm/glm.hpp>
#include "../operations/boolean-utils/geometry.h"

#include "geometry.h"

namespace webifc::geometry {

	constexpr int VERTEX_FORMAT_SIZE_FLOATS = 6;

    struct Plane
    {
		size_t id;
        double distance;
        Vec normal;

		bool IsEqualTo(const Vec &n, double d) const;
	};

	struct Face
	{
		int pId;
		int i0;
		int i1;
		int i2;
	};

    struct AABB
    {
        uint32_t index;
        Vec min = Vec(DBL_MAX, DBL_MAX, DBL_MAX);
        Vec max = Vec(-DBL_MAX, -DBL_MAX, -DBL_MAX);
        Vec center = Vec();

        bool intersects(const AABB& other) const;
        bool contains(const Vec& pos) const;
        void merge(const AABB& other);
        void merge(const glm::dvec3& other);
        bool Intersect(const Vec& origin, const Vec& dir) const;
    };

	struct Geometry
	{
		std::vector<float> fvertexData;
		std::vector<double> vertexData;
		std::vector<uint32_t> indexData;
		std::vector<uint32_t> planeData;
		std::vector<Plane> planes;
		
		bool isPolygon = false;
		bool hasPlanes = false;
		uint32_t numPoints = 0;
		uint32_t numFaces = 0;

		void BuildFromVectors(std::vector<double>& d, std::vector<uint32_t>& i);
		void AddPoint(glm::dvec4& pt, glm::dvec3& n);
		AABB GetAABB() const;
		void AddPoint(glm::dvec3& pt, glm::dvec3& n);
		void AddFace(glm::dvec3 a, glm::dvec3 b, glm::dvec3 c, uint32_t pId = -1);
		void AddFace(uint32_t a, uint32_t b, uint32_t c, uint32_t pId = -1);
		size_t AddPlane(const glm::dvec3 &normal, double d);
		void buildPlanes();
		Face GetFace(size_t index) const;
		AABB GetFaceBox(size_t index) const;
		Vec GetPoint(size_t index) const;
		void GetCenterExtents(glm::dvec3& center, glm::dvec3& extents) const;
		Geometry Normalize(glm::dvec3 center, glm::dvec3 extents) const;
		Geometry DeNormalize(glm::dvec3 center, glm::dvec3 extents) const;
		bool IsEmpty();
		double Volume(const glm::dmat4& trans = glm::dmat4(1));
	};

	struct IfcGeometry : Geometry
	{
		bool halfSpace = false;
		std::vector<IfcGeometry>  part;
		Vec halfSpaceX = Vec(1, 0, 0);
		Vec halfSpaceY = Vec(0, 1, 0);
		Vec halfSpaceZ = Vec(0, 0, 1);
		Vec halfSpaceOrigin = Vec(0, 0, 0);
		Vec normalizationCenter = Vec(0, 0, 0);
		void ReverseFaces();
		uint32_t GetVertexData();
		void AddPart(IfcGeometry geom);
		void AddPart(Geometry geom);
		void AddGeometry(Geometry geom, glm::dmat4 trans = glm::dmat4(1), double scx = 1, double scy = 1, double scz = 1, glm::dvec3 origin = glm::dvec3(0, 0, 0));
		void MergeGeometry(Geometry geom);
		uint32_t GetVertexDataSize();
		uint32_t GetIndexData();
		uint32_t GetIndexDataSize();
		SweptDiskSolid GetSweptDiskSolid();
		glm::dmat4 Normalize();
		SweptDiskSolid sweptDiskSolid;
		private:
			void ReverseFace(uint32_t index);
			bool normalized = false;

	};

}