/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
 
#include <vector>
#include <istream>
#include "IfcTokenStream.h"

namespace webifc::parsing
{

  IfcTokenStream::IfcTokenStream(const size_t chunkSize, const uint64_t maxChunks) 
  :  _chunkSize(chunkSize), _maxChunks(maxChunks)
  { 
    _cChunk=nullptr;
    _fileStream=nullptr;
  }

  IfcTokenStream::~IfcTokenStream() 
  {
    for (size_t i=0; i < _chunks.size();i++)  _chunks[i].Clear(true);
    _chunks.clear();
    std::vector<IfcTokenChunk>().swap(_chunks);
    delete _fileStream;
  }

  size_t IfcTokenStream::GetNoLines() {
    if (_fileStream != nullptr) return _fileStream->GetNoLines();
    return 0;
  }

  void IfcTokenStream::SetTokenSource(const std::function<uint32_t(char *, size_t, size_t)> &requestData, bool fromStream) 
  {
      _fileStream = new IfcFileStream(requestData,_chunkSize,fromStream);
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
      if (_chunks.empty())
      {
        // empty source (e.g. zero-byte file): one empty writer chunk keeps
        // every downstream invariant (front()/IsAtEnd) intact
        _chunks.emplace_back(_chunkSize, 0, 0, nullptr);
        _activeChunks++;
      }
      _cChunk = &_chunks.front();
      _fileStream->Clear();
  }

  void IfcTokenStream::SetTokenSource(std::istream &requestData)
  {
     // clear() first: once a read hits EOF the stream keeps failbit, and a
     // failed seekg would make every later chunk reload return 0 bytes —
     // chunk eviction re-reads the source for the model's whole lifetime.
     SetTokenSource([&](char* dest, size_t sourceOffset, size_t destSize) { requestData.clear(); requestData.seekg(sourceOffset); requestData.read(dest, destSize); return (uint32_t)requestData.gcount();},true);
  }
  
  std::string_view IfcTokenStream::ReadString() 
  {
      if (!_cChunk->IsLoaded()) {
        checkMemory();
        _activeChunks++;
      }
      auto length = _cChunk->Read<uint32_t>(_readPtr);
      Forward(sizeof(uint32_t));
      if (length > 0) 
      {
        auto str = _cChunk->ReadString(_readPtr,length);
        Forward(length);
        return str;
      }
      return "";
  }
    
  void IfcTokenStream::MoveTo(const size_t pos)
  {
     for (size_t i=_chunks.size()-1; i >=0; i--)
      {
        if (_chunks[i].GetTokenRef() <= pos) 
        {
          _currentChunk = i;
          _cChunk = &_chunks[_currentChunk];
          _readPtr = pos - _cChunk->GetTokenRef();
          break;
        }
      }
  }
  
  void IfcTokenStream::checkMemory()
  {
    if (_maxChunks != 0 && _activeChunks >= _maxChunks){
      for (uint32_t x = 0; x < _chunks.size(); x++)
      {
        // never evict the chunk under the read cursor: callers may hold
        // string_views into it between loader calls
        if (&_chunks[x] == _cChunk)
          continue;
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
      // Writer-fed chunks get a null file stream: their content does not
      // exist in the source file, so eviction must never free them (Clear()
      // refuses when _fileStream is null) — a reload would re-tokenize file
      // bytes instead of the written tokens.
      if (_chunks.empty())
      {
        _chunks.emplace_back(_chunkSize,0,0,nullptr);
        _activeChunks++;
      }
      if ( _chunks.back().TokenSize() + size > _chunks.back().GetMaxSize())
      {
        checkMemory();
        _chunks.emplace_back(_chunkSize,_chunks.back().GetTokenRef() + _chunks.back().TokenSize(),0,nullptr);
        _activeChunks++;
      }
      _chunks.back().Push(v,size);
  }
  
  size_t IfcTokenStream::GetTotalSize()
  {
    if (_chunks.size()==0) return 0;
    return _chunks.back().TokenSize() + _chunks.back().GetTokenRef();
  }
  
  size_t IfcTokenStream::GetReadOffset() 
  {
      return _cChunk->GetTokenRef() + _readPtr;
  }

  IfcTokenStream * IfcTokenStream::Clone() {
    IfcTokenStream * newStream = new IfcTokenStream(_activeChunks,_maxChunks,_chunks,_fileStream->Clone());
    return newStream;
  }

  IfcTokenStream::IfcTokenStream(size_t activeChunks, uint64_t maxChunks, std::vector<IfcTokenStream::IfcTokenChunk> &chunks,IfcTokenStream::IfcFileStream * fileStream) : _activeChunks(activeChunks), _maxChunks(maxChunks), _chunks(chunks),  _cChunk(&chunks[0]), _fileStream(fileStream)
  {}

}