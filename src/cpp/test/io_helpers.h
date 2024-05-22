/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.  */

#pragma once 


#include <vector>
#include <string>
#include <sstream>
#include <cstdint>
#include <glm/glm.hpp>
#include "../geometry/representation/geometry.h"
#include "../geometry/representation/IfcGeometry.h"
#include "../geometry/IfcGeometryProcessor.h"
#include "../geometry/operations/geometryutils.h"

namespace webifc::io 
{

    struct Point
    {
        double x;
        double y;
        int32_t id = -1;
        bool isBoundary = false;

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

        glm::dvec2 operator()() const
        {
            return glm::dvec2(
                x, y);
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

        void Merge(const Bounds &other)
        {
            min = glm::min(min, other.min);
            max = glm::max(max, other.max);
        }
    };
    
    Bounds getBounds(std::vector<std::vector<glm::dvec2>> input, glm::dvec2 size, glm::dvec2 offset);   

    struct SVGLineSet
    {
        std::vector<std::vector<glm::dvec2>> lines;
        std::string color = "rgb(255,0,0)";

        Bounds GetBounds(glm::dvec2 size, glm::dvec2 offset)
        {
            return getBounds(lines, size, offset);
        }
    };

    struct SVGDrawing
    {
        std::vector<SVGLineSet> sets;

        Bounds GetBounds(glm::dvec2 size, glm::dvec2 offset)
        {
            Bounds b;
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
 
    void writeFile(std::string filename, std::string data);
    void DumpSVGCurve(std::vector<glm::dvec3> points, std::string filename, std::vector<uint32_t> indices = {});
    void svgMakeLine(glm::dvec2 a, glm::dvec2 b, std::stringstream &svg, std::string col = "rgb(255,0,0)");
    void SVGLinesToString(Bounds bounds, glm::dvec2 size, glm::dvec2 offset, SVGLineSet lineSet, std::stringstream &svg);
    std::string makeSVGLines(SVGDrawing drawing);
    std::string ToObj(const webifc::geometry::IfcGeometry &geom, size_t &offset, glm::dmat4 transform = glm::dmat4(1), double inputScale = 1.0);
    std::string ToObj(webifc::geometry::IfcComposedMesh &mesh, webifc::geometry::IfcGeometryProcessor &processor, size_t &offset, glm::dmat4 mat = glm::dmat4(1));
    std::string ToObj(webifc::geometry::IfcFlatMesh &mesh, webifc::geometry::IfcGeometryProcessor &processor, size_t &offset, glm::dmat4 mat = glm::dmat4(1));
    void DumpGradientCurve(std::vector<webifc::geometry::IfcCurve> &curves, webifc::geometry::IfcCurve &curve, std::string filenameV, std::string filenameH);
    void DumpSectionCurves(std::vector<webifc::geometry::IfcCurve> &curves, std::string filename);
    void DumpAlignment(std::vector<webifc::geometry::IfcAlignment> &align, std::string filenameV, std::string filenameH);
    void DumpCrossSections(std::vector<webifc::geometry::IfcCrossSections> &crossSection, std::string filename);
    void DumpIfcGeometryToPath(const webifc::geometry::IfcGeometry &geom, std::string path, double inputScale);
    std::string ToObj(webifc::geometry::IfcGeometry &geom, size_t &offset, glm::dmat4 transform = glm::dmat4(1));
    void DumpIfcGeometry(webifc::geometry::IfcGeometry &geom, std::string filename);
    void DumpFlatMesh(webifc::geometry::IfcFlatMesh &mesh, webifc::geometry::IfcGeometryProcessor &processor, std::string filename);
    void DumpSVGLines(std::vector<std::vector<glm::dvec2>> lines, std::string filename);
    std::string makeSVGLines(std::vector<glm::dvec2> input, std::vector<uint32_t> indices);
    std::string makeSVGLines(std::vector<std::vector<glm::dvec2>> lines);
    void DumpMesh(webifc::geometry::IfcComposedMesh &mesh, webifc::geometry::IfcGeometryProcessor &processor, std::string filename);
    std::string GradientVerticalToObj(const std::vector<webifc::geometry::IfcCurve> &geom);
    std::string GradientHorizontalToObj(const webifc::geometry::IfcCurve &geom);
    std::string VAlignmentToObj(const std::vector<webifc::geometry::IfcAlignment> &geom);
    std::string HAlignmentToObj(const std::vector<webifc::geometry::IfcAlignment> &geom);
    std::string CrossSectionToObj(const std::vector<webifc::geometry::IfcCrossSections> &geom);
}