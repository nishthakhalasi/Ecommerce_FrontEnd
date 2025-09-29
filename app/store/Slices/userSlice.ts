import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  User,
  UserState,
  FetchUserByIdPayload,
  UpdateUserPayload,
  DeleteUserPayload,
} from "../../types/user";
import api from "../../utils/axiosSetup";

export const fetchUsers = createAsyncThunk<User[]>(
  "user/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/users");
      return res.data.filter(
        (user: User) => user.role?.toLowerCase() !== "admin"
      );
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchUserById = createAsyncThunk<User, FetchUserByIdPayload>(
  "user/fetchUserById",
  async ({ userId }, { rejectWithValue }) => {
    try {
      const res = await api.get(`/users/${userId}`);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const updateUser = createAsyncThunk<User, UpdateUserPayload>(
  "user/updateUser",
  async ({ userId, formData }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/users/${userId}/update`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const deleteUser = createAsyncThunk<string, DeleteUserPayload>(
  "user/deleteUser",
  async ({ userId }, { rejectWithValue }) => {
    try {
      await api.delete(`/users/${userId}`);
      return userId;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const initialState: UserState = {
  users: [],
  usersLoading: false,
  usersError: null,
  selectedUser: null,
  selectedUserLoading: false,
  selectedUserError: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // fetchUsers
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.usersLoading = true;
        state.usersError = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.users = action.payload;
        state.usersLoading = false;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.usersError = action.payload as string;
        state.usersLoading = false;
      });

    // fetchUserById
    builder
      .addCase(fetchUserById.pending, (state) => {
        state.selectedUserLoading = true;
        state.selectedUserError = null;
      })
      .addCase(
        fetchUserById.fulfilled,
        (state, action: PayloadAction<User>) => {
          state.selectedUser = action.payload;
          state.selectedUserLoading = false;
        }
      )
      .addCase(fetchUserById.rejected, (state, action) => {
        state.selectedUserError = action.payload as string;
        state.selectedUserLoading = false;
      });

    // updateUser
    builder
      .addCase(updateUser.pending, (state) => {
        state.selectedUserLoading = true;
        state.selectedUserError = null;
      })
      .addCase(updateUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.selectedUser = action.payload;
        state.selectedUserLoading = false;
        const idx = state.users.findIndex(
          (u) => u.id === action.payload.id || u._id === action.payload._id
        );
        if (idx !== -1) state.users[idx] = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.selectedUserError = action.payload as string;
        state.selectedUserLoading = false;
      });

    // deleteUser
    builder
      .addCase(deleteUser.pending, (state) => {
        state.usersLoading = true;
        state.usersError = null;
      })
      .addCase(deleteUser.fulfilled, (state, action: PayloadAction<string>) => {
        state.users = state.users.filter(
          (u) => u.id !== action.payload && u._id !== action.payload
        );
        state.usersLoading = false;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.usersError = action.payload as string;
        state.usersLoading = false;
      });
  },
});

export default userSlice.reducer;
