"use client";

import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { logOut } from "../store/Slices/authSlice";
import AdminTopbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Spinner from "../components/Spinner";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    dispatch(logOut());
    router.replace("/auth/login");
  };
  useEffect(() => {
    if (!user || user.role !== "ADMIN") {
      router.replace("/auth/login");
    }
  }, [user, router]);

  if (!user) return <Spinner />;

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col">
        <AdminTopbar
          user={user}
          onLogout={handleLogout}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />
        <main className="flex-1 p-6 md:p-10 overflow-auto">{children}</main>
        <footer className="text-center py-4 text-gray-400 text-sm border-t border-gray-200 dark:border-gray-700">
          &copy; {new Date().getFullYear()} Your Company. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
