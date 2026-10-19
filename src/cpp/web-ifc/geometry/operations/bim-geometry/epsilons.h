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
    // A shared face normal may replace a triangle normal within ~1e-4 rad.
    constexpr double SHARED_NORMAL_MIN_COS = 1.0 - 1.0E-08;
    // Normals of triangles grouped into one plane by vertex distance may differ by ~1.4e-3 rad.
    constexpr double COPLANAR_MIN_COS = 1.0 - 1.0E-06;

    /*
        Used before boolean differences in IfcGeometryProcessor.cpp
    */
    // Cutter faces within this many plane deviation tolerances of a parallel operand face are snapped onto it.
    constexpr double SNAP_TO_OPERAND_PLANE_FACTOR = 2.0;
    // Cutter vertices closer than this are treated as copies of one position while snapping.
    constexpr double SNAP_WELD_DISTANCE = 1.0E-09;
}