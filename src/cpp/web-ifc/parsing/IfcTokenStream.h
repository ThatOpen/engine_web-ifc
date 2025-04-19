/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
 
#pragma once
 
#include <vector>
#include <istream>
#include <iostream>
#include <functional>
#include <string_view>
#include <cstring>
#include <cstdint>
 
namespace webifc::parsing
{
  
  enum IfcTokenType : char
  {
    UNKNOWN = 0,
    STRING,
    LABEL,
    ENUM,
    REAL,
    REF,
    EMPTY,
    SET_BEGIN,
    SET_END,
    LINE_END,
    INTEGER
  };
  
  
  class IfcTokenStream 
  {
      public:
        IfcTokenStream(const size_t chunkSize, const uint64_t maxChunks);
        ~IfcTokenStream();
        void SetTokenSource(const std::function<uint32_t(char *, size_t, size_t)> &requestData);
        void SetTokenSource(std::istream &requestData);
        template <typename T> T Read()
        {
          if (!_cChunk->IsLoaded()) {
            checkMemory();
            _activeChunks++;
          }
          T v =  _cChunk->Read<T>(_readPtr);
          Forward(sizeof(T));
          return v;
        }
        template <typename T> void Push(T input)
        {
          Push(&input,sizeof(T));
        }
        void Push(void *v, const size_t size);
        void Forward(const size_t size);
        std::string_view ReadString();
        void Back();
        inline bool IsAtEnd() const noexcept {
            return _currentChunk >= _chunks.size() - 1 && _readPtr >= _chunks.back().TokenSize();
        };
        void MoveTo(const size_t pos);
        size_t GetReadOffset();
        size_t GetTotalSize();

      private:
        void checkMemory();
        size_t _readPtr = 0;
      	size_t _currentChunk = 0;
        size_t _activeChunks = 0;
        size_t _chunkSize;
        uint64_t _maxChunks;
        class IfcFileStream
        {
          public:
            IfcFileStream(const std::function<uint32_t(char *, size_t, size_t)> &requestData, const uint32_t size);
            ~IfcFileStream();
            void Go(const uint32_t ref);
            void Forward();
            void Back();
            size_t GetRef();
            char Next();
            char Prev();
            bool IsAtEnd();
            char Get();
            void Clear();
          private:
            void load();
            std::function<uint32_t(char *, size_t, size_t)> _dataSource;
            size_t _pointer=0;
            size_t _size;
            char prev;
            size_t _currentSize=0;
            size_t _startRef=0;
            char * _buffer; 
        };
        class IfcTokenChunk
        {
            public:
              IfcTokenChunk(const size_t chunkSize, const size_t startRef, const size_t fileStartRef, IfcFileStream *_fileStream);
              bool Clear(bool force);
              bool Clear() { return Clear(false); }
              inline bool IsLoaded() const noexcept { return _loaded; }
              inline size_t TokenSize() const noexcept { return _currentSize; }
              inline size_t GetTokenRef() const noexcept { return _startRef; }
              size_t GetMaxSize() const noexcept { return _chunkSize; }

              void Push(void *v, const size_t size);
              
              std::string_view ReadString(const size_t ptr,const size_t size); 
              template <typename T> T Read(const size_t ptr)
              {
                if (!_loaded) Load();
                T v;
                std::memcpy(&v, _chunkData+ptr, sizeof(T));
                return v;
              }
              template <typename T> void Push(T input)
              {
                Push(&input,sizeof(T));
              }
            private:
              void Load();
              bool _loaded=false;
              size_t _currentSize=0;
              size_t _startRef=0;
              size_t _fileStartRef;
              size_t _chunkSize;
            	uint8_t *_chunkData;
              IfcFileStream *_fileStream;
        };
        std::vector<IfcTokenChunk> _chunks;
        IfcTokenChunk * _cChunk;
        IfcFileStream * _fileStream;
  };
  
}