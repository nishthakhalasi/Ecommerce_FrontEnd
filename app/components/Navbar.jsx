"use client";

import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import { logOut } from "../store/Slices/authSlice";
import { ShoppingCart } from "lucide-react";
import Cookies from "js-cookie";

export default function Navbar() {
  const { user } = useSelector((state) => state.auth);
  const cartCount = useSelector((state) => state.cart?.items?.length || 0);
  const dispatch = useDispatch();
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);

  if (!user) return null;

  const profileImage = user?.profilePicture
    ? `http://localhost:3000${user.profilePicture}`
    : "/default-avatar.png";

  const handleLogout = () => {
    dispatch(logOut());
    Cookies.remove("token");
    Cookies.remove("role");
    Cookies.remove("user");
    router.replace("/auth/login");
  };

  if (user.role === "ADMIN") {
    return (
      <div className="flex justify-between items-center bg-white shadow-md px-6 py-4 mb-6 rounded">
        <h1 className="text-2xl font-semibold text-gray-700">
          Admin Dashboard
        </h1>

        <div className="relative" id="user-menu">
          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => setShowMenu(!showMenu)}
          >
            <Image
              src={profileImage}
              alt={user?.name || "User avatar"}
              width={50}
              height={50}
              className="rounded-full object-cover"
            />
            <div className="flex flex-col">
              <span className="text-sm font-medium">{user?.name}</span>
              <span className="text-xs text-gray-500">{user?.email}</span>
            </div>
          </div>

          {showMenu && (
            <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded border border-gray-200 z-50">
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100 rounded"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (user.role === "USER") {
    return (
      <nav className="sticky top-0 z-50 bg-white border-b w-full">
        <div className="flex items-center justify-between px-4 md:px-8 py-2 w-full">
          <div className="flex items-center space-x-2 md:space-x-3">
            <div className="relative w-14 h-14 md:w-20 md:h-20">
              <Image
                src="/logo.png"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 3.5rem, 5rem"
                alt="FASHION SHOP Logo"
                priority
              />
            </div>
            <Link
              href="/"
              className="text-xl md:text-2xl font-bold tracking-wide whitespace-nowrap"
            >
              FASHION SHOP
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-6 font-medium text-gray-700 text-lg">
            <Link href="/" className="hover:text-black transition">
              Home
            </Link>
            <Link href="/user/products" className="hover:text-black transition">
              Products
            </Link>
            <Link href="/user/about" className="hover:text-black transition">
              AboutUS
            </Link>
          </div>

          <div className="flex items-center space-x-4 text-lg relative">
            <Link href="/user/cart" className="relative group">
              <ShoppingCart className="w-7 h-7 text-gray-700 group-hover:text-black transition" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            <Image
              src={profileImage}
              alt={user?.name || "User profile"}
              width={50}
              height={50}
              className="rounded-full object-cover cursor-pointer"
              onClick={() => setShowMenu(!showMenu)}
            />

            {showMenu && (
              <div className="absolute right-0 top-full mt-2 bg-white border shadow-lg rounded w-36 flex flex-col items-center z-50">
                <Link
                  href="/user/dashboard"
                  className="px-3 py-1 w-full text-center hover:bg-gray-100 transition"
                  onClick={() => setShowMenu(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1 w-full text-center hover:bg-gray-100 transition"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>
    );
  }

  return null;
}
