/* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at https://mozilla.org/MPL/2.0/.  */

// Implementation for IfcGeometry

#include "IfcGeometry.h"
#include "../operations/geometryutils.h"

namespace webifc::geometry {

        bool AABB::intersects(const AABB& other) const
        {
           double eps = EPS_BIG;
           return (max.x + eps >= other.min.x && other.max.x + eps >= min.x &&
                    max.y + eps >= other.min.y && other.max.y + eps >= min.y &&
                    max.z + eps >= other.min.z && other.max.z + eps >= min.z);
        }

        bool AABB::contains(const Vec& pos) const
        {
            double eps = EPS_BIG;
            return  pos.x + eps >= min.x && pos.x - eps <= max.x &&
                    pos.y + eps >= min.y && pos.y - eps <= max.y &&
                    pos.z + eps >= min.z && pos.z - eps <= max.z;
        }

        void AABB::merge(const AABB& other)
        {
            min = glm::min(min, other.min);
            max = glm::max(max, other.max);
        }

        void AABB::merge(const glm::dvec3& other)
        {
            min = glm::min(min, other);
            max = glm::max(max, other);
        }

        bool AABB::Intersect(const Vec& origin, const Vec& dir) const
        {
            // r.dir is unit direction vector of ray
            Vec dirfrac;
            dirfrac.x = 1.0 / dir.x;
            dirfrac.y = 1.0 / dir.y;
            dirfrac.z = 1.0 / dir.z;
            // lb is the corner of AABB with minimal coordinates - left bottom, rt is maximal corner
            // r.org is origin of ray
            double t1 = (min.x - origin.x) * dirfrac.x;
            double t2 = (max.x - origin.x) * dirfrac.x;
            double t3 = (min.y - origin.y) * dirfrac.y;
            double t4 = (max.y - origin.y) * dirfrac.y;
            double t5 = (min.z - origin.z) * dirfrac.z;
            double t6 = (max.z - origin.z) * dirfrac.z;

            double tmin = std::max(std::max(std::min(t1, t2), std::min(t3, t4)), std::min(t5, t6));
            double tmax = std::min(std::min(std::max(t1, t2), std::max(t3, t4)), std::max(t5, t6));

            // if tmax < 0, ray (line) is intersecting AABB, but the whole AABB is behind us
            if (tmax < -EPS_BIG)
            {
                //t = tmax;
                return false;
            }

            // if tmin > tmax, ray doesn't intersect AABB
            if (tmin > tmax + EPS_BIG)
            {
                //t = tmax;
                return false;
            }

            //t = tmin;
            return true;
        }

		void Geometry::BuildFromVectors(std::vector<double>& d, std::vector<uint32_t>& i)
		{
			vertexData = d;
			indexData = i;

			numPoints = indexData.size();
			numFaces = indexData.size() / 3;
		}

		void Geometry::AddPoint(glm::dvec4& pt, glm::dvec3& n)
		{
			glm::dvec3 p = pt;
			AddPoint(p, n);
		}

		AABB Geometry::GetAABB() const
		{
			AABB aabb;

			for (uint32_t i = 0; i < numPoints; i++)
			{
				aabb.min = glm::min(aabb.min, GetPoint(i));
				aabb.max = glm::max(aabb.max, GetPoint(i));
			}

			return aabb;
		}

		void Geometry::AddPoint(glm::dvec3& pt, glm::dvec3& n)
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

