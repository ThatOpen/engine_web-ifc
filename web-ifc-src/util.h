#pragma once

#include <sstream>
#include <fstream>

namespace webifc
{
	std::vector<glm::dvec2> rescale(std::vector<glm::dvec2> input, glm::dvec2 size, glm::dvec2 offset)
	{
		std::vector<glm::dvec2> retval;

		glm::dvec2 min(
			DBL_MAX,
			DBL_MAX
		);

		glm::dvec2 max(
			-DBL_MAX,
			-DBL_MAX
		);

		for (auto& pt : input)
		{
			min = glm::min(min, pt);
			max = glm::max(max, pt);
		}

		for (auto& pt : input)
		{
			retval.emplace_back(
				((pt.x - min.x) / (max.x - min.x)) * size.x + offset.x,
				((pt.y - min.y) / (max.y - min.y)) * size.y + offset.y
			);
		}

		return retval;
	}

	std::string makeSVGLines(std::vector<glm::dvec2> input)
	{
		glm::dvec2 size(1024, 52);
		glm::dvec2 offset(5, 5);

		auto rescaled = rescale(input, size, offset);

		std::stringstream svg;

		svg << "<svg width=\"" << size.x + offset.x * 2 << "\" height=\"" << size.y + offset.y * 2 << "\">";

		for (int i = 1; i < rescaled.size(); i++)
		{
			auto& start = rescaled[i - 1];
			auto& end = rescaled[i];
			svg << "<line x1=\"" << start.x << "\" y1=\"" << start.y << "\" ";
			svg << "x2=\"" << end.x << "\" y2=\"" << end.y << "\" ";
			svg << "style = \"stroke:rgb(255,0,0);stroke-width:2\" />";
		}

		return svg.str();
	}

	void DumpSVGCurve(std::vector<glm::dvec2> points, std::wstring filename)
	{
		std::ofstream out(L"debug_output/" + filename);
		out << makeSVGLines(points);
	}

	bool isConvexOrColinear(glm::dvec2 a, glm::dvec2 b, glm::dvec2 c)
	{
		return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x) >= 0;
	}
}