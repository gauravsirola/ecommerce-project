import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductsByCategory } from "../api/productApi.js";
import ProductCard from "../components/ProductCard.jsx";

const CategoryProductsPage = () => {
  const { categoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | loading | succeeded | failed
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setStatus("loading");
      try {
        const data = await getProductsByCategory(categoryId);
        setProducts(data);
        setStatus("succeeded");
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch products");
        setStatus("failed");
      }
    };

    fetchProducts();
  }, [categoryId]);

  // Loading skeleton
  if (status === "loading") {
    return (
      <div className="max-w-6xl mx-auto px-6 py-20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array(8)
          .fill()
          .map((_, i) => (
            <div
              key={i}
              className="h-80 bg-gray-200 animate-pulse rounded-2xl"
            ></div>
          ))}
      </div>
    );
  }

  // Error state
  if (status === "failed") {
    return (
      <p className="text-red-500 text-center mt-10 text-lg font-medium">
        {error}
      </p>
    );
  }

  // No products
  if (products.length === 0) {
    return (
      <p className="text-center mt-20 text-gray-600 text-lg">
        No products found in category "
        <span className="font-semibold">{decodeURIComponent(categoryId)}</span>"
      </p>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      {/* Hero Header */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          {decodeURIComponent(categoryId)}
        </h1>
        <p className="text-gray-600 text-lg">
          Explore our wide range of products in this category.
        </p>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default CategoryProductsPage;
