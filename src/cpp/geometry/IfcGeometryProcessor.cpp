/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

#include <spdlog/spdlog.h>

#if defined(DEBUG_DUMP_SVG) || defined(DUMP_CSG_MESHES)
#include "../test/io_helpers.h"
#endif

#include "IfcGeometryProcessor.h"
#include <glm/gtx/transform.hpp>
#include "representation/geometry.h"
#include "operations/geometryutils.h"
#include "operations/curve-utils.h"
#include "operations/mesh_utils.h"
#include "operations/boolean-utils/fuzzy-bools.h"

namespace webifc::geometry
{
    IfcGeometryProcessor::IfcGeometryProcessor(const webifc::parsing::IfcLoader &loader, const webifc::schema::IfcSchemaManager &schemaManager, uint16_t circleSegments, bool coordinateToOrigin)
        : _geometryLoader(loader, schemaManager, circleSegments), _loader(loader), _schemaManager(schemaManager), _coordinateToOrigin(coordinateToOrigin), _circleSegments(circleSegments)
    {
    }

    IfcGeometryLoader IfcGeometryProcessor::GetLoader() const
    {
        return _geometryLoader;
    }

    void IfcGeometryProcessor::SetTransformation(const std::array<double, 16> &val)
    {
        glm::dmat4 transformation;
        glm::dvec4 v1(val[0], val[1], val[2], val[3]);
        glm::dvec4 v2(val[4], val[5], val[6], val[7]);
        glm::dvec4 v3(val[8], val[9], val[10], val[11]);
        glm::dvec4 v4(val[12], val[13], val[14], val[15]);

        transformation[0] = v1;
        transformation[1] = v2;
        transformation[2] = v3;
        transformation[3] = v4;
        _transformation = transformation;
    }

    IfcGeometry &IfcGeometryProcessor::GetGeometry(uint32_t expressID)
    {
        return _expressIDToGeometry[expressID];
    }

    void IfcGeometryProcessor::Clear()
    {
        _expressIDToGeometry.clear();
        std::unordered_map<uint32_t, IfcGeometry>().swap(_expressIDToGeometry);
        _geometryLoader.Clear();
    }

    std::array<double, 16> IfcGeometryProcessor::GetFlatCoordinationMatrix() const
    {
        std::array<double, 16> flatTransformation;
        for (int i = 0; i < 4; i++)
        {
            for (int j = 0; j < 4; j++)
            {
                flatTransformation[i * 4 + j] = _coordinationMatrix[i][j];
            }
        }
        return flatTransformation;
    }

    glm::dmat4 IfcGeometryProcessor::GetCoordinationMatrix() const
    {
        return _coordinationMatrix;
    }

    std::optional<glm::dvec4> IfcGeometryProcessor::GetStyleItemFromExpressId(uint32_t expressID)
    {
        std::optional<glm::dvec4> styledItemColor;
        auto &styledItems = _geometryLoader.GetStyledItems();
        auto &relMaterials = _geometryLoader.GetRelMaterials();
        auto &materialDefinitions = _geometryLoader.GetMaterialDefinitions();
        auto styledItem = styledItems.find(expressID);
        if (styledItem != styledItems.end())
        {
            auto items = styledItem->second;
            for (auto item : items)
            {
                styledItemColor = _geometryLoader.GetColor(item.second);
                if (styledItemColor)
                    break;
            }
        }

        if (!styledItemColor)
        {
            auto material = relMaterials.find(expressID);
            if (material != relMaterials.end())
            {
                auto &materials = material->second;
                for (auto item : materials)
                {
                    if (materialDefinitions.count(item.second) != 0)
                    {
                        auto &defs = materialDefinitions.at(item.second);
                        for (auto def : defs)
                        {
                            styledItemColor = _geometryLoader.GetColor(def.second);
                            if (styledItemColor)
                                break;
                        }
                    }

                    // if no color found, check material itself
                    if (!styledItemColor)
                    {
                        styledItemColor = _geometryLoader.GetColor(item.second);
                        if (styledItemColor)
                            break;
                    }
                }
            }
        }
        return styledItemColor;
    }

