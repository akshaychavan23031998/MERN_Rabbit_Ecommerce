import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL;

// LIST
export const fetchAdminProducts = createAsyncThunk(
  "adminProducts/fetchProducts",
  async () => {
    const token = localStorage.getItem("userToken");
    const { data } = await axios.get(`${API_URL}/api/admin/products`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;                           // array or {products:[]}, handled below
  }
);

// CREATE
export const createProduct = createAsyncThunk(
  "adminProducts/createProduct",
  async (productData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("userToken");
      const { data } = await axios.post(
        `${API_URL}/api/admin/products`,
        productData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return data; // created product
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

// UPDATE
export const updateProduct = createAsyncThunk(
  "adminProducts/updateProduct",
  async ({ id, productData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("userToken");
      const { data } = await axios.put(
        `${API_URL}/api/admin/products/${id}`,
        productData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return data; // updated product
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

// DELETE
export const deleteProduct = createAsyncThunk(
  "adminProducts/deleteProduct",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("userToken");
      await axios.delete(`${API_URL}/api/admin/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

const adminProductSlice = createSlice({
  name: "adminProducts",
  initialState: { products: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminProducts.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchAdminProducts.fulfilled, (s, a) => {
        s.loading = false;
        // support `[]` OR `{ products: [] }`
        s.products = Array.isArray(a.payload) ? a.payload : (a.payload?.products ?? []);
      })
      .addCase(fetchAdminProducts.rejected, (s, a) => { s.loading = false; s.error = a.error.message; })

      .addCase(createProduct.fulfilled, (s, a) => { s.products.push(a.payload); })

      .addCase(updateProduct.fulfilled, (s, a) => {
        const updated = a.payload;
        const i = s.products.findIndex(p => p._id === updated._id);
        if (i !== -1) s.products[i] = updated;
      })

      .addCase(deleteProduct.fulfilled, (s, a) => {
        s.products = s.products.filter(p => p._id !== a.payload);   // ✅ return in filter
      });
  },
});

export default adminProductSlice.reducer;

