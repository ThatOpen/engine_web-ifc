#pragma once

#include <glm/glm.hpp>
#include <vector>
#include <stdio.h>

#include "eps.h"

namespace fuzzybools
{
//============================================================================================

//	Original web-ifc version
	static bool computeSafeNormal(const glm::dvec3 v1, const glm::dvec3 v2, const glm::dvec3 v3, glm::dvec3& normal, double eps = 0)
	{
		glm::dvec3 v12(v2 - v1);
		glm::dvec3 v13(v3 - v1);

		glm::dvec3 temp = glm::cross(v12, v13);

		//v12 = glm::normalize(v12);
		//v13 = glm::normalize(v13);

		glm::dvec3 norm = glm::cross(v12, v13);

		double len = glm::length(norm);

		if (std::isnan(len) || len <= eps)
		{
			return false;
		}

		normal = norm / len;

		return true;
	}


//============================================================================================

/*	Unused function

        This experimental version potentially is superior when the coordinates are large, as can happen, for example,
        when global coordinates are used in a Mercator projection.  The calculation of vector products involves
        subtractions that lead to loss of precision for large numbers.  Rather than singling out one vertex,
        as in the original function, this version uses all three vertices and computes three estimates of the normal.
        Hopefully averaging the normals leads to a more robust estimate.
        
	static bool computeSafeNormal(const glm::dvec3 v1, const glm::dvec3 v2, const glm::dvec3 v3, glm::dvec3& normal, double eps = 0.0)
	{
		glm::dvec3 temp = glm::cross(v1, v2) + glm::cross(v2, v3) + glm::cross(v3, v1);
		double len = glm::length(temp);
		//normal = temp;
		normal = glm::dvec3(0.0, 0.0, 1.0);

		if (std::isnan(len) || len <= eps)
		{
			return false;
		}
		normal = glm::normalize(temp);	
		return true;
	}
*/

//============================================================================================

/*	Unused function

        This function is a second attempt to reduce the errors caused by loss of precision when subtracting large
        numbers.  It computes the centroid of the vertices, and then the normals for the three triangles
        formed by an edge and the centroid.  The three normals are averaged and returned as the "safe normal".
        
        static bool computeSafeNormal(const glm::dvec3 v1, const glm::dvec3 v2, const glm::dvec3 v3, glm::dvec3& normal, double eps = 0.0)
	{
		glm::dvec3 centroid((v1 + v2 + v3)/3.0);
		glm::dvec3 a(v1 - centroid);
		glm::dvec3 b(v2 - centroid);
		glm::dvec3 c(v3 - centroid);
		
		glm::dvec3 temp = glm::cross(a,b) + glm::cross(b,c) + glm::cross(c,a);
		double len = glm::length(temp);
		normal = temp;

		if (std::isnan(len) || len <= eps)
		{
			return false;
		}
		normal = glm::normalize(temp);	
		return true;
	}
*/	

//============================================================================================

	static glm::dvec3 computeNormal(const glm::dvec3 v1, const glm::dvec3 v2, const glm::dvec3 v3)
	{
		glm::dvec3 v12(v2 - v1);
		glm::dvec3 v13(v3 - v1);

		glm::dvec3 norm = glm::cross(v12, v13);

		return glm::normalize(norm);
	}

//============================================================================================

	static bool IsInsideCenterExtents(const glm::dvec3& pt, const glm::dvec3& center, const glm::dvec3& extents)
	{
		glm::dvec3 delta = pt - center;
		delta = glm::abs(delta);
		glm::dvec3 offset = delta - extents;
		return offset.x < toleranceIsInsideCenterExtents &&
		       offset.y < toleranceIsInsideCenterExtents &&
		       offset.z < toleranceIsInsideCenterExtents;
	}
	
//============================================================================================

	static double areaOfTriangle(glm::dvec3 a, glm::dvec3 b, glm::dvec3 c)
	{
		glm::dvec3 ab = b - a;
		glm::dvec3 ac = c - a;

		glm::dvec3 norm = glm::cross(ab, ac);
		return glm::length(norm) / 2;
	}

//============================================================================================