    IfcComposedMesh IfcGeometryProcessor::GetMesh(uint32_t expressID)
    {
        spdlog::debug("[GetMesh({})]",expressID);
        auto lineType = _loader.GetLineType(expressID);
        auto relVoids = _geometryLoader.GetRelVoids();
        auto &relElementAggregates = _geometryLoader.GetRelElementAggregates();

        
        IfcComposedMesh mesh;
        mesh.expressID = expressID;
        std::optional<glm::dvec4> generatedColor = GetStyleItemFromExpressId(expressID);
        if (!generatedColor) 
        {
            mesh.color = glm::dvec4(1.0);
            mesh.hasColor = false;
        } else {
            mesh.color = generatedColor.value();
            mesh.hasColor = true;
        }

        mesh.transformation = glm::dmat4(1);

        if (_schemaManager.IsIfcElement(lineType))
        {
            _loader.MoveToArgumentOffset(expressID, 5);
            uint32_t localPlacement = 0;
            if (_loader.GetTokenType() == parsing::IfcTokenType::REF)
            {
                _loader.StepBack();
                localPlacement = _loader.GetRefArgument();
            }
            uint32_t ifcPresentation = 0;
            if (_loader.GetTokenType() == parsing::IfcTokenType::REF)
            {
                _loader.StepBack();
                ifcPresentation = _loader.GetRefArgument();
            }

            if (localPlacement != 0 && _loader.IsValidExpressID(localPlacement))
            {
                mesh.transformation = _geometryLoader.GetLocalPlacement(localPlacement);
            }

            if (ifcPresentation != 0 && _loader.IsValidExpressID(ifcPresentation))
            {
                mesh.children.push_back(GetMesh(ifcPresentation));
            }

            auto relVoidsIt = relVoids.find(expressID);

            auto relAggIt = relElementAggregates.find(expressID);
            if (relAggIt != relElementAggregates.end() && !relAggIt->second.empty())
            {
                for (auto relAggExpressID : relAggIt->second)
                {
                    auto relVoidsIt2 = relVoids.find(relAggExpressID);
                    if (relVoidsIt2 != relVoids.end() && !relVoidsIt2->second.empty())
                    {
                        if (relVoidsIt != relVoids.end() && !relVoidsIt->second.empty())
                        {
                            relVoidsIt->second.insert(relVoidsIt->second.end(), relVoidsIt2->second.begin(), relVoidsIt2->second.end());
                        }
                        else
                        {
                            relVoidsIt = relVoidsIt2;
                        }
                    }
                }
            }

            if (relVoidsIt != relVoids.end() && !relVoidsIt->second.empty())
            {
                IfcComposedMesh resultMesh;

                auto origin = GetOrigin(mesh, _expressIDToGeometry);
                auto normalizeMat = glm::translate(-origin);
                auto flatElementMeshes = flatten(mesh, _expressIDToGeometry, normalizeMat);
                auto elementColor = mesh.GetColor();

                IfcGeometry finalGeometry;

                if (flatElementMeshes.size() != 0)
                {

                    std::vector<IfcGeometry> voidGeoms;

                    for (auto relVoidExpressID : relVoidsIt->second)
                    {
                        IfcComposedMesh voidGeom = GetMesh(relVoidExpressID);
                        auto flatVoidMesh = flatten(voidGeom, _expressIDToGeometry, normalizeMat);
                        voidGeoms.insert(voidGeoms.end(), flatVoidMesh.begin(), flatVoidMesh.end());
                    }

                    if(relVoidsIt->second.size() > 50) // When voids are greater than 10 they are all fused
                    {   
                        std::vector<IfcGeometry> joinedVoidGeoms;
                        IfcGeometry fusedVoids;
                        for (auto geom : voidGeoms)
                        {
                            if (geom.halfSpace)
                            {
                                joinedVoidGeoms.push_back(geom);
                            }
                            else
                            {
                                std::vector<IfcGeometry> geomVector = {geom};  // Wrap 'geom' in a vector
                                fusedVoids = BoolProcess(std::vector<IfcGeometry>{fusedVoids}, geomVector, "UNION");
                            }
                        }

                        #ifdef CSG_DEBUG_OUTPUT
                            // io::DumpIfcGeometry(fusedVoids, "union_bool_void.obj");
                        #endif

                        joinedVoidGeoms.push_back(fusedVoids);

                        voidGeoms = joinedVoidGeoms;
                        voidGeoms.shrink_to_fit();
                    }

                    // if(flatElementMeshes.size() > 10) // When elements are greater than 10 they are all fused
                    // {   
                    //     std::vector<IfcGeometry> joinedMeshGeoms;
                    //     IfcGeometry fusedMesh;
                    //     for (auto geom : flatElementMeshes)
                    //     {
                    //         if (geom.halfSpace)
                    //         {
                    //             joinedMeshGeoms.push_back(geom);
                    //         }
                    //         else
                    //         {
                    //             #ifdef CSG_DEBUG_OUTPUT
                    //                 // io::DumpIfcGeometry(fusedMesh, "union_bool_solid_partial_A.obj");
                    //             #endif

                    //             #ifdef CSG_DEBUG_OUTPUT
                    //                 // io::DumpIfcGeometry(geom, "union_bool_solid_partial_B.obj");
                    //             #endif

                    //             std::vector<IfcGeometry> geomVector = {geom};  // Wrap 'geom' in a vector
                    //             fusedMesh = BoolProcess(std::vector<IfcGeometry>{fusedMesh}, geomVector, "UNION");

                    //             #ifdef CSG_DEBUG_OUTPUT
                    //                 // io::DumpIfcGeometry(fusedMesh, "union_bool_solid_partial.obj");
                    //             #endif
                    //         }
                    //     }

                    //     #ifdef CSG_DEBUG_OUTPUT
                    //         // io::DumpIfcGeometry(fusedMesh, "union_bool_solid.obj");
                    //     #endif

                    //     joinedMeshGeoms.push_back(fusedMesh);

                    //     flatElementMeshes = joinedMeshGeoms;
                    //     flatElementMeshes.shrink_to_fit();
                    // }

                    finalGeometry = BoolProcess(flatElementMeshes, voidGeoms, "DIFFERENCE");
                    
                    #ifdef CSG_DEBUG_OUTPUT
                        io::DumpIfcGeometry(finalGeometry, "mesh_bool.obj");
                    #endif
                }

                _expressIDToGeometry[expressID] = finalGeometry;
                resultMesh.transformation = glm::translate(origin);
                resultMesh.expressID = expressID;
                resultMesh.hasGeometry = true;
                // If there is no styledItemcolor apply color of the object
                if (mesh.hasColor)
                {
                    resultMesh.color = mesh.color;
                    resultMesh.hasColor = true;
                }
                else if (elementColor.has_value())
                {
                    resultMesh.hasColor = true;
                    resultMesh.color = *elementColor;
                }
                else
                {
                    resultMesh.hasColor = false;
                }

                return resultMesh;
            }
            else
            {
                return mesh;
            }
            
        }
        else
        {
            switch (lineType)
            {
            case schema::IFCSECTIONEDSOLIDHORIZONTAL:
            case schema::IFCSECTIONEDSOLID:
            case schema::IFCSECTIONEDSURFACE:
            {
                auto geom = SectionedSurface(_geometryLoader.GetCrossSections3D(expressID));
                mesh.transformation = glm::dmat4(1);
                // TODO: this is getting problematic.....
                _expressIDToGeometry[expressID] = geom;
                mesh.hasGeometry = true;

                // #ifdef DEBUG_DUMP_SVG
                //     webifc::io::DumpSectionCurves(curves,"sectioned.obj");
                //     webifc::io::DumpIfcGeometry(geom, "geom.obj");
                // #endif

                return mesh;

                break;
            }
            case schema::IFCMAPPEDITEM:
            {
                _loader.MoveToArgumentOffset(expressID, 0);
                uint32_t ifcPresentation = _loader.GetRefArgument();
                uint32_t localPlacement = _loader.GetRefArgument();

                mesh.transformation = _geometryLoader.GetLocalPlacement(localPlacement);
                mesh.children.push_back(GetMesh(ifcPresentation));

                return mesh;
            }
            case schema::IFCBOOLEANCLIPPINGRESULT:
            {
                _loader.MoveToArgumentOffset(expressID, 1);
                uint32_t firstOperandID = _loader.GetRefArgument();
                uint32_t secondOperandID = _loader.GetRefArgument();

                auto firstMesh = GetMesh(firstOperandID);
                auto secondMesh = GetMesh(secondOperandID);

                auto origin = GetOrigin(firstMesh, _expressIDToGeometry);
                auto normalizeMat = glm::translate(-origin);

                auto flatFirstMeshes = flatten(firstMesh, _expressIDToGeometry, normalizeMat);
                auto flatSecondMeshes = flatten(secondMesh, _expressIDToGeometry, normalizeMat);

                IfcGeometry resultMesh = BoolProcess(flatFirstMeshes, flatSecondMeshes, "DIFFERENCE");

                _expressIDToGeometry[expressID] = resultMesh;
                mesh.hasGeometry = true;
                mesh.transformation = glm::translate(origin);

                if (!mesh.hasColor && firstMesh.hasColor)
                {
                    mesh.hasColor = true;
                    mesh.color = firstMesh.color;
                }

                return mesh;
            }
            case schema::IFCBOOLEANRESULT:
            {
                // @Refactor: duplicate of above

                _loader.MoveToArgumentOffset(expressID, 0);
                std::string_view op = _loader.GetStringArgument();

                if (op != "DIFFERENCE" && op != "UNION")
                {
                   spdlog::error("[GetMesh()] Unsupported boolean op {}",std::string(op), expressID);
                    return mesh;
                }

                uint32_t firstOperandID = _loader.GetRefArgument();
                uint32_t secondOperandID = _loader.GetRefArgument();

                auto firstMesh = GetMesh(firstOperandID);
                auto secondMesh = GetMesh(secondOperandID);

                auto origin = GetOrigin(firstMesh, _expressIDToGeometry);
                auto normalizeMat = glm::translate(-origin);

                auto flatFirstMeshes = flatten(firstMesh, _expressIDToGeometry, normalizeMat);
                auto flatSecondMeshes = flatten(secondMesh, _expressIDToGeometry, normalizeMat);

                if (flatFirstMeshes.size() == 0)
                {
                    // bail out because we will get strange meshes
                    // if this happens, probably there's an issue parsing the first mesh
                    return mesh;
                }

                IfcGeometry resultMesh = BoolProcess(flatFirstMeshes, flatSecondMeshes, std::string(op));

                _expressIDToGeometry[expressID] = resultMesh;
                mesh.hasGeometry = true;
                mesh.transformation = glm::translate(origin);
                if (!mesh.hasColor && firstMesh.hasColor)
                {
                    mesh.hasColor = true;
                    mesh.color = firstMesh.color;
                }

                return mesh;
            }
            case schema::IFCHALFSPACESOLID:
            {
                _loader.MoveToArgumentOffset(expressID, 0);
                uint32_t surfaceID = _loader.GetRefArgument();
                std::string_view agreement = _loader.GetStringArgument();

                IfcSurface surface = GetSurface(surfaceID);

                glm::dvec3 extrusionNormal = glm::dvec3(0, 0, 1);

                bool flipWinding = false;
                if (agreement == "T")
                {
                    extrusionNormal *= -1;
                    flipWinding = true;
                }

                double d = 1;

                IfcProfile profile;
                profile.isConvex = false;
                profile.curve = GetRectangleCurve(d, d, glm::dmat3(1));

                auto geom = Extrude(profile, extrusionNormal, d);
                geom.halfSpace = true;

                // @Refactor: duplicate of extrudedareasolid
                if (flipWinding)
                {
                    for (uint32_t i = 0; i < geom.numFaces; i++)
                    {
                        uint32_t temp = geom.indexData[i * 3 + 0];
                        temp = geom.indexData[i * 3 + 0];
                        geom.indexData[i * 3 + 0] = geom.indexData[i * 3 + 1];
                        geom.indexData[i * 3 + 1] = temp;
                    }
                }

                mesh.transformation = surface.transformation;
                // TODO: this is getting problematic.....
                _expressIDToGeometry[expressID] = geom;
                mesh.hasGeometry = true;

                return mesh;
            }
            case schema::IFCPOLYGONALBOUNDEDHALFSPACE:
            {
                _loader.MoveToArgumentOffset(expressID, 0);
                uint32_t surfaceID = _loader.GetRefArgument();
                std::string_view agreement = _loader.GetStringArgument();
                uint32_t positionID = _loader.GetRefArgument();
                uint32_t boundaryID = _loader.GetRefArgument();

                IfcSurface surface = GetSurface(surfaceID);
                glm::dmat4 position = _geometryLoader.GetLocalPlacement(positionID);
                IfcCurve curve = _geometryLoader.GetCurve(boundaryID, 2);

                if (!curve.IsCCW())
                {
                    curve.Invert();
                }

                glm::dvec3 extrusionNormal = glm::dvec3(0, 0, 1);
                glm::dvec3 planeNormal = surface.transformation[2];
                glm::dvec3 planePosition = surface.transformation[3];

                glm::dmat4 invPosition = glm::inverse(position);
                glm::dvec3 localPlaneNormal = invPosition * glm::dvec4(planeNormal, 0);
                auto localPlanePos = invPosition * glm::dvec4(planePosition, 1);

                bool flipWinding = false;
                double extrudeDistance = EXTRUSION_DISTANCE_HALFSPACE_M / _geometryLoader.GetLinearScalingFactor();

                bool halfSpaceInPlaneDirection = agreement != "T";
                bool extrudeInPlaneDirection = glm::dot(localPlaneNormal, extrusionNormal) > 0;
                bool ignoreDistanceInExtrude = (!halfSpaceInPlaneDirection && extrudeInPlaneDirection) || (halfSpaceInPlaneDirection && !extrudeInPlaneDirection);
                if (ignoreDistanceInExtrude)
                {
                    // spec says this should be * 0, but that causes issues for degenerate 0 volume pbhs
                    // hopefully we can get away by just inverting it
                    extrudeDistance *= -1;
                    flipWinding = true;
                }

                IfcProfile profile;
                profile.isConvex = false;
                profile.curve = curve;

                auto geom = Extrude(profile, extrusionNormal, extrudeDistance, localPlaneNormal, localPlanePos);
                // auto geom = Extrude(profile, surface.transformation, extrusionNormal, EXTRUSION_DISTANCE_HALFSPACE);

                // @Refactor: duplicate of extrudedareasolid
                if (flipWinding)
                {
                    for (uint32_t i = 0; i < geom.numFaces; i++)
                    {
                        uint32_t temp = geom.indexData[i * 3 + 0];
                        temp = geom.indexData[i * 3 + 0];
                        geom.indexData[i * 3 + 0] = geom.indexData[i * 3 + 1];
                        geom.indexData[i * 3 + 1] = temp;
                    }
                }

                #ifdef DUMP_CSG_MESHES
                    DumpIfcGeometry(geom, "pbhs.obj");
                #endif

                // TODO: this is getting problematic.....
                _expressIDToGeometry[expressID] = geom;
                mesh.hasGeometry = true;
                mesh.transformation = position;

                return mesh;
            }
            case schema::IFCREPRESENTATIONMAP:
            {
                _loader.MoveToArgumentOffset(expressID, 0);
                uint32_t axis2Placement = _loader.GetRefArgument();
                uint32_t ifcPresentation = _loader.GetRefArgument();

                mesh.transformation = _geometryLoader.GetLocalPlacement(axis2Placement);
                mesh.children.push_back(GetMesh(ifcPresentation));

                return mesh;
            }
            case schema::IFCFACEBASEDSURFACEMODEL:
            case schema::IFCSHELLBASEDSURFACEMODEL:
            {
                _loader.MoveToArgumentOffset(expressID, 0);
                auto shells = _loader.GetSetArgument();

                for (auto &shell : shells)
                {
                    uint32_t shellRef = _loader.GetRefArgument(shell);
                    IfcComposedMesh temp;
                    _expressIDToGeometry[shellRef] = GetBrep(shellRef);
                    std::optional<glm::dvec4> shellColor = GetStyleItemFromExpressId(shellRef);
                    if (shellColor) {
                        temp.color=shellColor.value();
                        temp.hasColor=true;
                    }
                    temp.expressID = shellRef;
                    temp.hasGeometry = true;
                    temp.transformation = glm::dmat4(1);
                    mesh.children.push_back(temp);
                }

                return mesh;
            }
            case schema::IFCADVANCEDBREP:
            {
                _loader.MoveToArgumentOffset(expressID, 0);
                uint32_t ifcPresentation = _loader.GetRefArgument();

                _expressIDToGeometry[expressID] = GetBrep(ifcPresentation);
                if (!mesh.hasColor) mesh.color=GetStyleItemFromExpressId(ifcPresentation).value_or(glm::dvec4(1.0));
                mesh.hasGeometry = true;

                return mesh;
            }
            case schema::IFCFACETEDBREP:
            {
                _loader.MoveToArgumentOffset(expressID, 0);
                uint32_t ifcPresentation = _loader.GetRefArgument();

                _expressIDToGeometry[expressID] = GetBrep(ifcPresentation);
                if (!mesh.hasColor) mesh.color=GetStyleItemFromExpressId(ifcPresentation).value_or(glm::dvec4(1.0));;
                mesh.hasGeometry = true;

                return mesh;
            }
            case schema::IFCPRODUCTREPRESENTATION:
            case schema::IFCPRODUCTDEFINITIONSHAPE:
            {
                _loader.MoveToArgumentOffset(expressID, 2);
                auto representations = _loader.GetSetArgument();

                for (auto &repToken : representations)
                {
                    uint32_t repID = _loader.GetRefArgument(repToken);
                    mesh.children.push_back(GetMesh(repID));
                }

                return mesh;
            }
            case schema::IFCSHAPEREPRESENTATION:
            {
                _loader.MoveToArgumentOffset(expressID, 1);
                auto type = _loader.GetStringArgument();

                _loader.MoveToArgumentOffset(expressID, 3);
                auto repItems = _loader.GetSetArgument();

                for (auto &repToken : repItems)
                {
                    uint32_t repID = _loader.GetRefArgument(repToken);
                    mesh.children.push_back(GetMesh(repID));
                }

                return mesh;
            }
            case schema::IFCPOLYGONALFACESET:
            {
                _loader.MoveToArgumentOffset(expressID, 0);

                auto coordinatesRef = _loader.GetRefArgument();
                auto points = _geometryLoader.ReadIfcCartesianPointList3D(coordinatesRef);

                // second optional argument closed, ignored

                // indices
                _loader.MoveToArgumentOffset(expressID, 2);
                auto faces = _loader.GetSetArgument();

                IfcGeometry geom;

                std::vector<IfcBound3D> bounds;
                for (auto &face : faces)
                {
                    uint32_t faceID = _loader.GetRefArgument(face);
                    ReadIndexedPolygonalFace(faceID, bounds, points);

                    TriangulateBounds(geom, bounds, expressID);

                    bounds.clear();
                }

                _loader.MoveToArgumentOffset(expressID, 3);
                if (_loader.GetTokenType() == parsing::IfcTokenType::SET_BEGIN)
                {
                    spdlog::error("[GetMesh()] Unsupported IFCPOLYGONALFACESET with PnIndex {}", expressID);
                }

                _expressIDToGeometry[expressID] = geom;
                mesh.expressID = expressID;
                mesh.hasGeometry = true;

                return mesh;
            }
            case schema::IFCTRIANGULATEDFACESET:
            {
                _loader.MoveToArgumentOffset(expressID, 0);

                auto coordinatesRef = _loader.GetRefArgument();
                auto points = _geometryLoader.ReadIfcCartesianPointList3D(coordinatesRef);

                // second argument normals, ignored
                // third argument closed, ignored

                // indices
                _loader.MoveToArgumentOffset(expressID, 3);
                auto indices = Read2DArrayOfThreeIndices();

                IfcGeometry geom;

                _loader.MoveToArgumentOffset(expressID, 4);
                if (_loader.GetTokenType() == parsing::IfcTokenType::SET_BEGIN)
                {
                    _loader.StepBack();
                    auto pnIndex = Read2DArrayOfThreeIndices();

                    // ignore
                    // std::cout << "Unsupported IFCTRIANGULATEDFACESET with PnIndex!" << std::endl;
                }

                for (size_t i = 0; i < indices.size(); i += 3)
                {
                    int i1 = indices[i + 0] - 1;
                    int i2 = indices[i + 1] - 1;
                    int i3 = indices[i + 2] - 1;

                    geom.AddFace(points[i1], points[i2], points[i3]);
                }

                // DumpIfcGeometry(geom, "test.obj");

                _expressIDToGeometry[expressID] = geom;
                mesh.expressID = expressID;
                mesh.hasGeometry = true;

                return mesh;
            }
            case schema::IFCSURFACECURVESWEPTAREASOLID:
            {

                // TODO: closed sweeps not implemented
                // TODO: the plane is not being used now

                _loader.MoveToArgumentOffset(expressID, 0);

                IfcProfile profile;
                glm::dmat4 placement(1);
                IfcCurve directrix;
                IfcSurface surface;

                double startParam = 0;
                double endParam = 1;
                auto profileID = _loader.GetRefArgument();
                auto placementID = _loader.GetRefArgument();
                auto directrixRef = _loader.GetRefArgument();
                bool closed = false;

                if (_loader.GetTokenType() == parsing::IfcTokenType::REAL)
                {
                    _loader.StepBack();
                    startParam = _loader.GetDoubleArgument();
                }

                if (_loader.GetTokenType() == parsing::IfcTokenType::REAL)
                {
                    _loader.StepBack();
                    endParam = _loader.GetDoubleArgument();
                }

                auto surfaceID = _loader.GetRefArgument();

                if (profileID)
                {
                    profile = _geometryLoader.GetProfile(profileID);
                }
                else
                {
                    break;
                }

                if (placementID)
                {
                    placement = _geometryLoader.GetLocalPlacement(placementID);
                }

                if (directrixRef)
                {
                    directrix = _geometryLoader.GetCurve(directrixRef, 3);
                }
                else
                {
                    break;
                }

                double dst = glm::distance(directrix.points[0], directrix.points[directrix.points.size() - 1]);
                if (startParam == 0 && endParam == 1 && dst < 1e-5)
                {
                    closed = true;
                }

                if (surfaceID)
                {
                    surface = GetSurface(surfaceID);
                }
                else
                {
                    break;
                }

                std::reverse(profile.curve.points.begin(), profile.curve.points.end());

                IfcGeometry geom = Sweep(_geometryLoader.GetLinearScalingFactor(), closed, profile, directrix, surface.normal(), true);

                mesh.transformation = placement;
                _expressIDToGeometry[expressID] = geom;
                mesh.expressID = expressID;
                mesh.hasGeometry = true;

                return mesh;
            }
            case schema::IFCSWEPTDISKSOLID:
            {

                // TODO: prevent self intersections in Sweep function still not working properly

                bool closed = false;

                _loader.MoveToArgumentOffset(expressID, 0);
                auto directrixRef = _loader.GetRefArgument();

                double radius = _loader.GetDoubleArgument();
                // double innerRadius = 0.0;

                if (_loader.GetTokenType() == parsing::IfcTokenType::REAL)
                {
                    spdlog::error("[GetMesh()] Inner radius of IFCSWEPTDISKSOLID currently not supported {}", expressID);
                    _loader.StepBack();
                    _loader.GetDoubleArgument();
                }

                // double startParam = 0;
                // double endParam = 0;

                if (_loader.GetTokenType() == parsing::IfcTokenType::REAL)
                {
                    _loader.StepBack();
                    _loader.GetDoubleArgument();
                }

                if (_loader.GetTokenType() == parsing::IfcTokenType::REAL)
                {
                    _loader.StepBack();
                    _loader.GetDoubleArgument();
                }

                IfcCurve directrix = _geometryLoader.GetCurve(directrixRef, 3);

                IfcProfile profile;
                profile.curve = GetCircleCurve(radius, _circleSegments);

                IfcGeometry geom = SweepCircular(_geometryLoader.GetLinearScalingFactor(), mesh, closed, profile, radius, directrix);

                _expressIDToGeometry[expressID] = geom;
                mesh.expressID = expressID;
                mesh.hasGeometry = true;

                return mesh;
            }
            case schema::IFCREVOLVEDAREASOLID:
            {
                IfcComposedMesh mesh;

                _loader.MoveToArgumentOffset(expressID, 0);
                uint32_t profileID = _loader.GetRefArgument();
                uint32_t placementID = _loader.GetRefArgument();
                uint32_t axis1PlacementID = _loader.GetRefArgument();
                double angle = angleConversion(_loader.GetDoubleArgument(), _geometryLoader.GetAngleUnits());

                IfcProfile profile = _geometryLoader.GetProfile(profileID);
                glm::dmat4 placement = _geometryLoader.GetLocalPlacement(placementID);
                glm::dvec3 axis = _geometryLoader.GetAxis1Placement(axis1PlacementID)[0];

                bool closed = false;

                glm::dvec3 pos = _geometryLoader.GetAxis1Placement(axis1PlacementID)[1];

                IfcCurve directrix = BuildArc(_geometryLoader.GetLinearScalingFactor(), pos, axis, angle, _circleSegments);
                if(glm::distance(directrix.points[0], directrix.points[directrix.points.size() - 1]) < EPS_BIG)
                {
                    closed = true;
                }

                IfcGeometry geom;

                if (!profile.isComposite)
                {
                    geom = Sweep(_geometryLoader.GetLinearScalingFactor(), closed, profile, directrix, axis, false);
                }
                else
                {
                    for (uint32_t i = 0; i < profile.profiles.size(); i++)
                    {
                        IfcGeometry geom_t = Sweep(_geometryLoader.GetLinearScalingFactor(), closed, profile.profiles[i], directrix, axis, false, false);
                        geom.AddPart(geom_t);
                        geom.AddGeometry(geom_t);
                    }
                }

                mesh.transformation = placement;
                _expressIDToGeometry[expressID] = geom;
                mesh.expressID = expressID;
                mesh.hasGeometry = true;
                if (!mesh.hasColor)
                    mesh.color = glm::dvec4(1.0);
                else
                    mesh.color = generatedColor.value();
                return mesh;
            }
            case schema::IFCEXTRUDEDAREASOLID:
            {
                _loader.MoveToArgumentOffset(expressID, 0);
                uint32_t profileID = _loader.GetRefArgument();
                uint32_t placementID = _loader.GetOptionalRefArgument();
                uint32_t directionID = _loader.GetRefArgument();
                double depth = _loader.GetDoubleArgument();

                auto lineProfileType = _loader.GetLineType(profileID);
                IfcProfile profile = _geometryLoader.GetProfile(profileID);
                if (!profile.isComposite)
                {
                    if (profile.curve.points.empty())
                    {
                        return mesh;
                    }
                }
                else
                {
                    for (uint32_t i = 0; i < profile.profiles.size(); i++)
                    {
                        if (profile.profiles[i].curve.points.empty())
                        {
                            return mesh;
                        }
                    }
                }

                if (placementID)
                {
                    mesh.transformation = _geometryLoader.GetLocalPlacement(placementID);
                }

                glm::dvec3 dir = _geometryLoader.GetCartesianPoint3D(directionID);

                double dirDot = glm::dot(dir, glm::dvec3(0, 0, 1));
                bool flipWinding = dirDot < 0; // can't be perp according to spec

                // TODO: correct dump in case of compositeProfile
                #ifdef CSG_DEBUG_OUTPUT
                    io::DumpSVGCurve(profile.curve.points, "IFCEXTRUDEDAREASOLID_curve.html");
                #endif

                IfcGeometry geom;

                if (!profile.isComposite)
                {
                    geom = Extrude(profile, dir, depth);
                    if (flipWinding)
                    {
                        for (uint32_t i = 0; i < geom.numFaces; i++)
                        {
                            uint32_t temp = geom.indexData[i * 3 + 0];
                            temp = geom.indexData[i * 3 + 0];
                            geom.indexData[i * 3 + 0] = geom.indexData[i * 3 + 1];
                            geom.indexData[i * 3 + 1] = temp;
                        }
                    }
                }
                else
                {
                    for (uint32_t i = 0; i < profile.profiles.size(); i++)
                    {
                        IfcGeometry geom_t = Extrude(profile.profiles[i], dir, depth);
                        if (flipWinding)
                        {
                            for (uint32_t k = 0; k < geom_t.numFaces; k++)
                            {
                                uint32_t temp = geom_t.indexData[k * 3 + 0];
                                temp = geom_t.indexData[k * 3 + 0];
                                geom_t.indexData[k * 3 + 0] = geom_t.indexData[k * 3 + 1];
                                geom_t.indexData[k * 3 + 1] = temp;
                            }
                        }
                        geom.AddPart(geom_t);
                        geom.AddGeometry(geom_t);
                    }
                }

                // TODO: correct dump in case of compositeProfile
                #ifdef CSG_DEBUG_OUTPUT
                    io::DumpIfcGeometry(geom, "IFCEXTRUDEDAREASOLID_geom.obj");
                #endif

                _expressIDToGeometry[expressID] = geom;
                mesh.expressID = expressID;
                mesh.hasGeometry = true;

                return mesh;
            }
            case schema::IFCGEOMETRICSET:
            {
                _loader.MoveToArgumentOffset(expressID, 0);
                auto items = _loader.GetSetArgument();

                for (auto &item : items)
                {
                    uint32_t itemID = _loader.GetRefArgument(item);
                    mesh.children.push_back(GetMesh(itemID));
                }

                return mesh;
            }
            case schema::IFCPOLYLINE:
            case schema::IFCINDEXEDPOLYCURVE:
            case schema::IFCTRIMMEDCURVE:
                // ignore polylines as meshes
                return mesh;
            default:
                spdlog::error("[GetMesh()] unexpected mesh type {}", expressID, lineType);
                break;
            }
        }

        return IfcComposedMesh();
    }

