import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { CartItem, CartState } from "../../types/cart";
import { RootState } from "../store";

const initialState: CartState = {
  items: [],
  loading: false,
  error: null,
  clientSecret: "",
  checkoutStatus: "idle",
};

export const addToCartAPI = createAsyncThunk<
  CartItem,
  { token: string; productId: number; quantity: number }
>(
  "cart/addToCart",
  async ({ token, productId, quantity }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${process.env.BASE_URL}/carts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, quantity }),
      });

      const data = await res.json();
      if (!res.ok) return rejectWithValue(data.message || "Failed to add item");

      return data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const fetchCart = createAsyncThunk<CartItem[], string>(
  "cart/fetchCart",
  async (token, { rejectWithValue }) => {
    try {
      console.log(token);

      const res = await fetch(`${process.env.BASE_URL}/carts`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      console.log("Cart from API:", data);
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const removeFromCartAPI = createAsyncThunk<
  number,
  { token: string; cartId: number }
>("cart/removeFromCart", async ({ token, cartId }, { rejectWithValue }) => {
  try {
    console.log("cartSlice token:", token);

    const res = await fetch(`${process.env.BASE_URL}/carts/${cartId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    return cartId;
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

export const updateCartQuantityAPI = createAsyncThunk<
  CartItem,
  { token: string; cartItemId: number; quantity: number }
>(
  "cart/updateCartQuantity",
  async ({ token, cartItemId, quantity }, { rejectWithValue }) => {
    try {
      const res = await fetch(`${process.env.BASE_URL}/carts/${cartItemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity }),
      });
      const data = await res.json();
      return data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);
export const checkoutCart = createAsyncThunk<string, { token: string }>(
  "cart/checkoutCart",
  async ({ token }, { rejectWithValue }) => {
    console.log("cartSlice", token);

    try {
      const res = await fetch(`${process.env.BASE_URL}/carts/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        return rejectWithValue(data.message || "Checkout failed");
      }

      return data.clientSecret;
    } catch (err: any) {
      return rejectWithValue(err.message);
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
          if (!state.items) state.items = [];
          if (action.payload) {
            state.items.push(action.payload);
          }
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
        const updatedItem = action.payload;

        const index = state.items.findIndex((i) => i.id === updatedItem.id);
        if (index !== -1) {
          state.items[index] = {
            ...state.items[index],
            quantity: updatedItem.quantity,
          };
        }
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
