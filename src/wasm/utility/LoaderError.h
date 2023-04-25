/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

#pragma once 

#include <vector>
#include <string>

namespace webifc::utility
{

	enum class LoaderErrorType
	{
	UNSPECIFIED,
	PARSING,
	BOOL_ERROR,
	UNSUPPORTED_TYPE
	};

	class LoaderError
	{
    public:
      LoaderErrorType type;
  		std::string message;
  		uint32_t expressID;
  		uint32_t ifcType;

  		LoaderError(const LoaderErrorType t = LoaderErrorType::UNSPECIFIED, const std::string m = "", const uint32_t e = 0, const uint32_t type = 0);
  };

  class LoaderErrorHandler
	{
		public:
			void ReportError(const LoaderErrorType t = LoaderErrorType::UNSPECIFIED, const std::string m = "", const uint32_t e = 0, const uint32_t type = 0);
			void ClearErrors();
			const std::vector<LoaderError> &GetErrors() const;
		private:
			std::vector<LoaderError> _errors;
	};


}