    IfcSurface IfcGeometryProcessor::GetSurface(uint32_t expressID)
    {
        spdlog::debug("[GetSurface({})]",expressID);
        auto lineType = _loader.GetLineType(expressID);

        // TODO: IfcSweptSurface and IfcBSplineSurface still missing
        switch (lineType)
        {
        case schema::IFCPLANE:
        {
            IfcSurface surface;

            _loader.MoveToArgumentOffset(expressID, 0);
            uint32_t locationID = _loader.GetRefArgument();
            surface.transformation = _geometryLoader.GetLocalPlacement(locationID);

            return surface;
        }
        case schema::IFCBSPLINESURFACE:
        {
            IfcSurface surface;

            std::vector<std::vector<glm::vec<3, glm::f64>>> ctrolPts;

            _loader.MoveToArgumentOffset(expressID, 0);
            int Udegree = _loader.GetIntArgument();

            _loader.MoveToArgumentOffset(expressID, 1);
            int Vdegree = _loader.GetIntArgument();

            _loader.MoveToArgumentOffset(expressID, 2);
            auto ctrlPointGroups = _loader.GetSetListArgument();
            for (auto &set : ctrlPointGroups)
            {
                std::vector<glm::vec<3, glm::f64>> list;
                for (auto &token : set)
                {
                    uint32_t pointId = _loader.GetRefArgument(token);
                    list.push_back(_geometryLoader.GetCartesianPoint3D(pointId));
                }
                ctrolPts.push_back(list);
            }

            _loader.MoveToArgumentOffset(expressID, 3);
            auto curveType = _loader.GetStringArgument();

            _loader.MoveToArgumentOffset(expressID, 4);
            auto closedU = _loader.GetStringArgument();

            _loader.MoveToArgumentOffset(expressID, 5);
            auto closedV = _loader.GetStringArgument();

            _loader.MoveToArgumentOffset(expressID, 6);
            auto selfIntersect = _loader.GetStringArgument();

            surface.BSplineSurface.Active = true;
            surface.BSplineSurface.UDegree = Udegree;
            surface.BSplineSurface.VDegree = Vdegree;
            surface.BSplineSurface.ControlPoints = ctrolPts;
            surface.BSplineSurface.ClosedU = closedU;
            surface.BSplineSurface.ClosedV = closedV;
            surface.BSplineSurface.CurveType = curveType;

            break;
        }
        case schema::IFCBSPLINESURFACEWITHKNOTS:
        {
            IfcSurface surface;

            std::vector<std::vector<glm::vec<3, glm::f64>>> ctrolPts;
            std::vector<uint32_t> UMultiplicity;
            std::vector<uint32_t> VMultiplicity;
            std::vector<glm::f64> UKnots;
            std::vector<glm::f64> VKnots;

            _loader.MoveToArgumentOffset(expressID, 0);
            int Udegree = _loader.GetIntArgument();

            _loader.MoveToArgumentOffset(expressID, 1);
            int Vdegree = _loader.GetIntArgument();

            _loader.MoveToArgumentOffset(expressID, 2);
            auto ctrlPointGroups = _loader.GetSetListArgument();
            for (auto &set : ctrlPointGroups)
            {
                std::vector<glm::vec<3, glm::f64>> list;
                for (auto &token : set)
                {
                    uint32_t pointId = _loader.GetRefArgument(token);
                    list.push_back(_geometryLoader.GetCartesianPoint3D(pointId));
                }
                ctrolPts.push_back(list);
            }

            _loader.MoveToArgumentOffset(expressID, 3);
            auto curveType = _loader.GetStringArgument();

            _loader.MoveToArgumentOffset(expressID, 4);
            auto closedU = _loader.GetStringArgument();

            _loader.MoveToArgumentOffset(expressID, 5);
            auto closedV = _loader.GetStringArgument();

            _loader.MoveToArgumentOffset(expressID, 6);
            auto selfIntersect = _loader.GetStringArgument();

            _loader.MoveToArgumentOffset(expressID, 7);
            auto knotSetU = _loader.GetSetArgument();

            _loader.MoveToArgumentOffset(expressID, 8);
            auto knotSetV = _loader.GetSetArgument();

            _loader.MoveToArgumentOffset(expressID, 9);
            auto indexesSetU = _loader.GetSetArgument();

            _loader.MoveToArgumentOffset(expressID, 10);
            auto indexesSetV = _loader.GetSetArgument();

            for (auto &token : knotSetU)
            {
                UMultiplicity.push_back(_loader.GetIntArgument(token));
            }

            for (auto &token : knotSetV)
            {
                VMultiplicity.push_back(_loader.GetIntArgument(token));
            }

            for (auto &token : indexesSetU)
            {
                UKnots.push_back(_loader.GetDoubleArgument(token));
            }

            for (auto &token : indexesSetV)
            {
                VKnots.push_back(_loader.GetDoubleArgument(token));
            }

            surface.BSplineSurface.Active = true;
            surface.BSplineSurface.UDegree = Udegree;
            surface.BSplineSurface.VDegree = Vdegree;
            surface.BSplineSurface.ControlPoints = ctrolPts;
            surface.BSplineSurface.UMultiplicity = UMultiplicity;
            surface.BSplineSurface.VMultiplicity = VMultiplicity;
            surface.BSplineSurface.UKnots = UKnots;
            surface.BSplineSurface.VKnots = VKnots;

            return surface;

            break;
        }
        case schema::IFCRATIONALBSPLINESURFACEWITHKNOTS:
        {
            IfcSurface surface;

            std::vector<std::vector<glm::vec<3, glm::f64>>> ctrolPts;
            std::vector<std::vector<glm::f64>> weightPts;
            std::vector<uint32_t> UMultiplicity;
            std::vector<uint32_t> VMultiplicity;
            std::vector<glm::f64> UKnots;
            std::vector<glm::f64> VKnots;

            _loader.MoveToArgumentOffset(expressID, 0);
            int Udegree = _loader.GetIntArgument();

            _loader.MoveToArgumentOffset(expressID, 1);
            int Vdegree = _loader.GetIntArgument();

            _loader.MoveToArgumentOffset(expressID, 2);
            auto ctrlPointGroups = _loader.GetSetListArgument();
            for (auto &set : ctrlPointGroups)
            {
                std::vector<glm::vec<3, glm::f64>> list;
                for (auto &token : set)
                {
                    uint32_t pointId = _loader.GetRefArgument(token);
                    list.push_back(_geometryLoader.GetCartesianPoint3D(pointId));
                }
                ctrolPts.push_back(list);
            }

            _loader.MoveToArgumentOffset(expressID, 3);
            auto curveType = _loader.GetStringArgument();

            _loader.MoveToArgumentOffset(expressID, 4);
            auto closedU = _loader.GetStringArgument();

            _loader.MoveToArgumentOffset(expressID, 5);
            auto closedV = _loader.GetStringArgument();

            _loader.MoveToArgumentOffset(expressID, 6);
            auto selfIntersect = _loader.GetStringArgument();

            _loader.MoveToArgumentOffset(expressID, 7);
            auto knotSetU = _loader.GetSetArgument();

            _loader.MoveToArgumentOffset(expressID, 8);
            auto knotSetV = _loader.GetSetArgument();

            _loader.MoveToArgumentOffset(expressID, 9);
            auto indexesSetU = _loader.GetSetArgument();

            _loader.MoveToArgumentOffset(expressID, 10);
            auto indexesSetV = _loader.GetSetArgument();

            _loader.MoveToArgumentOffset(expressID, 12);
            auto weightPointGroups = _loader.GetSetListArgument();
            for (auto &set : weightPointGroups)
            {
                std::vector<glm::f64> list;
                for (auto &token : set)
                {
                    list.push_back(_loader.GetDoubleArgument(token));
                }
                weightPts.push_back(list);
            }

            for (auto &token : knotSetU)
            {
                UMultiplicity.push_back(_loader.GetIntArgument(token));
            }

            for (auto &token : knotSetV)
            {
                VMultiplicity.push_back(_loader.GetIntArgument(token));
            }

            for (auto &token : indexesSetU)
            {
                UKnots.push_back(_loader.GetDoubleArgument(token));
            }

            for (auto &token : indexesSetV)
            {
                VKnots.push_back(_loader.GetDoubleArgument(token));
            }

            // if (UKnots[UKnots.size() - 1] != (int)UKnots[UKnots.size() - 1])
            // {
            //     for (uint32_t i = 0; i < UKnots.size(); i++)
            //     {
            //         UKnots[i] = UKnots[i] * (UKnots.size() - 1) / UKnots[UKnots.size() - 1];
            //     }
            // }

            // if (VKnots[VKnots.size() - 1] != (int)VKnots[VKnots.size() - 1])
            // {
            //     for (uint32_t i = 0; i < VKnots.size(); i++)
            //     {
            //         VKnots[i] = VKnots[i] * (VKnots.size() - 1) / VKnots[VKnots.size() - 1];
            //     }
            // }

            // if (closedU == "T")
            // {
            //  std::vector<std::vector<glm::vec<3, glm::f64>>> newCtrolPts;
            //  for (uint32_t i = 0; i < Udegree; i++)
            //  {
            //      newCtrolPts.push_back(ctrolPts[ctrolPts.size() - 1 + (i - Udegree)]);
            //  }
            //  for (uint32_t s = 0; s < ctrolPts.size(); s++)
            //  {
            //      newCtrolPts.push_back(ctrolPts[s]);
            //  }
            //  ctrolPts = newCtrolPts;
            //  UMultiplicity[0] += Udegree;
            // }

            // if (closedV == "T")
            // {
            //  std::vector<std::vector<glm::vec<3, glm::f64>>> newCtrolPts;
            //  for (uint32_t r = 0; r < ctrolPts.size(); r++)
            //  {
            //      std::vector<glm::vec<3, glm::f64>> newSubList;
            //      for (uint32_t i = 0; i < Vdegree; i++)
            //      {
            //          newSubList.push_back(ctrolPts[r][ctrolPts[r].size() - 1 + (i - Vdegree)]);
            //      }
            //      for (uint32_t s = 0; s < ctrolPts[r].size(); s++)
            //      {
            //          newSubList.push_back(ctrolPts[r][s]);
            //      }
            //      newCtrolPts.push_back(newSubList);
            //  }
            //  ctrolPts = newCtrolPts;
            //  VMultiplicity[0] += Vdegree;
            // }

            surface.BSplineSurface.Active = true;
            surface.BSplineSurface.UDegree = Udegree;
            surface.BSplineSurface.VDegree = Vdegree;
            surface.BSplineSurface.ControlPoints = ctrolPts;
            surface.BSplineSurface.UMultiplicity = UMultiplicity;
            surface.BSplineSurface.VMultiplicity = VMultiplicity;
            surface.BSplineSurface.UKnots = UKnots;
            surface.BSplineSurface.VKnots = VKnots;
            surface.BSplineSurface.WeightPoints = weightPts;

            return surface;

            break;
        }
        case schema::IFCCYLINDRICALSURFACE:
        {
            IfcSurface surface;

            _loader.MoveToArgumentOffset(expressID, 0);
            uint32_t locationID = _loader.GetRefArgument();
            surface.transformation = _geometryLoader.GetLocalPlacement(locationID);

            _loader.MoveToArgumentOffset(expressID, 1);
            double radius = _loader.GetDoubleArgument();

            surface.CylinderSurface.Active = true;
            surface.CylinderSurface.Radius = radius;

            return surface;

            break;
        }
        case schema::IFCSURFACEOFREVOLUTION:
        {
            IfcSurface surface;

            _loader.MoveToArgumentOffset(expressID, 0);
            uint32_t profileID = _loader.GetRefArgument();
            IfcProfile profile = _geometryLoader.GetProfile3D(profileID);

            _loader.MoveToArgumentOffset(expressID, 1);
            if (_loader.GetTokenType() == parsing::IfcTokenType::REF)
            {
                _loader.StepBack();
                uint32_t placementID = _loader.GetRefArgument();
                surface.transformation = _geometryLoader.GetLocalPlacement(placementID);
            }

            _loader.MoveToArgumentOffset(expressID, 2);
            uint32_t locationID = _loader.GetRefArgument();

            surface.RevolutionSurface.Active = true;
            surface.RevolutionSurface.Direction = _geometryLoader.GetLocalPlacement(locationID);
            surface.RevolutionSurface.Profile = profile;

            return surface;

            break;
        }
        case schema::IFCSURFACEOFLINEAREXTRUSION:
        {
            IfcSurface surface;

            _loader.MoveToArgumentOffset(expressID, 0);
            uint32_t profileID = _loader.GetRefArgument();
            IfcProfile profile = _geometryLoader.GetProfile(profileID);

            _loader.MoveToArgumentOffset(expressID, 2);
            uint32_t directionID = _loader.GetRefArgument();
            glm::dvec3 direction = _geometryLoader.GetCartesianPoint3D(directionID);

            _loader.MoveToArgumentOffset(expressID, 3);
            double length = 0;
            if (_loader.GetTokenType() == parsing::IfcTokenType::REAL)
            {
                _loader.StepBack();
                length = _loader.GetDoubleArgument();
            }

            surface.ExtrusionSurface.Active = true;
            surface.ExtrusionSurface.Length = length;
            surface.ExtrusionSurface.Profile = profile;
            surface.ExtrusionSurface.Direction = direction;

            _loader.MoveToArgumentOffset(expressID, 1);
            uint32_t locationID = _loader.GetRefArgument();
            surface.transformation = _geometryLoader.GetLocalPlacement(locationID);

            return surface;

            break;
        }
        default:
            spdlog::error("[GetSurface()] unexpected surface type", expressID, lineType);
            break;
        }

        return IfcSurface();
    }

