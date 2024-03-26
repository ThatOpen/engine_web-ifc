/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.  */

//Generic Representations of geometry used in web-ifc

#pragma once

#include <array>
#include <optional>
#include <string_view>
#include <cstdio>
#include <algorithm>
#include <unordered_map>
#include <cstdint>
#include <glm/glm.hpp>

#include "IfcCurve.h"

#define CONST_PI 3.141592653589793238462643383279502884L

namespace webifc::geometry {

	inline constexpr double EPS_SMALL = 1e-6;
	inline static constexpr double EPS_TINY = 1e-9;

	const static std::unordered_map<std::string_view, int> Horizontal_alignment_type{
		{"LINE", 1},		
		{"CIRCULARARC", 2},	
		{"CLOTHOID", 3},	
		{"CUBICSPIRAL", 4},				//ToDo
		{"BIQUADRATICPARABOLA", 5},		//ToDo
		{"BLOSSCURVE", 6},				//ToDo
		{"COSINECURVE", 7},				//ToDo
		{"SINECURVE", 8},				//ToDo
		{"VIENNESEBEND", 9}};			//ToDo

		const static std::unordered_map<std::string_view, int> Vertical_alignment_type{
			{"CONSTANTGRADIENT", 1},	
			{"CIRCULARARC", 2},			
			{"PARABOLICARC", 3},		
			{"CLOTHOID", 4}};				//ToDo

		const double EXTRUSION_DISTANCE_HALFSPACE_M = 100;

		struct IfcSegmentIndexSelect
		{
			std::string_view type;
			std::vector<uint32_t> indexs;
		};

		struct IfcProfile
		{
			std::string_view type;
			IfcCurve curve;
			std::vector<IfcCurve> holes;
			bool isConvex;
			bool isComposite = false;
			std::vector<IfcProfile> profiles;
			std::vector<double> tags;
		};

		struct IfcAlignmentSegment
		{
			std::vector<IfcCurve> curves;
		};

		struct Cylinder
		{
			bool Active = false;
			double Radius;
		};

		struct BSpline
		{
			bool Active = false;
			double UDegree;
			double VDegree;
			std::string_view ClosedU;
			std::string_view ClosedV;
			std::string_view CurveType;
			std::vector<std::vector<double>> Weights;
			std::vector<std::vector<glm::dvec3>> ControlPoints;
			std::vector<uint32_t> UMultiplicity;
			std::vector<uint32_t> VMultiplicity;
			std::vector<glm::f64> UKnots;
			std::vector<glm::f64> VKnots;
			std::vector<std::vector<glm::f64>> WeightPoints;
		};

		struct Revolution
		{
			bool Active = false;
			glm::dmat4 Direction;
			IfcProfile Profile;
		};

		struct Extrusion
		{
			bool Active = false;
			glm::dvec3 Direction;
			IfcProfile Profile;
			double Length;
		};

		struct IfcCrossSections
		{
			std::vector<IfcCurve> curves;
			std::vector<uint32_t> expressID;
		};

		struct IfcAlignment
		{
			IfcAlignmentSegment Horizontal;
			IfcAlignmentSegment Vertical;

			void transform(glm::dmat4 coordinationMatrix)
			{
				uint32_t ic = 0;
				for (auto curve : Horizontal.curves)
				{
					if (ic > 0)
					{
						uint32_t lastId1 = Horizontal.curves[ic - 1].points.size() - 1;
						uint32_t lastId2 = Horizontal.curves[ic].points.size() - 1;
						double d1 = glm::distance(Horizontal.curves[ic].points[0], Horizontal.curves[ic - 1].points[lastId1]);
						double d2 = glm::distance(Horizontal.curves[ic].points[lastId2], Horizontal.curves[ic - 1].points[lastId1]);
						if(d1 > d2){
							std::reverse(Horizontal.curves[ic].points.begin(), Horizontal.curves[ic].points.end());
						}
					}
					ic++;
				}

				ic = 0;
				for (auto curve : Horizontal.curves)
				{
					uint32_t ip = 0;
					for (auto pt : curve.points)
					{
						Horizontal.curves[ic].points[ip] = coordinationMatrix * glm::dvec4(pt.x, 0, -pt.y, 1);
						Horizontal.curves[ic].points[ip] = glm::dvec4(Horizontal.curves[ic].points[ip].x,
																		-Horizontal.curves[ic].points[ip].z,
																		Horizontal.curves[ic].points[ip].y,
																		1);
						ip++;
					}
					ic++;
				}

				ic = 0;
				for (auto curve : Vertical.curves)
				{
					uint32_t ip = 0;
					for (auto pt : curve.points)
					{
						Vertical.curves[ic].points[ip] = glm::dvec3(pt.x, pt.y + coordinationMatrix[3][1], 1);
						ip++;
					}
					ic++;
				}
			}
	};

