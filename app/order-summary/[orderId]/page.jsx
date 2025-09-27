"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrderById, clearOrder } from "../../store/Slices/orderSlice";

export default function OrderSummaryPage() {
  const { orderId } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { order, loading, error } = useSelector((state) => state.order);

  useEffect(() => {
    if (!orderId || !token) return;

    dispatch(fetchOrderById({ orderId, token }));

    return () => dispatch(clearOrder());
  }, [dispatch, orderId, token]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading order...</p>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Order not found.</p>
      </div>
    );

  if (!order) return null;

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center">
      <div className="w-full max-w-6xl flex flex-col gap-6">
        {/* Order Details */}
        <div className="bg-white shadow-xl rounded-2xl p-6 space-y-6">
          <h2 className="text-3xl font-bold text-gray-800 text-center lg:text-left">
            Order Summary
          </h2>

          {/* Order Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center md:text-left">
            <div className="bg-blue-50 p-4 rounded-xl shadow-sm">
              <p className="font-semibold text-gray-700">Order ID</p>
              <p className="mt-1 text-gray-900">{order.id}</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-xl shadow-sm">
              <p className="font-semibold text-gray-700">Status</p>
              <p className="mt-1 text-gray-900">{order.status}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-xl shadow-sm">
              <p className="font-semibold text-gray-700">Total Paid</p>
              <p className="mt-1 text-gray-900">
                ₹{Number(order.netAmount || 0).toFixed(2)}
              </p>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="p-4 bg-gray-50 rounded-xl shadow-sm">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Shipping Address
            </h3>
            <p className="text-gray-700">{order.address}</p>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              Products
            </h3>
            <div className="space-y-4">
              {order.products.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-4 bg-white border rounded-xl shadow-sm"
                >
                  {item.product?.photo && (
                    <img
                      src={`http://localhost:3000/uploads/${item.product.photo}`}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">
                      {item.product?.name}
                    </p>
                    <p className="text-gray-500">Quantity: {item.quantity}</p>
                    <p className="text-gray-500">
                      Unit Price: ₹{Number(item.product?.price || 0)}
                    </p>
                    <p className="text-gray-500">
                      Total: ₹{Number(item.product?.price || 0) * item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Events */}
          {order.events?.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">
                Order History
              </h3>
              <ul className="divide-y divide-gray-200">
                {order.events.map((event) => (
                  <li key={event.id} className="py-2">
                    <p className="text-gray-700">
                      <span className="font-semibold">{event.status}</span> –{" "}
                      {new Date(event.createdAt).toLocaleString()}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Continue Shopping Button */}
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => router.push("/user/products")}
              className="w-full max-w-xs py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
