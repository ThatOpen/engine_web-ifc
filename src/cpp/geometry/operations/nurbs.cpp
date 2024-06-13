#include "nurbs.h"
#include <geometry/representation/IfcGeometry.h>
#include <geometry/representation/geometry.h>
#include <geometry/operations/geometryutils.h>
#include <tinynurbs/tinynurbs.h>
#include <spdlog/spdlog.h>
#include <CDT.h>

#include <numeric>

namespace webifc::geometry{

	void Nurbs::fill_geometry(){
		auto uv_points {this->get_uv_points()};
		auto indices {get_triangulation_uv_points(uv_points)};
		for (size_t i = 0; i < indices.size(); i += 3)
		{
			auto const& p0 {uv_points[indices[i + 0]]};
			auto const& p1 {uv_points[indices[i + 1]]};
			auto const& p2 {uv_points[indices[i + 2]]};
			auto pt00 {tinynurbs::surfacePoint(*this->nurbs, p0.x, p0.y)};
			auto pt01 {tinynurbs::surfacePoint(*this->nurbs, p1.x, p1.y)};
			auto pt10 {tinynurbs::surfacePoint(*this->nurbs, p2.x, p2.y)};
			geometry.AddFace(pt00, pt01, pt10);
		}
	}	

	Nurbs::Nurbs(IfcGeometry& geometry, std::vector<IfcBound3D>const & bounds, IfcSurface const& surface, double const scaling)
		: geometry{geometry}, 
			bounds{bounds}, 
			bspline_surface{surface.BSplineSurface},
			num_u{this->bspline_surface.ControlPoints.size()},
			num_v{this->bspline_surface.ControlPoints.front().size()},
			scaling{scaling} {
			this->init();
	}
	
