#pragma once

#include <sstream>
#include <fstream>
#include <vector>
#include <array>

#include "../deps/glm/glm/glm.hpp"

namespace webifc
{
	const double EPS_MINISCULE = 1e-12; // what?
	const double EPS_TINY = 1e-9;
	const double EPS_SMALL = 1e-6;
	const double EPS_BIG = 1e-4;

    void writeFile(std::wstring filename, std::string data)
    {
    #ifdef _MSC_VER
		std::ofstream out(L"debug_output/" + filename);
		out << data;
    #endif
    }

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

	constexpr int VERTEX_FORMAT_SIZE_FLOATS = 6;

	glm::dvec3 computeNormal(const glm::dvec3 v1, const glm::dvec3 v2, const glm::dvec3 v3)
	{
		glm::dvec3 v12(v2 - v1);
		glm::dvec3 v13(v3 - v1);

		glm::dvec3 norm = glm::cross(v12, v13);

		return glm::normalize(norm);
	}

	struct IfcGeometry
	{
		std::vector<double> vertexData;
		std::vector<uint32_t> indexData;

		uint32_t numPoints = 0;
		uint32_t numFaces = 0;

		inline void AddPoint(glm::dvec4& pt, glm::dvec3& n)
		{
			glm::dvec3 p = pt;
			AddPoint(p, n);
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

			//vertexData[numPoints * VERTEX_FORMAT_SIZE_FLOATS + 3] = n.x;
			//vertexData[numPoints * VERTEX_FORMAT_SIZE_FLOATS + 4] = n.y;
			//vertexData[numPoints * VERTEX_FORMAT_SIZE_FLOATS + 5] = n.z;

			numPoints += 1;
		}

		inline void AddFace(glm::dvec3 a, glm::dvec3 b, glm::dvec3 c)
		{
			AddFace(numPoints + 0, numPoints + 1, numPoints + 2);

			glm::dvec3 normal = computeNormal(a, b, c);
			AddPoint(a, normal);
			AddPoint(b, normal);
			AddPoint(c, normal);
		}

		inline void AddFace(uint32_t a, uint32_t b, uint32_t c)
		{
			//indexData.reserve((numFaces + 1) * 3);
			//indexData[numFaces * 3 + 0] = a;
			//indexData[numFaces * 3 + 1] = b;
			//indexData[numFaces * 3 + 2] = c;
			indexData.push_back(a);
			indexData.push_back(b);
			indexData.push_back(c);

			numFaces++;
		}

		inline Face GetFace(uint32_t index) const
		{
			Face f;
			f.i0 = indexData[index * 3 + 0];
			f.i1 = indexData[index * 3 + 1];
			f.i2 = indexData[index * 3 + 2];
			return f;
		}

		inline glm::dvec3 GetPoint(uint32_t index) const
		{
			return glm::dvec3(
				vertexData[index * VERTEX_FORMAT_SIZE_FLOATS + 0],
				vertexData[index * VERTEX_FORMAT_SIZE_FLOATS + 1],
				vertexData[index * VERTEX_FORMAT_SIZE_FLOATS + 2]
			);
		}

		double* GetVertexData()
		{
			return &vertexData[0];
		}

		size_t GetVertexDataSize()
		{
			return vertexData.size();
		}

		uint32_t* GetIndexData()
		{
			return &indexData[0];
		}

		size_t GetIndexDataSize()
		{
			return indexData.size();
		}
	};

	bool equals2d(glm::dvec2 A, glm::dvec2 B, double eps = 0)
	{
		return std::fabs(A.x - B.x) <= eps && std::fabs(A.y - B.y) <= eps;
	}

	struct IfcCurve
	{
		std::vector<glm::dvec2> points;
		inline void Add(const glm::dvec2& pt)
		{
			if (points.empty())
			{
				points.push_back(pt);
			}
			else if (!equals2d(pt, points.back()))
			{
				points.push_back(pt);
			}
		}
	};

	struct IfcTrimmingSelect
	{
		bool hasParam = false;
		bool hasPos = false;
		double param;
		glm::dvec2 pos;
	};

	struct IfcTrimmingArguments
	{
		bool exist = false;
		IfcTrimmingSelect start;
		IfcTrimmingSelect end;
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

	struct IfcPlacedGeometry
	{
		glm::dvec4 color;
		glm::dmat4 transformation;
		std::array<double, 16> flatTransformation;
		uint32_t geometryExpressID;

		void SetFlatTransformation()
		{
			for (int i = 0; i < 4; i++)
			{
				for (int j = 0; j < 4; j++)
				{
					flatTransformation[i * 4 + j] = transformation[i][j];
				}
			}
		}
	};

	struct IfcFlatMesh
	{
		std::vector<IfcPlacedGeometry> geometries;
	};

