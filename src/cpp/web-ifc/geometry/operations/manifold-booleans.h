/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

#pragma once

#include "../representation/IfcGeometry.h"

namespace webifc::geometry
{
    // Returns false for inputs that cannot represent closed, oriented solids.
    // The caller can retain its existing handling of open surfaces/half spaces.
    bool TryManifoldBoolean(const IfcGeometry &first, const std::vector<IfcGeometry> &cutters,
        const std::string &operation, IfcGeometry &result, double tolerance = 0);
}
