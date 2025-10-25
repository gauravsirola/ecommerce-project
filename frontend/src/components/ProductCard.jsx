import React from "react";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";

const ProductCard = ({ product }) => {
  const discountedPrice =
    product.discountPercentage && product.price
      ? product.price - (product.price * product.discountPercentage) / 100
      : product.price;

  return (
    <div className="bg-white border rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col">
      {/* Image */}
      <div className="relative overflow-hidden rounded-t-2xl">
        <img
          src={product.images?.[0] || "/placeholder.png"}
          alt={product.title}
          className="w-full h-52 object-cover transform transition-transform duration-300 hover:scale-105"
        />
        {product.discountPercentage > 0 && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            {product.discountPercentage}% OFF
          </span>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">{product.title}</h3>
        <p className="text-sm text-gray-500 mb-2">{product.brand}</p>

        {/* Rating */}
        <div className="flex items-center mb-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={16}
              className={`${
                i < Math.round(product.rating)
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-gray-300"
              }`}
            />
          ))}
          <span className="text-gray-600 text-sm ml-2">
            {product.rating.toFixed(1)}
          </span>
        </div>

        {/* Price */}
        <div className="mb-4">
          <span className="text-lg font-semibold text-gray-900">
            ₹{discountedPrice.toFixed(2)}
          </span>
          {product.discountPercentage > 0 && (
            <span className="text-gray-400 line-through text-sm ml-2">
              ₹{product.price.toFixed(2)}
            </span>
          )}
        </div>

        {/* View Details Button */}
        <Link
          to={`/product/${product._id}`}
          className="mt-auto bg-blue-600 text-white py-2 px-4 rounded-xl text-center font-medium hover:bg-blue-700 transition"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