	struct IfcComposedMesh
	{
		glm::dvec4 color;
		glm::dmat4 transformation;
		uint32_t expressID;
		bool hasGeometry = false;
		bool hasColor = false;
		std::vector<IfcComposedMesh> children;
	};

	void flattenRecursive(IfcComposedMesh& mesh, std::unordered_map<uint32_t, IfcGeometry>& geometryMap, IfcGeometry& geom, glm::dmat4 mat)
	{
		glm::dmat4 newMat = mat * mesh.transformation;

		auto& meshGeom = geometryMap[mesh.expressID];

		if (meshGeom.numFaces)
		{
			for (uint32_t i = 0; i < meshGeom.numFaces; i ++)
			{
				Face f = meshGeom .GetFace(i);
				glm::dvec3 a = newMat * glm::dvec4(meshGeom.GetPoint(f.i0), 1);
				glm::dvec3 b = newMat * glm::dvec4(meshGeom.GetPoint(f.i1), 1);
				glm::dvec3 c = newMat * glm::dvec4(meshGeom.GetPoint(f.i2), 1);

				geom.AddFace(a, b, c);
			}
		}

		for (auto& c : mesh.children)
		{
			flattenRecursive(c, geometryMap, geom, newMat);
		}
	}

	IfcGeometry flatten(IfcComposedMesh& mesh, std::unordered_map<uint32_t, IfcGeometry>& geometryMap, glm::dmat4 mat = glm::dmat4(1))
	{
		IfcGeometry geom;
		flattenRecursive(mesh, geometryMap, geom, mat);
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

		double maxSize = std::max(width, height);

		if (width == 0 && height == 0)
		{
			printf("asdf");
		}

		for (auto& pt : input)
		{
			retval.emplace_back(
				((pt.x - min.x) / (maxSize)) * size.x + offset.x,
				((pt.y - min.y) / (maxSize)) * size.y + offset.y
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

		svg << "<svg width=\"" << size.x + offset.x * 2 << "\" height=\"" << size.y + offset.y * 2 << "\" xmlns=\"http://www.w3.org/2000/svg\" >";

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

		svg << "</svg>";

		return svg.str();
	}

	void DumpSVGCurve(std::vector<glm::dvec2> points, std::wstring filename, std::vector<uint32_t> indices = {})
	{
        writeFile(filename, makeSVGLines(points, indices));
	}

    struct Point
    {
        double x;
        double y;
        int32_t id = -1;

		Point()
		{

		}

		Point(double xx, double yy)
		{
			x = xx;
			y = yy;
		}

		Point(glm::dvec2 p)
		{
			x = p.x;
			y = p.y;
		}

        glm::dvec2 operator()()
        {
            return glm::dvec2(
                x, y
            );
        }
    };

    struct Triangle
    {
        Point a;
        Point b;
        Point c;

        int32_t id = -1;
    };

    struct Edge
    {
        int32_t a = -1;
        int32_t b = -1;
    };

	struct Bounds
	{
		glm::dvec2 min;
		glm::dvec2 max;
	};

	glm::dvec2 cmin(glm::dvec2 m, Point p)
	{
		return glm::dvec2(
			std::min(m.x, p.x),
			std::min(m.y, p.y)
		);
	}

	glm::dvec2 cmax(glm::dvec2 m, Point p)
	{
		return glm::dvec2(
			std::max(m.x, p.x),
			std::max(m.y, p.y)
		);
	}

	Bounds getBounds(std::vector<Triangle> input, glm::dvec2 size, glm::dvec2 offset)
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

		for (auto& tri : input)
		{
			min = cmin(min, tri.a);
			max = cmax(max, tri.a);

			min = cmin(min, tri.b);
			max = cmax(max, tri.b);

			min = cmin(min, tri.c);
			max = cmax(max, tri.c);
		}

		double width = max.x - min.x;
		double height = max.y - min.y;

		if (width == 0 && height == 0)
		{
			printf("asdf");
		}

		return {
			min,
			max
		};
	}

	Bounds getBounds(std::vector<std::vector<glm::dvec2>> input, glm::dvec2 size, glm::dvec2 offset)
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

		for (auto& loop : input)
		{
			for (auto& point : loop)
			{
				min = glm::min(min, point);
				max = glm::max(max, point);
			}
		}

		double width = max.x - min.x;
		double height = max.y - min.y;

		if (width == 0 && height == 0)
		{
			printf("asdf");
		}

		return {
			min,
			max
		};
	}

	glm::dvec2 rescale(Point p, Bounds b, glm::dvec2 size, glm::dvec2 offset)
	{
		return glm::dvec2(
			((p.x - b.min.x) / (b.max.x - b.min.x)) * size.x + offset.x,
			((p.y - b.min.y) / (b.max.y - b.min.y)) * size.y + offset.y
		);
	}

