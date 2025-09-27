import { Product } from "./product";

export interface OrderProduct {
  productId: number;
  quantity: number;
  product: Product;
}

export interface OrderEvent {
  id: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: number;
  netAmount: number;
  address: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  products: OrderProduct[];
  events?: OrderEvent[];
}
