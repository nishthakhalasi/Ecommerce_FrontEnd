"use client";

import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Package,
  Settings,
} from "lucide-react";
import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-72 bg-gradient-to-b from-indigo-600 to-indigo-800 text-white h-auto shadow-xl flex flex-col">
      <div className="p-8 text-3xl font-extrabold tracking-wide border-b border-indigo-500">
        Admin Panel
      </div>
      <nav className="flex-1 px-6 py-6 space-y-4">
        <Link
          href="/admin/dashboard"
          className="flex items-center gap-4 py-3 px-4 text-lg rounded-xl hover:bg-indigo-700 transition"
        >
          <LayoutDashboard size={24} /> Dashboard
        </Link>
        <Link
          href="/admin/users"
          className="flex items-center gap-4 py-3 px-4 text-lg rounded-xl hover:bg-indigo-700 transition"
        >
          <Users size={24} /> Users
        </Link>
        <Link
          href="/admin/products"
          className="flex items-center gap-4 py-3 px-4 text-lg rounded-xl hover:bg-indigo-700 transition"
        >
          <Package size={24} /> Products
        </Link>
        <Link
          href="/admin/orders"
          className="flex items-center gap-4 py-3 px-4 text-lg rounded-xl hover:bg-indigo-700 transition"
        >
          <ShoppingCart size={24} /> Orders
        </Link>
        <Link
          href="/admin/settings"
          className="flex items-center gap-4 py-3 px-4 text-lg rounded-xl hover:bg-indigo-700 transition"
        >
          <Settings size={24} /> Settings
        </Link>
      </nav>
      <div className="p-6 border-t border-indigo-500 text-sm text-center opacity-80">
        © 2025 Admin Panel
      </div>
    </aside>
  );
}
