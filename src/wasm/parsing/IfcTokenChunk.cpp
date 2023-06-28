/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
 

#include "IfcTokenStream.h"

namespace webifc::parsing
{

  std::vector<char> p21decode(std::vector<char> & str);
  bool need_to_decode(std::vector<char> & str);
  double crack_atof(const char*& num, const char* const end);

    
  IfcTokenStream::IfcTokenChunk::IfcTokenChunk(const size_t chunkSize, const size_t startRef, const size_t fileStartRef, IfcFileStream *fileStream) :  _startRef(startRef), _fileStartRef(fileStartRef), _chunkSize(chunkSize), _fileStream(fileStream)
  {
    _chunkData = nullptr;
    if (_fileStream!=nullptr) Load();
    else _loaded=true;
  }
  
  bool IfcTokenStream::IfcTokenChunk::Clear()
  {
    if (_fileStream==nullptr) return false; 
    delete[] _chunkData;
    _loaded=false;
    return true;
  }
  
  size_t IfcTokenStream::IfcTokenChunk::GetTokenRef()
  {
    return _startRef;
  }
  
  size_t IfcTokenStream::IfcTokenChunk::TokenSize()
  {
    return _currentSize;
  }
  
  bool IfcTokenStream::IfcTokenChunk::IsLoaded() 
  {
    return _loaded;
  }
  
  std::string_view IfcTokenStream::IfcTokenChunk::ReadString(const size_t ptr,const size_t size) 
  {
  		if (!_loaded) Load();
      return std::string_view((char*)_chunkData+ptr,size);
  }
  
  void IfcTokenStream::IfcTokenChunk::Push(void *v, const size_t size)
  {
      _currentSize+=size;
      if (_chunkData == nullptr) 
      {
         _chunkData = new uint8_t[_chunkSize];
      }
      if (_currentSize > _chunkSize) {
          uint8_t * tmp = _chunkData;
          _chunkData = new uint8_t[_currentSize];
          std::memcpy(_chunkData, tmp, _currentSize-size);
          _chunkSize = _currentSize;
          delete[] tmp;
      }
      std::memcpy(_chunkData + _currentSize - size, v, size);
  }
  
  void IfcTokenStream::IfcTokenChunk::Load()
  {
      _chunkData = new uint8_t[_chunkSize];
      _loaded=true;
      if (_fileStream->GetRef()!=_fileStartRef) _fileStream->Go(_fileStartRef);
      std::vector<char> temp;
      _currentSize = 0;
      while ( !_fileStream->IsAtEnd() && _currentSize < _chunkSize)
      {
        const char c = _fileStream->Get();
        if (c == ' ' || c == '\n' || c == '\r' || c == '\t')
        { 
          _fileStream->Forward();
          continue;
        }

        if (c == '\'')
        {

          _fileStream->Forward();
          temp.clear();
          // apparently I dont fully understand strings in IFC yet
          // this example from uptown shows that escaping is not used: 'Type G5 - 800kg/m\X2\00B2\X0\';
          // this example from revit shows that double quotes are used as one quote: 'RPC Tree - Deciduous:Scarlet Oak - 42'':946835'
          // turns out this is just part of ISO 10303-21, thanks ottosson!
          while (true)
          {
  
            temp.push_back(_fileStream->Get());
            // if its a quote, maybe its the end of the string
            if (_fileStream->Get() == '\'')
            {
              // if there's another quote behind it, its not
              _fileStream->Forward();
              if (_fileStream->Get() == '\'')
              {
                // we also bump pos, otherwise we still break next loop...
                temp.push_back(_fileStream->Get());
              }
              else
              {
                _fileStream->Back();
                temp.pop_back();
                break;
              }
            }
            
             _fileStream->Forward();
            
          }

          if (need_to_decode(temp)) temp = p21decode(temp);

          Push<uint8_t>(IfcTokenType::STRING);
          Push<uint16_t>(temp.size());
          if (!temp.empty()) Push((void*)&temp[0], temp.size());
          
        } 
        else if (c == '#')
        {
          _fileStream->Forward();
          uint32_t num = 0;
          while (_fileStream->Get() >= '0' &&  _fileStream->Get() <= '9')
          {
            num = num * 10 + (_fileStream->Get() - '0');
            _fileStream->Forward();
          }

          Push<uint8_t>(IfcTokenType::REF);
          Push<uint32_t>(num);

          // skip next advance
          continue;
        }
        else if (c == '$') Push<uint8_t>(IfcTokenType::EMPTY);
        else if (c == '*')
        {
          if (_fileStream->Prev() == '/')
          {
            _fileStream->Forward();

            // comment
            while (!(_fileStream->Prev() == '*' && _fileStream->Get() == '/')) _fileStream->Forward();
  
          }
          else Push<uint8_t>(IfcTokenType::UNKNOWN);
        }
        else if (c == '(') Push<uint8_t>(IfcTokenType::SET_BEGIN);
        else if (c >= '0' && c <= '9')
        {
          bool negative = _fileStream->Prev() == '-';
          temp.clear();

          while ((_fileStream->Get() >= '0' && _fileStream->Get() <= '9') || (_fileStream->Get() == '.') || _fileStream->Get() == 'e' || _fileStream->Get() == 'E' || _fileStream->Get() == '-'|| _fileStream->Get() == '+')
          {
            temp.push_back(_fileStream->Get());
            _fileStream->Forward();
          }

          const char* start = &(temp[0]);
          const char* end = start;
          double value = crack_atof(end, start + temp.size());

          if (negative) value *= -1;
          Push<uint8_t>(IfcTokenType::REAL);
          Push<double>(value);

          // skip next advance
          continue;
        }
        else if (c == '.')
        {
          temp.clear();
          _fileStream->Forward();
          while (_fileStream->Get() != '.')
          {
            temp.push_back(_fileStream->Get());
            _fileStream->Forward();
          }

          Push<uint8_t>(IfcTokenType::ENUM);
          Push<uint16_t>(temp.size());
          Push((void*)&temp[0], temp.size());
        }
        else if ((c >= 'A' && c <= 'Z') || (c >= 'a' && c <= 'z'))
        {
          temp.clear();
          while ((_fileStream->Get() >= 'A' && _fileStream->Get() <= 'Z') || (_fileStream->Get() >= 'a' && _fileStream->Get() <= 'z') || (_fileStream->Get() >= '0' && _fileStream->Get() <= '9') || _fileStream->Get() == '_')
          {
            temp.push_back(std::toupper(_fileStream->Get()));
            _fileStream->Forward();
          }

          Push<uint8_t>(IfcTokenType::LABEL);
          Push<uint16_t>(temp.size());
          Push((void*)&temp[0], temp.size ());

          // skip next advance
          continue;
        }
        else if (c == ')') Push<uint8_t>(IfcTokenType::SET_END);
        else if (c == ';')
        {
          Push<uint8_t>(IfcTokenType::LINE_END);
          _fileStream->Forward();
          continue;
        }
        _fileStream->Forward();  
      }
      _chunkSize=_currentSize;
    }
}