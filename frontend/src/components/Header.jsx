import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice.js";
import { fetchCart } from "../features/cart/cartSlice.js";
import SearchBar from "./SearchBar.jsx";

const Header = () => {
  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Fetch cart when user logs in or changes
  useEffect(() => {
    if (isLoggedIn && user?.id) {
      dispatch(fetchCart(user.id));
    }
  }, [dispatch, isLoggedIn, user]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="bg-white shadow-md p-4 flex items-center justify-between">
      {/* Left: Logo */}
      <div>
        <Link to="/categories" className="text-2xl font-bold text-blue-600">
          MyShop
        </Link>
      </div>

      {/* Center: Search */}
      <div className="flex-grow mx-4">
        <SearchBar />
      </div>

      {/* Right: Auth buttons + Cart */}
      <div className="flex items-center gap-4">
        {isLoggedIn && (
          <Link
            to="/cart"
            className="relative flex items-center gap-1 bg-gray-100 px-3 py-1 rounded hover:bg-gray-200"
          >
            🛒
            <span className="ml-1 font-semibold">{totalItems}</span>
          </Link>
        )}

        {isLoggedIn ? (
          <>
            <span className="text-gray-700">Welcome {user.firstName}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
            >
              Signup
            </Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
