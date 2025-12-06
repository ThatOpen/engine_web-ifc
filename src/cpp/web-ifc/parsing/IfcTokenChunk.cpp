/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
 

#include "IfcTokenStream.h"

namespace webifc::parsing
{
  
  IfcTokenStream::IfcTokenChunk::IfcTokenChunk(const size_t chunkSize, const size_t startRef, const size_t fileStartRef, IfcFileStream *fileStream) :  _startRef(startRef), _fileStartRef(fileStartRef), _chunkSize(chunkSize), _fileStream(fileStream)
  {
    _chunkData = nullptr;
    _loaded=true;
    _currentSize = 0;
    if (_fileStream!=nullptr) Load();
  }

  bool IfcTokenStream::IfcTokenChunk::Clear(bool force)
  {
    if (_fileStream==nullptr && !force) return false; 
    if (_chunkData!=nullptr) { delete[] _chunkData; _chunkData = nullptr; }
    _loaded=false;
    return true;
  }

  bool IfcTokenStream::IfcTokenChunk::Clear()
  {
    return Clear(false);
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

  size_t IfcTokenStream::IfcTokenChunk::GetMaxSize() 
  {
    return _chunkSize;
  }
  
  std::string_view IfcTokenStream::IfcTokenChunk::ReadString(const size_t ptr,const size_t size) 
  {
  		if (!_loaded) Load();
      return std::string_view((char*)_chunkData+ptr,size);
  }
  
  void IfcTokenStream::IfcTokenChunk::Push(void *v, const size_t size)
  {
      if (_chunkData == nullptr) _chunkData =  new uint8_t[_chunkSize];
      _currentSize+=size;
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
      temp.reserve(50);
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
          Push<uint8_t>(IfcTokenType::STRING);
          Push<uint16_t>(temp.size());
          if (temp.size() > 0) Push(temp.data(),temp.size());
        } 
        else if (c == '#')
        {
          _fileStream->Forward();
          uint32_t num = 0;
          char c = _fileStream->Get();
          while (c >= '0' &&  c <= '9')
          {
            num = num * 10 + (c - '0');
            _fileStream->Forward();
            c = _fileStream->Get();
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
          temp.clear();
          if (_fileStream->Prev() == '-') temp.push_back('-');
          char c = _fileStream->Get();
          bool isFrac = false;
          while ((c >= '0' && c <= '9') || (c == '.') || c == 'e' || c == 'E' || c == '-'|| c == '+')
          {
            temp.push_back(c);
            if (c=='.' || c == 'E') isFrac = true;
            _fileStream->Forward();
            c = _fileStream->Get();
          }
          if (isFrac) Push<uint8_t>(IfcTokenType::REAL);
          else Push<uint8_t>(IfcTokenType::INTEGER);  
          Push<uint16_t>(temp.size());
          Push(temp.data(), temp.size());

          // skip next advance
          continue;
        }
        else if (c == '.')
        {
          temp.clear();
          _fileStream->Forward();
          char c = _fileStream->Get();
          while ( c != '.')
          {
            temp.push_back(c);
            _fileStream->Forward();
            c = _fileStream->Get();
          }

          Push<uint8_t>(IfcTokenType::ENUM);
          Push<uint16_t>(temp.size());
          Push(temp.data(), temp.size());
        }
        else if ((c >= 'A' && c <= 'Z') || (c >= 'a' && c <= 'z'))
        {
          temp.clear();
          char c = _fileStream->Get();
          while ((c >= 'A' && c <= 'Z') || (c >= 'a' && c <= 'z') || (c >= '0' && c <= '9') || c == '_')
          {
            temp.push_back(c);
            _fileStream->Forward();
            c = _fileStream->Get();
          }

          Push<uint8_t>(IfcTokenType::LABEL);
          Push<uint16_t>(temp.size());
          Push(temp.data(), temp.size ());

          // skip next advance
          continue;
        }
        else if (c == ')') Push<uint8_t>(IfcTokenType::SET_END);
        else if (c == ';') Push<uint8_t>(IfcTokenType::LINE_END);
        _fileStream->Forward();  
      }
    }
}