import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { Product, ProductsState } from "../../types/product";

export const fetchProducts = createAsyncThunk<Product[], string>(
  "products/fetchProducts",
  async (token, { rejectWithValue }) => {
    if (!token) return rejectWithValue("Token not provided");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/products`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.status === 401) throw new Error("Unauthorized. Please login.");
      if (!res.ok) throw new Error("Failed to fetch products");

      const data = await res.json();

      return data.date || [];
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const addProduct = createAsyncThunk<
  Product,
  { token: string; formData: any }
>("products/addProduct", async ({ token, formData }, { rejectWithValue }) => {
  try {
    const body = new FormData();

    for (const key in formData) {
      const value = formData[key];

      if (key === "image" && value) {
        body.append("photo", value);
      } else if (key === "tags" && value) {
        value.split(",").forEach((tag) => body.append("tags", tag.trim()));
      } else if (key === "price" && value !== undefined) {
        body.append("price", Number(value).toString());
      } else if (value !== undefined) {
        body.append(key, value);
      }
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/products`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body,
    });

    if (!res.ok) throw new Error("Failed to add product");
    console.log(res);
    return await res.json();
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

export const updateProduct = createAsyncThunk<
  Product,
  { token: string; id: string; formData: any }
>(
  "products/updateProduct",
  async ({ token, id, formData }, { rejectWithValue }) => {
    try {
      const body = new FormData();
      for (const key in formData) {
        if (key === "image" && formData.image) {
          body.append("photo", formData.image);
        } else {
          body.append(key, formData[key]);
        }
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/products/${id}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
          body,
        }
      );

      if (!res.ok) throw new Error("Failed to update product");
      return await res.json();
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const deleteProduct = createAsyncThunk<
  number,
  { token: string; id: number }
>("products/deleteProduct", async ({ token, id }, { rejectWithValue }) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/products/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      const data = await res.json();
      return rejectWithValue(data.message || "Failed to delete product");
    }

    return id;
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

const initialState: ProductsState = {
  products: [],
  loading: true,
  error: null,
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      //Fetch
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      //Add
      .addCase(
        addProduct.fulfilled,
        (state, action: PayloadAction<Product>) => {
          state.products.push(action.payload);
        }
      )

      //Update
      .addCase(
        updateProduct.fulfilled,
        (state, action: PayloadAction<Product>) => {
          const index = state.products.findIndex(
            (p) => p.id === action.payload.id || p._id === action.payload._id
          );
          if (index !== -1) state.products[index] = action.payload;
        }
      )

      .addCase(
        deleteProduct.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.products = state.products.filter(
            (p) => p.id !== action.payload
          );
        }
      );
  },
});

export default productsSlice.reducer;