		void Geometry::AddFace(glm::dvec3 a, glm::dvec3 b, glm::dvec3 c)
		{
			glm::dvec3 normal;

			double area = fuzzybools::areaOfTriangle(a, b, c);
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

		void Geometry::AddFace(uint32_t a, uint32_t b, uint32_t c)
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

		Face Geometry::GetFace(size_t index) const
		{
			Face f;
			f.i0 = indexData[index * 3 + 0];
			f.i1 = indexData[index * 3 + 1];
			f.i2 = indexData[index * 3 + 2];
			return f;
		}

		AABB Geometry::GetFaceBox(size_t index) const
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

		glm::dvec3 Geometry::GetPoint(size_t index) const
		{
			return glm::dvec3(
				vertexData[index * VERTEX_FORMAT_SIZE_FLOATS + 0],
				vertexData[index * VERTEX_FORMAT_SIZE_FLOATS + 1],
				vertexData[index * VERTEX_FORMAT_SIZE_FLOATS + 2]
			);
		}

		void Geometry::GetCenterExtents(glm::dvec3& center, glm::dvec3& extents) const
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

		Geometry Geometry::Normalize(glm::dvec3 center, glm::dvec3 extents) const
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

		Geometry Geometry::DeNormalize(glm::dvec3 center, glm::dvec3 extents) const
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
		
		bool Geometry::IsEmpty()
		{
			return vertexData.empty();
		}

		double Geometry::Volume(const glm::dmat4& trans)
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

	glm::dmat4 IfcGeometry::Normalize()
	{
		glm::dvec3 center = normalizationCenter;
		if (!normalized)
		{	
			glm::dvec3 extents;
			GetCenterExtents(center,extents);
			for (size_t i = 0; i < vertexData.size(); i += 6)
			{
				vertexData[i + 0] = vertexData[i + 0] - center.x;
				vertexData[i + 1] = vertexData[i + 1] - center.y;
				vertexData[i + 2] = vertexData[i + 2] - center.z;
			}
			normalizationCenter = center;
			normalized = true;
		}
		glm::dmat4 resultMat = glm::dmat4(1.0);
		resultMat[3][0] = center[0];
		resultMat[3][1] = center[1];
		resultMat[3][2] = center[2];

		return  resultMat;
	}

	uint32_t IfcGeometry::GetVertexData()
	{
		// unfortunately webgl can't do doubles
		if (fvertexData.size() != vertexData.size())
		{
			fvertexData.resize(vertexData.size());
			for (size_t i = 0; i < vertexData.size(); i++)
			{
				// The vector was previously copied in batches of 6, but
				// copying single entry at a time is more resilient if the 
				// underlying geometry lib changes the treatment of normals
				fvertexData[i] = vertexData[i];
			}
		}
		if (fvertexData.empty())
		{
			return 0;
		}
		return (uint32_t)(size_t)&fvertexData[0];
	}

	void IfcGeometry::AddPart(IfcGeometry geom)
	{
		part.push_back(geom);
	}

	void IfcGeometry::AddPart(Geometry geom)
	{
		IfcGeometry newGeom;
		newGeom.MergeGeometry(geom);
		part.push_back(newGeom);
	}

	void IfcGeometry::AddGeometry(Geometry geom, glm::dmat4 trans, double scx, double scy, double scz, glm::dvec3 origin)
	{
		for (uint32_t i = 0; i < geom.numFaces; i++)
		{
			Face f = geom.GetFace(i);
			glm::dvec3 a = geom.GetPoint(f.i0);
			glm::dvec3 b = geom.GetPoint(f.i1);
			glm::dvec3 c = geom.GetPoint(f.i2);
			if(scx != 1 || scy != 1 || scz != 1)
			{
				double aax = glm::dot(trans[0], glm::dvec4(a - origin, 1)) * scx;
				double aay = glm::dot(trans[1], glm::dvec4(a - origin, 1)) * scy;
				double aaz = glm::dot(trans[2], glm::dvec4(a - origin, 1)) * scz;
				a = origin + glm::dvec3(aax *  trans[0]) + glm::dvec3(aay * trans[1]) + glm::dvec3(aaz * trans[2]);
				double bbx = glm::dot(trans[0], glm::dvec4(b - origin, 1)) * scx;
				double bby = glm::dot(trans[1], glm::dvec4(b - origin, 1)) * scy;
				double bbz = glm::dot(trans[2], glm::dvec4(b - origin, 1)) * scz;
				b = origin + glm::dvec3(bbx *  trans[0]) + glm::dvec3(bby * trans[1]) + glm::dvec3(bbz * trans[2]);
				double ccx = glm::dot(trans[0], glm::dvec4(c - origin, 1)) * scx;
				double ccy = glm::dot(trans[1], glm::dvec4(c - origin, 1)) * scy;
				double ccz = glm::dot(trans[2], glm::dvec4(c - origin, 1)) * scz;
				c = origin + glm::dvec3(ccx *  trans[0]) + glm::dvec3(ccy * trans[1]) + glm::dvec3(ccz * trans[2]);
			}
			AddFace(a, b, c);
		}
		AddPart(geom);
	}

	void IfcGeometry::MergeGeometry(Geometry geom)
	{
		for (uint32_t i = 0; i < geom.numFaces; i++)
		{
			Face f = geom.GetFace(i);
			glm::dvec3 a = geom.GetPoint(f.i0);
			glm::dvec3 b = geom.GetPoint(f.i1);
			glm::dvec3 c = geom.GetPoint(f.i2);
			AddFace(a, b, c);
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