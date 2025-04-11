#pragma once

namespace bimGeometry
{
    constexpr double  EPS_TINY_CURVE = 1e-9;
    constexpr double EPS_NONZERO    = 1.0E-20;
    constexpr double EPS_MINISCULE  = 1.0E-12;
    constexpr double EPS_TINY       = 1.0E-04;
    constexpr double EPS_SMALL      = 1.0E-04;
    constexpr double EPS_BIG        = 1.0E-04;
    constexpr double EPS_BIG2       = 1.0E-03;
    constexpr double SCALED_EPS_BIG = 1.0E-04;

    /*
        Constants used in function AddFace in geometry.h
    */    
    constexpr double toleranceAddFace = 1.0E-10;
    
}