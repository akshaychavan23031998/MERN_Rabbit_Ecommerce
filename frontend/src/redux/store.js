// import { configureStore } from "@reduxjs/toolkit";
// import authReducer from "./slices/authSlice";
// import productReducer from "./slices/productsSlice";
// import cartReducer from "./slices/cartSlice";
// import checkoutReducer from "./slices/checkoutSlice";
// import orderReducer from "./slices/orderSlice";
// import adminReducer from "./slices/adminSlice";
// import adminProductReducer from "./slices/adminProductSlice";
// import adminOrderReducer from "./slices/adminOrderSlice";

// const store = configureStore({
//   reducer: {
//     auth: authReducer,
//     products: productReducer,
//     cart: cartReducer,
//     checkout: checkoutReducer,
//     orders: orderReducer,
//     admin: adminReducer,
//     adminProducts: adminProductReducer,
//     adminOrders: adminOrderReducer,
//   },
// });

// export default store;

// redux/store.js
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage"; // localStorage
import authReducer from "./slices/authSlice";
import productReducer from "./slices/productsSlice";
import cartReducer from "./slices/cartSlice";
import checkoutReducer from "./slices/checkoutSlice";
import orderReducer from "./slices/orderSlice";
import adminReducer from "./slices/adminSlice";
import adminProductReducer from "./slices/adminProductSlice";
import adminOrderReducer from "./slices/adminOrderSlice";

// Combine all reducers
const rootReducer = combineReducers({
  auth: authReducer,
  products: productReducer,
  cart: cartReducer,
  checkout: checkoutReducer,
  orders: orderReducer,
  admin: adminReducer,
  adminProducts: adminProductReducer,
  adminOrders: adminOrderReducer,
});

// Persist config: whitelist the reducers you want to persist (e.g., cart & auth)
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["cart", "auth"], // Adjust according to your needs
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the store with the persisted reducer
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types from redux-persist
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Create the persistor which will persist the store
export const persistor = persistStore(store);

