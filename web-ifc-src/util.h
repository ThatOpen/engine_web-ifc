#pragma once

#include <sstream>
#include <fstream>
#include <vector>

#include <glm/glm.hpp>

namespace webifc
{
	const double EPS_SMALL = 1e-8;

	struct Face
	{
		int i0;
		int i1;
		int i2;
	};

	struct Loop
	{
		bool hasOne;
		glm::dvec2 v1;
		glm::dvec2 v2;
	};

	struct IfcGeometry
	{
		std::vector<glm::dvec3> points;
		std::vector<Face> faces;

		void AddFace(glm::dvec3 a, glm::dvec3 b, glm::dvec3 c)
		{
			points.push_back(a);
			points.push_back(b);
			points.push_back(c);

			Face f;
			f.i0 = points.size() - 3;
			f.i1 = points.size() - 2;
			f.i2 = points.size() - 1;

			faces.push_back(f);
		}
	};

	struct IfcTransformedGeometry
	{
		glm::dmat4 matrix;
		std::vector<glm::dvec3> points;
		std::vector<Face> faces;
	};

	struct IfcCurve
	{
		std::vector<glm::dvec2> points;
	};

	struct IfcCurve3D
	{
		std::vector<glm::dvec3> points;
	};

	enum class IfcBoundType
	{
		OUTERBOUND,
		BOUND
	};

	struct IfcBound3D
	{
		IfcBoundType type;
		bool orientation;
		IfcCurve3D curve;
	};

	struct IfcProfile
	{
		std::string type;
		IfcCurve curve;
		bool isConvex;
	};

	struct IfcComposedMesh
	{
		glm::dmat4 transformation;
		uint64_t geometryRef;
		IfcGeometry geom; // TODO: remove and make ref
		std::vector<IfcComposedMesh> children;
	};

	void flattenRecursive(IfcComposedMesh& mesh, IfcGeometry& geom, glm::dmat4 mat)
	{
		glm::dmat4 newMat = mat * mesh.transformation;

		if (!mesh.geom.faces.empty())
		{
			for (int i = 0; i < mesh.geom.faces.size(); i ++)
			{
				Face& f = mesh.geom.faces[i];
				glm::dvec3 a = newMat * glm::dvec4(mesh.geom.points[f.i0], 1);
				glm::dvec3 b = newMat * glm::dvec4(mesh.geom.points[f.i1], 1);
				glm::dvec3 c = newMat * glm::dvec4(mesh.geom.points[f.i2], 1);

				geom.AddFace(a, b, c);
			}
		}

		for (auto& c : mesh.children)
		{
			flattenRecursive(c, geom, newMat);
		}
	}

	IfcGeometry flatten(IfcComposedMesh& mesh)
	{
		IfcGeometry geom;
		flattenRecursive(mesh, geom, glm::dmat4(1));
		return geom;
	}

	std::vector<glm::dvec2> rescale(std::vector<glm::dvec2> input, glm::dvec2 size, glm::dvec2 offset)
	{
		std::vector<glm::dvec2> retval;

		glm::dvec2 min(
			DBL_MAX,
			DBL_MAX
		);

		glm::dvec2 max(
			-DBL_MAX,
			-DBL_MAX
		);

		for (auto& pt : input)
		{
			min = glm::min(min, pt);
			max = glm::max(max, pt);
		}

		double width = max.x - min.x;
		double height = max.y - min.y;

		if (width == 0 || height == 0)
		{
			printf("asdf");
		}

		for (auto& pt : input)
		{
			retval.emplace_back(
				((pt.x - min.x) / (width)) * size.x + offset.x,
				((pt.y - min.y) / (height)) * size.y + offset.y
			);
		}

		return retval;
	}

