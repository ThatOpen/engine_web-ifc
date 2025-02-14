#pragma once

#include <vector>
#include <string>

#include <glm/glm.hpp>

#include "util.h"

namespace fuzzybools
{
	struct Bounds
	{
		glm::dvec2 min;
		glm::dvec2 max;

		void Merge(const Bounds& other)
		{
			min = glm::min(min, other.min);
			max = glm::max(max, other.max);
		}
	};

	static Bounds getBounds(std::vector<std::vector<glm::dvec2>> input, glm::dvec2 size, glm::dvec2 offset)
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

		for (auto& loop : input)
		{
			for (auto& point : loop)
			{
				min = glm::min(min, point);
				max = glm::max(max, point);
			}
		}

		double width = max.x - min.x;
		double height = max.y - min.y;

		if (width == 0 && height == 0)
		{
			if (messages) {  printf("asdf"); }
		}

		return {
			min,
			max
		};
	}

	struct SVGLineSet
	{
		std::vector<std::vector<glm::dvec2>> lines;
		std::string color = "rgb(255,0,0)";

		Bounds GetBounds(glm::dvec2 size, glm::dvec2 offset)
		{
			return getBounds(lines, size, offset);;
		}
	};

	struct SVGDrawing
	{
		std::vector<SVGLineSet> sets;

		Bounds GetBounds(glm::dvec2 size, glm::dvec2 offset)
		{
			Bounds b;
			b.min = glm::dvec2(
				DBL_MAX,
				DBL_MAX
			);

			b.max = glm::dvec2(
				-DBL_MAX,
				-DBL_MAX
			);

			for (auto& set : sets)
			{
				b.Merge(set.GetBounds(size, offset));
			}

			return b;
		}
	};

	static glm::dvec2 rescale(glm::dvec2 p, Bounds b, glm::dvec2 size, glm::dvec2 offset)
	{
		return glm::dvec2(
			((p.x - b.min.x) / (b.max.x - b.min.x)) * size.x + offset.x,
			((p.y - b.min.y) / (b.max.y - b.min.y)) * size.y + offset.y
		);
	}

	static void svgMakeLine(glm::dvec2 a, glm::dvec2 b, std::stringstream& svg, std::string col = "rgb(255,0,0)")
	{
		svg << "<line x1=\"" << a.x << "\" y1=\"" << a.y << "\" ";
		svg << "x2=\"" << b.x << "\" y2=\"" << b.y << "\" ";
		svg << "style = \"stroke:" + col + ";stroke-width:1\" />";
	}

	static void SVGLinesToString(Bounds bounds, glm::dvec2 size, glm::dvec2 offset, SVGLineSet lineSet, std::stringstream& svg)
	{
		for (auto& line : lineSet.lines)
		{
			if (line.size() > 1)
			{
				for (int i = 1; i < line.size(); i++)
				{
					glm::dvec2 a = rescale(line[i], bounds, size, offset);
					glm::dvec2 b = rescale(line[i - 1], bounds, size, offset);

					svgMakeLine(a, b, svg, lineSet.color);
				}
			}
			else
			{
				glm::dvec2 a = rescale(line[0], bounds, size, offset);
				svg << "<circle cx = \"" << a.x << "\" cy = \"" << a.y << "\" r = \"3\" style = \"stroke:rgb(0,0,255);stroke-width:2\" />";
			}
		}
	}

	static std::string makeSVGLines(SVGDrawing drawing)
	{
		glm::dvec2 size(2048, 2048);
		glm::dvec2 offset(5, 5);

		Bounds bounds = drawing.GetBounds(size, offset);

		std::stringstream svg;

		svg << "<svg width=\"" << size.x + offset.x * 2 << "\" height=\"" << size.y + offset.y * 2 << " \" xmlns=\"http://www.w3.org/2000/svg\">";

		for (auto& set : drawing.sets)
		{
			SVGLinesToString(bounds, size, offset, set, svg);
		}

		svg << "</svg>";

		return svg.str();
	}

	static void DumpSVGLines(std::vector<std::vector<glm::dvec2>> lines, std::wstring filename)
	{
		SVGLineSet set;
		set.lines = lines;
		SVGDrawing drawing;
		drawing.sets.push_back(set);
		writeFile(filename, makeSVGLines(drawing));
	}
}