    IfcFlatMesh IfcGeometryProcessor::GetFlatMesh(uint32_t expressID)
    {
        spdlog::debug("[GetFlatMesh({})]",expressID);
        IfcFlatMesh flatMesh;
        flatMesh.expressID = expressID;

        IfcComposedMesh composedMesh = GetMesh(expressID);

        glm::dmat4 mat = glm::scale(glm::dvec3(_geometryLoader.GetLinearScalingFactor()));

        AddComposedMeshToFlatMesh(flatMesh, composedMesh, _transformation * NormalizeIFC * mat);

        return flatMesh;
    }

    void IfcGeometryProcessor::AddComposedMeshToFlatMesh(IfcFlatMesh &flatMesh, const IfcComposedMesh &composedMesh, const glm::dmat4 &parentMatrix, const glm::dvec4 &color, bool hasColor)
    {
       
        glm::dvec4 newParentColor = color;
        bool newHasColor = hasColor;
        glm::dmat4 newMatrix = parentMatrix * composedMesh.transformation;

        if (composedMesh.hasColor && !hasColor)
        {
            newHasColor = true;
            newParentColor = composedMesh.color;
        }

        if (composedMesh.hasGeometry)
        {
            IfcPlacedGeometry geometry;

            if (!_isCoordinated && _coordinateToOrigin)
            {
                auto &geom = _expressIDToGeometry[composedMesh.expressID];
                if(geom.numPoints > 0)
                {
                    auto pt = geom.GetPoint(0);
                    auto transformedPt = newMatrix * glm::dvec4(pt, 1);
                    _coordinationMatrix = glm::translate(-glm::dvec3(transformedPt));
                    _isCoordinated = true;
                }
            }

     
            auto geom = _expressIDToGeometry[composedMesh.expressID];
            if (geometry.testReverse()) geom.ReverseFaces();

            auto translation = glm::dmat4(1.0);

            translation = geom.Normalize();

            _expressIDToGeometry[composedMesh.expressID] = geom;

            if (!composedMesh.hasColor)
            {
                geometry.color = newParentColor;
            }
            else
            {
                geometry.color = composedMesh.color;
                newParentColor = composedMesh.color;
                newHasColor = composedMesh.hasColor;
            }

            geometry.transformation = _coordinationMatrix * newMatrix * translation;

            geometry.SetFlatTransformation();
            geometry.geometryExpressID = composedMesh.expressID;

            flatMesh.geometries.push_back(geometry);
        } else if (composedMesh.hasColor) {
            newParentColor = composedMesh.color;
            newHasColor = composedMesh.hasColor;
        }

        for (auto &c : composedMesh.children)
        {
            AddComposedMeshToFlatMesh(flatMesh, c, newMatrix, newParentColor, newHasColor);
        }
    }