	void svgMakeLine(glm::dvec2 a, glm::dvec2 b, std::stringstream& svg)
	{
		svg << "<line x1=\"" << a.x << "\" y1=\"" << a.y << "\" ";
		svg << "x2=\"" << b.x << "\" y2=\"" << b.y << "\" ";
		svg << "style = \"stroke:rgb(255,0,0);stroke-width:1\" />";
	}

	std::string makeSVGTriangles(std::vector<Triangle> triangles, Point p, Point prev)
	{
		glm::dvec2 size(512, 512);
		glm::dvec2 offset(5, 5);

		Bounds bounds = getBounds(triangles, size, offset);

		std::stringstream svg;

		svg << "<svg width=\"" << size.x + offset.x * 2 << "\" height=\"" << size.y + offset.y * 2 << "  \" xmlns=\"http://www.w3.org/2000/svg\" >";

		for (auto& t : triangles)
		{
			if (t.id != -1)
			{
				glm::dvec2 a = rescale(t.a, bounds, size, offset);
				glm::dvec2 b = rescale(t.b, bounds, size, offset);
				glm::dvec2 c = rescale(t.c, bounds, size, offset);

				svgMakeLine(a, b, svg);
				svgMakeLine(b, c, svg);
				svgMakeLine(c, a, svg);
			}
		}

		glm::dvec2 rp = rescale(p, bounds, size, offset);
		glm::dvec2 rprev = rescale(prev, bounds, size, offset);

		if (p.id != -1)
		{
			svg << "<circle cx = \"" << rp.x << "\" cy = \"" << rp.y << "\" r = \"3\" style = \"stroke:rgb(0,0,255);stroke-width:2\" />";
		}

		if (prev.id != -1)
		{
			svg << "<circle cx = \"" << rprev.x << "\" cy = \"" << rprev.y << "\" r = \"3\" style = \"stroke:rgb(0,0,100);stroke-width:2\" />";
		}

		svg << "</svg>";

		return svg.str();
	}

	glm::dvec2 rescale(glm::dvec2 p, Bounds b, glm::dvec2 size, glm::dvec2 offset)
	{
		return glm::dvec2(
			((p.x - b.min.x) / (b.max.x - b.min.x)) * size.x + offset.x,
			((p.y - b.min.y) / (b.max.y - b.min.y)) * size.y + offset.y
		);
	}

	std::string makeSVGLines(std::vector<std::vector<glm::dvec2>> lines)
	{
		glm::dvec2 size(2048, 2048);
		glm::dvec2 offset(5, 5);

		Bounds bounds = getBounds(lines, size, offset);

		std::stringstream svg;

		svg << "<svg width=\"" << size.x + offset.x * 2 << "\" height=\"" << size.y + offset.y * 2 << " \" xmlns=\"http://www.w3.org/2000/svg\">";

		for (auto& line : lines)
		{
			if (line.size() > 1)
			{
				for (int i = 1; i < line.size(); i++)
				{
					glm::dvec2 a = rescale(line[i], bounds, size, offset);
					glm::dvec2 b = rescale(line[i - 1], bounds, size, offset);

					svgMakeLine(a, b, svg);
				}
			}
			else
			{
				glm::dvec2 a = rescale(line[0], bounds, size, offset);
				svg << "<circle cx = \"" << a.x << "\" cy = \"" << a.y << "\" r = \"3\" style = \"stroke:rgb(0,0,255);stroke-width:2\" />";
			}
		}

		svg << "</svg>";

		return svg.str();
	}

	void DumpSVGTriangles(std::vector<Triangle> triangles, Point p, Point prev, std::wstring filename)
	{
        writeFile(filename, makeSVGTriangles(triangles, p, prev));
	}

