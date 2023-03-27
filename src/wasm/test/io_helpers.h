/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.  */

#pragma once 


#include <vector>
#include <string>
#include <sstream>
#include <glm/glm.hpp>
#include "../geometry/representation/geometry.h"
#include "../geometry/representation/IfcGeometry.h"
#include "../geometry/IfcGeometryProcessor.h"
#include "../geometry/operations/geometryutils.h"


namespace webifc::geometry {
    struct Polygon3D;
    struct ClipSegment2D;
}


namespace webifc::io 
{

    webifc::geometry::Bounds getBounds(std::vector<std::vector<glm::dvec2>> input, glm::dvec2 size, glm::dvec2 offset);
    webifc::geometry::Bounds getBounds(std::vector<webifc::geometry::Triangle> input, glm::dvec2 size, glm::dvec2 offset);
    
    struct SVGLineSet
    {
        std::vector<std::vector<glm::dvec2>> lines;
        std::string color = "rgb(255,0,0)";

        webifc::geometry::Bounds GetBounds(glm::dvec2 size, glm::dvec2 offset)
        {
            return getBounds(lines, size, offset);
        }
    };

    struct SVGDrawing
    {
        std::vector<SVGLineSet> sets;

        webifc::geometry::Bounds GetBounds(glm::dvec2 size, glm::dvec2 offset)
        {
            webifc::geometry::Bounds b;
            b.min = glm::dvec2(
                DBL_MAX,
                DBL_MAX);

            b.max = glm::dvec2(
                -DBL_MAX,
                -DBL_MAX);

            for (auto &set : sets)
            {
                b.Merge(set.GetBounds(size, offset));
            }

            return b;
        }
    };

    void GetExportableEdges(const webifc::geometry::Polygon3D &poly,std::vector<std::vector<glm::dvec2>>& vecs);  
    void writeFile(std::string filename, std::string data);
    void DumpSVGCurve(std::vector<glm::dvec3> points, std::string filename, std::vector<uint32_t> indices = {});
    void svgMakeLine(glm::dvec2 a, glm::dvec2 b, std::stringstream &svg, std::string col = "rgb(255,0,0)");
    void SVGLinesToString(webifc::geometry::Bounds bounds, glm::dvec2 size, glm::dvec2 offset, SVGLineSet lineSet, std::stringstream &svg);
    std::string makeSVGLines(SVGDrawing drawing);
    std::string ToObj(const webifc::geometry::IfcGeometry &geom, size_t &offset, glm::dmat4 transform = glm::dmat4(1), double inputScale = 1.0);
    std::string ToObj(webifc::geometry::IfcComposedMesh &mesh, webifc::geometry::IfcGeometryProcessor &processor, size_t &offset, glm::dmat4 mat = glm::dmat4(1));
    void DumpAlignment(std::vector<webifc::geometry::IfcAlignment> &align, std::string filenameV, std::string filenameH);
    void DumpIfcGeometryToPath(const webifc::geometry::IfcGeometry &geom, std::string path, double inputScale);
    std::string ToObj(webifc::geometry::IfcGeometry &geom, size_t &offset, glm::dmat4 transform = glm::dmat4(1));
    void DumpIfcGeometry(webifc::geometry::IfcGeometry &geom, std::string filename);
    std::string makeSVGTriangles(std::vector<webifc::geometry::Triangle> triangles, webifc::geometry::Point p, webifc::geometry::Point prev, std::vector<webifc::geometry::Point> pts = {});
    void DumpSVGTriangles(std::vector<webifc::geometry::Triangle> triangles, webifc::geometry::Point p, webifc::geometry::Point prev, std::string filename, std::vector<webifc::geometry::Point> pts = {});
    void DumpSVGLines(std::vector<std::vector<glm::dvec2>> lines, std::string filename);
    std::string makeSVGLines(std::vector<glm::dvec2> input, std::vector<uint32_t> indices);
    std::string makeSVGLines(std::vector<std::vector<glm::dvec2>> lines);
    void DumpPrevTriangles(size_t num, webifc::geometry::Point& p, webifc::geometry::Point& prev, std::vector<webifc::geometry::Triangle>& triangles);
    void DumpTriangleID(int num, webifc::geometry::Point& p, webifc::geometry::Point& prev, std::vector<webifc::geometry::Triangle>& triangles);
    void Print(webifc::geometry::Polygon3D &poly,const std::string& filename);
    void PrintEdges(webifc::geometry::Polygon3D &poly,const std::string& filename);
    void PrintEdgesAndLoop(std::vector<std::pair<size_t, size_t>> edges,std::vector<glm::dvec2> points,const std::string& filename, const std::vector<size_t>& loop);
    void PrintLoops(std::vector<glm::dvec2> points,const std::string& filename, const std::vector<size_t>& loop, const std::vector<size_t>& loopb, glm::dvec2 horLinePos);
    void DumpMesh(webifc::geometry::IfcComposedMesh &mesh, webifc::geometry::IfcGeometryProcessor &processor, std::string filename);
    void DumpPolygonWithClipsegments(const webifc::geometry::Polygon3D& poly, const std::vector<webifc::geometry::ClipSegment2D>& segments, const std::string& filename);
    std::string VAlignmentToObj(const std::vector<webifc::geometry::IfcAlignment> &geom);
    std::string HAlignmentToObj(const std::vector<webifc::geometry::IfcAlignment> &geom);
    void CheckTriangleEdges(webifc::geometry::Triangle& t, std::vector<webifc::geometry::Triangle>& triangles);
    std::vector<int32_t> FindTrianglesWithEdge(int32_t a, int32_t b, std::vector<webifc::geometry::Triangle>& triangles);

}