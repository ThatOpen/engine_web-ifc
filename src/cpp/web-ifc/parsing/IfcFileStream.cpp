/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
 
 #include "IfcTokenStream.h"

 namespace webifc::parsing {

   IfcTokenStream::IfcFileStream::IfcFileStream(const std::function<uint32_t(char *, size_t, size_t)> &requestData, size_t size, bool fromStream) : _dataSource(requestData), _size(size), _fromStream(fromStream)
   {
      if (!fromStream) {
        char * countBuffer = new char[_size];
        size_t countSize = 0;
        size_t startCountRef =0;
        while ((countSize = _dataSource(countBuffer, startCountRef, _size)) != 0) {
          for (size_t i=0; i < countSize;i++) if (countBuffer[i]=='\n') noLines++;
            startCountRef+=countSize;
        }
        delete[] countBuffer;
      }
      _buffer = nullptr;
      load();
   }

   IfcTokenStream::IfcFileStream::~IfcFileStream() 
   {
    if (_buffer != nullptr) {
      delete[] _buffer;
      _buffer = nullptr;
    }
   }
   
   void IfcTokenStream::IfcFileStream::load()
   {
     if (_buffer == nullptr) _buffer = new char[_size];
     // Prev() must be exact after ANY window move (Go/Back included): the
     // tokenizer consults it for leading '-' on numbers and '/*' comments, so
     // a stale byte makes an eviction reload diverge from the original
     // tokenization and silently shifts every tape offset in the chunk.
     if (_startRef > 0)
     {
       char pb = 0;
       if (_dataSource(&pb, _startRef - 1, 1) == 1) prev = pb;
       else prev = 0;
     }
     else prev = 0;
     _currentSize = _dataSource(_buffer, _startRef, _size);
     _pointer = 0;
   }
       
   void IfcTokenStream::IfcFileStream::Go(size_t ref)
   {
      _startRef=ref;
      load();
   }

   void IfcTokenStream::IfcFileStream::Back()
   {
      if (_pointer == 0)
      {
        if (_startRef > 0) {
          _startRef--;
          load();
          _pointer = 0;
        }
      } 
      else
      {
        _pointer--;
      }
   } 

   void IfcTokenStream::IfcFileStream::Clear() 
   {
      delete[] _buffer;
      _buffer=nullptr;
   }

   IfcTokenStream::IfcFileStream* IfcTokenStream::IfcFileStream::Clone() {
    IfcFileStream * newStream = new IfcFileStream(_dataSource,_size,_fromStream);
    return newStream;
   }
 }