// curves.cpp — arcs and splines as the polylines the topology can hold. Port of curves.ts.
#pragma STDC FP_CONTRACT OFF
#if defined(__clang__)
#pragma clang fp contract(off)
#endif

#include "curves.h"

#include <cmath>
#include <cstring>
#include <limits>

namespace brep {

// ---- JS Math semantics (V8 base/ieee754.cc = fdlibm; builtins Math.hypot/round/max/min) ----

namespace {

inline int32_t highWord(double x) {
  uint64_t u;
  std::memcpy(&u, &x, 8);
  return static_cast<int32_t>(u >> 32);
}
inline uint32_t lowWord(double x) {
  uint64_t u;
  std::memcpy(&u, &x, 8);
  return static_cast<uint32_t>(u);
}
inline double fromWords(uint32_t hi, uint32_t lo) {
  const uint64_t u = (static_cast<uint64_t>(hi) << 32) | lo;
  double x;
  std::memcpy(&x, &u, 8);
  return x;
}

constexpr double S1 = -1.66666666666666324348e-01, S2 = 8.33333333332248946124e-03,
                 S3 = -1.98412698298579493134e-04, S4 = 2.75573137070700676789e-06,
                 S5 = -2.50507602534068634195e-08, S6 = 1.58969099521155010221e-10;
constexpr double C1 = 4.16666666666666019037e-02, C2 = -1.38888888888741095749e-03,
                 C3 = 2.48015872894767294178e-05, C4 = -2.75573143513906633035e-07,
                 C5 = 2.08757232129817482790e-09, C6 = -1.13596475577881948265e-11;

double kernelSin(double x, double y, int iy) {
  const int32_t ix = highWord(x) & 0x7fffffff;
  if (ix < 0x3e400000) {
    if (static_cast<int>(x) == 0) return x;
  }
  const double z = x * x;
  const double v = z * x;
  const double r = S2 + z * (S3 + z * (S4 + z * (S5 + z * S6)));
  if (iy == 0) return x + v * (S1 + z * r);
  return x - ((z * (0.5 * y - v * r) - y) - v * S1);
}

double kernelCos(double x, double y) {
  const int32_t ix = highWord(x) & 0x7fffffff;
  if (ix < 0x3e400000) {
    if (static_cast<int>(x) == 0) return 1.0;
  }
  const double z = x * x;
  const double r = z * (C1 + z * (C2 + z * (C3 + z * (C4 + z * (C5 + z * C6)))));
  if (ix < 0x3fd33333) return 1.0 - (0.5 * z - (z * r - x * y));
  double qx;
  if (ix > 0x3fe90000) qx = 0.28125;
  else qx = fromWords(static_cast<uint32_t>(ix - 0x00200000), 0);
  const double hz = 0.5 * z - qx;
  const double a = 1.0 - qx;
  return a - (hz - (z * r - x * y));
}

constexpr int32_t TWO_OVER_PI[66] = {
    0xA2F983, 0x6E4E44, 0x1529FC, 0x2757D1, 0xF534DD, 0xC0DB62, 0x95993C, 0x439041, 0xFE5163,
    0xABDEBB, 0xC561B7, 0x246E3A, 0x424DD2, 0xE00649, 0x2EEA09, 0xD1921C, 0xFE1DEB, 0x1CB129,
    0xA73EE8, 0x8235F5, 0x2EBB44, 0x84E99C, 0x7026B4, 0x5F7E41, 0x3991D6, 0x398353, 0x39F49C,
    0x845F8B, 0xBDF928, 0x3B1FF8, 0x97FFDE, 0x05980F, 0xEF2F11, 0x8B5A0A, 0x6D1F6D, 0x367ECF,
    0x27CB09, 0xB74F46, 0x3F669E, 0x5FEA2D, 0x7527BA, 0xC7EBE5, 0xF17B3D, 0x0739F7, 0x8A5292,
    0xEA6BFB, 0x5FB11F, 0x8D5D08, 0x560330, 0x46FC7B, 0x6BABF0, 0xCFBC20, 0x9AF436, 0x1DA9E3,
    0x91615E, 0xE61B08, 0x659985, 0x5F14A0, 0x68408D, 0xFFD880, 0x4D7327, 0x310606, 0x1556CA,
    0x73A8C9, 0x60E27B, 0xC08C6B};

constexpr int32_t NPIO2_HW[32] = {
    0x3FF921FB, 0x400921FB, 0x4012D97C, 0x401921FB, 0x401F6A7A, 0x4022D97C, 0x4025FDBB,
    0x402921FB, 0x402C463A, 0x402F6A7A, 0x4031475C, 0x4032D97C, 0x40346B9C, 0x4035FDBB,
    0x40378FDB, 0x403921FB, 0x403AB41B, 0x403C463A, 0x403DD85A, 0x403F6A7A, 0x40407E4C,
    0x4041475C, 0x4042106C, 0x4042D97C, 0x4043A28C, 0x40446B9C, 0x404534AC, 0x4045FDBB,
    0x4046C6CB, 0x40478FDB, 0x404858EB, 0x404921FB};

constexpr double PIO2[8] = {1.57079625129699707031e+00, 7.54978941586159635335e-08,
                            5.39030252995776476554e-15, 3.28200341580791294123e-22,
                            1.27065575308067607349e-29, 1.22933308981111328932e-36,
                            2.73370053816464559624e-44, 2.16741683877804819444e-51};
constexpr double TWO24 = 1.67772160000000000000e+07, TWON24 = 5.96046447753906250000e-08;

int kernelRemPio2(const double* x, double* y, int e0, int nx, int prec) {
  static const int initJk[] = {2, 3, 4, 6};
  int32_t jz, jx, jv, jp, jk, carry, n, iq[20], i, j, k, m, q0, ih;
  double z, fw, f[20], fq[20], q[20];
  jk = initJk[prec];
  jp = jk;
  jx = nx - 1;
  jv = (e0 - 3) / 24;
  if (jv < 0) jv = 0;
  q0 = e0 - 24 * (jv + 1);
  j = jv - jx;
  m = jx + jk;
  for (i = 0; i <= m; i++, j++) f[i] = (j < 0) ? 0.0 : static_cast<double>(TWO_OVER_PI[j]);
  for (i = 0; i <= jk; i++) {
    for (j = 0, fw = 0.0; j <= jx; j++) fw += x[j] * f[jx + i - j];
    q[i] = fw;
  }
  jz = jk;
recompute:
  for (i = 0, j = jz, z = q[jz]; j > 0; i++, j--) {
    fw = static_cast<double>(static_cast<int32_t>(TWON24 * z));
    iq[i] = static_cast<int32_t>(z - TWO24 * fw);
    z = q[j - 1] + fw;
  }
  z = std::scalbn(z, q0);
  z -= 8.0 * std::floor(z * 0.125);
  n = static_cast<int32_t>(z);
  z -= static_cast<double>(n);
  ih = 0;
  if (q0 > 0) {
    i = (iq[jz - 1] >> (24 - q0));
    n += i;
    iq[jz - 1] -= i << (24 - q0);
    ih = iq[jz - 1] >> (23 - q0);
  } else if (q0 == 0) {
    ih = iq[jz - 1] >> 23;
  } else if (z >= 0.5) {
    ih = 2;
  }
  if (ih > 0) {
    n += 1;
    carry = 0;
    for (i = 0; i < jz; i++) {
      j = iq[i];
      if (carry == 0) {
        if (j != 0) {
          carry = 1;
          iq[i] = 0x1000000 - j;
        }
      } else {
        iq[i] = 0xffffff - j;
      }
    }
    if (q0 > 0) {
      switch (q0) {
        case 1: iq[jz - 1] &= 0x7fffff; break;
        case 2: iq[jz - 1] &= 0x3fffff; break;
      }
    }
    if (ih == 2) {
      z = 1.0 - z;
      if (carry != 0) z -= std::scalbn(1.0, q0);
    }
  }
  if (z == 0.0) {
    j = 0;
    for (i = jz - 1; i >= jk; i--) j |= iq[i];
    if (j == 0) {
      for (k = 1; iq[jk - k] == 0; k++) {
      }
      for (i = jz + 1; i <= jz + k; i++) {
        f[jx + i] = static_cast<double>(TWO_OVER_PI[jv + i]);
        for (j = 0, fw = 0.0; j <= jx; j++) fw += x[j] * f[jx + i - j];
        q[i] = fw;
      }
      jz += k;
      goto recompute;
    }
  }
  if (z == 0.0) {
    jz -= 1;
    q0 -= 24;
    while (iq[jz] == 0) {
      jz--;
      q0 -= 24;
    }
  } else {
    z = std::scalbn(z, -q0);
    if (z >= TWO24) {
      fw = static_cast<double>(static_cast<int32_t>(TWON24 * z));
      iq[jz] = static_cast<int32_t>(z - TWO24 * fw);
      jz += 1;
      q0 += 24;
      iq[jz] = static_cast<int32_t>(fw);
    } else {
      iq[jz] = static_cast<int32_t>(z);
    }
  }
  fw = std::scalbn(1.0, q0);
  for (i = jz; i >= 0; i--) {
    q[i] = fw * static_cast<double>(iq[i]);
    fw *= TWON24;
  }
  for (i = jz; i >= 0; i--) {
    for (fw = 0.0, k = 0; k <= jp && k <= jz - i; k++) fw += PIO2[k] * q[i + k];
    fq[jz - i] = fw;
  }
  // prec == 2 (the only one rem_pio2 uses)
  fw = 0.0;
  for (i = jz; i >= 0; i--) fw += fq[i];
  y[0] = (ih == 0) ? fw : -fw;
  fw = fq[0] - fw;
  for (i = 1; i <= jz; i++) fw += fq[i];
  y[1] = (ih == 0) ? fw : -fw;
  return n & 7;
}

constexpr double INVPIO2 = 6.36619772367581382433e-01, PIO2_1 = 1.57079632673412561417e+00,
                 PIO2_1T = 6.07710050650619224932e-11, PIO2_2 = 6.07710050630396597660e-11,
                 PIO2_2T = 2.02226624879595063154e-21, PIO2_3 = 2.02226624871116645580e-21,
                 PIO2_3T = 8.47842766036889956997e-32;

int32_t remPio2(double x, double* y) {
  const int32_t hx = highWord(x);
  const int32_t ix = hx & 0x7fffffff;
  double z, w, t, r, fn;
  if (ix <= 0x3fe921fb) {
    y[0] = x;
    y[1] = 0;
    return 0;
  }
  if (ix < 0x4002d97c) {
    if (hx > 0) {
      z = x - PIO2_1;
      if (ix != 0x3ff921fb) {
        y[0] = z - PIO2_1T;
        y[1] = (z - y[0]) - PIO2_1T;
      } else {
        z -= PIO2_2;
        y[0] = z - PIO2_2T;
        y[1] = (z - y[0]) - PIO2_2T;
      }
      return 1;
    }
    z = x + PIO2_1;
    if (ix != 0x3ff921fb) {
      y[0] = z + PIO2_1T;
      y[1] = (z - y[0]) + PIO2_1T;
    } else {
      z += PIO2_2;
      y[0] = z + PIO2_2T;
      y[1] = (z - y[0]) + PIO2_2T;
    }
    return -1;
  }
  if (ix <= 0x413921fb) {
    t = std::fabs(x);
    const int32_t n = static_cast<int32_t>(t * INVPIO2 + 0.5);
    fn = static_cast<double>(n);
    r = t - fn * PIO2_1;
    w = fn * PIO2_1T;
    if (n < 32 && ix != NPIO2_HW[n - 1]) {
      y[0] = r - w;
    } else {
      const int32_t j = ix >> 20;
      y[0] = r - w;
      int32_t i = j - ((highWord(y[0]) >> 20) & 0x7ff);
      if (i > 16) {
        t = r;
        w = fn * PIO2_2;
        r = t - w;
        w = fn * PIO2_2T - ((t - r) - w);
        y[0] = r - w;
        i = j - ((highWord(y[0]) >> 20) & 0x7ff);
        if (i > 49) {
          t = r;
          w = fn * PIO2_3;
          r = t - w;
          w = fn * PIO2_3T - ((t - r) - w);
          y[0] = r - w;
        }
      }
    }
    y[1] = (r - y[0]) - w;
    if (hx < 0) {
      y[0] = -y[0];
      y[1] = -y[1];
      return -n;
    }
    return n;
  }
  if (ix >= 0x7ff00000) {
    y[0] = y[1] = x - x;
    return 0;
  }
  const uint32_t low = lowWord(x);
  const int32_t e0 = (ix >> 20) - 1046;
  z = fromWords(static_cast<uint32_t>(ix - (e0 << 20)), low);
  double tx[3];
  for (int i = 0; i < 2; i++) {
    tx[i] = static_cast<double>(static_cast<int32_t>(z));
    z = (z - tx[i]) * TWO24;
  }
  tx[2] = z;
  int nx = 3;
  while (tx[nx - 1] == 0.0) nx--;
  const int32_t n = kernelRemPio2(tx, y, e0, nx, 2);
  if (hx < 0) {
    y[0] = -y[0];
    y[1] = -y[1];
    return -n;
  }
  return n;
}

constexpr double ATANHI[4] = {4.63647609000806093515e-01, 7.85398163397448278999e-01,
                              9.82793723247329054082e-01, 1.57079632679489655800e+00};
constexpr double ATANLO[4] = {2.26987774529616870924e-17, 3.06161699786838301793e-17,
                              1.39033110312309984516e-17, 6.12323399573676603587e-17};
constexpr double AT[11] = {3.33333333333329318027e-01,  -1.99999999998764832476e-01,
                           1.42857142725034663711e-01,  -1.11111104054623557880e-01,
                           9.09088713343650656196e-02,  -7.69187620504482999495e-02,
                           6.66107313738753120669e-02,  -5.83357013379057348645e-02,
                           4.97687799461593236017e-02,  -3.65315727442169155270e-02,
                           1.62858201153657823623e-02};

}  // namespace

double jsSin(double x) {
  double y[2];
  const int32_t ix = highWord(x) & 0x7fffffff;
  if (ix <= 0x3fe921fb) return kernelSin(x, 0.0, 0);
  if (ix >= 0x7ff00000) return x - x;
  const int32_t n = remPio2(x, y);
  switch (n & 3) {
    case 0: return kernelSin(y[0], y[1], 1);
    case 1: return kernelCos(y[0], y[1]);
    case 2: return -kernelSin(y[0], y[1], 1);
    default: return -kernelCos(y[0], y[1]);
  }
}

double jsCos(double x) {
  double y[2];
  const int32_t ix = highWord(x) & 0x7fffffff;
  if (ix <= 0x3fe921fb) return kernelCos(x, 0.0);
  if (ix >= 0x7ff00000) return x - x;
  const int32_t n = remPio2(x, y);
  switch (n & 3) {
    case 0: return kernelCos(y[0], y[1]);
    case 1: return -kernelSin(y[0], y[1], 1);
    case 2: return -kernelCos(y[0], y[1]);
    default: return kernelSin(y[0], y[1], 1);
  }
}

double jsAtan(double x) {
  const int32_t hx = highWord(x);
  const int32_t ix = hx & 0x7fffffff;
  int id;
  if (ix >= 0x44100000) {
    const uint32_t low = lowWord(x);
    if (ix > 0x7ff00000 || (ix == 0x7ff00000 && low != 0)) return x + x;
    if (hx > 0) return ATANHI[3] + ATANLO[3];
    return -ATANHI[3] - ATANLO[3];
  }
  if (ix < 0x3fdc0000) {
    if (ix < 0x3e400000) return x;
    id = -1;
  } else {
    x = std::fabs(x);
    if (ix < 0x3ff30000) {
      if (ix < 0x3fe60000) {
        id = 0;
        x = (2.0 * x - 1.0) / (2.0 + x);
      } else {
        id = 1;
        x = (x - 1.0) / (x + 1.0);
      }
    } else if (ix < 0x40038000) {
      id = 2;
      x = (x - 1.5) / (1.0 + 1.5 * x);
    } else {
      id = 3;
      x = -1.0 / x;
    }
  }
  const double z = x * x;
  const double w = z * z;
  const double s1 = z * (AT[0] + w * (AT[2] + w * (AT[4] + w * (AT[6] + w * (AT[8] + w * AT[10])))));
  const double s2 = w * (AT[1] + w * (AT[3] + w * (AT[5] + w * (AT[7] + w * AT[9]))));
  if (id < 0) return x - x * (s1 + s2);
  const double zz = ATANHI[id] - ((x * (s1 + s2) - ATANLO[id]) - x);
  return (hx < 0) ? -zz : zz;
}

double jsAtan2(double y, double x) {
  constexpr double tiny = 1.0e-300, pi_o_4 = 7.8539816339744827900e-01,
                   pi_o_2 = 1.5707963267948965580e+00, pi = 3.1415926535897931160e+00,
                   pi_lo = 1.2246467991473531772e-16;
  const int32_t hx = highWord(x), ix = hx & 0x7fffffff;
  const uint32_t lx = lowWord(x);
  const int32_t hy = highWord(y), iy = hy & 0x7fffffff;
  const uint32_t ly = lowWord(y);
  if ((static_cast<uint32_t>(ix) | ((lx | (0u - lx)) >> 31)) > 0x7ff00000u ||
      (static_cast<uint32_t>(iy) | ((ly | (0u - ly)) >> 31)) > 0x7ff00000u)
    return x + y;
  if (((hx - 0x3ff00000) | static_cast<int32_t>(lx)) == 0) return jsAtan(y);
  int m = ((hy >> 31) & 1) | ((hx >> 30) & 2);
  if ((iy | static_cast<int32_t>(ly)) == 0) {
    switch (m) {
      case 0:
      case 1: return y;
      case 2: return pi + tiny;
      default: return -pi - tiny;
    }
  }
  if ((ix | static_cast<int32_t>(lx)) == 0) return (hy < 0) ? -pi_o_2 - tiny : pi_o_2 + tiny;
  if (ix == 0x7ff00000) {
    if (iy == 0x7ff00000) {
      switch (m) {
        case 0: return pi_o_4 + tiny;
        case 1: return -pi_o_4 - tiny;
        case 2: return 3.0 * pi_o_4 + tiny;
        default: return -3.0 * pi_o_4 - tiny;
      }
    }
    switch (m) {
      case 0: return 0.0;
      case 1: return -0.0;
      case 2: return pi + tiny;
      default: return -pi - tiny;
    }
  }
  if (iy == 0x7ff00000) return (hy < 0) ? -pi_o_2 - tiny : pi_o_2 + tiny;
  const int32_t k = (iy - ix) >> 20;
  double z;
  if (k > 60) {
    z = pi_o_2 + 0.5 * pi_lo;
    m &= 1;
  } else if (hx < 0 && k < -60) {
    z = 0.0;
  } else {
    z = jsAtan(std::fabs(y / x));
  }
  switch (m) {
    case 0: return z;
    case 1: return -z;
    case 2: return pi - (z - pi_lo);
    default: return (z - pi_lo) - pi;
  }
}

double jsRound(double x) {
  if (!std::isfinite(x)) return x;
  const double r = std::floor(x);
  const double out = (x - r >= 0.5) ? r + 1 : r;
  return out == 0 ? std::copysign(0.0, x) : out;  // -0.5 <= x <= -0 rounds to -0
}

double jsMax(double a, double b) {
  if (std::isnan(a) || std::isnan(b)) return std::numeric_limits<double>::quiet_NaN();
  if (a == b) return std::signbit(a) ? b : a;
  return a > b ? a : b;
}

double jsMin(double a, double b) {
  if (std::isnan(a) || std::isnan(b)) return std::numeric_limits<double>::quiet_NaN();
  if (a == b) return std::signbit(a) ? a : b;
  return a < b ? a : b;
}

namespace {
template <int N>
inline double v8Hypot(const double (&args)[N]) {
  double v[N];
  double max = 0;
  bool oneArgIsNaN = false;
  for (int i = 0; i < N; i++) {
    v[i] = std::fabs(args[i]);
    if (std::isnan(v[i])) oneArgIsNaN = true;
    else if (v[i] > max) max = v[i];
  }
  if (max == std::numeric_limits<double>::infinity()) return max;
  if (oneArgIsNaN) return std::numeric_limits<double>::quiet_NaN();
  if (max == 0) return 0;
  double sum = 0, compensation = 0;
  for (int i = 0; i < N; i++) {
    const double n = v[i] / max;
    const double summand = n * n - compensation;
    const double preliminary = sum + summand;
    compensation = (preliminary - sum) - summand;
    sum = preliminary;
  }
  return std::sqrt(sum) * max;
}
}  // namespace

double jsHypot3(double x, double y, double z) {
  const double a[3] = {x, y, z};
  return v8Hypot(a);
}
double jsHypot2(double x, double y) {
  const double a[2] = {x, y};
  return v8Hypot(a);
}

// ---- curves ----

namespace {

constexpr double PI = 3.141592653589793;

inline P3 sub(const P3& a, const P3& b) { return {a[0] - b[0], a[1] - b[1], a[2] - b[2]}; }
inline P3 cross(const P3& a, const P3& b) {
  return {a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]};
}
inline double dot(const P3& a, const P3& b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
inline double normSquared(const P3& a) { return dot(a, a); }
inline double len(const P3& a) { return jsHypot3(a[0], a[1], a[2]); }

// facetsForSweep as TS computes it, NaN included.
inline double facetsForSweepD(double sweep) {
  return jsMax(1, jsRound((SIDES_PER_REVOLUTION * std::fabs(sweep)) / (PI * 2)));
}

}  // namespace

int32_t facetsForSweep(double sweep) {
  // A non-finite sweep is NaN/Infinity in TS; there is no int32 for it.
  return static_cast<int32_t>(facetsForSweepD(sweep));
}

std::vector<P3> arcStations(const P3& centre, const P3& ex, const P3& ey, double radius,
                            double from, double sweep) {
  const double steps = facetsForSweepD(sweep);
  std::vector<P3> out;
  if (steps >= 0 && steps < 1e9) out.reserve(static_cast<size_t>(steps) + 1);
  for (double i = 0; i <= steps; i++) {
    const double a = from + (sweep * i) / steps;
    const double c = jsCos(a) * radius, s = jsSin(a) * radius;
    out.push_back({centre[0] + ex[0] * c + ey[0] * s, centre[1] + ex[1] * c + ey[1] * s,
                   centre[2] + ex[2] * c + ey[2] * s});
  }
  return out;
}

CircleByThreePointsResult circleByThreePoints(const P3& a, const P3& b, const P3& c) {
  const P3 u = sub(b, a), v = sub(c, a);
  const P3 n = cross(u, v);
  const double nn = normSquared(n);
  if (nn == 0) return {{a, c}, false};

  const double uu = normSquared(u), vv = normSquared(v);
  const P3 w = {uu * v[0] - vv * u[0], uu * v[1] - vv * u[1], uu * v[2] - vv * u[2]};
  const P3 off = cross(w, n);
  const double k = 1 / (2 * nn);
  const P3 centre = {a[0] + off[0] * k, a[1] + off[1] * k, a[2] + off[2] * k};

  const P3 radialA = sub(a, centre);
  const double radius = len(radialA);
  if (!(radius > 0)) return {{a, c}, false};

  const double nl = std::sqrt(nn);
  const P3 ez = {n[0] / nl, n[1] / nl, n[2] / nl};
  const P3 ex = {radialA[0] / radius, radialA[1] / radius, radialA[2] / radius};
  const P3 ey = cross(ez, ex);

  const P3 spokeC = sub(c, centre);
  double sweep = jsAtan2(dot(spokeC, ey), dot(spokeC, ex));
  if (sweep <= 0) sweep += PI * 2;

  const double sagitta = radius * (1 - jsCos(sweep / 2));
  const double span = jsMax(jsMax(len(v), len(u)), len(sub(c, b)));
  if (span == 0 || sagitta > 4 * span) return {{a, c}, true};

  std::vector<P3> points = arcStations(centre, ex, ey, radius, 0, sweep);
  // TS assigns points[0] then points[length-1]; on an empty array that leaves just [c].
  if (points.empty()) points.push_back(a);
  points[0] = a;
  points[points.size() - 1] = c;
  return {std::move(points), false};
}

std::optional<std::vector<P3>> bSplineSamples(double degreeIn, const std::vector<P3>& control,
                                              const std::vector<double>& knots,
                                              const std::vector<double>& multiplicities,
                                              const std::vector<double>* weights,
                                              double samples) {
  const double controlLength = static_cast<double>(control.size());
  if (!(degreeIn >= 1) || controlLength < degreeIn + 1) return std::nullopt;
  if (knots.size() != multiplicities.size() || knots.empty()) return std::nullopt;

  std::vector<double> full;
  for (size_t i = 0; i < knots.size(); i++) {
    const double times = jsRound(multiplicities[i]);
    if (!(times >= 1)) return std::nullopt;
    for (double k = 0; k < times; k++) full.push_back(knots[i]);
  }
  if (static_cast<double>(full.size()) != controlLength + degreeIn + 1) return std::nullopt;
  // From here degree is an integer: the length test above cannot pass otherwise.
  const int64_t degree = static_cast<int64_t>(degreeIn);
  const int64_t nControl = static_cast<int64_t>(control.size());

  const std::vector<double>* w =
      weights && weights->size() == control.size() ? weights : nullptr;

  std::vector<double> px(degree + 1), py(degree + 1), pz(degree + 1), pw(degree + 1);
  auto at = [&](double t, P3& outPoint) -> bool {
    int64_t span = degree;
    while (span < nControl - 1 && full[span + 1] <= t) span++;

    for (int64_t j = 0; j <= degree; j++) {
      const P3& c = control[span - degree + j];
      const double weight = w ? (*w)[span - degree + j] : 1;
      px[j] = c[0] * weight;
      py[j] = c[1] * weight;
      pz[j] = c[2] * weight;
      pw[j] = weight;
    }
    for (int64_t r = 1; r <= degree; r++) {
      for (int64_t j = degree; j >= r; j--) {
        const double lo = full[span - degree + j], hi = full[span + 1 + j - r];
        const double paramSpan = hi - lo;
        const double a = paramSpan == 0 ? 0 : (t - lo) / paramSpan;
        px[j] = (1 - a) * px[j - 1] + a * px[j];
        py[j] = (1 - a) * py[j - 1] + a * py[j];
        pz[j] = (1 - a) * pz[j - 1] + a * pz[j];
        pw[j] = (1 - a) * pw[j - 1] + a * pw[j];
      }
    }
    const double denom = pw[degree];
    if (!std::isfinite(denom) || denom == 0) return false;
    outPoint = {px[degree] / denom, py[degree] / denom, pz[degree] / denom};
    return true;
  };

  const double first = full[degree], last = full[nControl];
  if (!(last > first)) return std::nullopt;
  const double steps = jsMax(2, jsRound(samples));
  std::vector<P3> out;
  P3 p;
  for (double i = 0; i <= steps; i++) {
    if (!at(first + ((last - first) * i) / steps, p)) return std::nullopt;
    if (!out.empty()) {
      const P3& prev = out.back();
      if (prev[0] == p[0] && prev[1] == p[1] && prev[2] == p[2]) continue;
    }
    out.push_back(p);
  }
  if (out.size() >= 2) return out;
  return std::nullopt;
}

void appendRun(std::vector<P3>& chain, const std::vector<P3>& run) {
  size_t start = 0;
  if (!chain.empty() && !run.empty()) {
    const P3& last = chain.back();
    const P3& first = run[0];
    if (last[0] == first[0] && last[1] == first[1] && last[2] == first[2]) start = 1;
  }
  chain.insert(chain.end(), run.begin() + static_cast<std::ptrdiff_t>(start), run.end());
}

std::vector<P3> unclosedRing(const std::vector<P3>& chain) {
  if (chain.size() < 2) return chain;
  const P3& a = chain[0];
  const P3& z = chain.back();
  if (a[0] == z[0] && a[1] == z[1] && a[2] == z[2])
    return std::vector<P3>(chain.begin(), chain.end() - 1);
  return chain;
}

}  // namespace brep
