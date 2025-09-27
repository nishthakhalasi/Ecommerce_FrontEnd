"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkoutCart, clearCart } from "../../../store/Slices/cartSlice";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { createOrder } from "../../../store/Slices/orderSlice";

export default function CheckoutPage() {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  const router = useRouter();
  const { token } = useSelector((state) => state.auth);
  const { clientSecret, checkoutStatus, error } = useSelector(
    (state) => state.cart
  );

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      toast.error("You must be logged in to checkout");
      return;
    }
    dispatch(checkoutCart({ token }));
  }, [dispatch, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || !clientSecret) return;

    setLoading(true);
    try {
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        toast.error("Payment failed: " + result.error.message);
      } else if (result.paymentIntent.status === "succeeded") {
        toast.success("Payment successful 🎉");

        // Create order in backend
        const orderAction = await dispatch(createOrder({ token })).unwrap();
        dispatch(clearCart());
        router.push(`/order-summary/${orderAction.id}`);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-purple-50 p-4">
      <div className="w-full max-w-lg bg-white shadow-2xl rounded-2xl p-8 md:p-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Checkout
        </h2>

        {checkoutStatus === "loading" && (
          <p className="text-gray-500 mb-4 text-center">
            Creating payment intent...
          </p>
        )}
        {error && (
          <p className="text-red-500 mb-4 text-center font-medium">{error}</p>
        )}

        {clientSecret && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="p-4 border-2 border-gray-200 rounded-xl hover:border-blue-400 transition-colors">
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: "16px",
                      color: "#1f2937",
                      "::placeholder": { color: "#9ca3af" },
                    },
                    invalid: { color: "#ef4444" },
                  },
                }}
              />
            </div>

            <button
              type="submit"
              disabled={!stripe || loading || checkoutStatus === "loading"}
              className={`w-full py-3 rounded-xl text-white font-semibold transition-all ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Processing..." : "Pay Now"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
