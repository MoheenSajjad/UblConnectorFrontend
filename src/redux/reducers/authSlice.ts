import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { AuthState, LoginCredentials, User } from "@/types";
import { apiClient } from "@/services/config/api-client";
import { Auth } from "@/services/config/endpoints";
import token from "@/utils/token/token";
import { useTDispatch } from "@/hooks/use-redux";

const initialState: AuthState = {
  user: null,
  token: token.getToken("token"),
  isSuperUser: token.getToken("isSuperUser") === "true",
  isLoading: false,
  error: null,
};

export const login = createAsyncThunk(
  "auth/login",
  async (credentials: LoginCredentials) => {
    const response = await Auth.login(credentials);
    const { token, isSuperUser } = response.data.data;
    console.log("login called", response.data);

    localStorage.setItem("token", token);
    localStorage.setItem("isSuperUser", isSuperUser);

    return {
      token,
      isSuperUser: isSuperUser === "true",
    };
  }
);

export const logout = createAsyncThunk("auth/logout", async () => {
  localStorage.clear();
  // await apiClient.post("/auth/logout");
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setIsSuperUser: (state, action) => {
      state.isSuperUser = action.payload;
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
        state.token = action.payload.token;
        state.isSuperUser = action.payload.isSuperUser;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Login failed";
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isSuperUser = false;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