	static bool MatrixFlipsTriangles(const glm::dmat4& mat)
	{
		return glm::determinant(mat) < 0;
	}

//============================================================================================

	static bool MatrixFlipsTriangles(const glm::dmat3& mat)
	{
		return glm::determinant(mat) < 0;
	}

//============================================================================================

	static bool equals2d(glm::dvec2 A, glm::dvec2 B, double eps = 0)
	{
		return std::fabs(A.x - B.x) <= eps && std::fabs(A.y - B.y) <= eps;
	}

//============================================================================================

	static bool equals(glm::dvec3 A, glm::dvec3 B, double eps = 0)
	{
		return std::fabs(A.x - B.x) <= eps && std::fabs(A.y - B.y) <= eps && std::fabs(A.z - B.z) <= eps;
	}

//============================================================================================

	static bool equals(double A, double B, double eps = 0)
	{
		return std::fabs(A - B) <= eps;
	}

//============================================================================================

	static double sign2D(const glm::dvec2& p, const glm::dvec2& a, const glm::dvec2& b)
	{
		return (p.x - b.x) * (a.y - b.y) - (a.x - b.x) * (p.y - b.y);
	}

//============================================================================================

	static double cross2d(const glm::dvec2& point1, const glm::dvec2& point2) {
		return point1.x * point2.y - point1.y * point2.x;
	}

//============================================================================================

	// https://stackoverflow.com/questions/1903954/is-there-a-standard-sign-function-signum-sgn-in-c-c
	static double signOneZero(double x)
	{
		return (x > 0) - (x < 0);
	}

//============================================================================================

	static double ComparableAngle(const glm::dvec2& p, const glm::dvec2& a, const glm::dvec2& b)
	{
		double upDown = sign2D(p, a, b) >= 0 ? 1 : -1;
		double dot = (1 + glm::dot(glm::normalize(a - b), glm::normalize(p - b))) / 2.0;
		return upDown * dot;
	}

//============================================================================================

	static bool allEqual(bool b1, bool b2, bool b3, bool b4)
	{
		return b1 == b2 && b1 == b3 && b1 == b4;
	}

//============================================================================================

	struct LineLineIsect2D
	{
		bool isect = false;
		glm::dvec2 pt;
		double dist;
	};

//============================================================================================

	static LineLineIsect2D doLineSegmentsIntersect(const glm::dvec2& p, const glm::dvec2& p2, const glm::dvec2& q, const glm::dvec2& q2, double eps) 
	{
		LineLineIsect2D result;

		glm::dvec2 r = p2 - p;
		glm::dvec2 s = q2 - q;

		double uNumerator = cross2d(q - p, r);
		double denominator = cross2d(r, s);

		if (uNumerator == 0 && denominator == 0) {
			// They are collinear

			// Do they touch? (Are any of the points equal?)
			if (equals2d(p, q, eps) || equals2d(p, q2, eps) || equals2d(p2, q, eps) || equals2d(p2, q2, eps))
			{
				result.isect = true;

				return result;
			}

			// Do they overlap? (Are all the point differences in either direction the same sign)
			result.isect = !allEqual(
				(q.x - p.x < 0),
				(q.x - p2.x < 0),
				(q2.x - p.x < 0),
				(q2.x - p2.x < 0)) ||
				!allEqual(
					(q.y - p.y < 0),
					(q.y - p2.y < 0),
					(q2.y - p.y < 0),
					(q2.y - p2.y < 0));

			return result;
		}

		if (denominator == 0) {
			// lines are parallel
			result.isect = false;
			
			return result;
		}

		double u = uNumerator / denominator;
		double t = cross2d(q - p, s) / denominator;

		result.isect = (t >= -eps) && (t <= 1 + eps) && (u >= -eps) && (u <= 1 + eps);
		result.pt = p + r * t;
		result.dist = glm::distance(p, result.pt);

		return result;
	}

//============================================================================================

