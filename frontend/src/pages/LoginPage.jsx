import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, clearError } from "../features/auth/authSlice.js";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { fetchCart } from "../features/cart/cartSlice.js";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { status, error, isLoggedIn, user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);

  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setCredentials((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Dispatch login thunk
    await dispatch(login(credentials));
  };

  // Show toast if login fails
  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  // Navigate on successful login
  useEffect(() => {
    if (isLoggedIn) {
      dispatch(fetchCart(user._id));
      navigate("/categories");
    }
  }, [isLoggedIn, navigate]);

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow bg-white">
      <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          value={credentials.email}
          onChange={handleChange}
          className="input input-bordered w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          value={credentials.password}
          onChange={handleChange}
          className="input input-bordered w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className={`w-full py-2 rounded text-white font-semibold transition-colors
            ${status === "loading" ? "bg-blue-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}
          `}
        >
          {status === "loading" ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
