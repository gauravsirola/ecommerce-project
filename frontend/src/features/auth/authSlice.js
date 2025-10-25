import { createSlice } from "@reduxjs/toolkit";
import { signupUser, loginUser } from "../../api/authApi.js";

// Load from localStorage
const storedUser = localStorage.getItem("user");
const storedToken = localStorage.getItem("token");

if (storedUser === "undefined") {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
}

const initialState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  token: storedToken || null,
  isLoggedIn: !!storedToken,
  status: "idle", // idle | loading | succeeded | failed
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isLoggedIn = false;
      state.status = "idle";
      state.error = null;

      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
    setLoading: (state) => {
      state.status = "loading";
      state.error = null;
    },
    setError: (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    },
    setUser: (state, action) => {
      state.status = "succeeded";
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isLoggedIn = true;

      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("token", action.payload.token);
    },
    clearError: (state) => {
  state.status = "idle";
  state.error = null;
},
  },
});

export const { logout, setLoading, setError, setUser, clearError } = authSlice.actions;
export default authSlice.reducer;

// Thunk-style async actions
export const signup = (userData) => async (dispatch) => {
  dispatch(setLoading());
  try {
    const data = await signupUser(userData);
    dispatch(setUser(data));
  } catch (error) {
    dispatch(setError(error.response?.data?.message || "Signup failed"));
  }
};

export const login = (credentials) => async (dispatch) => {
  dispatch(setLoading());
  try {
    const data = await loginUser(credentials);
    dispatch(setUser(data));
  } catch (error) {
    dispatch(setError(error.response?.data?.message || "Login failed"));
  }
};