    IfcGeometry IfcGeometryProcessor::BoolProcess(const std::vector<IfcGeometry> &firstGeoms, std::vector<IfcGeometry> &secondGeoms, std::string op)
    {
        return boolEngine.BoolProcess(firstGeoms, secondGeoms, op);
    }

    std::vector<uint32_t> IfcGeometryProcessor::Read2DArrayOfThreeIndices()
    {
        std::vector<uint32_t> result;

        _loader.GetTokenType();

        // while we have point set begin
        while (_loader.GetTokenType() == parsing::IfcTokenType::SET_BEGIN)
        {
            result.push_back((uint32_t)_loader.GetIntArgument());
            result.push_back((uint32_t)_loader.GetIntArgument());
            result.push_back((uint32_t)_loader.GetIntArgument());

            // read point set end
            _loader.GetTokenType();
        }

        return result;
    }

    void IfcGeometryProcessor::ReadIndexedPolygonalFace(uint32_t expressID, std::vector<IfcBound3D> &bounds, const std::vector<glm::dvec3> &points)
    {
        
        spdlog::debug("[ReadIndexedPolygonalFace({})]",expressID);
        auto lineType = _loader.GetLineType(expressID);

        bounds.emplace_back();

        switch (lineType)
        {
        case schema::IFCINDEXEDPOLYGONALFACEWITHVOIDS:
        case schema::IFCINDEXEDPOLYGONALFACE:
        {
            _loader.MoveToArgumentOffset(expressID, 0);
            auto indexIDs = _loader.GetSetArgument();

            IfcGeometry geometry;
            for (auto &indexID : indexIDs)
            {
                uint32_t index = _loader.GetIntArgument(indexID);
                glm::dvec3 point = points[index - 1]; // indices are 1-based

                // I am not proud of this
                bounds.back().curve.points.push_back(point);
            }

            if (lineType == schema::IFCINDEXEDPOLYGONALFACE)
            {
                break;
            }

            // case IFCINDEXEDPOLYGONALFACEWITHVOIDS
            _loader.MoveToArgumentOffset(expressID, 1);

            // guaranteed to be set begin
            _loader.GetTokenType();

            // while we have hole-index set begin
            while (_loader.GetTokenType() == parsing::IfcTokenType::SET_BEGIN)
            {
                bounds.emplace_back();

                while (_loader.GetTokenType() != parsing::IfcTokenType::SET_END)
                {
                    _loader.StepBack();
                    uint32_t index = _loader.GetIntArgument();

                    glm::dvec3 point = points[index - 1]; // indices are still 1-based

                    // I am also not proud of this
                    bounds.back().curve.points.push_back(point);
                }
            }

            break;
        }
        default:
            spdlog::error("[ReadIndexedPolygonalFace()] unexpected indexedface type {}", expressID, lineType);
            break;
        }
    }

