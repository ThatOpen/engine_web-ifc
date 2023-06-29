/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
 
#include <vector>
#include <istream>
#include "IfcTokenStream.h"

namespace webifc::parsing
{

  IfcTokenStream::IfcTokenStream(const size_t chunkSize, const size_t maxChunks) 
  :  _chunkSize(chunkSize), _maxChunks(maxChunks)
  { 
    _cChunk=NULL;
    _fileStream=NULL;
  }

  void IfcTokenStream::SetTokenSource(const std::function<uint32_t(char *, size_t, size_t)> &requestData) 
  {
      _fileStream = new IfcFileStream(requestData,_chunkSize);
      size_t tokenOffset=0;
      while (!_fileStream->IsAtEnd())
      {
          checkMemory();
          IfcTokenChunk chunk(_chunkSize,tokenOffset,_fileStream->GetRef(),_fileStream);
          auto cSize = chunk.TokenSize();
          tokenOffset+=cSize;
          if (cSize > _chunkSize) _chunkSize = cSize;
          _chunks.push_back(chunk);
          _activeChunks++;
      }
      _cChunk = &_chunks.front();
      _fileStream->Clear();
  }

  void IfcTokenStream::SetTokenSource(std::istream &requestData)
  { 
     SetTokenSource([&](char* dest, size_t sourceOffset, size_t destSize) { requestData.seekg(sourceOffset); requestData.read(dest, destSize); return requestData.gcount();});
  }
  
  std::string_view IfcTokenStream::ReadString() 
  {
      if (!_cChunk->IsLoaded()) {
        checkMemory();
        _activeChunks++;
      }
      auto length = _cChunk->Read<uint16_t>(_readPtr);
      Forward(2);
      auto str = _cChunk->ReadString(_readPtr,length);
      Forward(length);
      return str;
  }
  
  void IfcTokenStream::Forward(const size_t size)
  {
      _readPtr+=size;
       while (_readPtr >= _cChunk->TokenSize()) 
      {
        if (_currentChunk == _chunks.size()-1)
        {
          _readPtr = _chunks.back().TokenSize();
          return;
        }
        _readPtr -= _cChunk->TokenSize();
        _currentChunk++;
        _cChunk = &_chunks[_currentChunk];
      }
  }
  
  void IfcTokenStream::MoveTo(const size_t pos)
  {
      _currentChunk = pos / _chunkSize;
      _cChunk = &_chunks[_currentChunk];
      _readPtr = pos % _chunkSize;
  }
  
  void IfcTokenStream::checkMemory()
  {
    if (_activeChunks == _maxChunks){
      for (uint32_t x = 0; x < _chunks.size(); x++) 
      {
        if (_chunks[x].IsLoaded())
        {
          if (_chunks[x].Clear())
          {
            _activeChunks--;
            break;
          }
        }
      }
    }
  }
  
  void IfcTokenStream::Push(void *v, const size_t size)
  {
      if (_chunks.empty())
      {
        _chunks.emplace_back(_chunkSize,0,0,_fileStream);
        _activeChunks++;
      }
      if ( _chunks.back().TokenSize() + size > _chunkSize)
      {
        checkMemory();
        _chunks.emplace_back(_chunkSize,_chunks.back().GetTokenRef() + _chunks.back().TokenSize(),0,_fileStream);
        _activeChunks++;
      }
      _chunks.back().Push(v,size);
  }
  
  size_t IfcTokenStream::GetTotalSize()
  {
    if (_chunks.size()==0) return 0;
    return _chunks.back().TokenSize() + _chunks.back().GetTokenRef();
  }
  
  void IfcTokenStream::Back()
  {
      if (_readPtr == 0 ) 
      {
        if (_currentChunk > 0) 
        {
          _cChunk = &_chunks[--_currentChunk];
          _readPtr=_cChunk->TokenSize()-1;
          return;
        }
      }
      _readPtr--;
  }
  
  bool IfcTokenStream::IsAtEnd()
  {
     return _currentChunk >= _chunks.size()-1 && _readPtr >= _chunks.back().TokenSize();
  }
  
  size_t IfcTokenStream::GetReadOffset() 
  {
      return _currentChunk*_chunkSize + _readPtr;
  }
  
}