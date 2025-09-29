import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState, User, LoginPayload, SignupPayload } from "../../types/auth";
import api from "../../utils/axiosSetup";
import axios from "axios";

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  success: null,
};
export const loginUser = createAsyncThunk<User, LoginPayload>(
  "auth/loginUser",
  async ({ email, password }, thunkAPI) => {
    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });
      return response.data;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        return thunkAPI.rejectWithValue(
          error.response?.data?.message || error.message
        );
      } else {
        return thunkAPI.rejectWithValue(error.message || "Login failed");
      }
    }
  }
);

export const signupUser = createAsyncThunk<User, SignupPayload>(
  "auth/signupUser",
  async (formData, thunkAPI) => {
    try {
      const res = await api.post("/auth/signup", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return res.data;
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        return thunkAPI.rejectWithValue(
          error.response?.data?.message || error.message
        );
      } else {
        return thunkAPI.rejectWithValue(error.message || "Login failed");
      }
    }
  }
);

export const validateToken = async (token: string) => {
  try {
    const res = await api.post(
      "/auth/validate",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return res.data.valid;
  } catch (err) {
    return false;
  }
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logOut: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    clearMessages: (state) => {
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.user = action.payload;
        state.token = action.payload.token || null;
        state.isAuthenticated = true;

        if (action.payload.token) {
          localStorage.setItem("token", action.payload.token);
          localStorage.setItem("user", JSON.stringify(action.payload));
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Signup
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(signupUser.fulfilled, (state) => {
        state.loading = false;
        state.success = "Registration successful! Please login.";
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logOut, clearMessages } = authSlice.actions;
export default authSlice.reducer;
