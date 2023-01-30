/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
 
#include <iostream>
#include "Logging.h"
 
namespace webifc
{
  
  LogLevel LOG_LEVEL = webifc::LogLevel::ERROR;
  
  void log(const std::string& msg, const LogLevel& level)
  {
    if (level >= LOG_LEVEL) {
            std::string fullMsg = msg;
                  switch (level) {
                          case LogLevel::DEBUG: fullMsg = "DEBUG: " + msg; break;
                    case LogLevel::INFO:  fullMsg = "INFO: "  + msg; break;
                    case LogLevel::WARN:  fullMsg = "WARN: "  + msg; break;
                    case LogLevel::ERROR: fullMsg = "ERROR: " + msg; break;
                    case LogLevel::OFF:   return;
                  }
                  std::cout << fullMsg << std::endl;
          }
  }

  void logDebug(const std::string& msg) { log(msg, LogLevel::DEBUG); }
  void logInfo(const std::string& msg)  { log(msg, LogLevel::INFO);  }
  void logWarn(const std::string& msg)  { log(msg, LogLevel::WARN);  }
  void logError(const std::string& msg) { log(msg, LogLevel::ERROR); }

}