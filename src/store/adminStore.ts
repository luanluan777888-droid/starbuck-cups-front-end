import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import cartReducer from "./slices/cartSlice";
import customersReducer from "./slices/customersSlice";
import ordersReducer from "./slices/ordersSlice";
import productsReducer from "./slices/productsSlice";
import notificationsReducer from "./slices/notificationSlice";
import effectSettingsReducer from "./effectSettingsSlice";

export const adminStore = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    customers: customersReducer,
    orders: ordersReducer,
    products: productsReducer,
    notifications: notificationsReducer,
    effectSettings: effectSettingsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export type AdminRootState = ReturnType<typeof adminStore.getState>;
export type AdminAppDispatch = typeof adminStore.dispatch;
