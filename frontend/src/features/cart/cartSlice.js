import { createSlice } from "@reduxjs/toolkit";
import { getCart, addToCartApi, removeFromCartApi, updateQuantityApi } from "../../api/cartApi.js";

const initialState = {
  cartItems: [],
  status: "idle",
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart: (state, action) => {
      state.cartItems = action.payload;
    },
    clearCart: (state) => {
      state.cartItems = [];
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
  },
});

export const { setCart, clearCart, setError, setStatus } = cartSlice.actions;

// Thunks
export const fetchCart = (userId) => async (dispatch) => {
  dispatch(setStatus("loading"));
  try {
    const data = await getCart(userId);
    dispatch(setCart(data.products));
    dispatch(setStatus("succeeded"));
  } catch (err) {
    dispatch(setError(err.response?.data?.message || "Failed to fetch cart"));
    dispatch(setStatus("failed"));
  }
};

export const addItemToCart = (userId, product) => async (dispatch) => {
  try {
    const data = await addToCartApi(userId, product);
    dispatch(setCart(data.products));
  } catch (err) {
    dispatch(setError(err.response?.data?.message || "Failed to add to cart"));
  }
};

export const removeItemFromCart = (userId, productId) => async (dispatch) => {
  try {
    const data = await removeFromCartApi(userId, productId);
    dispatch(setCart(data.products));
  } catch (err) {
    dispatch(setError(err.response?.data?.message || "Failed to remove from cart"));
  }
};

export const updateCartQuantity = (userId, productId, quantity) => async (dispatch) => {
  try {
    const data = await updateQuantityApi(userId, productId, quantity);
    dispatch(setCart(data.products));
  } catch (err) {
    dispatch(setError(err.response?.data?.message || "Failed to update quantity"));
  }
};

export default cartSlice.reducer;
