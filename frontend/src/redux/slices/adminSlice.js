import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// -- Helpers
const authHeaders = {
  headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` },
};

// === Thunks ===

// Get ALL users (array)
export const fetchUsers = createAsyncThunk("admin/fetchUsers", async () => {
  const { data } = await axios.get(
    `${import.meta.env.VITE_BACKEND_URL}/api/admin/users`,
    authHeaders
  );
  // backend returns { users: [...] }
  return data.users; // <-- return the array only
});

// Add a user
export const addUser = createAsyncThunk(
  "admin/addUser",
  async (userData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/users`,
        userData,
        authHeaders
      );
      // backend returns { message, user }
      return data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to add user" });
    }
  }
);

// Update a user (partial updates OK)
export const updateUser = createAsyncThunk(
  "admin/updateUser",
  async (payload, { rejectWithValue }) => {
    try {
      const { id, ...updates } = payload; // e.g. { id, role: "admin" }
      const { data } = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/users/${id}`,
        updates,
        authHeaders
      );
      // backend returns the updated user object
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to update user" });
    }
  }
);

// Delete user
export const deleteUser = createAsyncThunk(
  "admin/deleteUser",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/users/${id}`,
        authHeaders
      );
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to delete user" });
    }
  }
);

// === Slice ===
const adminSlice = createSlice({
  name: "admin",
  initialState: {
    users: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchUsers
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload; // <-- array
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // addUser
      .addCase(addUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users.unshift(action.payload); // push new user at top
      })
      .addCase(addUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to add user";
      })

      // updateUser
      .addCase(updateUser.pending, (state) => {
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const updated = action.payload; // user object
        const i = state.users.findIndex((u) => u._id === updated._id);
        if (i !== -1) state.users[i] = updated;
        else state.users.unshift(updated); // fallback
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.error = action.payload?.message || "Failed to update user";
      })

      // deleteUser
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((u) => u._id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.error = action.payload?.message || "Failed to delete user";
      });
  },
});

export default adminSlice.reducer;
