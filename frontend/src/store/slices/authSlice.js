import { createSlice } from "@reduxjs/toolkit";

// Initial state
const initialState = {
  token: localStorage.getItem("token") || "",
  isAuthenticated: !!localStorage.getItem("token"),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.token = action.payload.token;
      state.isAuthenticated = true;
      localStorage.setItem("token", action.payload.token);
    },
    logout: (state) => {
      state.token = "";
      state.isAuthenticated = false;
      localStorage.removeItem("token");
    },
    setToken: (state, action) => {
      state.token = action.payload;
      state.isAuthenticated = !!action.payload;
    },
  },
});

export const { loginSuccess, logout, setToken } = authSlice.actions;
export default authSlice.reducer;
