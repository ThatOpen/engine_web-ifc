#pragma once

namespace bimGeometry
{

    inline double _TOLERANCE_SCALAR_EQUALITY = 1.0E-04;
    inline double _PLANE_REFIT_ITERATIONS = 1;
    inline double _BOOLEAN_UNION_THRESHOLD = 150;

    constexpr double EPS_TINY_CURVE = 1.0E-09;
    constexpr double EPS_NONZERO = 1.0E-20;
    constexpr double EPS_MINISCULE = 1.0E-12;
    constexpr double EPS_TINY = 1.0E-04;
    constexpr double EPS_SMALL = 1.0E-04;
    constexpr double EPS_BIG = 1.0E-04;
    constexpr double EPS_BIG2 = 1.0E-03;
    constexpr double SCALED_EPS_BIG = 1.0E-04;

    /*
        Constants used in function AddFace in geometry.h
    */
    constexpr double toleranceAddFace = 1.0E-10;
    constexpr double toleranceVectorEquality = 1.0E-04;

    /*
        Used in geometry.cpp
    */
    constexpr double reconstructTolerance = 1.0E-01;
}