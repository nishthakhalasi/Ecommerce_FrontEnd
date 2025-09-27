"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Provider, useSelector } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store/store";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

function LayoutWrapper({ children }) {
  const pathname = usePathname() || "/";
  const router = useRouter();
  const user = useSelector((state) => state.auth.user);

  const isAdminRoute = pathname.startsWith("/admin");
  const isAuthRoute = ["/auth/login", "/auth/signup"].some((p) =>
    pathname.startsWith(p)
  );

  useEffect(() => {
    if (!user && !isAuthRoute) {
      router.replace("/auth/login"); // Unauthenticated
    } else if (user && isAuthRoute) {
      // Authenticated → redirect based on role
      if (user.role === "ADMIN") router.replace("/admin/dashboard");
      else if (user.role === "USER") router.replace("/");
    }
  }, [user, router, isAuthRoute]);

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
