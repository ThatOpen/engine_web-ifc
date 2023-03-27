#include <TinyCppTest.hpp>
#include <glm/glm.hpp>
#include "io_helpers.h"

TEST (TriangleAreaTest)
{
	glm::dvec3 a (0.0, 0.0, 0.0);
	glm::dvec3 b (1.0, 0.0, 0.0);
	glm::dvec3 c (0.0, 1.0, 0.0);
	ASSERT_EQ_EPS (webifc::geometry::areaOfTriangle (a, b, c), 0.5, webifc::geometry::EPS_TINY);
}

TEST(NewTest)
{
	// load model
	// get mesh for line
	// compute volume
	// check volume
}