		struct IfcTrimmingSelect
		{
			bool hasParam = false;
			bool hasPos = false;
			bool hasLenght = false;
			double param;
			glm::dvec2 pos;
			glm::dvec3 pos3D;
		};

		struct IfcTrimmingArguments
		{
			bool exist = false;
			IfcTrimmingSelect start;
			IfcTrimmingSelect end;
		};

		struct IfcPlacedGeometry
		{
			glm::dvec4 color;
			glm::dmat4 transformation;
			std::array<double, 16> flatTransformation;
			uint32_t geometryExpressID;

			void SetFlatTransformation()
			{
				flatTransformation = FlattenTransformation(transformation);
			}

			std::array<double, 16> FlattenTransformation(const glm::dmat4 &transformation)
			{
				std::array<double, 16> flatTransformation;

				for (int i = 0; i < 4; i++)
				{
					for (int j = 0; j < 4; j++)
					{
						flatTransformation[i * 4 + j] = transformation[i][j];
					}
				}

				return flatTransformation;
			}

			bool testReverse()
			{
				glm::dvec3 cx = glm::dvec3(transformation[0].x, transformation[0].y, transformation[0].z);
				glm::dvec3 cy = glm::dvec3(transformation[1].x, transformation[1].y, transformation[1].z);
				glm::dvec3 cz = glm::dvec3(transformation[2].x, transformation[2].y, transformation[2].z);

				glm::dvec3 dx = glm::cross(cy, cz);
				glm::dvec3 dy = glm::cross(cx, cz);
				glm::dvec3 dz = glm::cross(cx, cy);

				double fac1 = glm::dot(cx, dx);
				double fac2 = -glm::dot(cy, dy);
				double fac3 = glm::dot(cz, dz);

				return fac1 * fac2 * fac3 < 0;
			}

		};

		struct IfcFlatMesh
		{
			std::vector<IfcPlacedGeometry> geometries;
			uint32_t expressID;
		};

		struct IfcComposedMesh
		{
			glm::dvec4 color;
			glm::dmat4 transformation;
			uint32_t expressID;
			bool hasGeometry = false;
			bool hasColor = false;
			std::vector<IfcComposedMesh> children;

			std::optional<glm::dvec4> GetColor()
			{
				if (hasColor)
				{
					return color;
				}
				else
				{
					for (auto &c : children)
					{
						auto col = c.GetColor();
						if (col.has_value())
						{
							return col;
						}
					}
				}

				return std::nullopt;
			}
		};
		
		inline	glm::dmat4 NormalizeIFC(
			glm::dvec4(1, 0, 0, 0),
			glm::dvec4(0, 0, -1, 0),
			glm::dvec4(0, 1, 0, 0),
			glm::dvec4(0, 0, 0, 1));

		enum class IfcBoundType
		{
			OUTERBOUND,
			BOUND
		};

		// TODO: IfcBound3D can probably be merged with IfcProfile
		struct IfcBound3D
		{
			IfcBoundType type;
			bool orientation;
			IfcCurve curve;
		};

		struct IfcSurface
		{
			glm::dmat4 transformation;
			BSpline BSplineSurface;
			Cylinder CylinderSurface;
			Revolution RevolutionSurface;
			Extrusion ExtrusionSurface;

			glm::dvec3 normal()
			{
				if (!CylinderSurface.Active && !BSplineSurface.Active && !RevolutionSurface.Active)
				{
					return transformation[2];
				}
				else
				{
					if (BSplineSurface.Active)
					{
						printf("Normal to bspline still not implemented\n");
					}
					if (CylinderSurface.Active)
					{
						printf("Normal to cylinder still not implemented\n");
					}
					if (RevolutionSurface.Active)
					{
						printf("Normal to revolution still not implemented\n");
					}
					return glm::dvec3(0);
				}
			}
		};
	}