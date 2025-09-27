"use client";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store/store";
import { usePathname } from "next/navigation";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

export default function ClientProviders({ children }) {
  const pathname = usePathname() || "/";

  const isAdminRoute = pathname.startsWith("/admin");
  const isAuthRoute = ["/auth/login", "/auth/signup"].some((p) =>
    pathname.startsWith(p)
  );

  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <Elements stripe={stripePromise}>
          {!isAdminRoute && !isAuthRoute && <Navbar />}
          {children}
          {!isAdminRoute && !isAuthRoute && <Footer />}
        </Elements>
      </PersistGate>
    </Provider>
  );
}