	struct LineLineIsect
	{
		double param1;
		double param2;
		glm::dvec3 point1;
		glm::dvec3 point2;
		double distance;
	};

//============================================================================================

	static LineLineIsect LineLineIntersection(const glm::dvec3& P0, const glm::dvec3& P1,
		const glm::dvec3& Q0, const glm::dvec3& Q1)
	{
		glm::dvec3 P1mP0 = P1 - P0;
		glm::dvec3 Q1mQ0 = Q1 - Q0;
		glm::dvec3 P0mQ0 = P0 - Q0;
		double a = glm::dot(P1mP0, P1mP0);
		double b = glm::dot(P1mP0, Q1mQ0);
		double c = glm::dot(Q1mQ0, Q1mQ0);
		double d = glm::dot(P1mP0, P0mQ0);
		double e = glm::dot(Q1mQ0, P0mQ0);
		double det = a * c - b * b;
		double s, t, nd, bmd, bte, ctd, bpe, ate, btd;

		double const zero = (0);
		double const one = (1);
		if (det > zero)
		{
			bte = b * e;
			ctd = c * d;
			if (bte <= ctd)  // s <= 0
			{
				s = zero;
				if (e <= zero)  // t <= 0
				{
					// region 6
					t = zero;
					nd = -d;
					if (nd >= a)
					{
						s = one;
					}
					else if (nd > zero)
					{
						s = nd / a;
					}
					// else: s is already zero
				}
				else if (e < c)  // 0 < t < 1
				{
					// region 5
					t = e / c;
				}
				else  // t >= 1
				{
					// region 4
					t = one;
					bmd = b - d;
					if (bmd >= a)
					{
						s = one;
					}
					else if (bmd > zero)
					{
						s = bmd / a;
					}
					// else:  s is already zero
				}
			}
			else  // s > 0
			{
				s = bte - ctd;
				if (s >= det)  // s >= 1
				{
					// s = 1
					s = one;
					bpe = b + e;
					if (bpe <= zero)  // t <= 0
					{
						// region 8
						t = zero;
						nd = -d;
						if (nd <= zero)
						{
							s = zero;
						}
						else if (nd < a)
						{
							s = nd / a;
						}
						// else: s is already one
					}
					else if (bpe < c)  // 0 < t < 1
					{
						// region 1
						t = bpe / c;
					}
					else  // t >= 1
					{
						// region 2
						t = one;
						bmd = b - d;
						if (bmd <= zero)
						{
							s = zero;
						}
						else if (bmd < a)
						{
							s = bmd / a;
						}
						// else:  s is already one
					}
				}
				else  // 0 < s < 1
				{
					ate = a * e;
					btd = b * d;
					if (ate <= btd)  // t <= 0
					{
						// region 7
						t = zero;
						nd = -d;
						if (nd <= zero)
						{
							s = zero;
						}
						else if (nd >= a)
						{
							s = one;
						}
						else
						{
							s = nd / a;
						}
					}
					else  // t > 0
					{
						t = ate - btd;
						if (t >= det)  // t >= 1
						{
							// region 3
							t = one;
							bmd = b - d;
							if (bmd <= zero)
							{
								s = zero;
							}
							else if (bmd >= a)
							{
								s = one;
							}
							else
							{
								s = bmd / a;
							}
						}
						else  // 0 < t < 1
						{
							// region 0
							s /= det;
							t /= det;
						}
					}
				}
			}
		}
		else
		{
			// The segments are parallel. The quadratic factors to
			//   R(s,t) = a*(s-(b/a)*t)^2 + 2*d*(s - (b/a)*t) + f
			// where a*c = b^2, e = b*d/a, f = |P0-Q0|^2, and b is not
			// zero. R is constant along lines of the form s-(b/a)*t = k
			// and its occurs on the line a*s - b*t + d = 0. This line
			// must intersect both the s-axis and the t-axis because 'a'
			// and 'b' are not zero. Because of parallelism, the line is
			// also represented by -b*s + c*t - e = 0.
			//
			// The code determines an edge of the domain [0,1]^2 that
			// intersects the minimum line, or if none of the edges
			// intersect, it determines the closest corner to the minimum
			// line. The conditionals are designed to test first for
			// intersection with the t-axis (s = 0) using
			// -b*s + c*t - e = 0 and then with the s-axis (t = 0) using
			// a*s - b*t + d = 0.

			// When s = 0, solve c*t - e = 0 (t = e/c).
			if (e <= zero)  // t <= 0
			{
				// Now solve a*s - b*t + d = 0 for t = 0 (s = -d/a).
				t = zero;
				nd = -d;
				if (nd <= zero)  // s <= 0
				{
					// region 6
					s = zero;
				}
				else if (nd >= a)  // s >= 1
				{
					// region 8
					s = one;
				}
				else  // 0 < s < 1
				{
					// region 7
					s = nd / a;
				}
			}
			else if (e >= c)  // t >= 1
			{
				// Now solve a*s - b*t + d = 0 for t = 1 (s = (b-d)/a).
				t = one;
				bmd = b - d;
				if (bmd <= zero)  // s <= 0
				{
					// region 4
					s = zero;
				}
				else if (bmd >= a)  // s >= 1
				{
					// region 2
					s = one;
				}
				else  // 0 < s < 1
				{
					// region 3
					s = bmd / a;
				}
			}
			else  // 0 < t < 1
			{
				// The point (0,e/c) is on the line and domain, so we have
				// one point at which R is a minimum.
				s = zero;
				t = e / c;
			}
		}

		LineLineIsect result{};
		result.param1 = s;
		result.param2 = t;
		result.point1 = P0 + s * P1mP0;
		result.point2 = Q0 + t * Q1mQ0;

		// Issue #1665: Calculate distance within the plane containing both lines,
		// ignoring perpendicular offset between lines. This allows detecting 
		// intersections even when lines are slightly offset in 3D space.

		glm::dvec3 diff = result.point1 - result.point2;
		double totalDist = std::sqrt(glm::dot(diff, diff));

		if(totalDist < 1E-12)
		{
			result.distance = totalDist;
			return result;
		}

		if(totalDist > TOLERANCE_SCALAR_EQUALITY)
		{
			result.distance = totalDist;
			return result;
		}

		glm::dvec3 v1 = glm::normalize(P1mP0);
		glm::dvec3 v2 = glm::normalize(Q1mQ0);
		if (glm::abs(glm::dot(v1, v2)) > 1 - _TOLERANCE_PLANE_DEVIATION) 
		{ 
			result.distance = totalDist;
			return result;
		}

		// Calculate normal to the plane containing both lines
		glm::dvec3 normal = glm::cross(P1mP0, Q1mQ0);
		double normalLength = glm::length(normal);
		normal = normal / normalLength;  // Normalize
		
		// Perpendicular distance to the plane
		double perpDist = std::abs(glm::dot(diff, normal));
		
		// Distance within the plane (Pythagoras)
		double subs = totalDist * totalDist - perpDist * perpDist;
		if(subs < 0) {subs = 0;}
		result.distance = std::sqrt(subs);
		return result;
	}

//============================================================================================

