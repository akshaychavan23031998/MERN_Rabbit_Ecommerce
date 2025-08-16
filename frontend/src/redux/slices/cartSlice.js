import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

//Helper function to load cart from local storage
const loadCartFromStorage = () => {
  const storedCart = localStorage.getItem("cart");
  return storedCart ? JSON.parse(storedCart) : { products: [] };
};

// cartSlice.js (top or near other helpers)
const keyOf = (p) => `${p.productId}|${p.size || ""}|${p.color || ""}`;

const mergeCartExtras = (serverCart, prevCart, extrasForCurrentAction) => {
  const prevList = prevCart?.products || [];
  const prevMap = new Map(prevList.map((p) => [keyOf(p), p]));

  const mergedProducts = (serverCart?.products || []).map((item) => {
    const key = keyOf(item);
    const prev = prevMap.get(key);

    // carry over client-side fields from previous state
    let merged = {
      ...item,
      ...(prev
        ? {
            priceINR: prev.priceINR ?? item.priceINR,
            discountPrice: prev.discountPrice ?? item.discountPrice ?? null,
            name: prev.name ?? item.name,
            image: prev.image ?? item.image,
          }
        : {}),
    };

    // if this is the line we just added/updated, override with latest extras
    const ex = extrasForCurrentAction;
    if (
      ex &&
      item.productId === ex.productId &&
      (item.size || "") === (ex.size || "") &&
      (item.color || "") === (ex.color || "")
    ) {
      merged = {
        ...merged,
        price: ex.price ?? merged.price,
        discountPrice: ex.discountPrice ?? merged.discountPrice ?? null,
        priceINR: ex.priceINR ?? merged.priceINR,
        name: ex.name ?? merged.name,
        image: ex.image ?? merged.image,
      };
    }

    return merged;
  });

  return { ...serverCart, products: mergedProducts };
};

//Helper function to save cart in local storage
const saveCartToStorage = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

// fetch cart for a user or guest
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async ({ userId, guestId }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart`,
        { params: { userId, guestId } }
      );
      return response.data;
    } catch (error) {
      console.error(error);
      return rejectWithValue(error.response.data);
    }
  }
);

// Add an item to the cart for the user or guest
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (
    {
      productId,
      quantity,
      size,
      color,
      guestId,
      userId,
      price,
      discountPrice,
      priceINR,
      name,
      image,
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart`,
        {
          productId,
          quantity,
          size,
          color,
          guestId,
          userId,
          price,
          discountPrice,
          priceINR,
          name,
          image,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Update the quantity of an item in the cart
export const updateCartItemQuantity = createAsyncThunk(
  "cart/updateCartItemQuantity",
  async (
    { productId, quantity, size, color, guestId, userId },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart`,
        {
          productId,
          quantity,
          size,
          color,
          guestId,
          userId,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// // Remove an item from the cart
// export const removeFromCart = createAsyncThunk(
//   "cart/removeFromCart",
//   async ({ productId, userId, size, color, guestId }, { rejectWithValue }) => {
//     try {
//       const response = await axios({
//         method: "DELETE",
//         url: `${import.meta.env.VITE_BACKEND_URL}/api/cart`,
//         data: { productId, guestId, userId, size, color },
//       });
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response.data);
//     }
//   }
// );

export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async ({ productId, userId, size, color, guestId }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart/remove`,
        { productId, guestId, userId, size, color }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Merge the guest cart into user cart
export const mergeCart = createAsyncThunk(
  "cart/mergeCart",
  async ({ guestId, user }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart/merge`,
        { guestId, user },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: loadCartFromStorage(),
    loading: false,
    error: null,
  },
  reducers: {
    clearCart: (state) => {
      state.cart = { products: [] };
      localStorage.removeItem("cart");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // .addCase(fetchCart.fulfilled, (state, action) => {
      //   state.loading = false;
      //   state.cart = action.payload;
      //   state.error = null;
      //   saveCartToStorage(action.payload);
      // })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        const merged = mergeCartExtras(action.payload, state.cart, null);
        state.cart = merged;
        state.error = null;
        saveCartToStorage(merged);
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch cart";
      })
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // .addCase(addToCart.fulfilled, (state, action) => {
      //   state.loading = false;
      //   // state.cart = action.payload; // ✅ store updated cart!
      //   const serverCart = action.payload;
      //   const extras = action.meta.arg; // what PDP sent

      //   // find the same line item (match by id + size + color)
      //   const i = serverCart?.products?.findIndex(
      //     (p) =>
      //       p.productId === extras.productId &&
      //       p.size === extras.size &&
      //       p.color === extras.color
      //   );
      //   if (i != null && i >= 0) {
      //     serverCart.products[i] = {
      //       ...serverCart.products[i],
      //       // keep canonical USD if you want
      //       price: extras.price ?? serverCart.products[i].price,
      //       discountPrice:
      //         extras.discountPrice ??
      //         serverCart.products[i].discountPrice ??
      //         null,
      //       // display-ready INR for the drawer
      //       priceINR: extras.priceINR ?? serverCart.products[i].priceINR,
      //       // conveniences for UI
      //       name: extras.name ?? serverCart.products[i].name,
      //       image: extras.image ?? serverCart.products[i].image,
      //     };
      //   }
      //   state.cart = serverCart;
      //   state.error = null;
      //   // saveCartToStorage(action.payload);
      //   saveCartToStorage(serverCart);
      // })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        const serverCart = action.payload;
        const extras = action.meta.arg; // what PDP sent for THIS add
        const merged = mergeCartExtras(serverCart, state.cart, extras);
        state.cart = merged;
        state.error = null;
        saveCartToStorage(merged);
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to add to cart";
      })
      .addCase(updateCartItemQuantity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
      //   state.loading = false;
      //   state.cart = action.payload; // ✅ Update cart in state
      //   state.error = null;
      //   saveCartToStorage(action.payload);
      // })
      .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
        state.loading = false;
        // no extras from PDP here; just preserve prior client fields for all lines
        const merged = mergeCartExtras(action.payload, state.cart, null);
        state.cart = merged;
        state.error = null;
        saveCartToStorage(merged);
      })
      .addCase(updateCartItemQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Failed to update item quantity";
      })
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // .addCase(removeFromCart.fulfilled, (state, action) => {
      //   state.loading = false;
      //   state.cart = action.payload; // ✅ update entire cart
      //   saveCartToStorage(action.payload); // persist to localStorage
      //   state.error = null;
      // })

      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;
        const merged = mergeCartExtras(action.payload, state.cart, null);
        state.cart = merged;
        state.error = null;
        saveCartToStorage(merged);
      })

      .addCase(removeFromCart.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(mergeCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(mergeCart.fulfilled, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        saveCartToStorage(action.payload);
      })
      .addCase(mergeCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed merge the cart";
      });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
