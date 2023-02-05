/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

#pragma once 

namespace webifc
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

  		LoaderError(LoaderErrorType t = LoaderErrorType::UNSPECIFIED, std::string m = "", uint32_t e = 0,uint32_t type = 0) 
  			: type(t), message(m), expressID(e), ifcType(type)
  		{
  		}
		
  };
}
