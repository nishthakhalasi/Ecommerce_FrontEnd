import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "../store/Slices/authSlice";
import productReducer from "../store/Slices/productsSlice";
import userProductReducer from "../store/Slices/userSlice";
import cartReducer from "../store/Slices/cartSlice";
import orderReducer from "../store/Slices/orderSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  products: productReducer,
  user: userProductReducer,
  cart: cartReducer,
  order: orderReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "cart"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
