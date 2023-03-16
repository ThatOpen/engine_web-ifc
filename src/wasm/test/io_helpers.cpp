/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

#include "io_helpers.h"
#include <fstream>
#include "../geometry/representation/geometry.h"
#include "../geometry/operations/intersect-mesh-mesh.h"

namespace webifc::io 
{

  void writeFile(std::wstring filename, std::string data)
  {
    std::string newFileName(filename.begin(), filename.end());
    std::ofstream out(newFileName);
    out << data;
    out.close();
}

void DumpSVGCurve(std::vector<glm::dvec3> points, std::wstring filename, std::vector<uint32_t> indices)
{
    std::vector<glm::dvec2> points2D;
    for (auto &pt : points)
    {
        points2D.emplace_back(pt.x, pt.z);
    }
    writeFile(filename, makeSVGLines(points2D, indices));
}

void svgMakeLine(glm::dvec2 a, glm::dvec2 b, std::stringstream &svg, std::string col)
{
    svg << "<line x1=\"" << a.x << "\" y1=\"" << a.y << "\" ";
    svg << "x2=\"" << b.x << "\" y2=\"" << b.y << "\" ";
    svg << "style = \"stroke:" + col + ";stroke-width:1\" />";
}

void SVGLinesToString(webifc::geometry::Bounds bounds, glm::dvec2 size, glm::dvec2 offset, SVGLineSet lineSet, std::stringstream &svg)
{
    for (auto &line : lineSet.lines)
    {
        if (line.size() > 1)
        {
            for (size_t i = 1; i < line.size(); i++)
            {
                glm::dvec2 a = rescale(line[i], bounds, size, offset);
                glm::dvec2 b = rescale(line[i - 1], bounds, size, offset);

                svgMakeLine(a, b, svg, lineSet.color);
            }
        }
        else
        {
            glm::dvec2 a = rescale(line[0], bounds, size, offset);
            svg << "<circle cx = \"" << a.x << "\" cy = \"" << a.y << "\" r = \"3\" style = \"stroke:rgb(0,0,255);stroke-width:2\" />";
        }
    }
}

std::string makeSVGLines(SVGDrawing drawing)
{
    glm::dvec2 size(2048, 2048);
    glm::dvec2 offset(5, 5);

    webifc::geometry::Bounds bounds = drawing.GetBounds(size, offset);

    std::stringstream svg;

    svg << "<svg width=\"" << size.x + offset.x * 2 << "\" height=\"" << size.y + offset.y * 2 << " \" xmlns=\"http://www.w3.org/2000/svg\">";

    for (auto &set : drawing.sets)
    {
        SVGLinesToString(bounds, size, offset, set, svg);
    }

    svg << "</svg>";

    return svg.str();
}

std::string ToObj(const webifc::geometry::IfcGeometry &geom, size_t &offset, glm::dmat4 transform, double inputScale)
{
    std::stringstream obj;

    double scale = inputScale;

    for (uint32_t i = 0; i < geom.numPoints; i++)
    {
        glm::dvec4 t = transform * glm::dvec4(geom.GetPoint(i), 1);
        obj << "v " << t.x * scale << " " << t.y * scale << " " << t.z * scale << "\n";
    }

    for (uint32_t i = 0; i < geom.numFaces; i++)
    {
        webifc::geometry::Face f = geom.GetFace(i);
        obj << "f " << (f.i0 + 1 + offset) << "// " << (f.i1 + 1 + offset) << "// " << (f.i2 + 1 + offset) << "//\n";
    }

    offset += geom.numPoints;

    return obj.str();
}

std::string ToObj(webifc::geometry::IfcComposedMesh &mesh, webifc::geometry::IfcGeometryProcessor &processor, size_t &offset, glm::dmat4 mat)
{
    std::string complete;

    glm::dmat4 trans = mat * mesh.transformation;

    auto &geom = processor.GetGeometry(mesh.expressID);

    complete += ToObj(geom, offset, trans);

    for (auto c : mesh.children)
    {
        complete += ToObj(c, processor, offset, trans);
    }

    return complete;
}


void DumpAlignment(std::vector<webifc::geometry::IfcAlignment> &align, std::wstring filenameV, std::wstring filenameH)
{
    writeFile(filenameV, VAlignmentToObj(align));
    writeFile(filenameH, HAlignmentToObj(align));
}

void DumpIfcGeometryToPath(const webifc::geometry::IfcGeometry &geom, std::wstring path, double inputScale)
{
    size_t offset = 0;
    std::ofstream out(path);
    out << ToObj(geom, offset, glm::dmat4(1), inputScale);
}

std::string ToObj(webifc::geometry::IfcGeometry &geom, size_t &offset, glm::dmat4 transform)
{
    std::stringstream obj;

    double scale = 1.0;

    for (uint32_t i = 0; i < geom.numPoints; i++)
    {
        glm::dvec4 t = transform * glm::dvec4(geom.GetPoint(i), 1);
        obj << "v " << t.x * scale << " " << t.y * scale << " " << t.z * scale << "\n";
    }

    for (uint32_t i = 0; i < geom.numFaces; i++)
    {
        webifc::geometry::Face f = geom.GetFace(i);
        obj << "f " << (f.i0 + 1 + offset) << "// " << (f.i1 + 1 + offset) << "// " << (f.i2 + 1 + offset) << "//\n";
    }

    offset += geom.numPoints;

    return obj.str();
}

std::vector<int32_t> FindTrianglesWithEdge(int32_t a, int32_t b, std::vector<webifc::geometry::Triangle>& triangles)
{
    std::vector<int32_t> result;
    std::vector<int32_t> deleted;
    glm::dvec2 apt;
    glm::dvec2 bpt;

    for (size_t i = 0; i < triangles.size(); i++)
    {
        webifc::geometry::Triangle& t = triangles[i];

        bool found = false;
        if (t.a.id == a && t.b.id == b)
        {
            found = true;
            apt = t.a();
            bpt = t.b();
        }
        else if (t.b.id == a && t.c.id == b)
        {
            found = true;
            apt = t.b();
            bpt = t.c();
        }
        else if (t.c.id == a && t.a.id == b)
        {
            found = true;
            apt = t.c();
            bpt = t.a();
        }
        else if (t.a.id == b && t.b.id == a)
        {
            found = true;
            apt = t.b();
            bpt = t.a();
        }
        else if (t.b.id == b && t.c.id == a)
        {
            found = true;
            apt = t.c();
            bpt = t.b();
        }
        else if (t.c.id == b && t.a.id == a)
        {
            found = true;
            apt = t.a();
            bpt = t.c();
        }

        if (found)
        {
            if (t.id == -1)
            {
                deleted.push_back(i);
            }
            else
            {
                result.push_back(i);
            }
        }
    }

            // every edge must be replaced by a new edge, whether it has 1 or 2 adjacent triangles
            // a mismatch here means we made a mistake
    if (result.size() > 2)
    {
        printf("Triangle with this edge already deleted!");
    }

    return result;
}

void CheckTriangleEdges(webifc::geometry::Triangle& t, std::vector<webifc::geometry::Triangle>& triangles)
{
    FindTrianglesWithEdge(t.a.id, t.b.id, triangles);
    FindTrianglesWithEdge(t.b.id, t.c.id, triangles);
    FindTrianglesWithEdge(t.c.id, t.a.id, triangles);
}


void DumpIfcGeometry(webifc::geometry::IfcGeometry &geom, std::wstring filename)
{
    size_t offset = 0;
    writeFile(filename, ToObj(geom, offset));
}

std::string makeSVGTriangles(std::vector<webifc::geometry::Triangle> triangles, webifc::geometry::Point p, webifc::geometry::Point prev, std::vector<webifc::geometry::Point> pts)
{
    glm::dvec2 size(512, 512);
    glm::dvec2 offset(5, 5);

    webifc::geometry::Bounds bounds = getBounds(triangles, size, offset);

    std::stringstream svg;

    svg << "<svg width=\"" << size.x + offset.x * 2 << "\" height=\"" << size.y + offset.y * 2 << "  \" xmlns=\"http://www.w3.org/2000/svg\" >";

    for (auto &t : triangles)
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

    for (auto &pt : pts)
    {
        glm::dvec2 p = rescale(pt, bounds, size, offset);
        svg << "<circle cx = \"" << p.x << "\" cy = \"" << p.y << "\" r = \"1\" style = \"stroke:rgb(0,0,100);stroke-width:2\" />";
    }

    svg << "</svg>";

    return svg.str();
}

void DumpSVGTriangles(std::vector<webifc::geometry::Triangle> triangles, webifc::geometry::Point p, webifc::geometry::Point prev, std::wstring filename, std::vector<webifc::geometry::Point> pts)
{
    writeFile(filename, makeSVGTriangles(triangles, p, prev, pts));
}

void DumpSVGLines(std::vector<std::vector<glm::dvec2>> lines, std::wstring filename)
{
    writeFile(filename, makeSVGLines(lines));
}

std::string makeSVGLines(std::vector<glm::dvec2> input, std::vector<uint32_t> indices)
{
    glm::dvec2 size(512, 512);
    glm::dvec2 offset(5, 5);

    auto rescaled = webifc::geometry::rescale(input, size, offset);

    std::stringstream svg;

    svg << "<svg width=\"" << size.x + offset.x * 2 << "\" height=\"" << size.y + offset.y * 2 << "\" xmlns=\"http://www.w3.org/2000/svg\" >";

    if (!rescaled.empty())
    {
        for (int i = 1; i < 2; i++)
        {
            auto &start = rescaled[i - 1];
            auto &end = rescaled[i];
            svg << "<line x1=\"" << start.x << "\" y1=\"" << start.y << "\" ";
            svg << "x2=\"" << end.x << "\" y2=\"" << end.y << "\" ";
            svg << "style = \"stroke:rgb(0,255,0);stroke-width:2\" />";
        }

        for (size_t i = 2; i < rescaled.size() - 1; i++)
        {
            auto &start = rescaled[i - 1];
            auto &end = rescaled[i];
            svg << "<line x1=\"" << start.x << "\" y1=\"" << start.y << "\" ";
            svg << "x2=\"" << end.x << "\" y2=\"" << end.y << "\" ";
            svg << "style = \"stroke:rgb(0,0,0);stroke-width:2\" />";
        }

        for (size_t i = rescaled.size() - 1; i < rescaled.size(); i++)
        {
            auto &start = rescaled[i - 1];
            auto &end = rescaled[i];
            svg << "<line x1=\"" << start.x << "\" y1=\"" << start.y << "\" ";
            svg << "x2=\"" << end.x << "\" y2=\"" << end.y << "\" ";
            svg << "style = \"stroke:rgb(255,0,0);stroke-width:2\" />";
        }
    }

    for (size_t i = 0; i < indices.size(); i += 3)
    {
        glm::dvec2 a = rescaled[indices[i + 0]];
        glm::dvec2 b = rescaled[indices[i + 1]];
        glm::dvec2 c = rescaled[indices[i + 2]];

        svg << "<polygon points=\"" << a.x << "," << a.y << " " << b.x << "," << b.y << " " << c.x << "," << c.y << "\" style=\"fill:gray; stroke:none; stroke - width:0\" />`;";
    }

    svg << "</svg>";

    return svg.str();
}

std::string makeSVGLines(std::vector<std::vector<glm::dvec2>> lines)
{
    glm::dvec2 size(2048, 2048);
    glm::dvec2 offset(5, 5);

    webifc::geometry::Bounds bounds = getBounds(lines, size, offset);

    std::stringstream svg;

    svg << "<svg width=\"" << size.x + offset.x * 2 << "\" height=\"" << size.y + offset.y * 2 << " \" xmlns=\"http://www.w3.org/2000/svg\">";

    for (auto &line : lines)
    {
        if (line.size() > 1)
        {
            for (size_t i = 1; i < line.size(); i++)
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

void DumpPrevTriangles(size_t num, webifc::geometry::Point& p, webifc::geometry::Point& prev, std::vector<webifc::geometry::Triangle>& triangles)
{
    std::vector<webifc::geometry::Triangle> temp;
    for (size_t i = 0; i < num; i++)
    {
        webifc::geometry::Triangle t = triangles[triangles.size() - 1 - i];
        CheckTriangleEdges(t, triangles);

        t.id = 0;
        temp.push_back(t);
    }
    DumpSVGTriangles(temp, p, prev, L"triangles.svg");
}

void DumpTriangleID(int num, webifc::geometry::Point& p, webifc::geometry::Point& prev, std::vector<webifc::geometry::Triangle>& triangles)
{
    std::vector<webifc::geometry::Triangle> temp;
    webifc::geometry::Triangle t = triangles[num];
    t.id = 0;
    temp.push_back(t);
    DumpSVGTriangles(temp, p, prev, L"triangle.svg");
}

void Print(webifc::geometry::Polygon3D &poly,const std::wstring& filename)
{
    std::vector<std::vector<glm::dvec2>> vecs;

    GetExportableEdges(poly,vecs);

    DumpSVGLines(vecs, filename);
}

void PrintEdges(webifc::geometry::Polygon3D &poly,const std::wstring& filename)
{
    std::vector<std::vector<glm::dvec2>> vecs;

    for (auto& e : poly.edges)
    {
        vecs.push_back({ poly.points[e.first], poly.points[e.second] });           
    }

    DumpSVGLines(vecs, filename);
}

void PrintEdgesAndLoop(std::vector<std::pair<size_t, size_t>> edges,std::vector<glm::dvec2> points,const std::wstring& filename, const std::vector<size_t>& loop)
{
    std::vector<std::vector<glm::dvec2>> vecs;

    for (auto& e : edges)
    {
        vecs.push_back({ points[e.first], points[e.second] });
    }

    std::vector<std::vector<glm::dvec2>> loops;

    for (size_t i = 1; i < loop.size(); i++)
    {
        loops.push_back({ points[loop[i-1]], points[loop[i]] });
    }

    SVGLineSet set;
    set.lines = vecs;
    set.color = "rgb(255, 0, 0)";

    SVGLineSet set2;
    set2.lines = loops;
    set2.color = "rgb(0, 0, 255)";

    SVGDrawing drawing;
    drawing.sets.push_back(set);
    drawing.sets.push_back(set2);
    writeFile(filename + L".html", makeSVGLines(drawing));
}

void PrintLoops(std::vector<glm::dvec2> points,const std::wstring& filename, const std::vector<size_t>& loop, const std::vector<size_t>& loopb, glm::dvec2 horLinePos)
{
    std::vector<std::vector<glm::dvec2>> loop1;

    for (size_t i = 0; i < loop.size(); i++)
    {
        loop1.push_back({ points[loop[i]], points[loop[(i + 1) % loop.size()]] });
    }

    for (size_t i = 0; i < loopb.size(); i++)
    {
        loop1.push_back({ points[loopb[i]], points[loopb[(i + 1) % loopb.size()]] });
    }

    loop1.push_back({ horLinePos + glm::dvec2(1, 0), horLinePos - glm::dvec2(1, 0) });

    DumpSVGLines(loop1, filename + L"1.html");
}

void DumpMesh(webifc::geometry::IfcComposedMesh &mesh, webifc::geometry::IfcGeometryProcessor &processor, std::wstring filename)
{
    size_t offset = 0;
    writeFile(filename, ToObj(mesh, processor, offset, webifc::geometry::NormalizeIFC));
}

void DumpPolygonWithClipsegments(const webifc::geometry::Polygon3D& poly, const std::vector<webifc::geometry::ClipSegment2D>& segments, const std::wstring& filename)
{
    std::vector<std::vector<glm::dvec2>> vecs;

    GetExportableEdges(poly,vecs);

    for (auto& clip : segments)
    {
        if (clip.type == webifc::geometry::ClipSegment2DType::LINE)
        {
            vecs.push_back({ clip.pos, clip.pos2 });
        }
        else if (clip.type == webifc::geometry::ClipSegment2DType::POINT)
        {
                //vecs.push_back({ clip.pos });
        }
    }

    DumpSVGLines(vecs, filename);
}

std::string VAlignmentToObj(const std::vector<webifc::geometry::IfcAlignment> &geom)
{
    std::stringstream obj;

    for (uint32_t ia = 0; ia < geom.size(); ia++)
    {
        for (uint32_t ic = 0; ic < geom[ia].Vertical.curves.size(); ic++)
        {
            for (uint32_t ip = 0; ip < geom[ia].Vertical.curves[ic].points.size(); ip++)
            {
                glm::dvec3 t = glm::dvec4(geom[ia].Vertical.curves[ic].points[ip].x,geom[ia].Vertical.curves[ic].points[ip].y, 0, 1);
                obj << "v " << t.x << " " << t.y << " " << t.z << "\n";
            }
        }
    }

    uint32_t idx = 0;

    for (uint32_t ia = 0; ia < geom.size(); ia++)
    {
        for (uint32_t ic = 0; ic < geom[ia].Vertical.curves.size(); ic++)
        {
            for (uint32_t ip = 0; ip < geom[ia].Vertical.curves[ic].points.size() - 1; ip++)
            {
                obj << "l " << (idx) << " " << (idx + 1) << "\n";;
                idx++;
            }
        }
    }

    return obj.str();
}

std::string HAlignmentToObj(const std::vector<webifc::geometry::IfcAlignment> &geom)
{
    std::stringstream obj;

    for (uint32_t ia = 0; ia < geom.size(); ia++)
    {
        for (uint32_t ic = 0; ic < geom[ia].Horizontal.curves.size(); ic++)
        {
            for (uint32_t ip = 0; ip < geom[ia].Horizontal.curves[ic].points.size(); ip++)
            {
                glm::dvec3 t = glm::dvec4(geom[ia].Horizontal.curves[ic].points[ip].x,geom[ia].Horizontal.curves[ic].points[ip].y, 0, 1);
                obj << "v " << t.x << " " << t.y << " " << t.z << "\n";
            }
        }
    }

    uint32_t idx = 0;

    for (uint32_t ia = 0; ia < geom.size(); ia++)
    {
        for (uint32_t ic = 0; ic < geom[ia].Horizontal.curves.size(); ic++)
        {
            for (uint32_t ip = 0; ip < geom[ia].Horizontal.curves[ic].points.size() - 1; ip++)
            {
                obj << "l " << (idx) << " " << (idx + 1) << "\n";;
                idx++;
            }
        }
    }

    return obj.str();
}

webifc::geometry::Bounds getBounds(std::vector<webifc::geometry::Triangle> input, glm::dvec2 size, glm::dvec2 offset)
{
    std::vector<glm::dvec2> retval;

    glm::dvec2 min(
        DBL_MAX,
        DBL_MAX);

    glm::dvec2 max(
        -DBL_MAX,
        -DBL_MAX);

    for (auto &tri : input)
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

    return {min,max};
}

webifc::geometry::Bounds getBounds(std::vector<std::vector<glm::dvec2>> input, glm::dvec2 size, glm::dvec2 offset)
{
    std::vector<glm::dvec2> retval;

    glm::dvec2 min(
        DBL_MAX,
        DBL_MAX);

    glm::dvec2 max(
        -DBL_MAX,
        -DBL_MAX);

    for (auto &loop : input)
    {
        for (auto &point : loop)
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

    return {min, max};
}

void GetExportableEdges(const webifc::geometry::Polygon3D &poly,std::vector<std::vector<glm::dvec2>>& vecs)
{
    for (auto& contour : poly.contours)
    {
        for (size_t i = 0; i < contour.size(); i++)
        {
            vecs.push_back({ poly.points[contour[i]], poly.points[contour[(i + 1) % contour.size()]] });
        }
    }
}
}