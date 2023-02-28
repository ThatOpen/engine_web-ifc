/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
 
#include <sstream>
#include <string>
#include <cmath>
#include <algorithm>
#include "IfcLoader.h"
#include "../utility/LoaderError.h"
#include "../utility/Logging.h"
#include "../version.h"
#include "../schema/IfcSchemaManager.h" 

namespace webifc::parsing {

   std::string getAsStringWithBigE(double theNumber);
   double ConvertPrefix(const std::string &prefix);
   std::string p21encode(std::string_view input);

 
   IfcLoader::IfcLoader(size_t tapeSize, size_t memoryLimit,utility::LoaderErrorHandler &errorHandler,schema::IfcSchemaManager &schemaManager) :_schemaManager(schemaManager), _errorHandler(errorHandler)
   { 
   _tokenStream = new IfcTokenStream(tapeSize,(memoryLimit/tapeSize));
   }  
   
   std::unordered_map<uint32_t, std::vector<uint32_t>> & IfcLoader::GetRelVoids()
   { 
     return _relVoids;
   }
   
   std::unordered_map<uint32_t, std::vector<uint32_t>> & IfcLoader::GetRelVoidRels()
   { 
     return _relVoidRel;
   }
   
   std::unordered_map<uint32_t, std::vector<uint32_t>> & IfcLoader::GetRelAggregates()
   { 
     return _relAggregates;
   }
   
   std::unordered_map<uint32_t, std::vector<std::pair<uint32_t, uint32_t>>> & IfcLoader::GetStyledItems()
   { 
      return _styledItems;
   }
   
   std::unordered_map<uint32_t, std::vector<std::pair<uint32_t, uint32_t>>> & IfcLoader::GetRelMaterials()
   { 
     return _relMaterials;
   }
   
   std::unordered_map<uint32_t, std::vector<std::pair<uint32_t, uint32_t>>> & IfcLoader::GetMaterialDefinitions()
   { 
     return _materialDefinitions;
   }
   
   std::vector<uint32_t> IfcLoader::GetExpressIDsWithType(const uint32_t type)
   { 
      auto &list = _ifcTypeToLineID[type];
      std::vector<uint32_t> ret(list.size());

      std::transform(list.begin(), list.end(), ret.begin(), [&](uint32_t lineID)
      { return _lines[lineID].expressID; });

      return ret;
   }
   
   std::vector<IfcHeaderLine> IfcLoader::GetHeaderLinesWithType(const uint32_t type)
   { 
     auto &list = _ifcTypeToHeaderLineID[type];
     std::vector<IfcHeaderLine> ret(list.size());

     std::transform(list.begin(), list.end(), ret.begin(), [&](uint32_t lineID)
              { return _headerLines[lineID]; });

     return ret;
   }
   
   void IfcLoader::LoadFile(const std::function<uint32_t(char *, size_t, size_t)> &requestData)
   { 
     _open=true;
     _tokenStream->SetTokenSource(requestData);
     InitialiseIfcParsing();
   }

   IFC_SCHEMA IfcLoader::GetSchema() 
   { 
      auto line = GetHeaderLinesWithType(schema::FILE_SCHEMA)[0];
      MoveToHeaderLineArgument(line.lineIndex, 0);
      auto schemas = _schemaManager.GetAvailableSchemas();

      while (!_tokenStream->IsAtEnd()) {
          IfcTokenType t = static_cast<IfcTokenType>(_tokenStream->Read<char>());
          if (t == IfcTokenType::LINE_END) break;
          if (t == IfcTokenType::LABEL) 
          {
            std::string_view schemaName = _tokenStream->ReadString();
            for (size_t i = 0; i < schemas.size();i++) 
            {
              if (_schemaManager.GetSchemaName(schemas[i]) == schemaName) return schemas[i];
            }
          }
      }
      return IFC2X3;

   }
   
