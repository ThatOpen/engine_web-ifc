/**
 * The Surface and RationalSurface classes represent non-rational and rational
 * NURBS surfaces, respectively.
  *
 * Use of this source code is governed by a BSD-style license that can be found in
 * the LICENSE file.
 */

#ifndef TINYNURBS_SURFACE_H
#define TINYNURBS_SURFACE_H

#include "../util/array2.h"
#include "../../../deps/glm/glm/glm.hpp"
#include <stdexcept>
#include <vector>

namespace tinynurbs
{

// Forward declaration
template <typename T> struct RationalSurface;

/**
Struct for representing a non-rational NURBS surface
\tparam T Data type of control points and weights (float or double)
*/
template <typename T> struct Surface
{
    unsigned int degree_u, degree_v;
    std::vector<T> knots_u, knots_v;
    array2<glm::vec<3, T>> control_points;

    Surface() = default;
    Surface(const RationalSurface<T> &srf)
        : degree_u(srf.degree_u), degree_v(srf.degree_v), knots_u(srf.knots_u),
          knots_v(srf.knots_v), control_points(srf.control_points)
    {
    }
    Surface(unsigned int degree_u, unsigned int degree_v, const std::vector<T> &knots_u,
            const std::vector<T> &knots_v, array2<glm::vec<3, T>> control_points)
        : degree_u(degree_u), degree_v(degree_v), knots_u(knots_u), knots_v(knots_v),
          control_points(control_points)
    {
    }
};

/**
Struct for representing a non-rational NURBS surface
\tparam T Data type of control points and weights (float or double)
*/
template <typename T> struct RationalSurface
{
    unsigned int degree_u, degree_v;
    std::vector<T> knots_u, knots_v;
    array2<glm::vec<3, T>> control_points;
    array2<T> weights;

    RationalSurface() = default;
    RationalSurface(const Surface<T> &srf, const array2<T> &weights)
        : degree_u(srf.degree_u), degree_v(srf.degree_v), knots_u(srf.knots_u),
          knots_v(srf.knots_v), control_points(srf.control_points), weights(weights)
    {
    }
    RationalSurface(const Surface<T> &srf)
        : RationalSurface(srf, array2<T>(srf.control_points.rows(), srf.control_points.cols(), 1.0))
    {
    }
    RationalSurface(unsigned int degree_u, unsigned int degree_v, const std::vector<T> &knots_u,
                    const std::vector<T> &knots_v, const array2<glm::vec<3, T>> &control_points,
                    const array2<T> &weights)
        : degree_u(degree_u), degree_v(degree_v), knots_u(knots_u), knots_v(knots_v),
          control_points(control_points), weights(weights)
    {
    }
};

// Typedefs for ease of use
typedef Surface<float> Surface3f;
typedef Surface<double> Surface3d;
typedef RationalSurface<float> RationalSurface3f;
typedef RationalSurface<double> RationalSurface3d;

} // namespace tinynurbs

#endif // TINYNURBS_SURFACE_H
