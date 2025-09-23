/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

#pragma once

#include "../schema/IfcSchemaManager.h"
#include "../geometry/IfcGeometryProcessor.h"
#include "../parsing/IfcLoader.h"
#include <vector>
#include <map>
#include <optional>

namespace webifc::manager
{

    struct LoaderSettings
    {
        bool COORDINATE_TO_ORIGIN = false;
        uint16_t CIRCLE_SEGMENTS = 12;
        uint32_t TAPE_SIZE = 67108864; // probably no need for anyone other than web-ifc devs to change this
        uint32_t MEMORY_LIMIT = 2147483648;
        uint16_t LINEWRITER_BUFFER = 10000;
        double TOLERANCE_PLANE_INTERSECTION = 1.0E-04;
        double TOLERANCE_PLANE_DEVIATION = 1.0E-04;
        double TOLERANCE_BACK_DEVIATION_DISTANCE = 1.0E-04;
        double TOLERANCE_INSIDE_OUTSIDE_PERIMETER = 1.0E-10;
        double TOLERANCE_SCALAR_EQUALITY = 1.0E-04;
        uint16_t PLANE_REFIT_ITERATIONS = 1;
        uint16_t BOOLEAN_UNION_THRESHOLD = 150;
    };

    class ModelManager
    {
    public:
        ModelManager(bool _mt_enabled);
        ~ModelManager();
        webifc::geometry::IfcGeometryProcessor *GetGeometryProcessor(uint32_t modelID);
        const LoaderSettings &GetSettings(uint32_t modelID) const;
        webifc::parsing::IfcLoader *GetIfcLoader(uint32_t modelID) const;
        const webifc::schema::IfcSchemaManager &GetSchemaManager() const;
        bool IsModelOpen(uint32_t modelID) const;
        void CloseModel(uint32_t modelID);
        uint32_t CreateModel(LoaderSettings settings);
        void SetLogLevel(uint8_t levelArg);
        void CloseAllModels();

    private:
        const webifc::schema::IfcSchemaManager _schemaManager;
        std::vector<webifc::parsing::IfcLoader *> _loaders;
        std::vector<LoaderSettings> _settings;
        std::map<uint32_t, webifc::geometry::IfcGeometryProcessor *> _geometryProcessors;
        bool header_shown = false;
        bool mt_enabled;
    };
}