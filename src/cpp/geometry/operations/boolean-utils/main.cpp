#include <iostream>
#include "fuzzy-bools.h"

std::vector<double> va;
std::vector<uint32_t> ia;
std::vector<double> vb;
std::vector<uint32_t> ib;

struct AllocResult
{
    uint32_t vptr_a = 0;
    uint32_t iptr_a = 0;
    uint32_t vptr_b = 0;
    uint32_t iptr_b = 0;
};

AllocResult Alloc(uint32_t vsizeA, uint32_t isizeA, uint32_t vsizeB, uint32_t isizeB)
{
    std::cout << "Alloc: " << vsizeA << std::endl;

    va.resize(vsizeA, vsizeA);
    ia.resize(isizeA, isizeA);
    vb.resize(vsizeB, vsizeB);
    ib.resize(isizeB, isizeB);

    AllocResult result;
    result.vptr_a = (uint32_t)va.data();
    result.iptr_a = (uint32_t)ia.data();
    result.vptr_b = (uint32_t)vb.data();
    result.iptr_b = (uint32_t)ib.data();
    return result;
}

std::vector<double> resultVertices;
std::vector<uint32_t> resultIndices;

struct BoolResult
{
    uint32_t numVertices = 0;
    uint32_t numIndices = 0;
    uint32_t vptr = 0;
    uint32_t iptr = 0;
};

BoolResult DoSubtract() 
{
    fuzzybools::Geometry A;
    fuzzybools::Geometry B;

    A.BuildFromVectors(va, ia);
    B.BuildFromVectors(vb, ib);

    auto outputGeometry = fuzzybools::Subtract(A, B);

    resultVertices = outputGeometry.vertexData;
    resultIndices = outputGeometry.indexData;

    BoolResult result;

    result.numVertices = resultVertices.size();
    result.numIndices = resultIndices.size();

    result.vptr = (uint32_t)resultVertices.data();
    result.iptr = (uint32_t)resultIndices.data();

    return result;
}