#include <spdlog/spdlog.h>
#include "../generators.h"
namespace webifc::geometry::generators {
	void GenerateIfcCircleImpl(const uint32_t expressID, const uint32_t lineType, webifc::parsing::IfcLoader &loader, webifc::cache::IfcCache &cache) {
		spdlog::debug("[GenerateIfcCircleImpl({})]", expressID);
	}
}
