/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.  */

#pragma once 

#include <fstream>
#include <vector>
#include <string>
#include <sstream>
#include <cstdint>
#include <glm/glm.hpp>
#include "../web-ifc/geometry/representation/geometry.h"
#include "../web-ifc/geometry/representation/IfcGeometry.h"
#include "../web-ifc/geometry/IfcGeometryProcessor.h"
#include "../web-ifc/geometry/operations/geometryutils.h"
#include "io_helpers.h"

using namespace webifc::io;
namespace webifc::dump
{
    // Consolidated Three.js viewer HTML template
    static const std::string THREE_JS_VIEWER_TEMPLATE = R"(
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>IFC Geometry Viewer</title>
    <style>
        body { margin: 0; overflow: hidden; }
        canvas { display: block; }
    </style>
</head>
<body>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/three@0.134.0/examples/js/controls/OrbitControls.js"></script>
    <script>
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xcccccc);
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(50, 50, 50);
        camera.lookAt(0, 0, 0);
        camera.up.set(0, 0, 1); // Set Z as up direction
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);
        const controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.screenSpacePanning = true;
        controls.minDistance = 1;
        controls.maxDistance = 500;
        controls.mouseButtons = {
            LEFT: THREE.MOUSE.ROTATE,
            MIDDLE: THREE.MOUSE.PAN,
            RIGHT: THREE.MOUSE.DOLLY
        };
        controls.enablePan = true;
        controls.panSpeed = 0.5;
        controls.up = new THREE.Vector3(0, 0, 1);

        // Lighting setup
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4); // Soft ambient light
        scene.add(ambientLight);
        const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.6); // Primary light
        directionalLight1.position.set(1, 1, 1).normalize();
        scene.add(directionalLight1);
        const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.4); // Secondary light to reduce shadows
        directionalLight2.position.set(-1, -1, 1).normalize();
        scene.add(directionalLight2);

        const objData = "{}";
        const meshMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x888888, 
            roughness: 0.7, 
            metalness: 0.1, 
            side: THREE.DoubleSide ,
