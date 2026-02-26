import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../services/api";
import type { UserResponse } from "../../services/apiTypes";

interface AuthState {
  isAuthenticated: boolean;
  user: UserResponse | null;
  error: string | null;
  loading: boolean;
}

const storedUser = localStorage.getItem("user");

const initialState: AuthState = {
  isAuthenticated: !!storedUser,
  user: storedUser ? JSON.parse(storedUser) : null,
  error: null,
  loading: false,
};

export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  await api.post("/auth/logout");
  localStorage.removeItem("user");
  return null;
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setAuth: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      localStorage.setItem("user", JSON.stringify(action.payload.user));
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.isAuthenticated = false;
      state.user = null;
    });
  },
});

export const { clearError, setAuth } = authSlice.actions;
export default authSlice.reducer;