   void IfcLoader::LoadFile(std::istream &requestData)
   { 
     _open=true;
     _tokenStream->SetTokenSource(requestData);
     InitialiseIfcParsing();
   }
   
   void IfcLoader::SaveFile(const std::function<void(char *, size_t)> &outputData)
   { 
      std::ostringstream output;
      output << "ISO-10303-21;"<<std::endl<<"HEADER;"<<std::endl;
      output << "/******************************************************" << std::endl;
      output << "* STEP Physical File produced by: IFCjs WebIfc " << WEB_IFC_VERSION_NUMBER << std::endl;
      output << "* Module: web-ifc/IfcLoader" << std::endl;
      output << "* Version: " << WEB_IFC_VERSION_NUMBER << std::endl;
      output << "* Source: https://github.com/IFCjs/web-ifc" << std::endl;
      output << "* Issues: https://github.com/IFCjs/web-ifc/issues" << std::endl;
      output << "******************************************************/" << std::endl;
      for(uint32_t i=0; i < _headerLines.size();i++) 
      {
        _tokenStream->MoveTo(_headerLines[i].tapeOffset);
        bool newLine = true;
        bool insideSet = false;
        IfcTokenType prev = IfcTokenType::EMPTY;
        while (!_tokenStream->IsAtEnd())
        {
          IfcTokenType t = static_cast<IfcTokenType>(_tokenStream->Read<char>());

          if (t != IfcTokenType::SET_END && t != IfcTokenType::LINE_END)
          {
            if (insideSet && prev != IfcTokenType::SET_BEGIN && prev != IfcTokenType::LABEL && prev != IfcTokenType::LINE_END)
            {
              output << ",";
            }
          }

          if (t == IfcTokenType::LINE_END)
          {
            output << ";" << std::endl;
            break;
          }

          switch (t)
          {
            case IfcTokenType::UNKNOWN:
            {
              output << "*";
              break;
            }
            case IfcTokenType::EMPTY:
            {
              output << "$";
              break;
            }
            case IfcTokenType::SET_BEGIN:
            {
              output << "(";
              insideSet = true;
              break;
            }
            case IfcTokenType::SET_END:
            {
              output << ")";
              break;
            }
            case IfcTokenType::STRING:
            {
              output << "'" << _tokenStream->ReadString() << "'";
              break;
            }
            case IfcTokenType::ENUM:
            {
              output << "." << _tokenStream->ReadString() << ".";
              break;
            }
            case IfcTokenType::LABEL:
            {
              output << _tokenStream->ReadString();
              break;
            }
            case IfcTokenType::REF:
            {
              output << "#" << _tokenStream->Read<uint32_t>();
              if (newLine) output << "=";
              break;
            }
            case IfcTokenType::REAL:
            {
              output << getAsStringWithBigE(_tokenStream->Read<double>());
              break;
            }
            default:
              break;
          }

          if (t == IfcTokenType::LINE_END)
          {
            newLine = true;
            insideSet = false;
          }
          else
          {
            newLine = false;
          }
          prev = t;
        }

      }
      output << "ENDSEC;"<<std::endl<<"DATA;"<<std::endl;
      for(uint32_t i=0; i < _lines.size();i++)
      {
        _tokenStream->MoveTo(_lines[i].tapeOffset);
        bool newLine = true;
        bool insideSet = false;
        IfcTokenType prev = IfcTokenType::EMPTY;
        while (!_tokenStream->IsAtEnd())
        {
          IfcTokenType t = static_cast<IfcTokenType>(_tokenStream->Read<char>());

          if (t != IfcTokenType::SET_END && t != IfcTokenType::LINE_END)
          {
            if (insideSet && prev != IfcTokenType::SET_BEGIN && prev != IfcTokenType::LABEL && prev != IfcTokenType::LINE_END)
            {
              output << ",";
            }
          }

          if (t == IfcTokenType::LINE_END)
          {
            output << ";" << std::endl;
            break;
          }

          switch (t)
          {
            case IfcTokenType::UNKNOWN:
            {
              output << "*";
              break;
            }
            case IfcTokenType::EMPTY:
            {
              output << "$";
              break;
            }
            case IfcTokenType::SET_BEGIN:
            {
              output << "(";
              insideSet = true;
              break;
            }
            case IfcTokenType::SET_END:
            {
              output << ")";
              break;
            }
            case IfcTokenType::STRING:
            {
              output << "'" << p21encode(_tokenStream->ReadString()) << "'";
              break;
            }
            case IfcTokenType::ENUM:
            {
              output << "." << _tokenStream->ReadString() << ".";
              break;
            }
            case IfcTokenType::LABEL:
            {
              output << _tokenStream->ReadString();
              break;
            }
            case IfcTokenType::REF:
            {
              output << "#" << _tokenStream->Read<uint32_t>();
              if (newLine) output << "=";
              break;
            }
            case IfcTokenType::REAL:
            {
              output << getAsStringWithBigE(_tokenStream->Read<double>());
              break;
            }
            default:
              break;
          }

          if (t == IfcTokenType::LINE_END)
          {
            newLine = true;
            insideSet = false;
          }
          else
          {
            newLine = false;
          }
          prev = t;
        }
      }
      output << "ENDSEC;"<<std::endl<<"END-ISO-10303-21;";
      std::string tmp = output.str();
      const char * outputString = tmp.c_str();
      outputData((char*)outputString,tmp.size());
   }
   
