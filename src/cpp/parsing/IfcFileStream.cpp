/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */
 
 #include "IfcTokenStream.h"
 
 namespace webifc::parsing {

   IfcTokenStream::IfcFileStream::IfcFileStream(const std::function<uint32_t(char *, size_t, size_t)> &requestData, uint32_t size) : _dataSource(requestData), _size(size)
   {
     _buffer = nullptr;
     load();
   }

   IfcTokenStream::IfcFileStream::~IfcFileStream() 
   {
    delete _buffer;
   }
   
   void IfcTokenStream::IfcFileStream::load()
   {
     if (_buffer == nullptr) _buffer = new char[_size];
     else if (_currentSize > 0) prev=_buffer[_currentSize-1];
     _currentSize = _dataSource(_buffer, _startRef, _size);
     _pointer = 0;
   }
       
   void IfcTokenStream::IfcFileStream::Go(uint32_t ref)
   {
      _startRef=ref;
      load();
   }
       
  void IfcTokenStream::IfcFileStream::Forward() 
   { 
     _pointer++;
     if (_pointer == _currentSize && _currentSize != 0)
     {
       _startRef += _currentSize;
       load();
     }
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
   
   char IfcTokenStream::IfcFileStream::Prev() 
   {
     if (_pointer == 0) return prev;
     return _buffer[_pointer-1]; 
   }
   
   bool IfcTokenStream::IfcFileStream::IsAtEnd() 
   {
     return _pointer == _currentSize && _currentSize == 0;
   }
   
   size_t IfcTokenStream::IfcFileStream::GetRef() 
   {
     return _startRef+_pointer;
   }
   
   char IfcTokenStream::IfcFileStream::Get()
   { 
     return _buffer[_pointer]; 
   }
 }