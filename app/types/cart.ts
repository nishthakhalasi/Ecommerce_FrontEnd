import { Product } from "./product";

export interface CartItem {
  id: number;
  userId: number;
  productId: number;
  quantity: number;
  createdAt: string;
  updatedAt: string;
  product: Product;
}

export interface CartState {
  items: CartItem[];
  loading: boolean;
  error: string | null;
  clientSecret: string;
  checkoutStatus: "idle" | "loading" | "succeeded" | "failed";
}