	struct PlanePlaneIsectResult
	{
		glm::dvec3 pos;
		glm::dvec3 dir;
	};

//============================================================================================

	inline PlanePlaneIsectResult PlanePlaneIsect(const glm::dvec3& norm1, double d1, const glm::dvec3& norm2, double d2)
	{
		PlanePlaneIsectResult result;

		// https://stackoverflow.com/questions/6408670/line-of-intersection-between-two-planes
		result.dir = glm::cross(norm1, norm2);
		double det = glm::length(result.dir);

		double det2 = glm::determinant(glm::dmat3(norm1, norm2, result.dir));
		det *= det;
		result.pos = ((glm::cross(result.dir, norm2) * -d1 +
			glm::cross(norm1, result.dir) * -d2) / det);

		result.dir = glm::normalize(result.dir);

		return result;
	}

//============================================================================================

	// https://stackoverflow.com/questions/849211/shortest-distance-between-a-point-and-a-line-segment
	static double DistancePointToLineSegment2D(const glm::dvec2& v, const glm::dvec2& w, const glm::dvec2& p)
	{
		// Return minimum distance between line segment vw and point p
		const double l2 = glm::length(v - w);  // i.e. |w-v|^2 -  avoid a sqrt
		if (l2 == 0.0) return glm::distance(p, v);   // v == w case
		// Consider the line extending the segment, parameterized as v + t (w - v).
		// We find projection of point p onto the line. 
		// It falls where t = [(p-v) . (w-v)] / |w-v|^2
		// We clamp t from [0,1] to handle points outside the segment vw.
		const double t = std::max(0.0, std::min(1.0, dot(p - v, w - v) / (l2 * l2)));
		const glm::dvec2 projection = v + t * (w - v);  // Projection falls on the segment
		return glm::distance(p, projection);
	}

//============================================================================================

