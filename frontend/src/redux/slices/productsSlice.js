import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async Thunk to fetch products by collection and optional filters
// export const fetchProductsByFilters = createAsyncThunk(
//   "products/fetchByFilters",
//   async ({
//     collection,
//     size,
//     color,
//     gender,
//     minPrice,
//     maxPrice,
//     sortBy,
//     search,
//     category,
//     material,
//     brand,
//     limit,
//   }) => {
//     const query = new URLSearchParams();
//     if (collection) query.append("collection", collection);
//     if (size) query.append("size", size);
//     if (color) query.append("color", color);
//     if (gender) query.append("gender", gender);
//     if (minPrice) query.append("minPrice", minPrice);
//     if (maxPrice) query.append("maxPrice", maxPrice);
//     if (sortBy) query.append("sortBy", sortBy);
//     if (search) query.append("search", search);
//     if (category) query.append("category", category);
//     if (material) query.append("material", material);
//     if (brand) query.append("brand", brand);
//     if (limit) query.append("limit", limit);

//     const response = await axios.get(
//       `${import.meta.env.VITE_BACKEND_URL}/api/products?${query.toString()}`
//     );
//     return response.data;
//   }
// );

export const fetchProductsByFilters = createAsyncThunk(
  "products/fetchByFilters",
  async (filters, { rejectWithValue }) => {
    try {
      const query = new URLSearchParams();

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          query.append(key, value);
        }
      });

      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/products?${query.toString()}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Something went wrong"
      );
    }
  }
);


// we can also write this logic in below way, ==>>
// export const fetchProductsByFilters = createAsyncThunk(
//   "products/fetchByFilters",
//   async (filters) => {
//     const query = new URLSearchParams();

//     // Loop through filters
//     for (const [key, value] of Object.entries(filters)) {
//       if (value !== undefined && value !== null && value !== "") {
//         query.append(key, value);
//       }
//     }

//     const response = await axios.get(
//       `${import.meta.env.VITE_BACKEND_URL}/api/products?${query.toString()}`
//     );

//     return response.data;
//   }
// );

//Async thunk to fetch the products of single ID
export const fetchProductDetails = createAsyncThunk(
  "products/fetchProductDetails",
  async (id) => {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`
    );
    return response.data;
  }
);

//Async thunk to fetch the similar products
export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ id, productData }) => {
    const response = await axios.put(
      `${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`,
      productData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      }
    );
    return response.data;
  }
);

//Async thunk to fetch the similar products
export const fetchSimilarProducts = createAsyncThunk(
  "products/fetchSimilarProducts",
  async ({ id }) => {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/products/similar/${id}`
    );
    return response.data;
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    selectedProduct: null, // store the details of the single products
    similarProducts: [],
    loading: false,
    error: null,
    filters: {
      collection: "",
      size: "",
      color: "",
      gender: "",
      minPrice: "",
      maxPrice: "",
      sortBy: "",
      search: "",
      category: "",
      material: "",
      brand: "",
    },
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        collection: "",
        size: "",
        color: "",
        gender: "",
        minPrice: "",
        maxPrice: "",
        sortBy: "",
        search: "",
        category: "",
        material: "",
        brand: "",
      };
    },
  },
  extraReducers: (builder) => {
    builder
      //handle fetching products with filters
      .addCase(fetchProductsByFilters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // .addCase(fetchProductsByFilters.fulfilled, (state, action) => {
      //   state.loading = false;
      //   state.error = Array.isArray(action.payload) ? action.payload : [];
      // })
      .addCase(fetchProductsByFilters.fulfilled, (state, action) => {
        state.loading = false;
        state.products = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchProductsByFilters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      //handle fetching single product detail
      .addCase(fetchProductDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      //handle update product
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.updateProduct = action.payload;
        const index = state.products.findIndex(
          (product) => product._id === updateProduct._id
        );
        if (index !== -1) {
          state.products[index] = updateProduct;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      //handle fetching similar products
      .addCase(fetchSimilarProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSimilarProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.similarProducts = action.payload;
      })
      .addCase(fetchSimilarProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setFilters, clearFilters } = productsSlice.actions;
export default productsSlice.reducer;
