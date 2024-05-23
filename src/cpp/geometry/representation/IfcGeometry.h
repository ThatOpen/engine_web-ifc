/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.  */

// Represents a single piece of IFC Geometry

#pragma once

#include <vector>
#include <string>
#include <cstdint>
#include <glm/glm.hpp>
#include <fuzzy/geometry.h>

#include "geometry.h"

namespace webifc::geometry {

	struct IfcGeometry : fuzzybools::Geometry
	{
		bool halfSpace = false;
		std::vector<IfcGeometry>  part;
		glm::dvec3 halfSpaceX = glm::dvec3(1, 0, 0);
		glm::dvec3 halfSpaceY = glm::dvec3(0, 1, 0);
		glm::dvec3 halfSpaceZ = glm::dvec3(0, 0, 1);
		glm::dvec3 halfSpaceOrigin = glm::dvec3(0, 0, 0);
		glm::dvec3 normalizationCenter = glm::dvec3(0, 0, 0);
		void ReverseFaces();
		uint32_t GetVertexData();
		void AddPart(IfcGeometry geom);
		void AddPart(fuzzybools::Geometry geom);
		void AddGeometry(fuzzybools::Geometry geom, glm::dmat4 trans = glm::dmat4(1), double scx = 1, double scy = 1, double scz = 1, glm::dvec3 origin = glm::dvec3(0, 0, 0));
		void MergeGeometry(fuzzybools::Geometry geom);
		uint32_t GetVertexDataSize();
		uint32_t GetIndexData();
		uint32_t GetIndexDataSize();
		glm::dmat4 Normalize();
		private:
			void ReverseFace(uint32_t index);
			bool normalized = false;

	};

}