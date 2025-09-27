"use client";

import { useSelector, useDispatch } from "react-redux";
import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { logOut } from "../../store/Slices/authSlice";

export default function UserDashboard() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("role");
    Cookies.remove("user");
    dispatch(logOut());
    router.push("/auth/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-gray-800">
          Welcome, {user?.name || "User"}
        </h1>
        <button
          onClick={handleLogout}
          className="px-6 py-2 bg-red-600 text-white text-lg rounded-lg hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition">
          <h2 className="text-xl font-semibold mb-3">My Profile</h2>
          <p className="text-gray-600 mb-4">
            View and update your account details.
          </p>
          <Link
            href="/user/profile"
            className="text-indigo-600 font-medium hover:underline"
          >
            Go to Profile →
          </Link>
        </div>
        <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition">
          <h2 className="text-xl font-semibold mb-3">My Orders</h2>
          <p className="text-gray-600 mb-4">
            Track your order history and status.
          </p>
          <Link
            href="/user/orders"
            className="text-indigo-600 font-medium hover:underline"
          >
            View Orders →
          </Link>
        </div>
      </div>
    </div>
  );
}