   void IfcLoader::SaveFile(std::ostream &outputData)
   { 
     SaveFile([&](char* src, size_t srcSize)
      {
          outputData.write(src,srcSize);
      }
    );
   }
   
   void IfcLoader::InitialiseIfcParsing()
   {
     ParseLines();
     PopulateRelVoidsMap();
     PopulateRelAggregatesMap();
     PopulateStyledItemMap();
   	 PopulateRelMaterialsMap();
     ReadLinearScalingFactor();
   }
   
   bool IfcLoader::IsAtEnd()
   {
     return _tokenStream->IsAtEnd();
   }
  
   void IfcLoader::ParseLines() 
   {
        uint32_t maxExpressId = 0;
  			uint32_t currentIfcType = 0;
  			uint32_t currentExpressID = 0;
  			uint32_t currentTapeOffset = 0;
  			while (!_tokenStream->IsAtEnd())
  			{
          IfcTokenType t = static_cast<IfcTokenType>(_tokenStream->Read<char>());
  				switch (t)
  				{
  				case IfcTokenType::LINE_END:
  				{
            if (currentExpressID != 0)
  					{
  						IfcLine l;
  						l.expressID = currentExpressID;
  						l.ifcType = currentIfcType;
  						l.lineIndex = static_cast<uint32_t>(_lines.size());
  						l.tapeOffset = currentTapeOffset;
  						l.tapeEnd = _tokenStream->GetReadOffset();
  						_ifcTypeToLineID[l.ifcType].push_back(l.lineIndex);
  						maxExpressId = std::max(maxExpressId, l.expressID);

  						_lines.push_back(std::move(l));
  					}
  					else if (currentIfcType != 0)
  					{
  						if(currentIfcType == webifc::schema::FILE_DESCRIPTION || currentIfcType == webifc::schema::FILE_NAME||currentIfcType == webifc::schema::FILE_SCHEMA )
  						{
  							IfcHeaderLine l;
  							l.ifcType = currentIfcType;
  							l.lineIndex = static_cast<uint32_t>(_headerLines.size());
  							l.tapeOffset = currentTapeOffset;
  							l.tapeEnd = _tokenStream->GetReadOffset();
  							_ifcTypeToHeaderLineID[l.ifcType].push_back(l.lineIndex);
  							_headerLines.push_back(std::move(l));
  						}
  					}

  					// reset
  					currentExpressID = 0;
  					currentIfcType = 0;
  					currentTapeOffset = _tokenStream->GetReadOffset();

  					break;
  				}
  				case IfcTokenType::UNKNOWN:
  				case IfcTokenType::EMPTY:
  				case IfcTokenType::SET_BEGIN:
  				case IfcTokenType::SET_END:
  					break;
  				case IfcTokenType::STRING:
  				case IfcTokenType::ENUM:
  				{
  					_tokenStream->ReadString();

  					break;
  				}
  				case IfcTokenType::LABEL:
  				{
  					std::string_view s = _tokenStream->ReadString();
  					if (currentIfcType == 0)
  					{
              currentIfcType = _schemaManager.IfcTypeToTypeCode(s);
  					}

  					break;
  				}
  				case IfcTokenType::REF:
  				{
  					uint32_t ref = _tokenStream->Read<uint32_t>();
  					if (currentExpressID == 0)
  					{
  						currentExpressID = ref;
  					}

  					break;
  				}
  				case IfcTokenType::REAL:
  				{
  					_tokenStream->Forward(sizeof(double));
  					break;
  				}
  				default:
  					break;
  				}
  			}
  			_expressIDToLine.resize(maxExpressId + 1);
  			for (uint32_t i = 1; i <= _lines.size(); i++) _expressIDToLine[_lines[i-1].expressID] = i;
   }
   
