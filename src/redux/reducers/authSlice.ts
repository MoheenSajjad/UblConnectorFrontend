import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { AuthState, LoginCredentials, User } from "@/types";
import axios from "axios";

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem("token"),
  isLoading: false,
  error: null,
};

export const login = createAsyncThunk(
  "auth/login",
  async (credentials: LoginCredentials) => {
    // const response = await axios.post("/auth/login", credentials);
    // const { token, user } = response.data;
    localStorage.setItem("token", "abcToken");
    return {
      token: "token",
      user: { id: "1", email: "email", name: "moheen", role: "admin" },
    };
  }
);

export const logout = createAsyncThunk("auth/logout", async () => {
  localStorage.removeItem("token");
  // await axios.post("/auth/logout");
});

export const getCurrentUser = createAsyncThunk<User>(
  "auth/getCurrentUser",
  async () => {
    const response = await axios.get("/auth/me");
    return response.data;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Login failed";
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
      })
      // Get Current User
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
