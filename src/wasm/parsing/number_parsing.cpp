// the C++ STL is a mess for parsing numbers from strings, FAST. from_chars looked good but is not implemented in clang/gcc
// crack_atof is a very very fast alternative


// Original crack_atof version is at http://crackprogramming.blogspot.sg/2012/10/implement-atof.html
// But it cannot convert floating point with high +/- exponent.
// The version below by Tian Bo fixes that problem and improves performance by 10%
// http://coliru.stacked-crooked.com/a/2e28f0d71f47ca5e
// Oliver Schonrock: I picked this code up from
// https://www.codeproject.com/Articles/1130262/Cplusplus-string-view-Conversion-to-Integral-Types
// See there for benchmarking. It's blistering fast. 
// I am sure it's not 10000% "correct", but when summing 1'000'000 parsed doubles for me in a test,
// it obtained the exact same result as the vastly slower std::stod. Good enough for me.
// I recfactored it slightly, changing the signature, see below.

// this is the same signature as from_chars (which doesn't work for float on gcc/clang)
// ie it is a [start, end)  (not including *end). Well suited to parsing read only memorymappedfile
#include <string>
#include <cmath>
#include <sstream>
#include <iomanip>

namespace webifc::parsing {
  
  double crack_atof(const char*& num, const char* const end) {
    if (!num || !end || end <= num) {
      return 0;
    }

    int sign         = 1;
    double int_part  = 0.0;
    double frac_part = 0.0;
    bool has_frac    = false;
    bool has_exp     = false;

    // +/- sign
    if (*num == '-') {
      ++num;
      sign = -1;
    } else if (*num == '+') {
      ++num;
    }

    while (num != end) {
      if (*num >= '0' && *num <= '9') {
        int_part = int_part * 10 + (*num - '0');
      } else if (*num == '.') {
        has_frac = true;
        ++num;
        break;
      } else if (*num == 'e' || *num == 'E') {
        has_exp = true;
        ++num;
        break;
      } else {
        return sign * int_part;
      }
      ++num;
    }

    if (has_frac) {
      double frac_exp = 0.1;

      while (num != end) {
        if (*num >= '0' && *num <= '9') {
          frac_part += frac_exp * (*num - '0');
          frac_exp *= 0.1;
        } else if (*num == 'e' || *num == 'E') {
          has_exp = true;
          ++num;
          break;
        } else {
          return sign * (int_part + frac_part);
        }
        ++num;
      }
    }

    // parsing exponent part
    double exp_part = 1.0;
    if (num != end && has_exp) {
      int exp_sign = 1;
      if (*num == '-') {
        exp_sign = -1;
        ++num;
      } else if (*num == '+') {
        ++num;
      }

      int e = 0;
      while (num != end && *num >= '0' && *num <= '9') {
        e = e * 10 + *num - '0';
        ++num;
      }

      int n = exp_sign * e;
      double r   = 10.0;
      if (n < 0) {
        n = -n;
        r = 0.1;
      }

      while (n) {
        if (n & 1) {
          exp_part *= r;
        }
        r *= r;
        n >>= 1;
      }
    
    }

    return sign * (int_part + frac_part) * exp_part;
  }


  std::string getAsStringWithBigE(double theNumber)
    {
      std::stringstream stream;
      if (std::floor(theNumber) == theNumber) {
        // integer
        long theActualNumber = (long) theNumber;
        stream << theActualNumber << ".";
        return stream.str();
      } else {
        //decimal
        stream << theNumber;
        std::string s = stream.str();
        for (unsigned int j = 0; j < s.length(); j++)
        {
          if (s[j] == 'e')
          {
            s[j] = 'E';
            break;
          }
        }
        return s;
      }
    }

  }