	std::string makeSVGLines(std::vector<glm::dvec2> input, std::vector<uint32_t> indices)
	{
		glm::dvec2 size(512, 512);
		glm::dvec2 offset(5, 5);

		auto rescaled = rescale(input, size, offset);

		std::stringstream svg;

		svg << "<svg width=\"" << size.x + offset.x * 2 << "\" height=\"" << size.y + offset.y * 2 << "\">";

		for (int i = 1; i < rescaled.size(); i++)
		{
			auto& start = rescaled[i - 1];
			auto& end = rescaled[i];
			svg << "<line x1=\"" << start.x << "\" y1=\"" << start.y << "\" ";
			svg << "x2=\"" << end.x << "\" y2=\"" << end.y << "\" ";
			svg << "style = \"stroke:rgb(255,0,0);stroke-width:2\" />";
		}

		for (int i = 0; i < indices.size(); i += 3)
		{
			glm::dvec2 a = rescaled[indices[i + 0]];
			glm::dvec2 b = rescaled[indices[i + 1]];
			glm::dvec2 c = rescaled[indices[i + 2]];

			svg << "<polygon points=\"" << a.x << "," << a.y << " " << b.x << "," << b.y << " " << c.x << "," << c.y << "\" style=\"fill:gray; stroke:none; stroke - width:0\" />`;";
		}

		return svg.str();
	}

	void DumpSVGCurve(std::vector<glm::dvec2> points, std::wstring filename, std::vector<uint32_t> indices = {})
	{
		std::ofstream out(L"debug_output/" + filename);
		out << makeSVGLines(points, indices);
	}

	bool isConvexOrColinear(glm::dvec2 a, glm::dvec2 b, glm::dvec2 c)
	{
		return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x) >= 0;
	}

	glm::dmat4 NormalizeIFC(
		glm::dvec4(1, 0, 0, 0),
		glm::dvec4(0, 0, -1, 0),
		glm::dvec4(0, 1, 0, 0),
		glm::dvec4(0, 0, 0, 1)
	);

	glm::dvec3 computeNormal(glm::dvec3 v1, glm::dvec3 v2, glm::dvec3 v3)
	{
		glm::dvec3 v12(v2 - v1);
		glm::dvec3 v13(v3 - v1);

		glm::dvec3 norm = glm::cross(v12, v13);

		return glm::normalize(norm);
	}

	bool equals(glm::dvec3 A, glm::dvec3 B, double eps = 0)
	{
		return std::fabs(A.x - B.x) <= eps && std::fabs(A.y - B.y) <= eps && std::fabs(A.z - B.z) <= eps;
	}

	bool equals2d(glm::dvec2 A, glm::dvec2 B, double eps = 0)
	{
		return std::fabs(A.x - B.x) <= eps && std::fabs(A.y - B.y) <= eps;
	}

	double areaOfTriangle(glm::dvec3 a, glm::dvec3 b, glm::dvec3 c)
	{
		glm::dvec3 ab = b - a;
		glm::dvec3 ac = c - a;

		glm::dvec3 norm = glm::cross(ab, ac);
		return glm::length(norm) / 2;
	}

	void CheckTriangle(glm::dvec3 a, glm::dvec3 b, glm::dvec3 c)
	{
		if (areaOfTriangle(a, b, c) == 0)
		{
			printf("asdf");
		}
	}

	void CheckTriangle(Face& f, std::vector<glm::dvec3>& pts)
	{
		if (areaOfTriangle(pts[f.i0], pts[f.i1], pts[f.i2]) == 0)
		{
			printf("asdf");
		}
	}

	std::string ToObj(IfcGeometry& geom, int& offset, glm::dmat4 transform = glm::dmat4(1))
	{
		std::stringstream obj;

		double scale = 0.001;

		for (auto& pt : geom.points)
		{
			glm::dvec4 t = transform * glm::dvec4(pt, 1);
			obj << "v " << t.x * scale << " " << t.y * scale << " " << t.z * scale << "\n";
		}

		for (auto& f : geom.faces)
		{
			obj << "f " << (f.i0 + 1 + offset) << "// " << (f.i1 + 1 + offset) << "// " << (f.i2 + 1 + offset) << "//\n";
		}

		offset += geom.points.size();

		return obj.str();
	}

	std::string ToObj(IfcComposedMesh& mesh, int& offset, glm::dmat4 mat = glm::dmat4(1))
	{
		std::string complete;

		glm::dmat4 trans = mat * mesh.transformation;

		complete += ToObj(mesh.geom, offset, trans);

		for (auto c : mesh.children)
		{
			complete += ToObj(c, offset, trans);
		}

		return complete;
	}

	void DumpIfcGeometry(IfcGeometry& geom, std::wstring filename)
	{
		std::ofstream out(L"debug_output/" + filename);
		int offset = 0;
		out << ToObj(geom, offset);
	}
}