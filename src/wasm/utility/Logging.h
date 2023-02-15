/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
 
#pragma once
 
namespace webifc
{
  
  enum class LogLevel : int
  {
    LOG_LEVEL_DEBUG = 0,
    LOG_LEVEL_INFO,
    LOG_LEVEL_WARN,
    LOG_LEVEL_ERROR,
    LOG_LEVEL_OFF
  };
  
  void log(const std::string& msg, const LogLevel& level);
  void logDebug(const std::string& msg);
  void logInfo(const std::string& msg);
  void logWarn(const std::string& msg);
  void logError(const std::string& msg);
  
}