opacity: 0.7
        });
        const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 2 });
        const edgeMaterial = new THREE.LineBasicMaterial({ color: 0x333333, linewidth: 2 });

        // Parse OBJ data for vertices, lines, and faces
        function parseOBJ(objText) {
            const vertices = [];
            const lines = [];
            const faces = [];
            const linesArray = objText.split('\n');
            linesArray.forEach(line => {
                line = line.trim();
                if (line.startsWith('v ')) {
                    const parts = line.split(/\s+/).slice(1).map(parseFloat);
                    vertices.push(new THREE.Vector3(parts[0], parts[1], parts[2]));
                } else if (line.startsWith('l ')) {
                    const indices = line.split(/\s+/).slice(1).map(i => parseInt(i) - 1);
                    if (indices.length >= 2) {
                        lines.push(indices);
                    }
                } else if (line.startsWith('f ')) {
                    const indices = line.split(/\s+/).slice(1).map(part => parseInt(part.split('/')[0]) - 1);
                    if (indices.length >= 3) {
                        faces.push(indices.slice(0, 3)); // Only triangles
                    }
                }
            });
            return { vertices, lines, faces };
        }

        // Create mesh if faces exist
        const { vertices, lines, faces } = parseOBJ(objData);
        if (faces.length > 0) {
            const geometry = new THREE.BufferGeometry();
            const positions = new Float32Array(vertices.length * 3);
            const indices = new Uint32Array(faces.length * 3);
            vertices.forEach((v, i) => {
                positions[i * 3] = v.x;
                positions[i * 3 + 1] = v.y;
                positions[i * 3 + 2] = v.z;
            });
            faces.forEach((f, i) => {
                indices[i * 3] = f[0];
                indices[i * 3 + 1] = f[1];
                indices[i * 3 + 2] = f[2];
            });
            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            geometry.setIndex(new THREE.BufferAttribute(indices, 1));
            geometry.computeVertexNormals();
            const mesh = new THREE.Mesh(geometry, meshMaterial);
            scene.add(mesh);

            // Add wireframe lines for triangle edges
            const edges = new THREE.EdgesGeometry(geometry, 1); // Threshold angle of 1 degree
            const edgeLines = new THREE.LineSegments(edges, edgeMaterial);
            scene.add(edgeLines);
        }

        // Create lines if lines exist
        lines.forEach((lineIndices, index) => {
            const geometry = new THREE.BufferGeometry().setFromPoints([
                vertices[lineIndices[0]],
                vertices[lineIndices[1]]
            ]);
            const line = new THREE.Line(geometry, lineMaterial);
            scene.add(line);
        });

        // Compute bounding box
        const box = new THREE.Box3();
        vertices.forEach(vertex => box.expandByPoint(vertex));
        const minPoint = box.min;
        const center = box.getCenter(new THREE.Vector3());

        // Add XY grid (100x100m, 10m spacing) at Z=min
        const grid = new THREE.GridHelper(100, 10, 0x888888, 0x888888);
        grid.rotation.x = -Math.PI / 2;
        grid.position.set(minPoint.x, minPoint.y, minPoint.z);
        scene.add(grid);

        // Add coordinate axes (X: red, Y: green, Z: blue, 200m length)
        const axesGroup = new THREE.Group();
        axesGroup.position.set(minPoint.x, minPoint.y, minPoint.z);
        const axesMaterialX = new THREE.LineBasicMaterial({ color: 0xff0000 });
        const axesMaterialY = new THREE.LineBasicMaterial({ color: 0x00ff00 });
        const axesMaterialZ = new THREE.LineBasicMaterial({ color: 0x0000ff });
        const axesGeometryX = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(0, 0, 0), new THREE.Vector3(200, 0, 0)
        ]);
        const axesGeometryY = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 200, 0)
        ]);
        const axesGeometryZ = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 200)
        ]);
        const xAxis = new THREE.Line(axesGeometryX, axesMaterialX);
        const yAxis = new THREE.Line(axesGeometryY, axesMaterialY);
        const zAxis = new THREE.Line(axesGeometryZ, axesMaterialZ);
        axesGroup.add(xAxis);
        axesGroup.add(yAxis);
        axesGroup.add(zAxis);
        scene.add(axesGroup);

        // Zoom to bounding box
        const size = box.getSize(new THREE.Vector3());
        let maxDim = Math.max(size.x, size.y, size.z);
        if (maxDim < 0.0001) {
            maxDim = 1; // Prevent division by zero
        }
        const aspect = window.innerWidth / window.innerHeight;
        const fov = camera.fov * (Math.PI / 180);
        const fovHorizontal = 2 * Math.atan(Math.tan(fov / 2) * aspect);
        const maxDimHorizontal = Math.max(size.x, size.y);
        let cameraDistance = Math.max(
            maxDim / Math.tan(fov / 2),
            maxDimHorizontal / Math.tan(fovHorizontal / 2)
        );
        cameraDistance *= 1.1; // Padding
        cameraDistance = Math.max(cameraDistance, camera.near * 1.1);
        const offset = cameraDistance / Math.sqrt(3);
        camera.position.set(center.x + offset, center.y + offset, center.z + offset);
        camera.lookAt(center);
        controls.target.copy(center);

        function animate() {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        }
        animate();
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    </script>
</body>
</html>
)";

    inline glm::dvec2 cmin(glm::dvec2 m, webifc::io::Point p)
    {
        return glm::dvec2(
            std::min(m.x, p.x),
            std::min(m.y, p.y));
    }

    inline glm::dvec2 cmax(glm::dvec2 m, webifc::io::Point p)
    {
        return glm::dvec2(
            std::max(m.x, p.x),
            std::max(m.y, p.y));
    }

    inline glm::dvec2 rescale(webifc::io::Point p, Bounds b, glm::dvec2 size, glm::dvec2 offset)
    {
        return glm::dvec2(
            ((p.x - b.min.x) / (b.max.x - b.min.x)) * size.x + offset.x,
            ((p.y - b.min.y) / (b.max.y - b.min.y)) * size.y + offset.y);
    }

    inline glm::dvec2 rescale(glm::dvec2 p, Bounds b, glm::dvec2 size, glm::dvec2 offset)
    {
        return glm::dvec2(
            ((p.x - b.min.x) / (b.max.x - b.min.x)) * size.x + offset.x,
            ((p.y - b.min.y) / (b.max.y - b.min.y)) * size.y + offset.y);
    }

    inline std::vector<glm::dvec2> rescale(std::vector<glm::dvec2> input, glm::dvec2 size, glm::dvec2 offset)
    {
        std::vector<glm::dvec2> retval;

        glm::dvec2 min(DBL_MAX, DBL_MAX);
        glm::dvec2 max(-DBL_MAX, -DBL_MAX);

        for (auto& pt : input)
        {
            min = glm::min(min, pt);
            max = glm::max(max, pt);
        }

        double width = max.x - min.x;
        double height = max.y - min.y;
        double maxSize = std::max(width, height);

        if (width == 0 && height == 0)
        {
            printf("asdf\n");
        }

        for (auto& pt : input)
        {
            retval.emplace_back(
                ((pt.x - min.x) / (maxSize)) * size.x + offset.x,
                (size.y - ((pt.y - min.y) / (maxSize)) * size.y) + offset.y);
        }

        return retval;
    }

    inline void writeFile(std::string filename, std::string data)
    {
        std::string newFileName(filename.begin(), filename.end());
        std::ofstream out(newFileName);
        out << data;
        out.close();
    }

    inline std::string makeThreeJSViewer(std::vector<glm::dvec3> input, std::vector<uint32_t> indices)
    {
        std::stringstream obj;
        if (input.size() > 0)
        {
            // Generate OBJ data for lines
            for (size_t i = 0; i < input.size(); i++)
            {
                obj << "v " << input[i].x << " " << input[i].y << " " << input[i].z << "\n";
            }

            if (indices.size() > 0)
            {
                for (size_t i = 0; i < indices.size() - 1; i += 2)
                {
                    obj << "l " << (indices[i] + 1) << " " << (indices[i + 1] + 1) << "\n";
                }
            }
            else
            {
                for (size_t i = 0; i < input.size() - 1; ++i)
                {
                    obj << "l " << (i + 1) << " " << (i + 2) << "\n";
                }
            }
        }

        // Escape OBJ data for embedding in JavaScript
        std::string objData = obj.str();
        std::string escapedObjData;
        for (char c : objData)
        {
            if (c == '\n') escapedObjData += "\\n";
            else if (c == '"') escapedObjData += "\\\"";
            else escapedObjData += c;
        }

        // Replace placeholder with escaped OBJ data
        std::string html = THREE_JS_VIEWER_TEMPLATE;
        size_t pos = html.find(R"({})");
        if (pos != std::string::npos)
        {
            html.replace(pos, 2, escapedObjData);
        }

        return html;
    }

    inline std::string makeThreeJSViewer(std::vector<std::vector<glm::dvec2>> lines)
    {
        // Generate OBJ data for lines
        std::stringstream obj;
        size_t vertexOffset = 0;
        for (auto& line : lines)
        {
            for (auto& pt : line)
            {
                obj << "v " << pt.x << " " << pt.y << " 0\n";
            }
            for (size_t i = 0; i < line.size() - 1; i++)
            {
                obj << "l " << (vertexOffset + i + 1) << " " << (vertexOffset + i + 2) << "\n";
            }
            vertexOffset += line.size();
        }

        // Escape OBJ data for embedding in JavaScript
        std::string objData = obj.str();
        std::string escapedObjData;
        for (char c : objData)
        {
            if (c == '\n') escapedObjData += "\\n";
            else if (c == '"') escapedObjData += "\\\"";
            else escapedObjData += c;
        }

        // Replace placeholder with escaped OBJ data
        std::string html = THREE_JS_VIEWER_TEMPLATE;
        size_t pos = html.find(R"({})");
        if (pos != std::string::npos)
        {
            html.replace(pos, 2, escapedObjData);
        }

        return html;
    }

    inline void DumpLinesToHtml(std::vector<std::vector<glm::dvec2>> lines, std::string filename)
    {
        writeFile(filename, makeThreeJSViewer(lines));
    }

    inline std::string GradientVerticalToObjThree(const std::vector<webifc::geometry::IfcCurve>& geom)
    {
        std::stringstream obj;
        for (uint32_t ia = 0; ia < geom.size(); ia++)
        {
            if (geom[ia].points.size() > 0)
            {
                for (uint32_t ic = 0; ic < geom[ia].points.size(); ic++)
                {
                    glm::dvec3 t = glm::dvec4(geom[ia].points[ic].x, geom[ia].points[ic].y, 0, 1);
                    obj << "v " << t.x << " " << t.y << " " << t.z << "\n";
                }
            }
        }
        uint32_t idx = 0;
        for (uint32_t ia = 0; ia < geom.size(); ia++)
        {
            if (geom[ia].points.size() > 0)
            {
                for (uint32_t ic = 0; ic < geom[ia].points.size() - 1; ic++)
                {
                    obj << "l " << (idx) << " " << (idx + 1) << "\n";
                    idx++;
                }
            }
        }
        return obj.str();
    }

    inline std::string GradientHorizontalToObjThree(const webifc::geometry::IfcCurve& geom)
    {
        std::stringstream obj;
        for (uint32_t ic = 0; ic < geom.points.size(); ic++)
        {
            glm::dvec3 t = glm::dvec4(geom.points[ic].x, geom.points[ic].y, 0, 1);
            obj << "v " << t.x << " " << t.y << " " << t.z << "\n";
        }
        uint32_t idx = 0;
        for (uint32_t ic = 0; ic < geom.points.size() - 1; ic++)
        {
            obj << "l " << (idx) << " " << (idx + 1) << "\n";
            idx++;
        }
        return obj.str();
    }

    inline std::string VAlignmentToObjThree(const std::vector<webifc::geometry::IfcAlignment>& geom)
    {
        std::stringstream obj;
        for (uint32_t ia = 0; ia < geom.size(); ia++)
        {
            for (uint32_t ic = 0; ic < geom[ia].Vertical.curves.size(); ic++)
            {
                for (uint32_t ip = 0; ip < geom[ia].Vertical.curves[ic].points.size(); ip++)
                {
                    glm::dvec3 t = glm::dvec4(geom[ia].Vertical.curves[ic].points[ip].x, geom[ia].Vertical.curves[ic].points[ip].y, 0, 1);
                    obj << "v " << t.x << " " << t.y << " " << t.z << "\n";
                }
            }
        }
        uint32_t idx = 0;
        for (uint32_t ia = 0; ia < geom.size(); ia++)
        {
            if (geom[ia].Vertical.curves.size() > 0)
            {
                for (uint32_t ic = 0; ic < geom[ia].Vertical.curves.size(); ic++)
                {
                    if (geom[ia].Vertical.curves[ic].points.size() > 0)
                    {
                        for (uint32_t ip = 0; ip < geom[ia].Vertical.curves[ic].points.size() - 1; ip++)
                        {
                            obj << "l " << (idx) << " " << (idx + 1) << "\n";
                            idx++;
                        }
                    }
                }
            }
        }
        return obj.str();
    }

    inline std::string HAlignmentToObjThree(const std::vector<webifc::geometry::IfcAlignment>& geom)
    {
        std::stringstream obj;
        for (uint32_t ia = 0; ia < geom.size(); ia++)
        {
            for (uint32_t ic = 0; ic < geom[ia].Horizontal.curves.size(); ic++)
            {
                if (geom[ia].Horizontal.curves[ic].points.size() > 0)
                {
                    for (uint32_t ip = 0; ip < geom[ia].Horizontal.curves[ic].points.size(); ip++)
                    {
                        glm::dvec3 t = glm::dvec4(geom[ia].Horizontal.curves[ic].points[ip].x, geom[ia].Horizontal.curves[ic].points[ip].y, 0, 1);
                        obj << "v " << t.x << " " << t.y << " " << t.z << "\n";
                    }
                }
            }
        }
        uint32_t idx = 0;
        for (uint32_t ia = 0; ia < geom.size(); ia++)
        {
            for (uint32_t ic = 0; ic < geom[ia].Horizontal.curves.size(); ic++)
            {
                if (geom[ia].Horizontal.curves[ic].points.size() > 0)
                {
                    for (uint32_t ip = 0; ip < geom[ia].Horizontal.curves[ic].points.size() - 1; ip++)
                    {
                        obj << "l " << (idx) << " " << (idx + 1) << "\n";
                        idx++;
                    }
                }
            }
        }
        return obj.str();
    }

    inline std::string CrossSectionToObjThree(const std::vector<webifc::geometry::IfcCrossSections>& geom)
    {
        std::stringstream obj;
        for (uint32_t ia = 0; ia < geom.size(); ia++)
        {
            for (uint32_t ic = 0; ic < geom[ia].curves.size(); ic++)
            {
                for (uint32_t ip = 0; ip < geom[ia].curves[ic].points.size(); ip++)
                {
                    glm::dvec3 t = glm::dvec4(geom[ia].curves[ic].points[ip].x, geom[ia].curves[ic].points[ip].y, 0, 1);
                    obj << "v " << t.x << " " << t.y << " " << t.z << "\n";
                }
            }
        }
        uint32_t idx = 0;
        for (uint32_t ia = 0; ia < geom.size(); ia++)
        {
            for (uint32_t ic = 0; ic < geom[ia].curves.size(); ic++)
            {
                for (uint32_t ip = 0; ip < geom[ia].curves[ic].points.size() - 1; ip++)
                {
                    obj << "l " << (idx) << " " << (idx + 1) << "\n";
                    idx++;
                }
            }
        }
        return obj.str();
    }

    inline std::string ToObjThree(const webifc::geometry::IfcGeometry& geom, size_t& offset, const glm::dmat4& transform, double inputScale = 1.0)
    {
        std::stringstream obj;
        double scale = inputScale;
        for (uint32_t i = 0; i < geom.numPoints; i++)
        {
            glm::dvec4 t = transform * glm::dvec4(geom.GetPoint(i), 1);
            obj << "v " << t.x * scale << " " << t.y * scale << " " << t.z * scale << "\n";
        }
        for (uint32_t i = 0; i < geom.numFaces; i++)
        {
            bimGeometry::Face f = geom.GetFace(i);
            obj << "f " << (f.i0 + 1 + offset) << "// " << (f.i1 + 1 + offset) << "// " << (f.i2 + 1 + offset) << "//\n";
        }
        offset += geom.numPoints;
        return obj.str();
    }

    inline std::string ToObjThree(webifc::geometry::IfcComposedMesh& mesh, webifc::geometry::IfcGeometryProcessor& processor, size_t& offset, glm::dmat4 mat = glm::dmat4(1))
    {
        std::string complete;
        glm::dmat4 trans = mat * mesh.transformation;
        auto& geom = processor.GetGeometry(mesh.expressID);
        complete += ToObjThree(geom, offset, trans);
        for (auto c : mesh.children)
        {
            complete += ToObjThree(c, processor, offset, trans);
        }
        return complete;
    }

    inline void DumpGradientCurveThree(std::vector<webifc::geometry::IfcCurve>& curves, webifc::geometry::IfcCurve& curve, std::string filenameV, std::string filenameH)
    {
        writeFile(filenameV, GradientVerticalToObjThree(curves));
        writeFile(filenameH, GradientHorizontalToObjThree(curve));
    }

    inline void DumpSectionCurvesThree(std::vector<webifc::geometry::IfcCurve>& curves, std::string filename)
    {
        writeFile(filename, GradientVerticalToObjThree(curves));
    }

    inline void DumpAlignmentThree(std::vector<webifc::geometry::IfcAlignment>& align, std::string filenameV, std::string filenameH)
    {
        writeFile(filenameV, VAlignmentToObjThree(align));
        writeFile(filenameH, HAlignmentToObjThree(align));
    }

    inline void DumpCrossSectionsThree(std::vector<webifc::geometry::IfcCrossSections>& crossSection, std::string filename)
    {
        writeFile(filename, CrossSectionToObjThree(crossSection));
    }

    inline void DumpIfcGeometryToPathThree(const webifc::geometry::IfcGeometry& geom, std::string path, double inputScale)
    {
        size_t offset = 0;
        std::ofstream out(path.c_str());
        glm::dmat4 mat(1);
        out << ToObjThree(geom, offset, mat, inputScale);
    }

    inline std::string ToObjThree(webifc::geometry::IfcGeometry& geom, size_t& offset, glm::dmat4 transform = glm::dmat4(1))
    {
        std::stringstream obj;
        double scale = 1.0;
        for (uint32_t i = 0; i < geom.numPoints; i++)
        {
            auto p = glm::dvec4(geom.GetPoint(i), 1);
            glm::dvec4 t = transform * p;
            obj << "v " << t.x * scale << " " << t.y * scale << " " << t.z * scale << "\n";
        }
        for (uint32_t i = 0; i < geom.numFaces; i++)
        {
            bimGeometry::Face f = geom.GetFace(i);
            obj << "f " << (f.i0 + 1 + offset) << "// " << (f.i1 + 1 + offset) << "// " << (f.i2 + 1 + offset) << "//\n";
        }
        offset += geom.numPoints;
        return obj.str();
    }

    inline std::string ToObjThree(webifc::geometry::IfcFlatMesh& mesh, webifc::geometry::IfcGeometryProcessor& processor, size_t& offset, glm::dmat4 mat = glm::dmat4(1))
    {
        std::string complete;
        for (auto& geom : mesh.geometries)
        {
            webifc::geometry::IfcGeometry flatGeom = processor.GetGeometry(geom.geometryExpressID);
            glm::dmat4 trans = mat * geom.transformation;
            complete += ToObjThree(flatGeom, offset, trans);
        }
        return complete;
    }

    // Modified makeThreeJSViewer for IfcGeometry (triangle mesh)
    inline std::string makeThreeJSViewer(const std::vector<webifc::geometry::IfcGeometry>& vecGeom, double inputScale = 1.0)
    {
        std::stringstream obj;
        size_t offset = 0;
        glm::dmat4 mat(1);
        for (const webifc::geometry::IfcGeometry& geom : vecGeom)
        {
            obj << ToObjThree(geom, offset, mat, inputScale);
        }

        // Escape OBJ data for embedding
        std::string objData = obj.str();
        std::string escapedObjData;
        for (char c : objData)
        {
            if (c == '\n') escapedObjData += "\\n";
            else if (c == '"') escapedObjData += "\\\"";
            else escapedObjData += c;
        }

        // Embed in HTML template
        std::string html = THREE_JS_VIEWER_TEMPLATE;
        size_t pos = html.find(R"({})");
        if (pos != std::string::npos)
        {
            html.replace(pos, 2, escapedObjData);
        }

        return html;
    }

    inline void DumpIfcGeometryThree(std::vector<webifc::geometry::IfcGeometry> vecGeom, std::string filename, double epsNormal = 1e-8, double epsDist = 1e-6, double inputScale = 1.0)
    {
        std::string viewer = makeThreeJSViewer(vecGeom, inputScale);
        writeFile(filename, viewer);
    }

    inline void DumpFlatMeshThree(webifc::geometry::IfcFlatMesh& mesh, webifc::geometry::IfcGeometryProcessor& processor, std::string filename)
    {
        size_t offset = 0;
        writeFile(filename, ToObjThree(mesh, processor, offset));
    }

    inline Bounds getBounds(std::vector<std::vector<glm::dvec2>> input, glm::dvec2 size, glm::dvec2 offset)
    {
        std::vector<glm::dvec2> retval;
        glm::dvec2 min(DBL_MAX, DBL_MAX);
        glm::dvec2 max(-DBL_MAX, -DBL_MAX);
        for (auto& loop : input)
        {
            for (auto& point : loop)
            {
                min = glm::min(min, point);
                max = glm::max(max, point);
            }
        }
        double width = max.x - min.x;
        double height = max.y - min.y;
        if (width == 0 && height == 0)
        {
            printf("asdf");
        }
        return { min, max };
    }

    inline void DumpCurveToHtml(std::vector<glm::dvec3> points, std::string filename, std::vector<uint32_t> indices = {})
    {
        writeFile(filename, makeThreeJSViewer(points, indices));
    }
}