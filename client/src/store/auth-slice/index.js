import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
};

// Register user
export const registerUser = createAsyncThunk(
  "auth/register",
  async (formData, thunkAPI) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        formData,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || { success: false, message: "Registration failed" });
    }
  }
);

// Login user
export const loginUser = createAsyncThunk(
  "auth/login",
  async (formData, thunkAPI) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || { success: false, message: "Login failed" });
    }
  }
);

// Google Login user
export const googleLoginUser = createAsyncThunk(
  "auth/google-login",
  async ({ googleToken }, thunkAPI) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/google-login",
        { googleToken },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || { success: false, message: "Google login failed" });
    }
  }
);

// Logout user
export const logoutUser = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
  try {
    const response = await axios.post(
      "http://localhost:5000/api/auth/logout",
      {},
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || { success: false });
  }
});

// Check Auth status
export const checkAuth = createAsyncThunk("auth/checkauth", async (_, thunkAPI) => {
  try {
    const response = await axios.get("http://localhost:5000/api/auth/check-auth", {
      withCredentials: true,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      },
    });
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data || { success: false });
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(registerUser.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
      })

      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.success ? action.payload.user : null;
        state.isAuthenticated = action.payload.success;
        
        // Increment visit counter on successful login (only for regular users, not admins)
        if (action.payload.success && action.payload.user && action.payload.user.role !== 'admin') {
          const currentVisits = parseInt(localStorage.getItem('userVisits') || '0');
          localStorage.setItem('userVisits', (currentVisits + 1).toString());
          
          // Set session marker for this login
          const sessionKey = `session_${action.payload.user.id}_${Date.now()}`;
          sessionStorage.setItem('currentUserSession', sessionKey);
        }
      })
      .addCase(loginUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })

      // Google Login
      .addCase(googleLoginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(googleLoginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.success ? action.payload.user : null;
        state.isAuthenticated = action.payload.success;
        
        // Increment visit counter on successful Google login (only for regular users, not admins)
        if (action.payload.success && action.payload.user && action.payload.user.role !== 'admin') {
          const currentVisits = parseInt(localStorage.getItem('userVisits') || '0');
          localStorage.setItem('userVisits', (currentVisits + 1).toString());
          
          // Set session marker for this login
          const sessionKey = `session_${action.payload.user.id}_${Date.now()}`;
          sessionStorage.setItem('currentUserSession', sessionKey);
        }
      })
      .addCase(googleLoginUser.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })

      // Check Auth
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.success ? action.payload.user : null;
        state.isAuthenticated = action.payload.success;
        
        // Increment visit counter only once per session when user is authenticated (only for regular users, not admins)
        if (action.payload.success && action.payload.user && action.payload.user.role !== 'admin') {
          const sessionKey = `session_${action.payload.user.id}_${Date.now()}`;
          const lastSession = sessionStorage.getItem('currentUserSession');
          
          // Only count if this is a new session (different from last recorded session)
          if (!lastSession || lastSession !== sessionKey) {
            const currentVisits = parseInt(localStorage.getItem('userVisits') || '0');
            localStorage.setItem('userVisits', (currentVisits + 1).toString());
            sessionStorage.setItem('currentUserSession', sessionKey);
          }
        }
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })

      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      });
  },
});

export default authSlice.reducer;
