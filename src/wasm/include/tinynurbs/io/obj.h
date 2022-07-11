/**
 * Wavefront OBJ realted I/O functionality for curves and surfaces.
 * 
 * Use of this source code is governed by a BSD-style license that can be found in
 * the LICENSE file.
 */

#ifndef TINYNURBS_OBJ_H
#define TINYNURBS_OBJ_H

#include "../core/curve.h"
#include "../core/surface.h"
#include "../util/array2.h"
#include "../util/util.h"
#include "../../../deps/glm/glm/glm.hpp"
#include <algorithm>
#include <fstream>
#include <sstream>

namespace tinynurbs
{

/////////////////////////////////////////////////////////////////////

namespace internal
{

/**
 * Read rational curve data from a Wavefront OBJ stream.
 * @param is The input stream
 * @param[inout] deg Degree of the curve
 * @param[inout] knots Knot vector of the curve
 * @param[inout] ctrlPts Array of control points
 * @param[inout] weights Array of corresponding weights
 * @param[inout] rational Whether rational
 */
template <typename T>
void curveReadOBJ(std::istream &is, unsigned int &deg, std::vector<T> &knots,
                  std::vector<glm::vec<3, T>> &ctrlPts, std::vector<T> &weights, bool &rational)
{
    T knot_min = 0, knot_max = 1;
    std::vector<glm::vec<3, T>> ctrl_pts_buf;
    std::vector<T> weights_buf;
    std::vector<int> indices;
    std::vector<T> temp_knots;

    std::string start, token, sline;
    std::istringstream ssline;

    struct ToParse
    {
        bool deg, cstype, curv, parm;
    };

    ToParse parsed;

    while (std::getline(is, sline))
    {
        if (sline.size() == 0)
        {
            continue;
        }
        ssline.str(sline);
        ssline >> start;
        if (start == "v")
        {
            std::vector<double> four_coords;
            four_coords.resize(4, 0.0);
            four_coords[3] = 1.0;
            int index = 0;
            while (ssline && index <= 3)
            {
                ssline >> four_coords[index++];
            }
            ctrl_pts_buf.emplace_back(four_coords[0], four_coords[1], four_coords[2]);
            weights_buf.push_back(four_coords[3]);
        }
        else if (start == "cstype")
        {
            std::string token1;
            ssline >> token1;
            if (token1 == "bspline")
            {
                rational = false;
                parsed.cstype = true;
            }
            else if (token1 == "rat")
            {
                std::string token2;
                ssline >> token2;
                if (token2 == "bspline")
                {
                    rational = true;
                    parsed.cstype = true;
                }
            }
        }
        else if (start == "deg")
        {
            ssline >> deg;
            parsed.deg = true;
        }
        else if (start == "curv")
        {
            ssline >> knot_min >> knot_max;
            while (ssline >> token)
            {
                if (token == "\\")
                {
                    ssline.clear();
                    getline(is, sline);
                    ssline.str(sline);
                }
                else
                {
                    indices.push_back(std::stof(token));
                }
            }
            parsed.curv = true;
        }
        else if (start == "parm")
        {
            ssline >> start;
            if (start == "u")
            {
                while (ssline >> token)
                {
                    if (token == "\\")
                    {
                        ssline.clear();
                        std::getline(is, sline);
                        ssline.str(sline);
                    }
                    else
                    {
                        temp_knots.push_back(std::stof(token));
                    }
                }
            }
            parsed.parm = true;
        }
        else if (start == "end")
        {
            break;
        }
        ssline.clear();
    }

    // Check if necessary data was available in stream
    if (!parsed.cstype)
    {
        throw std::runtime_error("'cstype bspline / cstype rat bspline' line missing in file");
    }
    if (!parsed.deg)
    {
        throw std::runtime_error("'deg' line missing/incomplete in file");
    }
    if (!parsed.curv)
    {
        throw std::runtime_error("'curv' line missing/incomplete in file");
    }
    if (!parsed.parm)
    {
        throw std::runtime_error("'parm' line missing/incomplete in file");
    }

    int num_knots = temp_knots.size();
    int num_cp = num_knots - deg - 1;

    ctrlPts.resize(num_cp);
    weights.resize(num_cp);
    size_t num = 0;
    for (int i = 0; i < num_cp; ++i)
    {
        assert(i < ctrlPts.size());
        ctrlPts[i] = ctrl_pts_buf[indices[num] - 1];
        weights[i] = weights_buf[indices[num] - 1];
        ++num;
    }

    knots = temp_knots;
}

/**
 * Read rational surface data from a Wavefront OBJ stream.
 * @param is The input stream
 * @param[inout] deg_u Degree of the surface along u-direction
 * @param[inout] deg_v Degree of the surface along u-direction
 * @param[inout] knots_u Knot vector of the surface along u-direction
 * @param[inout] knots_v Knot vector of the surface along v-direction
 * @param[inout] ctrlPts 2D grid of control points of the surface
 * @param[inout] weights 2D grid of corresponding weights
 * @param[inout] rational Whether rational
 */
template <typename T>
void surfaceReadOBJ(std::istream &is, unsigned int &deg_u, unsigned int &deg_v,
                    std::vector<T> &knots_u, std::vector<T> &knots_v,
                    array2<glm::vec<3, T>> &ctrlPts, array2<T> &weights, bool &rational)
{
    T uknot_min = 0, uknot_max = 1;
    T vknot_min = 0, vknot_max = 1;

    std::vector<glm::vec<3, T>> ctrl_pts_buf;
    std::vector<T> weights_buf;
    std::vector<int> indices;
    std::vector<T> temp_uknots;
    std::vector<T> temp_vknots;

    std::string start, token, sline;
    std::istringstream ssline;

    struct ToParse
    {
        bool deg, cstype, surf, parm;
    };

    ToParse parsed;

    while (std::getline(is, sline))
    {
        if (sline.size() == 0)
        {
            break;
        }
        ssline.str(sline);
        ssline >> start;
        if (start == "v")
        {
            std::vector<double> four_coords;
            four_coords.resize(4);
            four_coords[3] = 1.0;
            int index = 0;
            while (ssline && index <= 3)
            {
                ssline >> four_coords[index++];
            }
            ctrl_pts_buf.emplace_back(four_coords[0], four_coords[1], four_coords[2]);
            weights_buf.push_back(four_coords[3]);
        }
        else if (start == "cstype")
        {
            std::string token1;
            ssline >> token1;
            if (token1 == "bspline")
            {
                rational = false;
                parsed.cstype = true;
            }
            else if (token1 == "rat")
            {
                std::string token2;
                ssline >> token2;
                if (token2 == "bspline")
                {
                    rational = true;
                    parsed.cstype = true;
                }
            }
        }
        else if (start == "deg")
        {
            ssline >> deg_u >> deg_v;
            parsed.deg = true;
        }
        else if (start == "surf")
        {
            ssline >> uknot_min >> uknot_max >> vknot_min >> vknot_max;
            while (ssline >> token)
            {
                if (token == "\\")
                {
                    ssline.clear();
                    getline(is, sline);
                    ssline.str(sline);
                }
                else
                {
                    indices.push_back(std::stof(token));
                }
            }
            parsed.surf = true;
        }
        else if (start == "parm")
        {
            ssline >> start;
            if (start == "u")
            {
                while (ssline >> token)
                {
                    if (token == "\\")
                    {
                        ssline.clear();
                        std::getline(is, sline);
                        ssline.str(sline);
                    }
                    else
                    {
                        temp_uknots.push_back(std::stof(token));
                    }
                }
            }
            else if (start == "v")
            {
                while (ssline >> token)
                {
                    if (token == "\\")
                    {
                        ssline.clear();
                        std::getline(is, sline);
                        ssline.str(sline);
                    }
                    else
                    {
                        temp_vknots.push_back(std::stof(token));
                    }
                }
            }
            parsed.parm = true;
        }
        else if (start == "end")
        {
            break;
        }
        ssline.clear();
    }

    // Check if necessary data was available in stream
    if (!parsed.cstype)
    {
        throw std::runtime_error("'cstype bspline / cstype rat bspline' line missing in file");
    }
    if (!parsed.deg)
    {
        throw std::runtime_error("'deg' line missing/incomplete in file");
    }
    if (!parsed.surf)
    {
        throw std::runtime_error("'surf' line missing/incomplete in file");
    }
    if (!parsed.parm)
    {
        throw std::runtime_error("'parm' line missing/incomplete in file");
    }

    int num_knots_u = temp_uknots.size();
    int num_knots_v = temp_vknots.size();
    int num_cp_u = num_knots_u - deg_u - 1;
    int num_cp_v = num_knots_v - deg_v - 1;

    ctrlPts.resize(num_cp_u, num_cp_v);
    weights.resize(num_cp_u, num_cp_v);
    size_t num = 0;
    for (int j = 0; j < num_cp_v; ++j)
    {
        for (int i = 0; i < num_cp_u; ++i)
        {
            assert(i < ctrlPts.rows() && j < ctrlPts.cols());
            ctrlPts(i, j) = ctrl_pts_buf[indices[num] - 1];
            weights(i, j) = weights_buf[indices[num] - 1];
            ++num;
        }
    }

    knots_u = temp_uknots;
    knots_v = temp_vknots;
}

/**
 * Save curve data to a Wavefront OBJ stream.
 * @param os The output stream
 * @param deg Degree of the curve
 * @param knots Knot vector of the curve
 * @param ctrlPts Array of control points
 * @param weights Array of corresponding weights
 * @param rational Whether rational
 */
template <typename T>
void curveSaveOBJ(std::ostream &os, unsigned int degree, const std::vector<T> &knots,
                  const std::vector<glm::vec<3, T>> &ctrlPts, const std::vector<T> &weights,
                  bool rational)
{
    using std::endl;

    for (int i = 0; i < ctrlPts.size(); ++i)
    {
        os << "v " << ctrlPts[i].x << " " << ctrlPts[i].y << " " << ctrlPts[i].z << " "
             << weights[i] << endl;
    }

    int n_knots = knots.size();
    int n_cp = ctrlPts.size();

    if (!rational)
    {
        os << "cstype bspline" << endl;
    }
    else
    {
        os << "cstype rat bspline" << endl;
    }
    os << "deg " << degree << endl << "curv ";
    os << knots[degree] << " " << knots[n_knots - degree - 1];
    for (int i = 0; i < n_cp; ++i)
    {
        os << " " << i + 1;
    }
    os << endl << "parm u";
    for (auto knot : knots)
    {
        os << " " << knot;
    }
    os << endl << "end";
}

/**
 * Save surface data to a Wavefront OBJ stream.
 * @param os The output stream
 * @param deg_u Degree of the surface along u-direction
 * @param deg_v Degree of the surface along v-direction
 * @param knots_u Knot vector of the surface along u-direction
 * @param knots_v Knot vector of the surface along v-direction
 * @param ctrlPts 2D grid of control points
 * @param weights 2D grid of corresponding weights
 * @param rational Whether rational
 */
template <typename T>
void surfaceSaveOBJ(std::ostream &os, unsigned int deg_u, unsigned int deg_v,
                    const std::vector<T> &knots_u, const std::vector<T> &knots_v,
                    const array2<glm::vec<3, T>> &ctrlPts, const array2<T> &weights, bool rational)
{

    using std::endl;

    if (ctrlPts.rows() == 0 || ctrlPts.cols() == 0)
    {
        return;
    }

    for (int j = 0; j < ctrlPts.cols(); j++)
    {
        for (int i = 0; i < ctrlPts.rows(); i++)
        {
            os << "v " << ctrlPts(i, j).x << " " << ctrlPts(i, j).y << " " << ctrlPts(i, j).z
                 << " " << weights(i, j) << endl;
        }
    }

    int nknots_u = knots_u.size();
    int nknots_v = knots_v.size();

    int nCpU = ctrlPts.rows();
    int nCpV = ctrlPts.cols();

    if (!rational)
    {
        os << "cstype bspline" << endl;
    }
    else
    {
        os << "cstype rat bspline" << endl;
    }
    os << "deg " << deg_u << " " << deg_v << endl << "surf ";
    os << knots_u[deg_u] << " " << knots_u[nknots_u - deg_u - 1] << " " << knots_v[deg_v] << " "
         << knots_v[nknots_v - deg_v - 1];
    for (int i = 0; i < nCpU * nCpV; i++)
    {
        os << " " << i + 1;
    }
    os << endl << "parm u";
    for (auto knot : knots_u)
    {
        os << " " << knot;
    }
    os << endl << "parm v";
    for (auto knot : knots_v)
    {
        os << " " << knot;
    }
    os << endl << "end";
}

} // namespace internal

/////////////////////////////////////////////////////////////////////

/**
 * Read curve data from a Wavefront OBJ stream and populate a RationalCurve object
 * @param is The input stream
 * @return RationalCurve object
 */
template <typename T> RationalCurve<T> curveReadOBJ(std::istream &is)
{
    RationalCurve<T> crv;
    std::vector<glm::vec<3, T>> control_points;
    bool rat;
    internal::curveReadOBJ(is, crv.degree, crv.knots, crv.control_points, crv.weights, rat);
    return crv;
}

/**
 * Read surface data from a Wavefront OBJ stream and populate a RationalSurface object
 * @param is The input stream
 * @return RationalSurface object
 */
template <typename T> RationalSurface<T> surfaceReadOBJ(std::istream &is)
{
    RationalSurface<T> srf;
    bool rat;
    internal::surfaceReadOBJ(is, srf.degree_u, srf.degree_v, srf.knots_u, srf.knots_v,
                             srf.control_points, srf.weights, rat);
    return srf;
}

/**
 * Save curve data from a Wavefront OBJ stream and populate a RationalSurface object
 * @param os The output stream
 * @param Curve object to save
 */
template <typename T> void curveSaveOBJ(std::ostream &os, const Curve<T> &crv)
{
    std::vector<T> w(crv.control_points.size(), T(1));
    internal::curveSaveOBJ(os, crv.degree, crv.knots, crv.control_points, w, false);
}

/**
 * Save rational curve data to a Wavefront OBJ stream.
 * @param os The output stream
 * @param RationalCurve object to save
 */
template <typename T> void curveSaveOBJ(std::ostream &os, const RationalCurve<T> &crv)
{
    internal::curveSaveOBJ(os, crv.degree, crv.knots, crv.control_points, crv.weights, true);
}

/**
 * Save non-rational surface data to a Wavefront OBJ stream.
 * @param os The output stream
 * @param srf Surface object to save
 */
template <typename T> void surfaceSaveOBJ(std::ostream &os, const Surface<T> &srf)
{
    array2<T> w(srf.control_points.rows(), srf.control_points.cols(), T(1));
    internal::surfaceSaveOBJ(os, srf.degree_u, srf.degree_v, srf.knots_u, srf.knots_v,
                             srf.control_points, w, false);
}

/**
 * Save rational surface data to a Wavefront OBJ stream.
 * @param os The output stream
 * @param srf RationalSurface object to save
 */
template <typename T>
void surfaceSaveOBJ(std::ostream &os, const RationalSurface<T> &srf)
{
    internal::surfaceSaveOBJ(os, srf.degree_u, srf.degree_v, srf.knots_u, srf.knots_v,
                             srf.control_points, srf.weights, true);
}

/////////////////////////////////////////////////////////////////////

/**
 * Read curve data from a Wavefront OBJ file and populate a RationalCurve object
 * @param filename Name of the file
 * @return RationalCurve object
 */
template <typename T> RationalCurve<T> curveReadOBJ(const std::string &filename)
{
    std::ifstream file(filename);
    if (!file)
    {
        throw std::runtime_error("File not found: " + filename);
    }

    return curveReadOBJ<T>(file);
}

/**
 * Read surface data from a Wavefront OBJ file and populate a RationalSurface object
 * @param filename Name of the file
 * @return RationalSurface object
 */
template <typename T> RationalSurface<T> surfaceReadOBJ(const std::string &filename)
{
    std::ifstream file(filename);
    if (!file)
    {
        throw std::runtime_error("File not found: " + filename);
    }

    return surfaceReadOBJ<T>(file);
}

/**
 * Save curve data from a Wavefront OBJ file and populate a RationalSurface object
 * @param filename Name of the file
 * @param Curve object to save
 */
template <typename T> void curveSaveOBJ(const std::string &filename, const Curve<T> &crv)
{
    std::ofstream fout(filename);
    curveSaveOBJ(fout, crv);
}

/**
 * Save rational curve data to a Wavefront OBJ file.
 * @param filename Name of the file
 * @param RationalCurve object to save
 */
template <typename T> void curveSaveOBJ(const std::string &filename, const RationalCurve<T> &crv)
{
    std::ofstream fout(filename);
    curveSaveOBJ(fout, crv);
}

/**
 * Save non-rational surface data to a Wavefront OBJ file.
 * @param filename Name of the file
 * @param srf Surface object to save
 */
template <typename T> void surfaceSaveOBJ(const std::string &filename, const Surface<T> &srf)
{
    std::ofstream fout(filename);
    surfaceSaveOBJ(fout, srf);
}

/**
 * Save rational surface data to a Wavefront OBJ file.
 * @param filename Name of the file
 * @param srf RationalSurface object to save
 */
template <typename T>
void surfaceSaveOBJ(const std::string &filename, const RationalSurface<T> &srf)
{
    std::ofstream fout(filename);
    surfaceSaveOBJ(fout, srf);
}

} // namespace tinynurbs

#endif // TINYNURBS_OBJ_H
