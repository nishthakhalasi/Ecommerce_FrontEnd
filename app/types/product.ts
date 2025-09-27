// src/types/product.ts

export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

export interface ProductsState {
  products: Product[];
  loading: boolean;
  error: string | null;
}
