#include "../boolean-utils/fuzzy-bools.h"
#include "geometry.h"

#pragma once

namespace bimGeometry 
{
    fuzzybools::Geometry convertToEngine(Geometry geom)
    {
        fuzzybools::Geometry newGeom;
        newGeom.fvertexData = geom.fvertexData;
		newGeom.vertexData = geom.vertexData;
		newGeom.indexData = geom.indexData;
        newGeom.planeData = geom.planeData;
		newGeom.numPoints = geom.numPoints;
		newGeom.numFaces = geom.numFaces;
        for(auto plane: geom.planes)
        {
            fuzzybools::SimplePlane newPlane;
            newPlane.distance = plane.distance;
            newPlane.normal = plane.normal;
            newGeom.planes.push_back(newPlane);
        }
        newGeom.hasPlanes = geom.hasPlanes;
        return newGeom;
    }

    Geometry convertToBim(fuzzybools::Geometry geom)
    {
        Geometry newGeom;
        newGeom.fvertexData = geom.fvertexData;
		newGeom.vertexData = geom.vertexData;
		newGeom.indexData = geom.indexData;
        newGeom.planeData = geom.planeData;
		newGeom.numPoints = geom.numPoints;
		newGeom.numFaces = geom.numFaces;
        uint32_t id = 0;
        for(auto plane: geom.planes)
        {
            Plane newPlane;
            newPlane.id = id;
            newPlane.distance = plane.distance;
            newPlane.normal = plane.normal;
            newGeom.planes.push_back(newPlane);
            id++;
        }
        newGeom.hasPlanes = geom.hasPlanes;
        return newGeom;
    }

    Geometry Union(Geometry firstOperator, Geometry secondOperator)
    {        
        fuzzybools::Geometry firstEngGeom = convertToEngine(firstOperator);
        fuzzybools::Geometry secondEngGeom = convertToEngine(secondOperator);
        return convertToBim(fuzzybools::Union(firstEngGeom, secondEngGeom));
    }

    Geometry Subtract(Geometry firstOperator, Geometry secondOperator)
    {
        fuzzybools::Geometry firstEngGeom = convertToEngine(firstOperator);
        fuzzybools::Geometry secondEngGeom = convertToEngine(secondOperator);
        return convertToBim(fuzzybools::Subtract(firstEngGeom, secondEngGeom));
    }

    Geometry BoolProcess(Geometry firstOperator, std::vector<Geometry> &secondGeoms, std::string op)
    {
        Geometry finalResult;

        for (auto &secondGeom : secondGeoms)
        {
            bool doit = true;
            if (secondGeom.numFaces == 0)
            {

                // bail out because we will get strange meshes
                // if this happens, probably there's an issue parsing the mesh that occurred earlier
                doit = false;
            }

            if (firstOperator.numFaces == 0 && op != "UNION")
            {

                // bail out because we will get strange meshes
                // if this happens, probably there's an issue parsing the mesh that occurred earlier
                break;
            }

            if (doit)
            {
                Geometry secondOperator;
                secondOperator = secondGeom;
                firstOperator.buildPlanes();
                secondOperator.buildPlanes();

                if (op == "DIFFERENCE")
                {
                    firstOperator = Subtract(firstOperator, secondOperator);
                }
                else if (op == "UNION")
                {
                    firstOperator = Union(firstOperator, secondOperator);
                }
            }
        }
        finalResult.AddGeometry(firstOperator);

        return finalResult;
    }
}