    IfcGeometry IfcGeometryProcessor::GetBrep(uint32_t expressID)
    {
        spdlog::debug("[GetBrep({})]",expressID);
        auto lineType = _loader.GetLineType(expressID);
        switch (lineType)
        {
        case schema::IFCCONNECTEDFACESET:
        case schema::IFCCLOSEDSHELL:
        case schema::IFCOPENSHELL:
        {
            _loader.MoveToArgumentOffset(expressID, 0);
            auto faces = _loader.GetSetArgument();

            IfcGeometry geometry;
            for (auto &faceToken : faces)
            {
                uint32_t faceID = _loader.GetRefArgument(faceToken);
                AddFaceToGeometry(faceID, geometry);
            }

            return geometry;
        }
        default:
            spdlog::error("[GetBrep()] unexpected shell type {}", expressID, lineType);
            break;
        }

        return IfcGeometry();
    }

    void IfcGeometryProcessor::AddFaceToGeometry(uint32_t expressID, IfcGeometry &geometry)
    {
        spdlog::debug("[AddFaceToGeometry({})]",expressID);
        auto lineType = _loader.GetLineType(expressID);

        switch (lineType)
        {
        case schema::IFCFACE:
        {
            _loader.MoveToArgumentOffset(expressID, 0);
            auto bounds = _loader.GetSetArgument();

            std::vector<IfcBound3D> bounds3D(bounds.size());

            for (size_t i = 0; i < bounds.size(); i++)
            {
                uint32_t boundID = _loader.GetRefArgument(bounds[i]);
                bounds3D[i] = _geometryLoader.GetBound(boundID);
            }

            TriangulateBounds(geometry, bounds3D, expressID);
            break;
        }
        case schema::IFCADVANCEDFACE:
        {
            _loader.MoveToArgumentOffset(expressID, 0);
            auto bounds = _loader.GetSetArgument();

            std::vector<IfcBound3D> bounds3D(bounds.size());

            for (size_t i = 0; i < bounds.size(); i++)
            {
                uint32_t boundID = _loader.GetRefArgument(bounds[i]);
                bounds3D[i] = _geometryLoader.GetBound(boundID);
            }

            _loader.MoveToArgumentOffset(expressID, 1);
            auto surfRef = _loader.GetRefArgument();

            auto surface = GetSurface(surfRef);

            // TODO: place the face in the surface and tringulate

            if (surface.BSplineSurface.Active)
            {
                TriangulateBspline(geometry, bounds3D, surface, _geometryLoader.GetLinearScalingFactor());
            }
            else if (surface.CylinderSurface.Active)
            {
                TriangulateCylindricalSurface(geometry, bounds3D, surface, _circleSegments);
            }
            else if (surface.RevolutionSurface.Active)
            {
                TriangulateRevolution(geometry, bounds3D, surface, _circleSegments);
            }
            else if (surface.ExtrusionSurface.Active)
            {
                TriangulateExtrusion(geometry, bounds3D, surface);
            }
            else
            {
                TriangulateBounds(geometry, bounds3D, expressID);
            }
            break;
        }
        default:
            spdlog::error("[AddFaceToGeometry()] unexpected face type {}", expressID, lineType);
            break;
        }
    }

