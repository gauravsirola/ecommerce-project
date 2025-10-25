import axios from "axios";

const API_URL = "http://localhost:3000/api/products"; // backend endpoint

// Fetch all products
export const getAllProducts = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Optionally, fetch products by category
export const getProductsByCategory = async (category) => {
  const response = await axios.get(`${API_URL}?category=${category}`);
  return response.data;
};

// Fetch products by search query
export const searchProducts = async (query) => {
  const response = await axios.get(`${API_URL}?search=${encodeURIComponent(query)}`);
  return response.data;
};