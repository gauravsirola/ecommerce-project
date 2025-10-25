import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProducts } from "../features/products/productsSlice.js";
import { Link } from "react-router-dom";
import { Tag } from "lucide-react"; // icon for categories

const CategoriesPage = () => {
  const dispatch = useDispatch();
  const { products, status, error } = useSelector((state) => state.products);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProducts());
    }
  }, [dispatch, status]);

  // Extract unique categories
  const categories = [...new Set(products.map((p) => p.category))];

  // Loading state
  if (status === "loading") {
    return (
      <div className="max-w-6xl mx-auto px-6 py-20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {Array(6)
          .fill()
          .map((_, i) => (
            <div
              key={i}
              className="h-40 bg-gray-200 animate-pulse rounded-2xl"
            ></div>
          ))}
      </div>
    );
  }

  // Error state
  if (status === "failed") {
    return (
      <p className="text-red-500 text-center mt-10 text-lg font-medium">
        {error || "Failed to load categories."}
      </p>
    );
  }

  // Main render
  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Shop by Category
        </h1>
        <p className="text-gray-600 text-lg">
          Browse through our product categories and find what suits you best.
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {categories.map((category, index) => (
          <Link
            key={category}
            to={`/categories/${encodeURIComponent(category)}`}
            className="group relative overflow-hidden rounded-2xl shadow-md bg-gradient-to-br from-white to-gray-50 border hover:shadow-xl transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100/50 to-transparent opacity-0 group-hover:opacity-100 transition duration-300"></div>
            <div className="flex flex-col items-center justify-center p-10 text-center h-44">
              <div className="mb-4 bg-blue-100 text-blue-600 p-3 rounded-full group-hover:bg-blue-600 group-hover:text-white transition duration-300">
                <Tag size={24} />
              </div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 capitalize group-hover:text-blue-700 transition">
                {category}
              </h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoriesPage;
