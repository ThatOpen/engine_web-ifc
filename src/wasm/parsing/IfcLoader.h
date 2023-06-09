/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

#pragma once

#include <vector>
#include <unordered_map>
#include <istream>
#include <set>

#include "IfcTokenStream.h"
#include "../utility/LoaderError.h"
#include "../schema/IfcSchemaManager.h"

namespace webifc::parsing
{
  
  struct IfcLine 
  {
    uint32_t expressID;
    uint32_t ifcType;
    uint32_t lineIndex;
    uint32_t tapeOffset;
    uint32_t tapeEnd;
  };

  struct IfcHeaderLine
  {
    uint32_t ifcType;
    uint32_t lineIndex;
    uint32_t tapeOffset;
    uint32_t tapeEnd;
  };
  
	class IfcLoader {
  
    public:
      IfcLoader(size_t tapeSize, size_t memoryLimit,utility::LoaderErrorHandler &errorHandler,schema::IfcSchemaManager &schemaManager);  
      ~IfcLoader();
      const std::vector<uint32_t> GetExpressIDsWithType(const uint32_t type) const;
      const std::vector<IfcHeaderLine> GetHeaderLinesWithType(const uint32_t type) const;
      void LoadFile(const std::function<uint32_t(char *, size_t, size_t)> &requestData);
      void LoadFile(std::istream &requestData);
      void SaveFile(const std::function<void(char *, size_t)> &outputData) const;
      void SaveFile(std::ostream &outputData) const;
      size_t GetNumLines() const;
      const std::vector<uint32_t> GetLineIDsWithType(const uint32_t type) const;
      uint32_t GetMaxExpressId() const;
      bool IsValidExpressID(const uint32_t expressID) const;
      uint32_t ExpressIDToLineID(const uint32_t expressID) const;
      uint32_t LineIDToExpressID(const uint32_t lineID) const; 
      const IfcLine &GetLine(const uint32_t lineID) const;
      bool IsOpen() const;
      bool IsAtEnd() const;
      void SetClosed();
      void MoveToLineArgument(const uint32_t lineID, const uint32_t argumentIndex) const;
      void MoveToHeaderLineArgument(const uint32_t lineID, const uint32_t argumentIndex) const;
      std::string GetStringArgument() const;
      std::string_view GetStringViewArgument() const;
      double GetDoubleArgument() const;
      double GetOptionalDoubleParam(double defaultValue) const;
      double GetDoubleArgument(const uint32_t tapeOffset) const;
      uint32_t GetRefArgument() const;
      uint32_t GetRefArgument(const uint32_t tapeOffset) const;
      uint32_t GetOptionalRefArgument() const;
      IfcTokenType GetTokenType() const;
      IfcTokenType GetTokenType(const uint32_t tapeOffset) const;
      const std::vector<uint32_t> GetSetArgument() const;
      const std::vector<std::vector<uint32_t>> GetSetListArgument() const;
      void MoveToArgumentOffset(const IfcLine &line, const uint32_t argumentIndex) const;
      void StepBack() const;
      IFC_SCHEMA GetSchema() const;
      void Push(void *v, const uint64_t size);
      uint64_t GetTotalSize() const;
      void UpdateLineTape(const uint32_t expressID, const uint32_t type, const uint32_t start, const uint32_t end);
      void AddHeaderLineTape(const uint32_t type, const uint32_t start, const uint32_t end);
      uint32_t GetCurrentLineExpressID() const;
      void RemoveLine(const uint32_t expressID);
      template <typename T> void Push(T input)
      {
        _tokenStream->Push(input);
      }

    private:
      const schema::IfcSchemaManager &_schemaManager;
      utility::LoaderErrorHandler &_errorHandler;
      IfcTokenStream * _tokenStream;
      std::vector<IfcLine> _lines;
      std::vector<IfcHeaderLine> _headerLines;
      std::vector<uint32_t> _expressIDToLine;
      std::unordered_map<uint32_t, std::vector<uint32_t>> _ifcTypeToLineID;
      std::unordered_map<uint32_t, std::vector<uint32_t>> _ifcTypeToHeaderLineID;
      void ParseLines();
      void ArgumentOffset(const uint32_t argumentIndex) const;      
	};
}