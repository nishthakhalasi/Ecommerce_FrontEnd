"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Provider, useDispatch, useSelector } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store/store";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import api, { setupInterceptors } from "./utils/axiosSetup";
import { logOut } from "./store/Slices/authSlice";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

function LayoutWrapper({ children }) {
  const pathname = usePathname() || "/";
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const isAdminRoute = pathname.startsWith("/admin");
  const isAuthRoute = ["/auth/login", "/auth/signup"].some((p) =>
    pathname.startsWith(p)
  );

  useEffect(() => {
    if (!user && !isAuthRoute) {
      router.replace("/auth/login");
    } else if (user && isAuthRoute) {
      if (user.role === "ADMIN") router.replace("/admin/dashboard");
      else if (user.role === "USER") router.replace("/");
    }
  }, [user, router, isAuthRoute]);

  useEffect(() => {
    const interceptor = setupInterceptors(dispatch, router);
    return () => {
      api.interceptors.response.eject(interceptor);
    };
  }, [dispatch, router]);

  useEffect(() => {
    const checkToken = async () => {
      const token = user?.token || localStorage.getItem("token");
      if (token) {
        try {
          const res = await api.post(
            "/auth/validate",
            {},
            { headers: { Authorization: `Bearer ${token}` } }
          );
          if (!res.data.valid) {
            dispatch(logOut());
            alert(
              "You have been logged out because your account was logged in elsewhere."
            );
            router.replace("/auth/login");
          }
        } catch {
          dispatch(logOut());
          router.replace("/auth/login");
        }
      }
    };

    checkToken();
    const interval = setInterval(checkToken, 5000);
    return () => clearInterval(interval);
  }, [dispatch, user, router]);

  return (
    <>
      <div className="flex flex-col min-h-screen">
        {!isAdminRoute && !isAuthRoute && <Navbar />}

        <main className="flex-1">{children}</main>

        {!isAdminRoute && !isAuthRoute && <Footer />}
      </div>
    </>
  );
}

export default function ClientProviders({ children }) {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <Elements stripe={stripePromise}>
          <LayoutWrapper>{children}</LayoutWrapper>
        </Elements>
      </PersistGate>
    </Provider>
  );
}
