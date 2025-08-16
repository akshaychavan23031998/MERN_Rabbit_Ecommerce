// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import axios from "axios";

// const API_URL = import.meta.env.VITE_BACKEND_URL;

// // LIST
// export const fetchAdminProducts = createAsyncThunk(
//   "adminProducts/fetchProducts",
//   async () => {
//     const token = localStorage.getItem("userToken");
//     const { data } = await axios.get(`${API_URL}/api/admin/products`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     return data;                           // array or {products:[]}, handled below
//   }
// );

// // CREATE
// export const createProduct = createAsyncThunk(
//   "adminProducts/createProduct",
//   async (productData, { rejectWithValue }) => {
//     try {
//       const token = localStorage.getItem("userToken");
//       const { data } = await axios.post(
//         `${API_URL}/api/admin/products`,
//         productData,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       return data; // created product
//     } catch (err) {
//       return rejectWithValue(err.response?.data || { message: err.message });
//     }
//   }
// );

// // UPDATE
// export const updateProduct = createAsyncThunk(
//   "adminProducts/updateProduct",
//   async ({ id, productData }, { rejectWithValue }) => {
//     try {
//       const token = localStorage.getItem("userToken");
//       const { data } = await axios.put(
//         `${API_URL}/api/admin/products/${id}`,
//         productData,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       return data; // updated product
//     } catch (err) {
//       return rejectWithValue(err.response?.data || { message: err.message });
//     }
//   }
// );

// // DELETE
// export const deleteProduct = createAsyncThunk(
//   "adminProducts/deleteProduct",
//   async (id, { rejectWithValue }) => {
//     try {
//       const token = localStorage.getItem("userToken");
//       await axios.delete(`${API_URL}/api/admin/products/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       return id;
//     } catch (err) {
//       return rejectWithValue(err.response?.data || { message: err.message });
//     }
//   }
// );

// const adminProductSlice = createSlice({
//   name: "adminProducts",
//   initialState: { products: [], loading: false, error: null },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchAdminProducts.pending, (s) => { s.loading = true; s.error = null; })
//       .addCase(fetchAdminProducts.fulfilled, (s, a) => {
//         s.loading = false;
//         // support `[]` OR `{ products: [] }`
//         s.products = Array.isArray(a.payload) ? a.payload : (a.payload?.products ?? []);
//       })
//       .addCase(fetchAdminProducts.rejected, (s, a) => { s.loading = false; s.error = a.error.message; })

//       .addCase(createProduct.fulfilled, (s, a) => { s.products.push(a.payload); })

//       .addCase(updateProduct.fulfilled, (s, a) => {
//         const updated = a.payload;
//         const i = s.products.findIndex(p => p._id === updated._id);
//         if (i !== -1) s.products[i] = updated;
//       })

//       .addCase(deleteProduct.fulfilled, (s, a) => {
//         s.products = s.products.filter(p => p._id !== a.payload);   // ✅ return in filter
//       });
//   },
// });

// export default adminProductSlice.reducer;

// frontend/src/redux/slices/adminProductSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL;

// small helper to add the auth header
const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem("userToken") || ""}`,
});

/* ------------------------- THUNKS ------------------------- */

// LIST (admin)
export const fetchAdminProducts = createAsyncThunk(
  "adminProducts/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API_URL}/api/admin/products`, {
        headers: authHeader(),
      });
      // backend may return [] or { products: [] }
      return Array.isArray(data) ? data : data?.products ?? [];
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

// CREATE (admin)
export const createProduct = createAsyncThunk(
  "adminProducts/createProduct",
  async (productData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${API_URL}/api/admin/products`,
        productData,
        { headers: authHeader() }
      );
      return data; // created product document
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

// UPDATE (admin)
export const updateProduct = createAsyncThunk(
  "adminProducts/updateProduct",
  async ({ id, productData }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(
        `${API_URL}/api/admin/products/${id}`,
        productData,
        { headers: authHeader() }
      );
      return data; // updated product document
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

// DELETE (admin)
export const deleteProduct = createAsyncThunk(
  "adminProducts/deleteProduct",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/api/admin/products/${id}`, {
        headers: authHeader(),
      });
      return id; // return id so we can remove from state
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

/* ------------------------- SLICE ------------------------- */

const initialState = {
  products: [],
  error: null,

  // granular UI flags (useful to disable buttons/spinners)
  isListing: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,

  // optional helpers
  lastCreatedId: null,
};

const adminProductSlice = createSlice({
  name: "adminProducts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      /* ---------- LIST ---------- */
      .addCase(fetchAdminProducts.pending, (s) => {
        s.isListing = true;
        s.error = null;
      })
      .addCase(fetchAdminProducts.fulfilled, (s, a) => {
        s.isListing = false;
        s.products = a.payload; // already normalized to an array in the thunk
      })
      .addCase(fetchAdminProducts.rejected, (s, a) => {
        s.isListing = false;
        s.error = a.payload?.message || a.error.message;
      })

      /* ---------- CREATE ---------- */
      .addCase(createProduct.pending, (s) => {
        s.isCreating = true;
        s.error = null;
      })
      .addCase(createProduct.fulfilled, (s, a) => {
        s.isCreating = false;
        s.products.unshift(a.payload); // show newest on top
        s.lastCreatedId = a.payload?._id || null;
      })
      .addCase(createProduct.rejected, (s, a) => {
        s.isCreating = false;
        s.error = a.payload?.message || a.error.message;

        // 👇 helpful during dev
        if (a.payload?.fields) {
          console.error("Validation errors:", a.payload.fields);
          alert(
            "Validation failed:\n" + JSON.stringify(a.payload.fields, null, 2)
          );
        }
      })

      /* ---------- UPDATE ---------- */
      .addCase(updateProduct.pending, (s) => {
        s.isUpdating = true;
        s.error = null;
      })
      .addCase(updateProduct.fulfilled, (s, a) => {
        s.isUpdating = false;
        const updated = a.payload;
        const i = s.products.findIndex((p) => p._id === updated._id);
        if (i !== -1) s.products[i] = updated;
      })
      .addCase(updateProduct.rejected, (s, a) => {
        s.isUpdating = false;
        s.error = a.payload?.message || a.error.message;
      })

      /* ---------- DELETE ---------- */
      .addCase(deleteProduct.pending, (s) => {
        s.isDeleting = true;
        s.error = null;
      })
      .addCase(deleteProduct.fulfilled, (s, a) => {
        s.isDeleting = false;
        s.products = s.products.filter((p) => p._id !== a.payload);
      })
      .addCase(deleteProduct.rejected, (s, a) => {
        s.isDeleting = false;
        s.error = a.payload?.message || a.error.message;
      });
  },
});

export default adminProductSlice.reducer;

/* ------------------------- OPTIONAL SELECTORS ------------------------- */
export const selectAdminProducts = (state) => state.adminProducts.products;
export const selectAdminProductsLoading = (state) =>
  state.adminProducts.isListing ||
  state.adminProducts.isCreating ||
  state.adminProducts.isUpdating ||
  state.adminProducts.isDeleting;
export const selectAdminProductsError = (state) => state.adminProducts.error;
