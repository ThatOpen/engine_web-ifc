#pragma once

#include <vector>
#include <glm/glm.hpp>

#include "math.h"
#include "aabb.h"

namespace fuzzybools
{
	constexpr int VERTEX_FORMAT_SIZE_FLOATS = 6;

	struct Face
	{
		int i0;
		int i1;
		int i2;
	};

	struct Geometry
	{
		std::vector<float> fvertexData;
		std::vector<double> vertexData;
		std::vector<uint32_t> indexData;

		uint32_t numPoints = 0;
		uint32_t numFaces = 0;

		void BuildFromVectors(std::vector<double>& d, std::vector<uint32_t>& i)
		{
			vertexData = d;
			indexData = i;

			numPoints = indexData.size();
			numFaces = indexData.size() / 3;
		}

		inline void AddPoint(glm::dvec4& pt, glm::dvec3& n)
		{
			glm::dvec3 p = pt;
			AddPoint(p, n);
		}

		AABB GetAABB() const
		{
			AABB aabb;

			for (uint32_t i = 0; i < numPoints; i++)
			{
				aabb.min = glm::min(aabb.min, GetPoint(i));
				aabb.max = glm::max(aabb.max, GetPoint(i));
			}

			return aabb;
		}

		inline void AddPoint(glm::dvec3& pt, glm::dvec3& n)
		{
			//vertexData.reserve((numPoints + 1) * VERTEX_FORMAT_SIZE_FLOATS);
			//vertexData[numPoints * VERTEX_FORMAT_SIZE_FLOATS + 0] = pt.x;
			//vertexData[numPoints * VERTEX_FORMAT_SIZE_FLOATS + 1] = pt.y;
			//vertexData[numPoints * VERTEX_FORMAT_SIZE_FLOATS + 2] = pt.z;
			vertexData.push_back(pt.x);
			vertexData.push_back(pt.y);
			vertexData.push_back(pt.z);

			vertexData.push_back(n.x);
			vertexData.push_back(n.y);
			vertexData.push_back(n.z);

			if (std::isnan(pt.x) || std::isnan(pt.y) || std::isnan(pt.z))
			{
				if (messages) { printf("NaN in geom!\n"); }
			}

			if (std::isnan(n.x) || std::isnan(n.y) || std::isnan(n.z))
			{
				if (messages) { printf("NaN in geom!\n"); }
			}

			//vertexData[numPoints * VERTEX_FORMAT_SIZE_FLOATS + 3] = n.x;
			//vertexData[numPoints * VERTEX_FORMAT_SIZE_FLOATS + 4] = n.y;
			//vertexData[numPoints * VERTEX_FORMAT_SIZE_FLOATS + 5] = n.z;

			numPoints += 1;
		}

		inline void AddFace(glm::dvec3 a, glm::dvec3 b, glm::dvec3 c)
		{
			glm::dvec3 normal;

			double area = areaOfTriangle(a, b, c);
//			if (!computeSafeNormal(a, b, c, normal, EPS_SMALL))
			if (!computeSafeNormal(a, b, c, normal, toleranceAddFace))
			{
				// bail out, zero area triangle
				if (messages) { printf("zero triangle, AddFace(vec, vec, vec)\n"); }
				return;
			}

			AddPoint(a, normal);
			AddPoint(b, normal);
			AddPoint(c, normal);

			AddFace(numPoints - 3, numPoints - 2, numPoints - 1);
		}

		inline void AddFace(uint32_t a, uint32_t b, uint32_t c)
		{
//			indexData.reserve((numFaces + 1) * 3);
//			indexData[numFaces * 3 + 0] = a;
//			indexData[numFaces * 3 + 1] = b;
//			indexData[numFaces * 3 + 2] = c;
			indexData.push_back(a);
			indexData.push_back(b);
			indexData.push_back(c);

			double area = areaOfTriangle(GetPoint(a), GetPoint(b), GetPoint(c));

			glm::dvec3 normal;
//			if (!computeSafeNormal(GetPoint(a), GetPoint(b), GetPoint(c), normal, EPS_SMALL))
			if (!computeSafeNormal(GetPoint(a), GetPoint(b), GetPoint(c), normal, toleranceAddFace))
			{
				// bail out, zero area triangle
				if (messages) { printf("zero triangle, AddFace(int, int, int)\n"); }
			}

			numFaces++;
		}

