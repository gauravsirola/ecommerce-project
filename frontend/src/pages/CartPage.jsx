import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchCart,
  removeItemFromCart,
  updateCartQuantity,
} from "../features/cart/cartSlice.js";

const CartPage = () => {
  const dispatch = useDispatch();
  const { cartItems, status, error } = useSelector((state) => state.cart);
  const { user, isLoggedIn } = useSelector((state) => state.auth);

  // Convert user._id (string) to number if needed
  useEffect(() => {
    if (user && user._id) {
      dispatch(fetchCart(user._id)); // backend expects numeric ID
    }
  }, [dispatch, user]);

  const handleRemove = (productId) => {
    dispatch(removeItemFromCart(user._id, productId));
  };

  const handleQuantityChange = (productId, quantity) => {
    if (quantity < 1) return;
    dispatch(updateCartQuantity(user._id, productId, quantity));
  };

  // Calculate total from Redux state (fallback if backend total isn’t stored)
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (!user) return <p className="text-center mt-6">Please login to view your cart.</p>;
  if (status === "loading") return <p className="text-center mt-6">Loading cart...</p>;
  if (status === "failed") return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto mt-6">
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 border rounded"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.thumbnail || "/placeholder.png"}
                  alt={item.title || "Product"}
                  className="w-20 h-20 object-cover rounded"
                />
                <div>
                  <p className="font-semibold">{item.title}</p>
                  <p>${item.price}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) =>
                    handleQuantityChange(item.id, parseInt(e.target.value))
                  }
                  className="w-16 border border-gray-300 rounded p-1 text-center"
                />
                <button
                  onClick={() => handleRemove(item.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <div className="text-right font-bold text-xl mt-4">
            Total: ${totalPrice.toFixed(2)}
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
