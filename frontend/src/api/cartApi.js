import axios from "axios";

const API_URL = "https://e-shop-gt27.onrender.com/api/cart";

// Fetch cart for current user
export const getCart = async (userId) => {
  const response = await axios.get(`${API_URL}/${userId}`);
  return response.data;
};

// Add item to cart
export const addToCartApi = async (userId, product) => {
  const response = await axios.post(`${API_URL}/${userId}/add`, { product });
  return response.data;
};

// Remove item from cart
export const removeFromCartApi = async (userId, productId) => {
  const response = await axios.delete(`${API_URL}/${userId}/remove/${productId}`);
  return response.data;
};

// Update quantity
export const updateQuantityApi = async (userId, productId, quantity) => {
  
  console.log("userID:", userId)
  console.log("productId:", productId)
  console.log("quantity:", quantity)

  const response = await axios.put(`${API_URL}/${userId}/update`, {
    productId,
    quantity,
  });
  return response.data;
};
