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
      std::unordered_map<uint32_t, std::vector<uint32_t>> &GetRelVoids();
      std::unordered_map<uint32_t, std::vector<uint32_t>> &GetRelNests();
      std::unordered_map<uint32_t, std::vector<uint32_t>> &GetRelVoidRels();
      std::unordered_map<uint32_t, std::vector<uint32_t>> &GetRelAggregates();
      std::unordered_map<uint32_t, std::vector<std::pair<uint32_t, uint32_t>>> &GetStyledItems();
      std::unordered_map<uint32_t, std::vector<std::pair<uint32_t, uint32_t>>> &GetRelMaterials();
      std::unordered_map<uint32_t, std::vector<std::pair<uint32_t, uint32_t>>> &GetMaterialDefinitions();
      std::vector<uint32_t> GetExpressIDsWithType(const uint32_t type);
      std::vector<IfcHeaderLine> GetHeaderLinesWithType(const uint32_t type);
      void LoadFile(const std::function<uint32_t(char *, size_t, size_t)> &requestData);
      void LoadFile(std::istream &requestData);
      void SaveFile(const std::function<void(char *, size_t)> &outputData);
      void SaveFile(std::ostream &outputData);
      size_t GetNumLines();
      std::vector<uint32_t> &GetLineIDsWithType(const uint32_t type);
      uint32_t GetMaxExpressId();
      bool IsValidExpressID(const uint32_t expressID);
      uint32_t ExpressIDToLineID(const uint32_t expressID);
      uint32_t LineIDToExpressID(const uint32_t lineID);
      IfcLine &GetLine(const uint32_t lineID);
      double GetLinearScalingFactor();
      bool IsOpen();
      bool IsAtEnd();
      void SetClosed();
      void MoveToLineArgument(const uint32_t lineID, const uint32_t argumentIndex);
      void MoveToHeaderLineArgument(const uint32_t lineID, const uint32_t argumentIndex);
      std::string GetStringArgument();
      std::string_view GetStringViewArgument();
      double GetDoubleArgument();
      double GetOptionalDoubleParam(double defaultValue);
      double GetDoubleArgument(const uint32_t tapeOffset);
      uint32_t GetRefArgument();
      uint32_t GetRefArgument(const uint32_t tapeOffset);
      uint32_t GetOptionalRefArgument();
      IfcTokenType GetTokenType();
      IfcTokenType GetTokenType(const uint32_t tapeOffset);
      std::vector<uint32_t> GetSetArgument();
      std::vector<std::vector<uint32_t>> GetSetListArgument();
      void MoveToArgumentOffset(IfcLine &line, const uint32_t argumentIndex);
      void StepBack();
      IFC_SCHEMA GetSchema();
      void Push(void *v, const uint64_t size);
      uint64_t GetTotalSize();
      void UpdateLineTape(const uint32_t expressID, const uint32_t type, const uint32_t start, const uint32_t end);
      void AddHeaderLineTape(const uint32_t type, const uint32_t start, const uint32_t end);
      template <typename T> void Push(T input)
      {
        _tokenStream->Push(input);
      }

    private:
      schema::IfcSchemaManager &_schemaManager;
      utility::LoaderErrorHandler &_errorHandler;
      IfcTokenStream * _tokenStream;
      bool _open = false;
      double _linearScalingFactor = 1;
      double _squaredScalingFactor = 1;
      double _cubicScalingFactor = 1;
      double _angularScalingFactor = 1;
      std::vector<IfcLine> _lines;
      std::vector<IfcHeaderLine> _headerLines;
      std::vector<uint32_t> _expressIDToLine;
      std::unordered_map<uint32_t, std::vector<uint32_t>> _ifcTypeToLineID;
      std::unordered_map<uint32_t, std::vector<uint32_t>> _ifcTypeToHeaderLineID;
      std::unordered_map<uint32_t, std::vector<uint32_t>> _relVoidRel;
      std::unordered_map<uint32_t, std::vector<uint32_t>> _relNests;
      std::unordered_map<uint32_t, std::vector<uint32_t>> _relVoids;
      std::unordered_map<uint32_t, std::vector<uint32_t>> _relAggregates;
      std::unordered_map<uint32_t, std::vector<std::pair<uint32_t, uint32_t>>> _styledItems;
      std::unordered_map<uint32_t, std::vector<std::pair<uint32_t, uint32_t>>> _relMaterials;
      std::unordered_map<uint32_t, std::vector<std::pair<uint32_t, uint32_t>>> _materialDefinitions;
      void GetLineDependencies(uint32_t expressID, std::set<uint32_t> &deps);
      std::set<uint32_t> GetLineDependencies(uint32_t expressID);
      std::vector<IfcLine> GetLinesForExpressIDs(const std::set<uint32_t> &expressIDs);
      void PopulateRelVoidsMap();
      void PopulateRelNestsMap();
      void PopulateRelAggregatesMap();
      void PopulateStyledItemMap();
      void PopulateRelMaterialsMap();
      void ReadLinearScalingFactor();
      void InitialiseIfcParsing();
      void ParseLines();
      void ArgumentOffset(const uint32_t argumentIndex);      
	};
}