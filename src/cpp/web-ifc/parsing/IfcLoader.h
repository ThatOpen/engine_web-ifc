/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

#pragma once

#include <vector>
#include <unordered_map>
#include <istream>
#include <set>
#include <cstdint>
#include <string_view>

#include "IfcTokenStream.h"
#include "../schema/IfcSchemaManager.h"

namespace webifc::parsing
{
  
	class IfcLoader {
  
    public:
      IfcLoader(uint32_t tapeSize, uint32_t memoryLimit,uint32_t lineWriterBuffer, const schema::IfcSchemaManager &schemaManager);  
      ~IfcLoader();
      const std::vector<uint32_t> GetHeaderLinesWithType(const uint32_t type) const;
      void LoadFile(const std::function<uint32_t(char *, size_t, size_t)> &requestData);
      void LoadFile(std::istream &requestData);
      void SaveFile(const std::function<void(char *, size_t)> &outputData) const;
      void SaveFile(std::ostream &outputData) const;
      const std::vector<uint32_t> GetExpressIDsWithType(const uint32_t type) const;
      uint32_t GetMaxExpressId() const;
      bool IsValidExpressID(const uint32_t expressID) const;
      uint32_t GetLineType(const uint32_t expressID) const;
      bool IsAtEnd() const;
      void MoveToLineArgument(const uint32_t expressID, const uint32_t argumentIndex) const;
      void MoveToHeaderLineArgument(const uint32_t lineID, const uint32_t argumentIndex) const;
      std::string_view GetStringArgument() const;
      std::string GetDecodedStringArgument() const;
      double GetDoubleArgument() const;
      long GetIntArgument() const;
      long GetIntArgument(const uint32_t tapeOffset) const;
      double GetDoubleArgument(const uint32_t tapeOffset) const;
      std::string_view  GetDoubleArgumentAsString() const;
      double GetOptionalDoubleParam(double defaultValue) const;
      uint32_t GetRefArgument() const;
      uint32_t GetRefArgument(const uint32_t tapeOffset) const;
      uint32_t GetOptionalRefArgument() const;
      IfcTokenType GetTokenType() const;
      IfcTokenType GetTokenType(const uint32_t tapeOffset) const;
      const std::vector<uint32_t> GetSetArgument() const;
      std::vector<uint32_t> GetAllLines() const;
      const std::vector<std::vector<uint32_t>> GetSetListArgument() const;
      void MoveToArgumentOffset(const uint32_t expressID, const uint32_t argumentIndex) const;
      void StepBack() const;
      IFC_SCHEMA GetSchema() const;
      void Push(void *v, const uint64_t size);
      uint64_t GetTotalSize() const;
      void UpdateLineTape(const uint32_t expressID, const uint32_t type, const uint32_t start);
      void AddHeaderLineTape(const uint32_t type, const uint32_t start);
      uint32_t GetCurrentLineExpressID() const;
      void RemoveLine(const uint32_t expressID);
      void PushDouble(double input);
      void PushInt(int input);
      uint32_t GetNextExpressID(uint32_t expressId) const;
      template <typename T> void Push(T input)
      {
        _tokenStream->Push(input);
      }

    private:
      struct IfcLine 
      {
        uint32_t ifcType;
        uint32_t tapeOffset;
      };
      uint32_t _maxExpressId;
      const uint32_t _lineWriterBuffer;
      const schema::IfcSchemaManager &_schemaManager;
      IfcTokenStream * _tokenStream;
      std::unordered_map<uint32_t,IfcLine*> _lines;
      std::vector<IfcLine*> _headerLines;
      std::unordered_map<uint32_t, std::vector<uint32_t>> _ifcTypeToExpressID;
      void ParseLines();
      void ArgumentOffset(const uint32_t argumentIndex) const;      
      
	};
}