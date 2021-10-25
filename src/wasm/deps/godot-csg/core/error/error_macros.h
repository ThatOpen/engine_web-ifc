/*************************************************************************/
/*  error_macros.h                                                       */
/*************************************************************************/
/*                       This file is part of:                           */
/*                           GODOT ENGINE                                */
/*                      https://godotengine.org                          */
/*************************************************************************/
/* Copyright (c) 2007-2021 Juan Linietsky, Ariel Manzur.                 */
/* Copyright (c) 2014-2021 Godot Engine contributors (cf. AUTHORS.md).   */
/*                                                                       */
/* Permission is hereby granted, free of charge, to any person obtaining */
/* a copy of this software and associated documentation files (the       */
/* "Software"), to deal in the Software without restriction, including   */
/* without limitation the rights to use, copy, modify, merge, publish,   */
/* distribute, sublicense, and/or sell copies of the Software, and to    */
/* permit persons to whom the Software is furnished to do so, subject to */
/* the following conditions:                                             */
/*                                                                       */
/* The above copyright notice and this permission notice shall be        */
/* included in all copies or substantial portions of the Software.       */
/*                                                                       */
/* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,       */
/* EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF    */
/* MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.*/
/* IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY  */
/* CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,  */
/* TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE     */
/* SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.                */
/*************************************************************************/

#include <stdexcept>

#ifndef ERROR_MACROS_H
#define ERROR_MACROS_H

#define ERR_FAIL_V(...)
#define ERR_FAIL_INDEX_V(a, b, c) if (a >= b) throw std::runtime_error("ERR_FAIL_INDEX");
#define ERR_FAIL_INDEX(a, b) if (a >= b) throw std::runtime_error("ERR_FAIL_INDEX");
#define ERR_FAIL_COND_V(cond, b) if (cond) throw std::runtime_error("asdfasdf");
#define ERR_FAIL_COND_MSG(cond, msg) if (cond) throw std::runtime_error(msg);
#define CRASH_BAD_INDEX(a, b) if (a >= b) throw std::runtime_error("ERR_FAIL_INDEX");
#define CRASH_NOW_MSG(...)
#define ERR_FAIL_COND(cond) if (cond) throw std::runtime_error("asdfasdf");
#define ERR_FAIL_COND_V_MSG(...)
#define ERR_FAIL_V_MSG(...)
#define ERR_PRINT(...)
#define WARN_PRINT(...)
#define ERR_FAIL(...)
#define CRASH_COND(...)

#endif // ERROR_MACROS_H
