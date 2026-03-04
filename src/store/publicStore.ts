import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./slices/cartSlice";
import productsReducer from "./slices/productsSlice";
import effectSettingsReducer from "./effectSettingsSlice";

export const publicStore = configureStore({
  reducer: {
    cart: cartReducer,
    products: productsReducer,
    effectSettings: effectSettingsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export type PublicRootState = ReturnType<typeof publicStore.getState>;
export type PublicAppDispatch = typeof publicStore.dispatch;
