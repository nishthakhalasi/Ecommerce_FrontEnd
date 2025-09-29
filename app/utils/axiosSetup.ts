import axios from "axios";
import { AppDispatch } from "../store/store";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
});

//function sets up request and response interceptors on the Axios instance.
export const setupInterceptors = (dispatch: AppDispatch, router: any) => {
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  const interceptor = api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (typeof window !== "undefined") {
        const status = error.response?.status;

        if (status === 401) {
          error.isForcedLogout = true;
          alert(
            "You have been logged out because your account was logged in elsewhere."
          );
          dispatch({ type: "auth/logOut" });
          router.replace("/auth/login");
        }
      }
      return Promise.reject();
    }
  );

  return interceptor;
};

export default api;
