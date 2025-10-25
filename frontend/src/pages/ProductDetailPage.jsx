import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllProducts } from "../api/productApi.js";
import { addItemToCart } from "../features/cart/cartSlice.js";
import { Star } from "lucide-react";

const ProductDetailPage = () => {
  const { productId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [product, setProduct] = useState(null);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setStatus("loading");
      try {
        const allProducts = await getAllProducts();
        const prod = allProducts.find((p) => p._id === productId);
        if (!prod) throw new Error("Product not found");
        setProduct(prod);
        setStatus("succeeded");
      } catch (err) {
        setError(err.message || "Failed to fetch product");
        setStatus("failed");
      }
    };
    fetchProduct();
  }, [productId]);

  const handleAddToCart = () => {
    if (user) {
      dispatch(addItemToCart(user._id, product));
      alert("Added to cart!");
    } else {
      alert("Redirecting to login page...");
      navigate("/login");
    }
  };

  if (status === "loading")
    return (
      <div className="flex justify-center items-center h-96">
        <p className="text-gray-500 animate-pulse">Loading product...</p>
      </div>
    );
  if (status === "failed")
    return <p className="text-red-500 text-center mt-10">{error}</p>;
  if (!product) return null;

  // Calculate discounted price if discountPercentage exists
  const discountedPrice =
    product.discountPercentage && product.price
      ? product.price - (product.price * product.discountPercentage) / 100
      : product.price;

  return (
    <div className="max-w-6xl mx-auto p-6 mt-10 grid md:grid-cols-2 gap-10">
      {/* Product Image Section */}
      <div className="flex justify-center items-center">
        <img
          src={product.images?.[0] || "/placeholder.png"}
          alt={product.title}
          className="rounded-2xl shadow-lg max-h-[500px] object-contain hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Product Details Section */}
      <div className="flex flex-col gap-4">
        <p className="text-sm text-gray-500 uppercase tracking-wide">
          {product.brand}
        </p>
        <h2 className="text-3xl font-bold text-gray-900">{product.title}</h2>

        {/* Rating Section */}
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, index) => (
            <Star
              key={index}
              size={18}
              className={`${
                index < Math.round(product.rating)
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-300"
              }`}
            />
          ))}
          <span className="ml-2 text-sm text-gray-600">
            ({product.rating.toFixed(1)})
          </span>
        </div>

        {/* Price and Discount */}
        <div className="mt-2">
          <div className="flex items-baseline gap-3">
            <span className="text-2xl font-semibold text-gray-900">
              ₹{discountedPrice.toFixed(2)}
            </span>
            {product.discountPercentage > 0 && (
              <>
                <span className="text-gray-400 line-through text-lg">
                  ₹{product.price.toFixed(2)}
                </span>
                <span className="text-green-600 font-medium">
                  {product.discountPercentage}% OFF
                </span>
              </>
            )}
          </div>
        </div>

        {/* Availability */}
        <p
          className={`text-sm font-medium ${
            product.availabilityStatus?.toLowerCase() === "in stock"
              ? "text-green-600"
              : "text-red-500"
          }`}
        >
          {product.availabilityStatus}
        </p>

        {/* Description */}
        <p className="text-gray-700 leading-relaxed mt-3">
          {product.description}
        </p>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={product.availabilityStatus?.toLowerCase() !== "in stock"}
          className={`mt-6 py-3 rounded-xl text-white font-semibold transition-all duration-300 ${
            product.availabilityStatus?.toLowerCase() === "in stock"
              ? "bg-blue-600 hover:bg-blue-700 active:scale-95"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          {product.availabilityStatus?.toLowerCase() === "in stock"
            ? "Add to Cart"
            : "Out of Stock"}
        </button>
      </div>
    </div>
  );
};

export default ProductDetailPage;
