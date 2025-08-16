import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL;
const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("userToken") || ""}`,
});

/* ---------- THUNKS ---------- */

// Fetch all orders (admin)
export const fetchAllOrders = createAsyncThunk(
  "adminOrders/fetchAllOrders",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API_URL}/api/admin/orders`, {
        headers: authHeader(),
      });
      return data; // array of orders
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

// Update order status (admin)
export const updateOrderStatus = createAsyncThunk(
  "adminOrders/updateOrderStatus",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(
        `${API_URL}/api/admin/orders/${id}`,
        { status },                // <-- body
        { headers: authHeader() }  // <-- headers
      );
      return data; // updated order
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

// Delete order (admin)
export const deleteOrder = createAsyncThunk(
  "adminOrders/deleteOrder",
  async ({ id }, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/api/admin/orders/${id}`, {
        headers: authHeader(),
      });
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

/* ---------- SLICE ---------- */

const initialState = {
  orders: [],
  totalOrders: 0,
  totalSales: 0,
  loading: false,
  error: null,
};

const adminOrderSlice = createSlice({
  name: "adminOrders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetch all orders
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;                        // <-- FIXED
        state.orders = action.payload || [];
        state.totalOrders = state.orders.length;
        state.totalSales = state.orders.reduce(
          (sum, o) => sum + (Number(o.totalPrice) || 0),
          0
        );
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message;
      })

      // update status
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const updated = action.payload;
        const idx = state.orders.findIndex((o) => o._id === updated._id);
        if (idx !== -1) state.orders[idx] = updated;
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.error = action.payload?.message || action.error.message;
      })

      // delete order
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.orders = state.orders.filter((o) => o._id !== action.payload);
        state.totalOrders = state.orders.length;
        state.totalSales = state.orders.reduce(
          (sum, o) => sum + (Number(o.totalPrice) || 0),
          0
        );
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.error = action.payload?.message || action.error.message;
      });
  },
});

export default adminOrderSlice.reducer;