	static bool PointOnLineSegment2D(const glm::dvec2& v, const glm::dvec2& w, const glm::dvec2& p, double EPS)
	{
		double dist = DistancePointToLineSegment2D(v, w, p);
		return dist <= EPS;
	}

//============================================================================================

	static bool onEdge2D(const glm::dvec2& p, const glm::dvec2& a, const glm::dvec2& b, double EPS)
	{
		double dist = std::fabs(sign2D(p, a, b));
		return dist <= EPS;
	}

//============================================================================================

	static bool IsVectorCCW(const std::vector<glm::dvec2>& points)
	{
		double sum = 0;

		for (int i = 0; i < points.size(); i++)
		{
			glm::dvec2 pt1 = points[i];
			glm::dvec2 pt2 = points[(i + 1) % points.size()];

			sum += (pt2.x - pt1.x) * (pt2.y + pt1.y);
		}

		return sum < 0;
	}

//============================================================================================

	static double areaOfTriangle(glm::dvec2 a, glm::dvec2 b, glm::dvec2 c)
	{
		glm::dvec2 ab = b - a;
		glm::dvec2 ac = c - a;

		double norm = cross2d(ab, ac) / 2;
		return std::fabs(norm);
	}

//============================================================================================

	// https://en.wikipedia.org/wiki/Barycentric_coordinate_system
	static glm::dvec3 ToBary(const glm::dvec3& a, const glm::dvec3& b, const glm::dvec3& c, const glm::dvec3& pt)
	{
		glm::dvec3 E1 = b - a;
		glm::dvec3 E2 = c - a;
		glm::dvec3 ROV0 = pt - a;
		glm::dvec3 N = glm::cross(E1, E2);
		glm::dvec3 dir = -N;
		glm::dvec3 Q = glm::cross(ROV0, dir);
		double d = dot(dir, N);

		if (d == 0)
		{
			if (messages) {  printf("bary conversion perp"); }
		}

		double det = 1.0 / d;
		double u = det * glm::dot(E2, (Q * -1.0));
		double v = det * glm::dot(E1, Q);
		double w = 1 - u - v;

		return glm::dvec3(w, u, v);
	}

//============================================================================================

	static glm::dvec2 FromBary(const glm::dvec2& a, const glm::dvec2& b, const glm::dvec2& c, const glm::dvec3& pt)
	{
		return pt.x * a + pt.y * b + pt.z * c;
	}

//============================================================================================

	// assume 0,0 1,0 0,1 triangle

	static glm::dvec3 ToBary2(const glm::dvec2& pt)
	{
		double v = pt.x;
		double w = pt.y;
		double u = 1 - v - w;

		return glm::dvec3(u, v, w);
	}

//============================================================================================

	static glm::dvec3 FromBary(const glm::dvec3& a, const glm::dvec3& b, const glm::dvec3& c, const glm::dvec3& pt)
	{
		return pt.x * a + pt.y * b + pt.z * c;
	}

//============================================================================================

	static double RandomDouble(double lo, double hi)
	{
		return lo + static_cast<double>(rand()) / (static_cast<double> (RAND_MAX / (hi - lo)));
	}
}
