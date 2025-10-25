import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { searchProducts } from "../api/productApi.js";
import ProductCard from "../components/ProductCard.jsx";

const SearchResultsPage = () => {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("idle"); // idle | loading | succeeded | failed
  const [error, setError] = useState(null);

  // Extract search query from URL
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("search") || "";

  useEffect(() => {
    const fetchSearchResults = async () => {
      setStatus("loading");
      try {
        const data = await searchProducts(searchQuery);
        setProducts(data);
        setStatus("succeeded");
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch search results");
        setStatus("failed");
      }
    };

    if (searchQuery.trim() !== "") {
      fetchSearchResults();
    } else {
      setProducts([]);
    }
  }, [searchQuery]);

  if (status === "loading") return <p>Searching for products...</p>;
  if (status === "failed") return <p className="text-red-500">{error}</p>;

  if (products.length === 0)
    return <p>No products found for "{searchQuery}"</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">
        Search Results for "{searchQuery}"
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default SearchResultsPage;