	void DumpSVGLines(std::vector<std::vector<glm::dvec2>> lines, std::wstring filename)
	{
        writeFile(filename, makeSVGLines(lines));
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

	bool equals(glm::dvec3 A, glm::dvec3 B, double eps = 0)
	{
		return std::fabs(A.x - B.x) <= eps && std::fabs(A.y - B.y) <= eps && std::fabs(A.z - B.z) <= eps;
	}

	double areaOfTriangle(glm::dvec3 a, glm::dvec3 b, glm::dvec3 c)
	{
		glm::dvec3 ab = b - a;
		glm::dvec3 ac = c - a;

		glm::dvec3 norm = glm::cross(ab, ac);
		return glm::length(norm) / 2;
	}

	double cross2d(const glm::dvec2& point1, const glm::dvec2& point2) {
		return point1.x * point2.y - point1.y * point2.x;
	}

	double areaOfTriangle(glm::dvec2 a, glm::dvec2 b, glm::dvec2 c)
	{
		glm::dvec2 ab = b - a;
		glm::dvec2 ac = c - a;

		double norm = cross2d(ab, ac) / 2;
		return std::fabs(norm);
	}

	void CheckTriangle(glm::dvec3 a, glm::dvec3 b, glm::dvec3 c)
	{
		if (areaOfTriangle(a, b, c) == 0)
		{
			printf("0 triangle\n");
		}
	}

	void CheckTriangle(Face& f, std::vector<glm::dvec3>& pts)
	{
		if (areaOfTriangle(pts[f.i0], pts[f.i1], pts[f.i2]) == 0)
		{
			printf("0 triangle\n");
		}
	}

	std::string ToObj(const IfcGeometry& geom, size_t& offset, glm::dmat4 transform = glm::dmat4(1))
	{
		std::stringstream obj;

		double scale = 0.001;

		for (uint32_t i = 0; i < geom.numPoints; i++)
		{
			glm::dvec4 t = transform * glm::dvec4(geom.GetPoint(i), 1);
			obj << "v " << t.x * scale << " " << t.y * scale << " " << t.z * scale << "\n";
		}

		for (uint32_t i = 0; i < geom.numFaces; i++)
		{
			Face f = geom.GetFace(i);
			obj << "f " << (f.i0 + 1 + offset) << "// " << (f.i1 + 1 + offset) << "// " << (f.i2 + 1 + offset) << "//\n";
		}

		offset += geom.numPoints;

		return obj.str();
	}

	std::string ToObj(IfcComposedMesh& mesh, std::unordered_map<uint32_t, IfcGeometry>& geometryMap, size_t& offset, glm::dmat4 mat = glm::dmat4(1))
	{
		std::string complete;

		glm::dmat4 trans = mat * mesh.transformation;

		auto& geom = geometryMap[mesh.expressID];

		complete += ToObj(geom, offset, trans);

		for (auto c : mesh.children)
		{
			complete += ToObj(c, geometryMap, offset, trans);
		}

		return complete;
	}

	void DumpIfcGeometry(const IfcGeometry& geom, std::wstring filename)
	{
		size_t offset = 0;
        writeFile(filename, ToObj(geom, offset));
	}

	//! This is essentially a chunked tightly packed dynamic array
	template<uint32_t N>
	class DynamicTape
	{
	public:
		DynamicTape()
		{
			AddChunk();
		}

		inline void AddChunk()
		{
			frontChunk = new uint8_t[N];
			memset(frontChunk, 0, N);
			chunks.push_back(frontChunk);
			sizes.push_back(0);
			writePtr++;
		}

		inline void CheckChunk(unsigned long long size)
		{
			if (sizes[writePtr] + size >= N)
			{
				AddChunk();
			}
		}

		inline void push(char v)
		{
			CheckChunk(1);
			frontChunk[sizes[writePtr]] = v;
			sizes[writePtr] += 1;
		}

		inline void push(void* v, unsigned long long size)
		{
			CheckChunk(size);
			memcpy(frontChunk + sizes[writePtr], v, size);
			sizes[writePtr] += size;
		}

		uint64_t GetTotalSize()
		{
			return chunks.size() * N;
		}

		void Reset()
		{
			readChunkIndex = 0;
			readPtr = 0;
		}

		template <typename T>
		inline T Read()
		{
			uint8_t* chunk = chunks[readChunkIndex];
			uint8_t* valuePtr = &chunk[readPtr];

			//T v = *(T*)(valuePtr);
			// make this memory access aligned for emscripten

			T v;

			memcpy(&v, valuePtr, sizeof(T));

			AdvanceRead(sizeof(T));
			return v;
		}

		inline void Reverse()
		{
			if (readPtr > 0)
			{
				readPtr--;
			}
			else
			{
				readChunkIndex--;
				readPtr = static_cast<uint32_t>(sizes[readChunkIndex] - 1);
			}
		}

		inline bool AtEnd()
		{
			return readChunkIndex == chunks.size();
		}

		inline uint32_t GetReadOffset()
		{
			return readChunkIndex * N + readPtr;
		}

		inline void MoveTo(uint32_t pos)
		{
			readChunkIndex = pos / N;
			readPtr = pos % N;
		}

		void DumpToDisk()
		{
			std::ofstream file("tape.bin");
			for (int i = 0; i < chunks.size(); i++)
			{
				file.write((char*)(chunks[i]), sizes[i]);
			}
		}

	private:

		inline void AdvanceRead(unsigned long long size)
		{
			readPtr += static_cast<uint32_t>(size);
			if (readPtr >= sizes[readChunkIndex])
			{
				readChunkIndex++;
				readPtr = 0;
			}
		}

		uint32_t readPtr = 0;
		uint32_t readChunkIndex = 0;
		uint32_t writePtr = -1;
		uint8_t* frontChunk = nullptr;
		std::vector<uint8_t*> chunks;
		std::vector<size_t> sizes;
	};

}