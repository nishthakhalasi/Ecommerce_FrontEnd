import axios from "axios";
import { store } from "../store/store";
import { logOut } from "../store/Slices/authSlice";

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      alert(
        "You have been logged out because your account was logged in elsewhere."
      );
      store.dispatch(logOut());
      window.location.href = "/auth/login";
    }
    return Promise.reject(error);
  }
);

export default axios;
