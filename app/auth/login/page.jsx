"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../store/Slices/authSlice";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { unwrapResult } from "@reduxjs/toolkit";

export default function Login() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });

  const { loading, error } = useSelector((state) => state.auth);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const actionResult = await dispatch(loginUser(formData));
      const result = unwrapResult(actionResult);

      if (result.role === "ADMIN") router.replace("/admin/dashboard");
      else if (result.role === "USER") router.replace("/");
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="flex flex-col md:flex-row w-full max-w-7xl bg-white rounded-3xl shadow-2xl overflow-hidden min-h-[60vh]">
        <div className="hidden md:block md:w-1/2 relative min-h-[60vh]">
          <Image
            src="/login.jpg"
            alt="Login page"
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 0px, 50vw"
          />
        </div>
        <div className="w-full md:w-1/2 p-16 flex flex-col justify-center">
          <h2 className="text-4xl font-bold text-blue-700 text-center mb-8">
            Account Login
          </h2>
          {error && (
            <p className="text-red-500 text-sm text-center mb-6">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-6 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-indigo-400 outline-none transition duration-300 hover:shadow-md text-lg"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-6 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-indigo-400 outline-none transition duration-300 hover:shadow-md text-lg"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white font-semibold py-4 rounded-2xl hover:bg-indigo-700 transition duration-300 shadow-md text-lg disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-sm text-gray-600 text-center mt-8">
            Don’t have an account?{" "}
            <Link
              href="/auth/signup"
              className="text-indigo-600 font-medium hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
