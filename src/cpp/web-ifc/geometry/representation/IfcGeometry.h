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
#include "../operations/bim-geometry/aabb.h"
#include "../operations/bim-geometry/face.h"
#include "../operations/bim-geometry/geometry.h"
#include "../operations/bim-geometry/utils.h"

#include "geometry.h"

namespace webifc::geometry {

	constexpr int VERTEX_FORMAT_SIZE_FLOATS = bimGeometry::VERTEX_FORMAT_SIZE_FLOATS;

    struct Plane : bimGeometry::Plane
    {
		
	};

    struct AABB : bimGeometry::AABB
    {

    };

	struct Geometry : bimGeometry::Geometry
	{
		bool isPolygon = false;

		void BuildFromVectors(std::vector<double>& d, std::vector<uint32_t>& i);
		AABB GetFaceBox(size_t index) const;
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
		void AddPart(IfcGeometry geom);
		void AddPart(Geometry geom);
		void AddGeometry(Geometry geom, glm::dmat4 trans = glm::dmat4(1), double scx = 1, double scy = 1, double scz = 1, glm::dvec3 origin = glm::dvec3(0, 0, 0));
		void MergeGeometry(Geometry geom);
		uintptr_t GetVertexData();
		uint32_t GetVertexDataSize();
		uintptr_t GetIndexData();
		uint32_t GetIndexDataSize();
		SweptDiskSolid GetSweptDiskSolid();
		glm::dmat4 Normalize();
		SweptDiskSolid sweptDiskSolid;
		private:
			void ReverseFace(uint32_t index);
			bool normalized = false;

	};

}