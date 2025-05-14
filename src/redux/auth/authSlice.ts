// src/lib/features/auth/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {  User } from './authApi';
import { RootState } from '../store';

// Define the auth state interface
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Initial state
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
};


if (typeof window !== "undefined") {
  const savedAuth = localStorage.getItem("auth") || sessionStorage.getItem("auth");
  if (savedAuth) {
    try {
      const parsedAuth = JSON.parse(savedAuth);
      initialState.user = parsedAuth.user;
      initialState.token = parsedAuth.token;
      initialState.isAuthenticated = true;
    } catch (error) {
      console.log(error);
      localStorage.removeItem("auth");
    }
  }
}

// Create the auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      localStorage.setItem("auth", JSON.stringify({ user, token }));
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },

});

// Export actions and reducer
export const { setCredentials, logout, setLoading } = authSlice.actions;
export default authSlice.reducer;

// Selector to get auth state
export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state:RootState) => state.auth.isAuthenticated;