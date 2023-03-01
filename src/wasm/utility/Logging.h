/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
 
#pragma once

#include <string>
 
namespace webifc::utility
{
  
  enum class LogLevel : int
  {
    LOG_LEVEL_DEBUG = 0,
    LOG_LEVEL_INFO,
    LOG_LEVEL_WARN,
    LOG_LEVEL_ERROR,
    LOG_LEVEL_OFF
  };

  static LogLevel LOG_LEVEL = LogLevel::LOG_LEVEL_ERROR;

  void setLogLevel(const int level);
  void setLogLevel(const LogLevel level);
  
  namespace log {
    void debug(const std::string& msg);
    void info(const std::string& msg);
    void warn(const std::string& msg);
    void error(const std::string& msg);
    void log(const std::string& msg, const LogLevel& level);
  }
}
