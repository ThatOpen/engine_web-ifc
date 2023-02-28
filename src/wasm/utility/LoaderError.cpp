/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

#include <vector>
#include "LoaderError.h"

namespace webifc::utility {

    void LoaderErrorHandler::ReportError(const LoaderError &&error) 
    { 
        log::error(error.message);
        _errors.push_back(std::move(error));
        std::cout << "ERRORLOGGED"<<std::endl;
    }
            
    void LoaderErrorHandler::ClearErrors()
    {
        _errors.clear();
    }

    std::vector<LoaderError> LoaderErrorHandler::GetErrors()
    {
        std::vector<LoaderError> output(_errors);
        return output;
    }

    LoaderError::LoaderError(const LoaderErrorType t, const std::string m, const uint32_t e, const uint32_t type) 
        : type(t), message(m), expressID(e), ifcType(type)
    {
    }
}