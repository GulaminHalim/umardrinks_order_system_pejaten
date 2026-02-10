import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./slices/cartSlice.jsx";
import orderNotificationReducer from "./slices/orderNotificationSlice.jsx";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    orderNotification: orderNotificationReducer,
  },
});
