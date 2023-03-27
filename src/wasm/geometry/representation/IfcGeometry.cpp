/* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at https://mozilla.org/MPL/2.0/.  */

// Implementation for IfcGeometry

#include "IfcGeometry.h"

namespace webifc::geometry {

	glm::dvec3 IfcGeometry::GetExtent() const
	{
		return max - min;
	}

   // set all vertices relative to min
	void IfcGeometry::Normalize()
	{
		for (size_t i = 0; i < vertexData.size(); i += 6)
		{
			vertexData[i + 0] = vertexData[i + 0] - min.x;
			vertexData[i + 1] = vertexData[i + 1] - min.y;
			vertexData[i + 2] = vertexData[i + 2] - min.z;
		}

		normalized = true;
	}

	void IfcGeometry::AddComponent(IfcGeometry &g)
	{
		components.push_back(g);
	}

	void IfcGeometry::AddPoint(glm::dvec4 &pt, glm::dvec3 &n)
	{
		glm::dvec3 p = pt;
		AddPoint(p, n);
	}

	// just follow the ifc spec, damn
	bool IfcGeometry::computeSafeNormal(const glm::dvec3 v1, const glm::dvec3 v2, const glm::dvec3 v3, glm::dvec3 &normal, double eps = 0)
	{
		glm::dvec3 v12(v2 - v1);
		glm::dvec3 v13(v3 - v1);

		glm::dvec3 norm = glm::cross(v12, v13);

		double len = glm::length(norm);

		if (len <= eps)
		{
			return false;
		}

		normal = norm / len;

		return true;
	}

	void IfcGeometry::AddPoint(glm::dvec3 &pt, glm::dvec3 &n)
	{
		auto const source = std::vector<double>{pt.x, pt.y, pt.z, n.x, n.y, n.z};
		vertexData.insert(vertexData.end(), source.begin(), source.end());
		

		min = glm::min(min, pt);
		max = glm::max(max, pt);


		if (std::isnan(pt.x) || std::isnan(pt.y) || std::isnan(pt.z))
		{
			printf("NaN in geom!\n");
		}

		if (std::isnan(n.x) || std::isnan(n.y) || std::isnan(n.z))
		{
			printf("NaN in geom!\n");
		}


		numPoints += 1;
	}

	void IfcGeometry::AddFace(glm::dvec3 a, glm::dvec3 b, glm::dvec3 c)
	{
		glm::dvec3 normal;
		if (!computeSafeNormal(a, b, c, normal))
		{
			// bail out, zero area triangle
			printf("zero tri\n");
			return;
		}

		AddFace(numPoints + 0, numPoints + 1, numPoints + 2);

		AddPoint(a, normal);
		AddPoint(b, normal);
		AddPoint(c, normal);
	}

	void IfcGeometry::AddFace(uint32_t a, uint32_t b, uint32_t c)
	{
		auto const source = std::vector<uint32_t>{a, b, c};
		indexData.insert(indexData.end(), source.begin(), source.end());

		numFaces++;
	}

	void IfcGeometry::ReverseFace(uint32_t index)
	{
			Face f = GetFace(index);
			indexData[index * 3 + 0] = f.i2;
			indexData[index * 3 + 1] = f.i1;
			indexData[index * 3 + 2] = f.i0;
	}

	void IfcGeometry::ReverseFaces()
	{
		for (size_t i = 0; i < numFaces; i++)
		{
			ReverseFace(i);
		}
	}

	Face IfcGeometry::GetFace(uint32_t index) const
	{
		Face f;
		f.i0 = indexData[index * 3 + 0];
		f.i1 = indexData[index * 3 + 1];
		f.i2 = indexData[index * 3 + 2];
		return f;
	}

	glm::dvec3 IfcGeometry::GetPoint(uint32_t index) const
	{
		return glm::dvec3(
			vertexData[index * VERTEX_FORMAT_SIZE_FLOATS + 0],
			vertexData[index * VERTEX_FORMAT_SIZE_FLOATS + 1],
			vertexData[index * VERTEX_FORMAT_SIZE_FLOATS + 2]);
	}

	void IfcGeometry::GetCenterExtents(glm::dvec3 &center, glm::dvec3 &extents) const
	{
		glm::dvec3 min = glm::dvec3(DBL_MAX, DBL_MAX, DBL_MAX);
		glm::dvec3 max = glm::dvec3(-DBL_MAX, -DBL_MAX, -DBL_MAX);

		for (size_t i = 0; i < numPoints; i++)
		{
			auto pt = GetPoint(i);
			min = glm::min(min, pt);
			max = glm::max(max, pt);
		}

		extents = (max - min);
		center = min + extents / 2.0;
	}

	IfcGeometry IfcGeometry::Normalize(glm::dvec3 center, glm::dvec3 extents) const
	{
		IfcGeometry newGeom;

		double scale = std::max(extents.x, std::max(extents.y, extents.z));

		for (size_t i = 0; i < numFaces; i++)
		{
			auto face = GetFace(i);
			auto a = (GetPoint(face.i0) - center) / scale;
			auto b = (GetPoint(face.i1) - center) / scale;
			auto c = (GetPoint(face.i2) - center) / scale;

			newGeom.AddFace(a, b, c);
		}

		return newGeom;
	}

	IfcGeometry IfcGeometry::DeNormalize(glm::dvec3 center, glm::dvec3 extents) const
	{
		IfcGeometry newGeom;

		double scale = std::max(extents.x, std::max(extents.y, extents.z));

		for (size_t i = 0; i < numFaces; i++)
		{
			auto face = GetFace(i);
			auto a = GetPoint(face.i0) * scale + center;
			auto b = GetPoint(face.i1) * scale + center;
			auto c = GetPoint(face.i2) * scale + center;

			newGeom.AddFace(a, b, c);
		}

		return newGeom;
	}

	uint32_t IfcGeometry::GetVertexData()
	{
		// unfortunately webgl can't do doubles
		if (fvertexData.size() != vertexData.size())
		{
			fvertexData.resize(vertexData.size());
			for (size_t i = 0; i < vertexData.size(); i += 6)
			{
				fvertexData[i + 0] = vertexData[i + 0];
				fvertexData[i + 1] = vertexData[i + 1];
				fvertexData[i + 2] = vertexData[i + 2];

				fvertexData[i + 3] = vertexData[i + 3];
				fvertexData[i + 4] = vertexData[i + 4];
				fvertexData[i + 5] = vertexData[i + 5];
			}

			// cleanup
			// vertexData = {};
		}

		if (fvertexData.empty())
		{
			return 0;
		}

		return (uint32_t)(size_t)&fvertexData[0];
	}

	void IfcGeometry::AddGeometry(IfcGeometry geom)
	{
		uint32_t maxIndex = numPoints;
		numPoints += geom.numPoints;
		min = glm::min(min, geom.min);
		max = glm::max(max, geom.max);
		vertexData.insert(vertexData.end(), geom.vertexData.begin(), geom.vertexData.end());
		for (uint32_t k = 0; k < geom.numFaces; k++)
		{
			AddFace(
				maxIndex + geom.indexData[k * 3 + 0],
				maxIndex + geom.indexData[k * 3 + 1],
				maxIndex + geom.indexData[k * 3 + 2]);
		}
	}

	uint32_t IfcGeometry::GetVertexDataSize()
	{
		return (uint32_t)fvertexData.size();
	}

	uint32_t IfcGeometry::GetIndexData()
	{
		return (uint32_t)(size_t)&indexData[0];
	}

	uint32_t IfcGeometry::GetIndexDataSize()
	{
		return (uint32_t)indexData.size();
	}

}