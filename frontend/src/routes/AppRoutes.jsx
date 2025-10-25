import React from "react";
import { Routes, Route } from "react-router-dom";
import SignupPage from "../pages/SignupPage.jsx";
import LoginPage from "../pages/LoginPage.jsx";
import CategoriesPage from "../pages/CategoriesPage.jsx";
import CategoryProductsPage from "../pages/CategoryProductsPage.jsx";
import ProductDetailPage from "../pages/ProductDetailPage.jsx";
import CartPage from "../pages/CartPage.jsx";

const AppRoutes = () => {
  return (
    <>
    <Routes>
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/categories" element={<CategoriesPage />} />
      <Route path="/categories/:categoryId" element={<CategoryProductsPage />} />
      <Route path="/product/:productId" element={<ProductDetailPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="*" element={<CategoriesPage />} /> fallback
    </Routes>
        </>
  );
};

export default AppRoutes;