   size_t IfcLoader::GetNumLines()
   { 
     return _lines.size();
   }
   
   std::vector<uint32_t> &IfcLoader::GetLineIDsWithType(const uint32_t type)
   { 
      return _ifcTypeToLineID[type];
   }
   
   uint32_t IfcLoader::GetMaxExpressId()
   { 
      if (_expressIDToLine.size()==0) return 0;
      return _expressIDToLine.size()-1;
   }
   
   bool IfcLoader::IsValidExpressID(const uint32_t expressID)
   {  
   	 if (_expressIDToLine[expressID]==0) return false;
     else return true;
   }
   
   uint32_t IfcLoader::ExpressIDToLineID(const uint32_t expressID)
   { 
      return _expressIDToLine[expressID]-1;
   }
   
   uint32_t IfcLoader::LineIDToExpressID(const uint32_t lineID)
   { 
      return _lines[lineID].expressID;
   }
   
   IfcLine &IfcLoader::GetLine(const uint32_t lineID)
   { 
      return _lines[lineID];
   }
   
   double IfcLoader::GetLinearScalingFactor()
   { 
      return _linearScalingFactor;
   }
   
   bool IfcLoader::IsOpen()
   { 
      return _open;
   }
    
   void IfcLoader::SetClosed()
   { 
     _open=false;
     delete _tokenStream;
   }
   
   void IfcLoader::MoveToLineArgument(const uint32_t lineID, const uint32_t argumentIndex)
   { 
     MoveToArgumentOffset(_lines[lineID], argumentIndex);
   }
   
   void IfcLoader::MoveToHeaderLineArgument(const uint32_t lineID, const uint32_t argumentIndex)
   { 
     _tokenStream->MoveTo(_headerLines[lineID].tapeOffset);
   	 ArgumentOffset(argumentIndex);	
   }
   
   std::string IfcLoader::GetStringArgument()
   { 
   	 std::string s = std::string(GetStringViewArgument());
     return s;
   }
   
   std::string_view IfcLoader::GetStringViewArgument()
   { 
     _tokenStream->Read<char>(); // string type
   	 std::string_view s = _tokenStream->ReadString();
     return s;
   }
   
   double IfcLoader::GetDoubleArgument()
   { 
       _tokenStream->Read<char>(); // real type
       return _tokenStream->Read<double>();
   }
   
   uint32_t IfcLoader::GetRefArgument()
   { 
      if (_tokenStream->Read<char>() != IfcTokenType::REF)
     	{
     		_errorHandler.ReportError({utility::LoaderErrorType::PARSING, "unexpected token type, expected REF"});
     		return 0;
     	}
     	return _tokenStream->Read<uint32_t>();
   }
   