		inline Face GetFace(size_t index) const
		{
			Face f;
			f.i0 = indexData[index * 3 + 0];
			f.i1 = indexData[index * 3 + 1];
			f.i2 = indexData[index * 3 + 2];
			return f;
		}

		inline AABB GetFaceBox(size_t index) const
		{
			AABB aabb;
			aabb.index = static_cast<uint32_t>(index);

			glm::dvec3 a = GetPoint(indexData[index * 3 + 0]);
			glm::dvec3 b = GetPoint(indexData[index * 3 + 1]);
			glm::dvec3 c = GetPoint(indexData[index * 3 + 2]);

			aabb.min = glm::min(a, aabb.min);
			aabb.min = glm::min(b, aabb.min);
			aabb.min = glm::min(c, aabb.min);

			aabb.max = glm::max(a, aabb.max);
			aabb.max = glm::max(b, aabb.max);
			aabb.max = glm::max(c, aabb.max);

			aabb.center = (aabb.max + aabb.min) / 2.0;

			return aabb;
		}

		inline glm::dvec3 GetPoint(size_t index) const
		{
			return glm::dvec3(
				vertexData[index * VERTEX_FORMAT_SIZE_FLOATS + 0],
				vertexData[index * VERTEX_FORMAT_SIZE_FLOATS + 1],
				vertexData[index * VERTEX_FORMAT_SIZE_FLOATS + 2]
			);
		}

		void GetCenterExtents(glm::dvec3& center, glm::dvec3& extents) const
		{
			glm::dvec3 min(DBL_MAX, DBL_MAX, DBL_MAX);
			glm::dvec3 max(DBL_MIN, DBL_MIN, DBL_MIN);

			for (size_t i = 0; i < numPoints; i++)
			{
				auto pt = GetPoint(i);
				min = glm::min(min, pt);
				max = glm::max(max, pt);
			}

			extents = (max - min);
			center = min + extents / 2.0;
		}

		Geometry Normalize(glm::dvec3 center, glm::dvec3 extents) const
		{
			Geometry newGeom;

			double scale = std::max(extents.x, std::max(extents.y, extents.z)) / 10.0;

			for (size_t i = 0; i < numFaces; i++)
			{
				auto face = GetFace(i);
				auto pa = GetPoint(face.i0);
				auto pb = GetPoint(face.i1);
				auto pc = GetPoint(face.i2);

				auto a = (pa - center) / scale;
				auto b = (pb - center) / scale;
				auto c = (pc - center) / scale;

				// std::cout << areaOfTriangle(pa, pb, pc) << std::endl;

				newGeom.AddFace(pa, pb, pc);
			}


			return newGeom;
		}

		Geometry DeNormalize(glm::dvec3 center, glm::dvec3 extents) const
		{
			Geometry newGeom;

			double scale = std::max(extents.x, std::max(extents.y, extents.z)) / 10.0;

			for (size_t i = 0; i < numFaces; i++)
			{
				auto face = GetFace(i);
				auto pa = GetPoint(face.i0);
				auto pb = GetPoint(face.i1);
				auto pc = GetPoint(face.i2);

				// std::cout << areaOfTriangle(pa, pb, pc) << std::endl;

				auto a = pa * scale + center;
				auto b = pb * scale + center;
				auto c = pc * scale + center;

				newGeom.AddFace(a, b, c);
			}


			return newGeom;
		}
		
		bool IsEmpty()
		{
			return vertexData.empty();
		}

		double Volume(const glm::dmat4& trans = glm::dmat4(1))
		{
			double totalVolume = 0;

			for (uint32_t i = 0; i < numFaces; i++)
			{
				Face f = GetFace(i);

				glm::dvec3 a = trans * glm::dvec4(GetPoint(f.i0), 1);
				glm::dvec3 b = trans * glm::dvec4(GetPoint(f.i1), 1);
				glm::dvec3 c = trans * glm::dvec4(GetPoint(f.i2), 1);

				glm::dvec3 norm;

//				if (computeSafeNormal(a, b, c, norm))
				if (computeSafeNormal(a, b, c, norm, EPS_SMALL))
				{
					double area = areaOfTriangle(a, b, c);
					double height = glm::dot(norm, a);

					double tetraVolume = area * height / 3;

					totalVolume += tetraVolume;
				}
			}

			return totalVolume;
		}
	};
}
