/**
 * Helper functions
 * 
 * Use of this source code is governed by a BSD-style license that can be found in
 * the LICENSE file.
*/

#ifndef TINYNURBS_UTIL
#define TINYNURBS_UTIL

#include "array2.h"
#include "../../../deps/glm/glm/glm.hpp"
#include <vector>

namespace tinynurbs
{
namespace util
{

/**
 * Convert an nd point in homogenous coordinates to an (n-1)d point in cartesian
 * coordinates by perspective division
 * @param[in] pt Point in homogenous coordinates
 * @return Point in cartesian coordinates
 */
template <int nd, typename T>
inline glm::vec<nd - 1, T> homogenousToCartesian(const glm::vec<nd, T> &pt)
{
    return glm::vec<nd - 1, T>(pt / pt[pt.length() - 1]);
}

/**
 * Convert a list of nd points in homogenous coordinates to a list of (n-1)d points in cartesian
 * coordinates by perspective division
 * @param[in] ptsws Points in homogenous coordinates
 * @param[out] pts Points in cartesian coordinates
 * @param[out] ws Homogenous weights
 */
template <int nd, typename T>
inline void homogenousToCartesian(const std::vector<glm::vec<nd, T>> &ptsws,
                                  std::vector<glm::vec<nd - 1, T>> &pts, std::vector<T> &ws)
{
    pts.clear();
    ws.clear();
    pts.reserve(ptsws.size());
    ws.reserve(ptsws.size());
    for (int i = 0; i < ptsws.size(); ++i)
    {
        const glm::vec<nd, T> &ptw_i = ptsws[i];
        pts.push_back(glm::vec<nd - 1, T>(ptw_i / ptw_i[ptw_i.length() - 1]));
        ws.push_back(ptw_i[ptw_i.length() - 1]);
    }
}

/**
 * Convert a 2D list of nd points in homogenous coordinates to cartesian
 * coordinates by perspective division
 * @param[in] ptsws Points in homogenous coordinates
 * @param[out] pts Points in cartesian coordinates
 * @param[out] ws Homogenous weights
 */
template <int nd, typename T>
inline void homogenousToCartesian(const array2<glm::vec<nd, T>> &ptsws,
                                  array2<glm::vec<nd - 1, T>> &pts, array2<T> &ws)
{
    pts.resize(ptsws.rows(), ptsws.cols());
    ws.resize(ptsws.rows(), ptsws.cols());
    for (int i = 0; i < ptsws.rows(); ++i)
    {
        for (int j = 0; j < ptsws.cols(); ++j)
        {
            const glm::vec<nd, T> &ptw_ij = ptsws(i, j);
            T w_ij = ptw_ij[nd - 1];
            pts(i, j) = glm::vec<nd - 1, T>(ptw_ij / w_ij);
            ws(i, j) = w_ij;
        }
    }
}

/**
 * Convert an nd point in cartesian coordinates to an (n+1)d point in homogenous
 * coordinates
 * @param[in] pt Point in cartesian coordinates
 * @param[in] w Weight
 * @return Input point in homogenous coordinates
 */
template <int nd, typename T>
inline glm::vec<nd + 1, T> cartesianToHomogenous(const glm::vec<nd, T> &pt, T w)
{
    return glm::vec<nd + 1, T>(pt * w, w);
}

/**
 * Convert list of points in cartesian coordinates to homogenous coordinates
 * @param[in] pts Points in cartesian coordinates
 * @param[in] ws Weights
 * @return Points in homogenous coordinates
 */
template <int nd, typename T>
inline std::vector<glm::vec<nd + 1, T>>
cartesianToHomogenous(const std::vector<glm::vec<nd, T>> &pts, const std::vector<T> &ws)
{
    std::vector<glm::vec<nd + 1, T>> Cw;
    Cw.reserve(pts.size());
    for (int i = 0; i < pts.size(); ++i)
    {
        Cw.push_back(cartesianToHomogenous(pts[i], ws[i]));
    }
    return Cw;
}

/**
 * Convert 2D list of points in cartesian coordinates to homogenous coordinates
 * @param[in] pts Points in cartesian coordinates
 * @param[in] ws Weights
 * @return Points in homogenous coordinates
 */
template <int nd, typename T>
inline array2<glm::vec<nd + 1, T>> cartesianToHomogenous(const array2<glm::vec<nd, T>> &pts,
                                                         const array2<T> &ws)
{
    array2<glm::vec<nd + 1, T>> Cw(pts.rows(), pts.cols());
    for (int i = 0; i < pts.rows(); ++i)
    {
        for (int j = 0; j < pts.cols(); ++j)
        {
            Cw(i, j) = util::cartesianToHomogenous(pts(i, j), ws(i, j));
        }
    }
    return Cw;
}

/**
 * Convert an (n+1)d point to an nd point without perspective division
 * by truncating the last dimension
 * @param[in] pt Point in homogenous coordinates
 * @return Input point in cartesian coordinates
 */
template <int nd, typename T>
inline glm::vec<nd - 1, T> truncateHomogenous(const glm::vec<nd, T> &pt)
{
    return glm::vec<nd - 1, T>(pt);
}

/**
 * Compute the binomial coefficient (nCk) using the formula
 * \product_{i=0}^k (n + 1 - i) / i
 */
inline unsigned int binomial(unsigned int n, unsigned int k)
{
    unsigned int result = 1;
    if (k > n)
    {
        return 0;
    }
    for (unsigned int i = 1; i <= k; ++i)
    {
        result *= (n + 1 - i);
        result /= i;
    }
    return result;
}

/**
 * Check if two numbers are close enough within eps
 * @param[in] a First number
 * @param[in] b Second number
 * @param[in] eps Tolerance for checking closeness
 * @return Whether the numbers are close w.r.t. the tolerance
 */
template <typename T> inline bool close(T a, T b, double eps = std::numeric_limits<T>::epsilon())
{
    return (std::abs(a - b) < eps) ? true : false;
}

/**
 * Map numbers from one interval to another
 * @param[in] val Number to map to another range
 * @param[in] old_min Minimum value of original range
 * @param[in] old_max Maximum value of original range
 * @param[in] new_min Minimum value of new range
 * @param[in] new_max Maximum value of new range
 * @return Number mapped to new range
 */
template <typename T> inline T mapToRange(T val, T old_min, T old_max, T new_min, T new_max)
{
    T old_range = old_max - old_min;
    T new_range = new_max - new_min;
    return (((val - old_min) * new_range) / old_range) + new_min;
}

} // namespace util

} // namespace tinynurbs

#endif // TINYNURBS_UTIL
