#pragma once

#include <vector>
#include <memory>
#include <glm/glm.hpp>
#include <glm/gtc/constants.hpp>

namespace tinynurbs{
	template<typename T>
	struct RationalSurface;
	typedef RationalSurface<double> RationalSurface3d;
}

namespace webifc::geometry{

	class IfcGeometry;
	class IfcBound3D;
	class BSpline;
	class IfcSurface;

	constexpr double rotations 		{ 6.0 };
  constexpr auto pi {glm::pi<double>()};
  constexpr auto pi2 {glm::two_pi<double>()};

	class Nurbs{
	
		using uv_point_t = glm::dvec2;
		using uv_points_t = std::vector<uv_point_t>;

		public:

		void fill_geometry();
		explicit Nurbs(IfcGeometry& geometry, std::vector<IfcBound3D>const & bounds, IfcSurface const& surface, double const scaling);

		private:

		void init();
		std::vector<double> get_weights() const;
		std::vector<double> get_knots(std::vector<double>const & bs_knots, std::vector<uint32_t> const & bs_mults) const;
		std::vector<glm::dvec3> get_control_points() const;
		uv_points_t get_uv_points() const;
		uv_point_t inverse_evaluation(glm::dvec3 const& pt) const;
		uv_point_t inverse_method(glm::dvec3 const& pt) const;
		std::vector<uint32_t> get_triangulation_uv_points(uv_points_t const& uv_points) const;
		std::vector<double> get_zscores(std::vector<double> const& knots) const;
		std::vector<double> check_knots(std::vector<double> const& knots) const;
		auto get_approximation(glm::dvec3 const& pt, uv_point_t const& range_u, uv_point_t const& range_v) const;

		IfcGeometry& geometry;
		std::vector<IfcBound3D> const& bounds;
		BSpline const& bspline_surface;
		size_t const num_u;
		size_t const num_v;
		double const scaling;
		double minError	{ 0.0001 };
		double maxError	{ 0.01 };
		std::shared_ptr<tinynurbs::RationalSurface3d> nurbs;
		uv_point_t range_knots_u{0.0};
		uv_point_t range_knots_v{0.0};
		glm::dvec3 ptc{0.0};
		glm::dvec3 pth{0.0};
		glm::dvec3 ptv{0.0};
		double dh{0.0};
		double dv{0.0};
		double pr{0.0};
	};
}