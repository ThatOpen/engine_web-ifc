/**
 * A simple class for 2D runtime arrays. Mainly used for control points and
 * weights of surfaces.
 * 
 * Use of this source code is governed by a BSD-style license that can be found in
 * the LICENSE file.
 */

#ifndef TINYNURBS_ARRAY2_H
#define TINYNURBS_ARRAY2_H

#include <assert.h>
#include <stdexcept>
#include <vector>

namespace tinynurbs
{

/**
 * A simple class for representing 2D runtime arrays.
 */
template <typename T> class array2
{
  public:
    array2() = default;
    array2(const array2<T> &arr) = default;
    array2 &operator=(const array2 &arr) = default;
    array2(array2<T> &&arr) = default;
    array2 &operator=(array2 &&arr) = default;
    array2(size_t rows, size_t cols, T default_value = T()) { resize(rows, cols, default_value); }
    array2(size_t rows, size_t cols, const std::vector<T> &arr)
        : rows_(rows), cols_(cols), data_(arr)
    {
        if (arr.size() != rows * cols)
        {
            throw std::runtime_error("Dimensions do not match with size of vector");
        }
    }
    void resize(size_t rows, size_t cols, T val = T())
    {
        data_.resize(rows * cols, val);
        rows_ = rows;
        cols_ = cols;
    }
    void clear()
    {
        rows_ = cols_ = 0;
        data_.clear();
    }
    T operator()(size_t row, size_t col) const
    {
        assert(row < rows_ && col < cols_);
        return data_[row * cols_ + col];
    }
    T &operator()(size_t row, size_t col)
    {
        assert(row < rows_ && col < cols_);
        return data_[row * cols_ + col];
    }
    T operator[](size_t idx) const
    {
        assert(idx < data_.size());
        return data_[idx];
    }
    T &operator[](size_t idx)
    {
        assert(idx < data_.size());
        return data_[idx];
    }
    size_t rows() const { return rows_; }
    size_t cols() const { return cols_; }
    size_t size() const { return data_.size(); }

  private:
    size_t rows_, cols_;
    std::vector<T> data_;
};

} // namespace tinynurbs

#endif // TINYNURBS_ARRAY2_H