  uint32_t IfcLoader::GetRefArgument(const uint32_t tapeOffset)
	{
			_tokenStream->MoveTo(tapeOffset);
			return GetRefArgument();
	}
    
  double IfcLoader::GetDoubleArgument(const uint32_t tapeOffset)
	{
		_tokenStream->MoveTo(tapeOffset);
		return GetDoubleArgument();
	}
  
  void IfcLoader::UpdateLineTape(const uint32_t expressID, const uint32_t type, const uint32_t start, const uint32_t end)
  {
  	if (expressID >= _expressIDToLine.size())
    {
       // allocate some space
      _expressIDToLine.resize(expressID+1);
    }

    // new line?
    if (_expressIDToLine[expressID] == 0)
  	{

      // create line object
  		int lineID = _lines.size();
  		_lines.emplace_back();

  		// create a line ID
  		_expressIDToLine[expressID] = lineID+1;
  		auto &line = _lines[lineID];

  		// fill line data
  		line.expressID = expressID;
  		line.lineIndex = lineID;
  		line.ifcType = type;

  		_ifcTypeToLineID[type].push_back(lineID);
  	}

  	auto lineID = _expressIDToLine[expressID]-1;
  	auto &line = _lines[lineID];

  	line.tapeOffset = start;
  	line.tapeEnd = end;
  }

  void IfcLoader::AddHeaderLineTape(const uint32_t type, const uint32_t start, const uint32_t end)
  {
    
      IfcHeaderLine l;
      l.ifcType = type;
      l.lineIndex = static_cast<uint32_t>(_headerLines.size());
      l.tapeOffset = start;
      l.tapeEnd = end;
      _ifcTypeToHeaderLineID[l.ifcType].push_back(l.lineIndex);
      _headerLines.push_back(std::move(l));
  }
  
  IfcTokenType IfcLoader::GetTokenType(uint32_t tapeOffset)
  {
    _tokenStream->MoveTo(tapeOffset);
    return GetTokenType();
  }
   
   uint32_t IfcLoader::GetOptionalRefArgument()
   { 
      IfcTokenType t = GetTokenType();
     	if (t == IfcTokenType::EMPTY)
     	{
     		return 0;
     	}
     	else if (t == IfcTokenType::REF)
     	{
     		return _tokenStream->Read<uint32_t>();
     	}
     	else
     	{
     		_errorHandler.ReportError({utility::LoaderErrorType::PARSING, "unexpected token type, expected REF or EMPTY"});
     		return 0;
     	}
   }
   
   IfcTokenType IfcLoader::GetTokenType()
   { 
     return static_cast<IfcTokenType>(_tokenStream->Read<char>());
   }

   void IfcLoader::Push(void *v, uint64_t size)
   {
     _tokenStream->Push(v,size);
   }
   
   uint64_t IfcLoader::GetTotalSize() 
   {
     return _tokenStream->GetTotalSize();
   }
     
   std::vector<uint32_t> IfcLoader::GetSetArgument()
   { 
     std::vector<uint32_t> tapeOffsets;
     _tokenStream->Read<char>(); // set begin
     int depth = 1;
     while (true)
     {
       uint32_t offset = _tokenStream->GetReadOffset();
       IfcTokenType t = static_cast<IfcTokenType>(_tokenStream->Read<char>());

       if (t == IfcTokenType::SET_BEGIN)
       {
         depth++;
       }
       else if (t == IfcTokenType::SET_END)
       {
         depth--;
       }
       else
       {
         tapeOffsets.push_back(offset);

         if (t == IfcTokenType::REAL)
         {
           _tokenStream->Read<double>();
         }
         else if (t == IfcTokenType::REF)
         {
           _tokenStream->Read<uint32_t>();
         }
         else if (t == IfcTokenType::STRING)
         {
           uint16_t length = _tokenStream->Read<uint16_t>();
           _tokenStream->Forward(length);
         }
         else if (t == IfcTokenType::LABEL)
         {
           uint16_t length = _tokenStream->Read<uint16_t>();
           _tokenStream->Forward(length);
         }
         else
         {
           _errorHandler.ReportError({utility::LoaderErrorType::PARSING, "unexpected token"});
         }
       }

       if (depth == 0)
       {
         break;
       }
     }

     return tapeOffsets;
   }
   
