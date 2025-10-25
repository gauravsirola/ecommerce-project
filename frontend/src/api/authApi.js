import axios from "axios";

const API_URL = "https://e-shop-gt27.onrender.com/api/auth"; // your backend URL

// Signup API
export const signupUser = async (userData) => {
  const response = await axios.post(`${API_URL}/signup`, userData);
  return response.data;
};

// Login API
export const loginUser = async (credentials) => {
  const response = await axios.post(`${API_URL}/login`, credentials);
  return response.data;
};
