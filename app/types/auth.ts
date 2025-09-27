// src/types/auth.ts

export interface User {
  id: number;
  name: string;
  email: string;
  token: string;
  [key: string]: any;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  success: string | null;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload extends Record<string, any> {
  name?: string;
  email: string;
  password: string;
}