   std::vector<std::vector<uint32_t>> IfcLoader::GetSetListArgument()
   { 
     std::vector<std::vector<uint32_t>> tapeOffsets;
   	 _tokenStream->Read<char>(); // set begin
   	 int depth = 1;
   	 std::vector<uint32_t> tempSet;

     	while (true)
     	{
     		uint32_t offset = _tokenStream->GetReadOffset();
     		IfcTokenType t = static_cast<IfcTokenType>(_tokenStream->Read<char>());

     		if (t == IfcTokenType::SET_BEGIN)
     		{
     			tempSet = std::vector<uint32_t>();
     			depth++;
     		}
     		else if (t == IfcTokenType::SET_END)
     		{
     			if (tempSet.size() > 0)
     			{
     				tapeOffsets.push_back(tempSet);
     				tempSet = std::vector<uint32_t>();
     			}
     			depth--;
     		}
     		else
     		{
     			tempSet.push_back(offset);

     			if (t == IfcTokenType::REAL)
     			{
     				_tokenStream->Read<double>();
     			}
     			else if (t == IfcTokenType::REF)
     			{
     				_tokenStream->Read<uint32_t>();
     			}
     			else if (t == IfcTokenType::STRING)
     			{
     				uint16_t length = _tokenStream->Read<uint16_t>();
     				_tokenStream->Forward(length);
     			}
     			else if (t == IfcTokenType::LABEL)
     			{
     				uint16_t length = _tokenStream->Read<uint16_t>();
     				_tokenStream->Forward(length);
     			}
     			else
     			{
     				_errorHandler.ReportError({utility::LoaderErrorType::PARSING, "unexpected token"});
     			}
     		}

     		if (depth == 0)
     		{
     			break;
     		}
     	}

     	return tapeOffsets;
   }
   
   void IfcLoader::PopulateRelVoidsMap()
   {
     auto relVoids = GetExpressIDsWithType(schema::IFCRELVOIDSELEMENT);

     for (uint32_t relVoidID : relVoids)
     {
       uint32_t lineID = ExpressIDToLineID(relVoidID);
       auto &line = GetLine(lineID);

       MoveToArgumentOffset(line, 4);

       uint32_t relatingBuildingElement = GetRefArgument();
       uint32_t relatedOpeningElement = GetRefArgument();

       _relVoids[relatingBuildingElement].push_back(relatedOpeningElement);
       _relVoidRel[relatingBuildingElement].push_back(relVoidID);
     }
   }
   
   void IfcLoader::PopulateRelAggregatesMap()
   {
      auto relVoids = GetExpressIDsWithType(schema::IFCRELAGGREGATES);

     	for (uint32_t relVoidID : relVoids)
     	{
     		uint32_t lineID = ExpressIDToLineID(relVoidID);
     		auto &line = GetLine(lineID);

     		MoveToArgumentOffset(line, 4);

     		uint32_t relatingBuildingElement = GetRefArgument();
     		auto aggregates = GetSetArgument();

     		for (auto &aggregate : aggregates)
     		{
          _tokenStream->MoveTo(aggregate);
     			uint32_t aggregateID = GetRefArgument();
     			_relAggregates[relatingBuildingElement].push_back(aggregateID);
     		}
     	}
   }
   
