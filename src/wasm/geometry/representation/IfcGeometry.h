/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.  */

// Represents a single piece of IFC Geometry

#pragma once

#include <vector>
#include <string>
#include <glm/glm.hpp>

#include "geometry.h"

namespace webifc::geometry {

	struct IfcGeometry
	{
		std::vector<IfcGeometry> components;
		std::vector<float> fvertexData;
		std::vector<double> vertexData;
		std::vector<uint32_t> indexData;
		glm::dvec3 min = glm::dvec3(DBL_MAX, DBL_MAX, DBL_MAX);
		glm::dvec3 max = glm::dvec3(-DBL_MAX, -DBL_MAX, -DBL_MAX);
		bool normalized = false;

		uint32_t numPoints = 0;
		uint32_t numFaces = 0;

		glm::dvec3 GetExtent() const;	
		void Normalize();
		void AddComponent(IfcGeometry &g);
		void AddPoint(glm::dvec4 &pt, glm::dvec3 &n);
		void AddPoint(glm::dvec3 &pt, glm::dvec3 &n);
		void AddFace(glm::dvec3 a, glm::dvec3 b, glm::dvec3 c);
		void AddFace(uint32_t a, uint32_t b, uint32_t c);
		void ReverseFace(uint32_t index);
		void ReverseFaces();
		Face GetFace(uint32_t index) const;
		glm::dvec3 GetPoint(uint32_t index) const;
		void GetCenterExtents(glm::dvec3 &center, glm::dvec3 &extents) const;
		IfcGeometry Normalize(glm::dvec3 center, glm::dvec3 extents) const;
		IfcGeometry DeNormalize(glm::dvec3 center, glm::dvec3 extents) const;
		uint32_t GetVertexData();
		void AddGeometry(IfcGeometry geom);
		uint32_t GetVertexDataSize();
		uint32_t GetIndexData();
		uint32_t GetIndexDataSize();

		private:
			bool computeSafeNormal(const glm::dvec3 v1, const glm::dvec3 v2, const glm::dvec3 v3, glm::dvec3 &normal, double eps);
	};

}