	void Nurbs::init(){
		this->nurbs = std::make_shared<tinynurbs::RationalSurface3d>(
				this->bspline_surface.UDegree,
				this->bspline_surface.VDegree,
				this->get_knots(this->bspline_surface.UKnots, this->bspline_surface.UMultiplicity),
				this->get_knots(this->bspline_surface.VKnots, this->bspline_surface.VMultiplicity),
				this->get_control_points(),
				this->get_weights());
		this->range_knots_u = {
			this->nurbs->knots_u[this->nurbs->degree_u],
			this->nurbs->knots_u[this->nurbs->knots_u.size() - this->nurbs->degree_u - 1]
		};
		this->range_knots_v = {
			this->nurbs->knots_v[this->nurbs->degree_v],
			this->nurbs->knots_v[this->nurbs->knots_v.size() - this->nurbs->degree_v - 1]
		};
		this->ptc = tinynurbs::surfacePoint(*this->nurbs, 0.0, 0.0);
		this->pth = tinynurbs::surfacePoint(*this->nurbs, 1.0, 0.0);
		this->ptv = tinynurbs::surfacePoint(*this->nurbs, 0.0, 1.0);
		this->dh = glm::distance(ptc, pth);
		this->dv = glm::distance(ptc, ptv);
		this->pr = (dh + 1) / (dv + 1);
		this->minError /= this->scaling;
		this->maxError /= this->scaling;
	}
	std::vector<double> Nurbs::get_weights() const{
		std::vector<double> result(this->num_u * this->num_v);
		std::fill(result.begin(), result.end(), 1.0);
		for (auto const& row : this->bspline_surface.Weights)
			for (size_t i{0}; i < row.size(); ++i)
			{
				result[i] = row[i];
		}
		return result;
	}
	std::vector<double> Nurbs::get_knots(std::vector<double>const & bs_knots, std::vector<uint32_t> const & bs_mults) const{
		std::vector<double> result;
		auto const num_srf_knots {std::accumulate(bs_mults.begin(), bs_mults.end(), 0.0)};
		result.reserve(num_srf_knots);
		for(size_t knot_i{0}; knot_i < bs_knots.size(); ++knot_i){
			auto const knot {bs_knots[knot_i]};
			auto const knot_mult {bs_mults[knot_i]};
			for(size_t i{0}; i < knot_mult; ++i) result.push_back(knot);
		}
		return result;
	}
	std::vector<glm::dvec3> Nurbs::get_control_points() const{
		std::vector<glm::dvec3> result;
		size_t num_points{0};
		for(auto const& row : this->bspline_surface.ControlPoints) num_points += row.size();
		result.reserve(num_points);
		for(auto const& row : this->bspline_surface.ControlPoints)  std::copy(row.begin(), row.end(), std::back_inserter(result));
		return result;
	}
	Nurbs::uv_points_t Nurbs::get_uv_points() const{
		Nurbs::uv_points_t points;
		auto const& bound_points {this->bounds.front().curve.points};
		size_t num_points{bound_points.size()};
		points.resize(num_points);
		std::transform(bound_points.begin(), bound_points.end(), points.begin(), [&](auto const& point){
				auto uv {this->inverse_evaluation(point)};
				return Nurbs::uv_point_t{uv.x, uv.y};
		});
		std::sort(points.begin(), points.end(),[](auto const& left, auto const& right){
			  if (left[0] != right[0]) {
          return left[0] < right[0];
        }
        return left[1] < right[1];
		});
		auto last_it2 = std::unique(points.begin(), points.end(), [](auto const& a, auto const& b){
				double EPS{1E-5};
				return std::abs(a[0] - b[0]) < EPS && std::abs(a[1] - b[1]) < EPS;
		});
		points.erase(last_it2, points.end());
		std::sort(points.begin(), points.end(),[](auto const& left, auto const& right){
		  return left[1] < right[1];
		});
		return points;
	}
	Nurbs::uv_point_t Nurbs::inverse_evaluation(glm::dvec3 const& pt) const
	{
		spdlog::debug("[BSplineInverseEvaluation({})]");
		double initial_divisor { 100.0 };
		double initial_max_distance { 1e+100 };
		return inverse_method(pt, initial_divisor, initial_max_distance);
	}
	Nurbs::uv_point_t Nurbs::inverse_method(glm::dvec3 const pt, double divisor, double max_distance) const
	{
		spdlog::debug("[InverseMethod({})]");
		double fU {0.5};
		double fV {0.5};
		glm::highp_dvec3 pt00{};
		while (max_distance > maxError && divisor < 10000)
		{
			for (double r = 1; r < 5; r++)
			{
				int round = 0;
				while (max_distance > minError && round < 3)
				{
					for (double i = 0; i < rotations; i++)
					{
						double rads = (i / rotations) * CONST_PI * 2;
						double incU = glm::sin(rads) / (r * r * divisor);
						double incV = glm::cos(rads) / (r * r * divisor);
						if (pr > 1)
						{
							incV *= pr;
						}
						else
						{
							incU /= pr;
						}
						while (true)
						{
							double ffU = fU + incU;
							double ffV = fV + incV;
							if (ffU < range_knots_u.x)
							{
									ffU = range_knots_u.y - (range_knots_u.x - ffU);
							}
							else if (ffU > range_knots_u.y)
							{
									ffU = range_knots_u.x + (ffU - range_knots_u.y);
							}
							if (ffV < range_knots_v.x)
							{
									ffV = range_knots_v.y - (range_knots_v.x - ffV);
							}
							else if (ffV > range_knots_v.y)
							{
									ffV = range_knots_v.x + (ffV - range_knots_v.y);
							}	

							pt00 = tinynurbs::surfacePoint(*this->nurbs, ffU, ffV);
							double di = glm::distance(pt00, pt);
							if (di < max_distance)
							{
								max_distance = di;
								fU = ffU;
								fV = ffV;
							}
							else
							{
								break;
							}
						}
					}
					round++;
				}
			}
			divisor *= 3;
		}
		return {fU, fV};
	}
	std::vector<uint32_t> Nurbs::get_triangulation_uv_points(Nurbs::uv_points_t const& uv_points) const{
		std::vector<uint32_t> result;
		if(uv_points.empty()) return result;
		auto const num_points {uv_points.size()};
		auto const num_edges {num_points};
		CDT::Triangulation<double> triangulator{CDT::VertexInsertionOrder::Auto};
		std::vector<CDT::V2d<double>> points;
		points.resize(num_points);
		std::transform(uv_points.begin(), uv_points.end(), points.begin(), [](auto const& uv_point){
			return CDT::V2d<double>{uv_point.x, uv_point.y};
		});

		try
		{
			triangulator.insertVertices(points);
			triangulator.eraseSuperTriangle();
			auto const num_indices{triangulator.triangles.size() * 3};
			result.reserve(triangulator.triangles.size() * 3);
			for(auto const& triangle : triangulator.triangles){
				auto & vertice0_id{triangle.vertices[0]};
				auto & vertice1_id{triangle.vertices[1]};
				auto & vertice2_id{triangle.vertices[2]};
				auto vertice0 {glm::dvec2{uv_points[vertice0_id][0], uv_points[vertice0_id][1]}};
				auto vertice1 {glm::dvec2{uv_points[vertice1_id][0], uv_points[vertice1_id][1]}};
				auto vertice2 {glm::dvec2{uv_points[vertice2_id][0], uv_points[vertice2_id][1]}};
				auto area{areaOfTriangle(vertice0, vertice1, vertice2)};
				constexpr double EPS {1E-3};
				constexpr double EPS2 {EPS*EPS};
				if(area < EPS2) {
					continue;
				}
				result.emplace_back(std::move(vertice0_id));
				result.emplace_back(std::move(vertice1_id));
				result.emplace_back(std::move(vertice2_id));
			}
		}
		catch(...){ return {};}
		return result;
	}
}