   void IfcLoader::PopulateStyledItemMap()
   {
     auto styledItems = GetExpressIDsWithType(schema::IFCSTYLEDITEM);

     for (uint32_t styledItemID : styledItems)
     {
       uint32_t lineID = ExpressIDToLineID(styledItemID);
       auto &line = GetLine(lineID);

       MoveToArgumentOffset(line, 0);

       if (GetTokenType() == IfcTokenType::REF)
       {
         _tokenStream->Back();
         uint32_t representationItem = GetRefArgument();

         auto styleAssignments = GetSetArgument();

         for (auto &styleAssignment : styleAssignments)
         {
            _tokenStream->MoveTo(styleAssignment);
           uint32_t styleAssignmentID = GetRefArgument();
           _styledItems[representationItem].emplace_back(styledItemID, styleAssignmentID);
         }
       }
     }
   }
   
   void IfcLoader::PopulateRelMaterialsMap()
   {
     auto styledItems = GetExpressIDsWithType(schema::IFCRELASSOCIATESMATERIAL);

     for (uint32_t styledItemID : styledItems)
     {
       uint32_t lineID = ExpressIDToLineID(styledItemID);
       auto &line = GetLine(lineID);

       MoveToArgumentOffset(line, 5);

       uint32_t materialSelect = GetRefArgument();

       MoveToArgumentOffset(line, 4);

       auto RelatedObjects = GetSetArgument();

       for (auto &ifcRoot : RelatedObjects)
       {
         _tokenStream->MoveTo(ifcRoot);
         uint32_t ifcRootID = GetRefArgument();
         _relMaterials[ifcRootID].emplace_back(styledItemID, materialSelect);
       }
     }

     auto matDefs = GetExpressIDsWithType(schema::IFCMATERIALDEFINITIONREPRESENTATION);

     for (uint32_t styledItemID : matDefs)
     {
       uint32_t lineID = ExpressIDToLineID(styledItemID);
       auto &line = GetLine(lineID);

       MoveToArgumentOffset(line, 2);

       auto representations = GetSetArgument();

       MoveToArgumentOffset(line, 3);

       uint32_t material = GetRefArgument();

       for (auto &representation : representations)
       {
         _tokenStream->MoveTo(representation);
         uint32_t representationID = GetRefArgument();
         _materialDefinitions[material].emplace_back(styledItemID, representationID);
       }
     }
   }
   
