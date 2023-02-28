/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

#include <vector>
#include <string>
#include <iostream>
#include "LoaderError.h"

namespace webifc::utility 
{

    void LoaderErrorHandler::ReportError(const LoaderErrorType t, const std::string m, const uint32_t e, const uint32_t type) 
    { 
        log::error(m);
        _errors.emplace_back(t,m,e,type);
        std::cout << "ERRORLOGGED"<<std::endl;
        std::cout << "SIZE"<<_errors.size()<<std::endl;
    }
            
    void LoaderErrorHandler::ClearErrors()
    {
        std::cout << "SIZE"<<_errors.size()<<std::endl;
        std::cout << "CLEAR"<<std::endl;
        _errors.clear();
    }

    std::vector<LoaderError>& LoaderErrorHandler::GetErrors()
    {
        std::cout << "ERRORLOGGED"<<_errors.size()<<std::endl;
        std::vector<LoaderError> output(_errors);
        return _errors;
    }

    LoaderError::LoaderError(const LoaderErrorType t, const std::string m, const uint32_t e, const uint32_t type) 
        : type(t), message(m), expressID(e), ifcType(type)
    {
    }
}