    fuzzybools::Geometry booleanManager::convertToEngine(Geometry geom)
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

    IfcGeometry booleanManager::convertToWebIfc(fuzzybools::Geometry geom)
    {
        IfcGeometry newGeom;
        newGeom.fvertexData = geom.fvertexData;
		newGeom.vertexData = geom.vertexData;
		newGeom.indexData = geom.indexData;
        newGeom.planeData = geom.planeData;
		newGeom.numPoints = geom.numPoints;
		newGeom.numFaces = geom.numFaces;
        uint32_t id = 0;
        for(auto plane: geom.planes)
        {
            webifc::geometry::Plane newPlane;
            newPlane.id = id;
            newPlane.distance = plane.distance;
            newPlane.normal = plane.normal;
            newGeom.planes.push_back(newPlane);
            id++;
        }
        newGeom.hasPlanes = geom.hasPlanes;
        return newGeom;
    }

    IfcGeometry booleanManager::BoolProcess(const std::vector<IfcGeometry> &firstGeoms, std::vector<IfcGeometry> &secondGeoms, std::string op)
    {
        spdlog::debug("[BoolProcess({})]");
        IfcGeometry finalResult;

        for (auto &firstGeom : firstGeoms)
        {
            IfcGeometry firstOperator = firstGeom;
            for (auto &secondGeom : secondGeoms)
            {
                bool doit = true;
                if (secondGeom.numFaces == 0)
                {
                    spdlog::error("[BoolProcess()] bool aborted due to empty source or target");

                    // bail out because we will get strange meshes
                    // if this happens, probably there's an issue parsing the mesh that occurred earlier
                    doit = false;
                }

                if (firstOperator.numFaces == 0 && op != "UNION")
                {
                    spdlog::error("[BoolProcess()] bool aborted due to empty source or target");

                    // bail out because we will get strange meshes
                    // if this happens, probably there's an issue parsing the mesh that occurred earlier
                    break;
                }

                if (doit)
                {
                    IfcGeometry secondOperator;

                    if (secondGeom.halfSpace)
                    {
                        glm::dvec3 origin = secondGeom.halfSpaceOrigin;
                        glm::dvec3 x = secondGeom.halfSpaceX - origin;
                        glm::dvec3 y = secondGeom.halfSpaceY - origin;
                        glm::dvec3 z = secondGeom.halfSpaceZ - origin;
                        glm::dmat4 trans = glm::dmat4(
                            glm::dvec4(x, 0),
                            glm::dvec4(y, 0),
                            glm::dvec4(z, 0),
                            glm::dvec4(0, 0, 0, 1)
                        );

                        double scaleX = 1;
                        double scaleY = 1;
                        double scaleZ = 1;

                        for (uint32_t i = 0; i < firstOperator.numPoints; i++)
                        {
                            glm::dvec3 p = firstOperator.GetPoint(i);
                            glm::dvec3 vec = (p - origin);
                            double dx = glm::dot(vec, x);
                            double dy = glm::dot(vec, y);
                            double dz = glm::dot(vec, z);
                            if (glm::abs(dx) > scaleX) {scaleX = glm::abs(dx); }
                            if (glm::abs(dy) > scaleY) {scaleY = glm::abs(dy); }
                            if (glm::abs(dz) > scaleZ) {scaleZ = glm::abs(dz); }
                        }
                        secondOperator.AddGeometry(secondGeom, trans, scaleX * 2, scaleY * 2, scaleZ * 2, secondGeom.halfSpaceOrigin);
                    } else {
                        secondOperator = secondGeom;
                    }

                    #ifdef CSG_DEBUG_OUTPUT
                        io::DumpIfcGeometry(secondOperator, "second.obj");
                    #endif

                    #ifdef CSG_DEBUG_OUTPUT
                        io::DumpIfcGeometry(firstOperator, "first.obj");
                    #endif

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

                    #ifdef CSG_DEBUG_OUTPUT
                        io::DumpIfcGeometry(firstOperator, "result.obj");
                    #endif
                }
            }
            finalResult.AddGeometry(firstOperator);
        }

        return finalResult;
    }

    IfcGeometry booleanManager::Union(IfcGeometry firstOperator, IfcGeometry secondOperator)
    {        
        fuzzybools::Geometry firstEngGeom = convertToEngine(firstOperator);
        fuzzybools::Geometry secondEngGeom = convertToEngine(secondOperator);
        return convertToWebIfc(fuzzybools::Union(firstEngGeom, secondEngGeom));
    }

    IfcGeometry booleanManager::Subtract(IfcGeometry firstOperator, IfcGeometry secondOperator)
    {
        fuzzybools::Geometry firstEngGeom = convertToEngine(firstOperator);
        fuzzybools::Geometry secondEngGeom = convertToEngine(secondOperator);
        return convertToWebIfc(fuzzybools::Subtract(firstEngGeom, secondEngGeom));
    }

}