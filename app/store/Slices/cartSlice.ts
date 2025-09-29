import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { CartItem, CartState } from "../../types/cart";
import { RootState } from "../store";
import api from "../../utils/axiosSetup";
import axios from "axios";

const initialState: CartState = {
  items: [],
  loading: false,
  error: null,
  clientSecret: "",
  checkoutStatus: "idle",
};

export const addToCartAPI = createAsyncThunk<
  CartItem,
  { productId: number; quantity: number }
>("cart/addToCart", async ({ productId, quantity }, { rejectWithValue }) => {
  try {
    const res = await api.post("/carts", { productId, quantity });
    return res.data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
    return rejectWithValue("An unexpected error occurred");
  }
});

export const fetchCart = createAsyncThunk<CartItem[], string>(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/carts");
      return res.data;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        return rejectWithValue(err.response?.data?.message || err.message);
      }
      return rejectWithValue("An unexpected error occurred");
    }
  }
);

export const removeFromCartAPI = createAsyncThunk<number, { cartId: number }>(
  "cart/removeFromCart",
  async ({ cartId }, { rejectWithValue }) => {
    try {
      const res = await api.delete(`/carts/${cartId}`);
      return cartId;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        return rejectWithValue(err.response?.data?.message || err.message);
      }
      return rejectWithValue("An unexpected error occurred");
    }
  }
);

export const updateCartQuantityAPI = createAsyncThunk<
  CartItem,
  { cartItemId: number; quantity: number }
>(
  "cart/updateCartQuantity",
  async ({ cartItemId, quantity }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/carts/${cartItemId}`, { quantity });
      return res.data;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        return rejectWithValue(err.response?.data?.message || err.message);
      }
      return rejectWithValue("An unexpected error occurred");
    }
  }
);
export const checkoutCart = createAsyncThunk<string>(
  "cart/checkoutCart",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.post("/carts/checkout");
      return res.data.clientSecret;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        return rejectWithValue(err.response?.data?.message || err.message);
      }
      return rejectWithValue("An unexpected error occurred");
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCart: (state) => {
      state.items = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Add to Cart
      .addCase(addToCartAPI.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        addToCartAPI.fulfilled,
        (state, action: PayloadAction<CartItem>) => {
          state.loading = false;
          state.items.push(action.payload);
        }
      )

      .addCase(addToCartAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Remove from Cart
      .addCase(removeFromCartAPI.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        removeFromCartAPI.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.loading = false;
          state.items = state.items.filter(
            (item) => item.id !== Number(action.payload)
          );
        }
      )
      .addCase(removeFromCartAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update Quantity
      .addCase(updateCartQuantityAPI.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartQuantityAPI.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex((i) => i.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      })
      .addCase(updateCartQuantityAPI.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Checkout
      .addCase(checkoutCart.pending, (state) => {
        state.checkoutStatus = "loading";
        state.error = null;
      })
      .addCase(checkoutCart.fulfilled, (state, action) => {
        state.checkoutStatus = "succeeded";
        state.clientSecret = action.payload;
      })
      .addCase(checkoutCart.rejected, (state, action) => {
        state.checkoutStatus = "failed";
        state.error = action.payload as string;
      });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;

export const selectCart = (state: RootState) => state.cart;
export const selectClientSecret = (state: RootState) => state.cart.clientSecret;
export const selectCheckoutStatus = (state: RootState) =>
  state.cart.checkoutStatus;
