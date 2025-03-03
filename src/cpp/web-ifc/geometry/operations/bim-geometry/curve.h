#include <vector>
#include <algorithm>
#include <glm/glm.hpp>

namespace bimGeometry {
	struct Curve
	{
		std::vector<glm::dvec3> points;
		
        void Invert();
		bool IsCCW() const;
        void Add(glm::dvec3 pt);
		void Add(glm::dvec2 pt);
    };
}