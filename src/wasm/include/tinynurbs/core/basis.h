/**
 * Low-level functions for evaluating B-spline basis functions and their derivatives
 * 
 * Use of this source code is governed by a BSD-style license that can be found in
 * the LICENSE file.
 */

#ifndef TINYNURBS_BASIS_H
#define TINYNURBS_BASIS_H

#include "../util/array2.h"
#include "../util/util.h"
#include <vector>

namespace tinynurbs
{

/**
 * Find the span of the given parameter in the knot vector.
 * @param[in] degree Degree of the curve.
 * @param[in] knots Knot vector of the curve.
 * @param[in] u Parameter value.
 * @return Span index into the knot vector such that (span - 1) < u <= span
*/
template <typename T> int findSpan(unsigned int degree, const std::vector<T> &knots, T u)
{
    // index of last control point
    int n = static_cast<int>(knots.size()) - degree - 2;
    assert(n >= 0);
    /*
        // For u that is equal to last knot value
        if (util::close(u, knots[n + 1])) {
            return n;
        }
    */
    // For values of u that lies outside the domain
    if (u > (knots[n + 1] - std::numeric_limits<T>::epsilon()))
    {
        return n;
    }
    if (u < (knots[degree] + std::numeric_limits<T>::epsilon()))
    {
        return degree;
    }

    // Binary search
    // TODO: Replace this with std::lower_bound
    int low = degree;
    int high = n + 1;
    int mid = (int)std::floor((low + high) / 2.0);
    while (u < knots[mid] || u >= knots[mid + 1])
    {
        if (u < knots[mid])
        {
            high = mid;
        }
        else
        {
            low = mid;
        }
        mid = (int)std::floor((low + high) / 2.0);
    }
    return mid;
}

/**
 * Compute a single B-spline basis function
 * @param[in] i The ith basis function to compute.
 * @param[in] deg Degree of the basis function.
 * @param[in] knots Knot vector corresponding to the basis functions.
 * @param[in] u Parameter to evaluate the basis functions at.
 * @return The value of the ith basis function at u.
 */
template <typename T> T bsplineOneBasis(int i, unsigned int deg, const std::vector<T> &U, T u)
{
    int m = static_cast<int>(U.size()) - 1;
    // Special case
    if ((i == 0 && close(u, U[0])) || (i == m - deg - 1 && close(u, U[m])))
    {
        return 1.0;
    }
    // Local property ensures that basis function is zero outside span
    if (u < U[i] || u >= U[i + deg + 1])
    {
        return 0.0;
    }
    // Initialize zeroth-degree functions
    std::vector<double> N;
    N.resize(deg + 1);
    for (int j = 0; j <= deg; j++)
    {
        N[j] = (u >= U[i + j] && u < U[i + j + 1]) ? 1.0 : 0.0;
    }
    // Compute triangular table
    for (int k = 1; k <= deg; k++)
    {
        T saved = (util::close(N[0], 0.0)) ? 0.0 : ((u - U[i]) * N[0]) / (U[i + k] - U[i]);
        for (int j = 0; j < deg - k + 1; j++)
        {
            T Uleft = U[i + j + 1];
            T Uright = U[i + j + k + 1];
            if (util::close(N[j + 1], 0.0))
            {
                N[j] = saved;
                saved = 0.0;
            }
            else
            {
                T temp = N[j + 1] / (Uright - Uleft);
                N[j] = saved + (Uright - u) * temp;
                saved = (u - Uleft) * temp;
            }
        }
    }
    return N[0];
}

/**
 * Compute all non-zero B-spline basis functions
 * @param[in] deg Degree of the basis function.
 * @param[in] span Index obtained from findSpan() corresponding the u and knots.
 * @param[in] knots Knot vector corresponding to the basis functions.
 * @param[in] u Parameter to evaluate the basis functions at.
 * @return N Values of (deg+1) non-zero basis functions.
 */
template <typename T>
std::vector<T> bsplineBasis(unsigned int deg, int span, const std::vector<T> &knots, T u)
{
    std::vector<T> N;
    N.resize(deg + 1, T(0));
    std::vector<T> left, right;
    left.resize(deg + 1, static_cast<T>(0.0));
    right.resize(deg + 1, static_cast<T>(0.0));
    T saved = 0.0, temp = 0.0;

    N[0] = 1.0;

    for (int j = 1; j <= deg; j++)
    {
        left[j] = (u - knots[span + 1 - j]);
        right[j] = knots[span + j] - u;
        saved = 0.0;
        for (int r = 0; r < j; r++)
        {
            temp = N[r] / (right[r + 1] + left[j - r]);
            N[r] = saved + right[r + 1] * temp;
            saved = left[j - r] * temp;
        }
        N[j] = saved;
    }
    return N;
}

/**
 * Compute all non-zero derivatives of B-spline basis functions
 * @param[in] deg Degree of the basis function.
 * @param[in] span Index obtained from findSpan() corresponding the u and knots.
 * @param[in] knots Knot vector corresponding to the basis functions.
 * @param[in] u Parameter to evaluate the basis functions at.
 * @param[in] num_ders Number of derivatives to compute (num_ders <= deg)
 * @return ders Values of non-zero derivatives of basis functions.
 */
template <typename T>
array2<T> bsplineDerBasis(unsigned int deg, int span, const std::vector<T> &knots, T u,
                          int num_ders)
{
    std::vector<T> left, right;
    left.resize(deg + 1, 0.0);
    right.resize(deg + 1, 0.0);
    T saved = 0.0, temp = 0.0;

    array2<T> ndu(deg + 1, deg + 1);
    ndu(0, 0) = 1.0;

    for (int j = 1; j <= deg; j++)
    {
        left[j] = u - knots[span + 1 - j];
        right[j] = knots[span + j] - u;
        saved = 0.0;

        for (int r = 0; r < j; r++)
        {
            // Lower triangle
            ndu(j, r) = right[r + 1] + left[j - r];
            temp = ndu(r, j - 1) / ndu(j, r);
            // Upper triangle
            ndu(r, j) = saved + right[r + 1] * temp;
            saved = left[j - r] * temp;
        }

        ndu(j, j) = saved;
    }

    array2<T> ders(num_ders + 1, deg + 1, T(0));

    for (int j = 0; j <= deg; j++)
    {
        ders(0, j) = ndu(j, deg);
    }

    array2<T> a(2, deg + 1);

    for (int r = 0; r <= deg; r++)
    {
        int s1 = 0;
        int s2 = 1;
        a(0, 0) = 1.0;

        for (int k = 1; k <= num_ders; k++)
        {
            T d = 0.0;
            int rk = r - k;
            int pk = deg - k;
            int j1 = 0;
            int j2 = 0;

            if (r >= k)
            {
                a(s2, 0) = a(s1, 0) / ndu(pk + 1, rk);
                d = a(s2, 0) * ndu(rk, pk);
            }

            if (rk >= -1)
            {
                j1 = 1;
            }
            else
            {
                j1 = -rk;
            }

            if (r - 1 <= pk)
            {
                j2 = k - 1;
            }
            else
            {
                j2 = deg - r;
            }

            for (int j = j1; j <= j2; j++)
            {
                a(s2, j) = (a(s1, j) - a(s1, j - 1)) / ndu(pk + 1, rk + j);
                d += a(s2, j) * ndu(rk + j, pk);
            }

            if (r <= pk)
            {
                a(s2, k) = -a(s1, k - 1) / ndu(pk + 1, r);
                d += a(s2, k) * ndu(r, pk);
            }

            ders(k, r) = d;

            int temp = s1;
            s1 = s2;
            s2 = temp;
        }
    }

    T fac = static_cast<T>(deg);
    for (int k = 1; k <= num_ders; k++)
    {
        for (int j = 0; j <= deg; j++)
        {
            ders(k, j) *= fac;
        }
        fac *= static_cast<T>(deg - k);
    }

    return ders;
}

} // namespace tinynurbs

#endif // TINYNURBS_BASIS_H