   void IfcLoader::ReadLinearScalingFactor()
   {
     auto projects = GetExpressIDsWithType(schema::IFCPROJECT);

     if (projects.size() != 1)
     {
       _errorHandler.ReportError({utility::LoaderErrorType::PARSING, "unexpected empty ifc project"});
       return;
     }

     auto projectEID = projects[0];

     auto &line = GetLine(ExpressIDToLineID(projectEID));
     MoveToArgumentOffset(line, 8);

     auto unitsID = GetRefArgument();

     auto &unitsLine = GetLine(ExpressIDToLineID(unitsID));
     MoveToArgumentOffset(unitsLine, 0);

     auto unitIds = GetSetArgument();

     for (auto &unitID : unitIds)
     {
       _tokenStream->MoveTo(unitID);
       auto unitRef = GetRefArgument();

       auto &line = GetLine(ExpressIDToLineID(unitRef));

       if (line.ifcType == schema::IFCSIUNIT)
       {
         MoveToArgumentOffset(line, 1);
         std::string unitType = GetStringArgument();

         std::string unitPrefix;

         MoveToArgumentOffset(line, 2);
         if (GetTokenType() == IfcTokenType::ENUM)
         {
           _tokenStream->Back();
           unitPrefix = GetStringArgument();
         }

         MoveToArgumentOffset(line, 3);
         std::string unitName = GetStringArgument();

         if (unitType == "LENGTHUNIT" && unitName == "METRE")
         {
           double prefix = ConvertPrefix(unitPrefix);
           _linearScalingFactor *= prefix;
         }
       }
       if(line.ifcType == schema::IFCCONVERSIONBASEDUNIT)
       {
         MoveToArgumentOffset(line, 1);
         std::string unitType = GetStringArgument();
         MoveToArgumentOffset(line, 3);
         auto unitRefLine = GetRefArgument();
         auto &unitLine = GetLine(ExpressIDToLineID(unitRefLine));
         
         MoveToArgumentOffset(unitLine, 1);
         auto ratios = GetSetArgument();

         ///Scale Correction

         MoveToArgumentOffset(unitLine, 2);
         auto scaleRefLine = GetRefArgument();

         auto &scaleLine = GetLine(ExpressIDToLineID(scaleRefLine));

         MoveToArgumentOffset(scaleLine, 1);
         std::string unitTypeScale = GetStringArgument();

         std::string unitPrefix;

         MoveToArgumentOffset(scaleLine, 2);
         if (GetTokenType() == IfcTokenType::ENUM)
         {
           _tokenStream->Back();
           unitPrefix = GetStringArgument();
         }

         MoveToArgumentOffset(scaleLine, 3);
         std::string unitName = GetStringArgument();

         if (unitTypeScale == "LENGTHUNIT" && unitName == "METRE")
         {
           double prefix = ConvertPrefix(unitPrefix);
           _linearScalingFactor *= prefix;
         }

         _tokenStream->MoveTo(ratios[0]);
         double ratio = GetDoubleArgument();
         if(unitType == "LENGTHUNIT")
         {
           _linearScalingFactor *= ratio;
         }
         else if (unitType == "AREAUNIT")
         {
           _squaredScalingFactor *= ratio;
         }
         else if (unitType == "VOLUMEUNIT")
         {
           _cubicScalingFactor *= ratio;
         }
         else if (unitType == "PLANEANGLEUNIT")
         {
           _angularScalingFactor *= ratio;
         }
       }		
     }
   }
   
   void IfcLoader::ArgumentOffset(const uint32_t argumentIndex)
   {
   	uint32_t movedOver = 0;
   	uint32_t setDepth = 0;
   	while (true)
   	{
   		if (setDepth == 1)
   		{
   			movedOver++;

   			if (movedOver-1 == argumentIndex)
   			{
   				return;
   			}
   		}

   		IfcTokenType t = static_cast<IfcTokenType>(_tokenStream->Read<char>());

   		switch (t)
   		{
   		case IfcTokenType::LINE_END:
   		{
   			_errorHandler.ReportError({utility::LoaderErrorType::PARSING, "unexpected line end"});
   			break;
   		}
   		case IfcTokenType::UNKNOWN:
   		case IfcTokenType::EMPTY:
   			break;
   		case IfcTokenType::SET_BEGIN:
   			setDepth++;
   			break;
   		case IfcTokenType::SET_END:
   			setDepth--;
   			if (setDepth == 0)
   			{
   				return;
   			}
   			break;
   		case IfcTokenType::STRING:
   		case IfcTokenType::ENUM:
   		case IfcTokenType::LABEL:
   		{
   			uint16_t length = _tokenStream->Read<uint16_t>();
   			_tokenStream->Forward(length);
   			break;
   		}
   		case IfcTokenType::REF:
   		{
   			_tokenStream->Read<uint32_t>();
   			break;
   		}
   		case IfcTokenType::REAL:
   		{
   			_tokenStream->Read<double>();
   			break;
   		}
   		default:
   			break;
   		}
   	}
   }
   
   void IfcLoader::MoveToArgumentOffset(IfcLine &line, const uint32_t argumentIndex)
   {
    _tokenStream->MoveTo(line.tapeOffset);
   	ArgumentOffset(argumentIndex);
   }
   
   void IfcLoader::StepBack() {
     _tokenStream->Back();
   }

   double IfcLoader::GetOptionalDoubleParam(double defaultValue = 0)
    {
      if (GetTokenType() ==IfcTokenType::REAL)
      {
        StepBack();
        return GetDoubleArgument();
      }
      return defaultValue;
    }

}