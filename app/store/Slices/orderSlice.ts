import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Order } from "../../types/order";
import { RootState } from "../store";
import api from "../../utils/axiosSetup";

interface OrderState {
  order: Order | null;
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  order: null,
  loading: false,
  error: null,
};

// Fetch order by ID
export const fetchOrderById = createAsyncThunk<Order, { orderId: string }>(
  "order/fetchOrderById",
  async ({ orderId }, { rejectWithValue }) => {
    try {
      const res = await api.get(`/orders/${orderId}`);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// Create order after successful payment
export const createOrder = createAsyncThunk<Order>(
  "order/createOrder",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.post("/orders");
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.order = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchOrderById.fulfilled,
        (state, action: PayloadAction<Order>) => {
          state.loading = false;
          state.order = action.payload;
        }
      )
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearOrder } = orderSlice.actions;
export default orderSlice.reducer;

export const selectOrder = (state: RootState) => state.order.order;
export const selectOrderLoading = (state: RootState) => state.order.loading;
export const selectOrderError = (state: RootState) => state.order.error;
