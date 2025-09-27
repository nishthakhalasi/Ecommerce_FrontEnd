// src/types/user.ts

export interface User {
  _id?: string;
  id?: string;
  name: string;
  email: string;
  role?: string;
  [key: string]: any;
}

export interface UserState {
  users: User[];
  usersLoading: boolean;
  usersError: string | null;
  selectedUser: User | null;
  selectedUserLoading: boolean;
  selectedUserError: string | null;
}

export interface FetchUserByIdPayload {
  token: string;
  userId: string;
}

export interface UpdateUserPayload {
  token: string;
  userId: string;
  formData: FormData;
}

export interface DeleteUserPayload {
  token: string;
  userId: string;
}
