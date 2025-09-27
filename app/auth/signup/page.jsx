"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { signupUser, clearMessages } from "../../store/Slices/authSlice";
import Spinner from "../../components/Spinner";
import { useRouter } from "next/navigation";

export default function SignUp() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { loading, error, success } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });
  const [profileFile, setProfileFile] = useState(null);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setProfileFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(clearMessages());

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const form = new FormData();
    form.append("name", formData.name);
    form.append("email", formData.email);
    form.append("password", formData.password);
    form.append("phone", formData.phone);
    if (profileFile) form.append("profilePicture", profileFile);

    dispatch(signupUser(form));
  };
  useEffect(() => {
    if (success) {
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        phone: "",
      });
      setProfileFile(null);
      dispatch(clearMessages());
      router.push("/auth/login");
    }
  }, [success, dispatch, router]);

  if (loading) return <Spinner />;

  return (
    <div className="min-h-screen flex justify-center items-center p-6 bg-gray-100">
      <div className="flex flex-col md:flex-row w-full max-w-7xl bg-white rounded-3xl shadow-2xl overflow-hidden min-h-[80vh]">
        <div className="hidden md:block md:w-1/2 relative min-h-[80vh]">
          <Image
            src="/signup.jpeg"
            alt="SignUp Image"
            fill
            className="object-cover"
            priority
            quality={100}
          />
        </div>
        <div className="w-full md:w-1/2 p-16 flex flex-col justify-center">
          <h2 className="text-4xl font-bold text-indigo-600 text-center mb-8">
            Create Your Account
          </h2>

          {error && (
            <p className="text-red-500 text-sm text-center mb-6">{error}</p>
          )}
          {success && (
            <p className="text-green-500 text-sm text-center mb-6">{success}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-6 py-4 border rounded-2xl focus:ring-2 focus:ring-indigo-400 outline-none transition text-lg"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-6 py-4 border rounded-2xl focus:ring-2 focus:ring-indigo-400 outline-none transition text-lg"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-6 py-4 border rounded-2xl focus:ring-2 focus:ring-indigo-400 outline-none transition text-lg"
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full px-6 py-4 border rounded-2xl focus:ring-2 focus:ring-indigo-400 outline-none transition text-lg"
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-6 py-4 border rounded-2xl focus:ring-2 focus:ring-indigo-400 outline-none transition text-lg"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full"
            />

            <button
              type="submit"
              className="w-full bg-indigo-600 text-white font-semibold py-4 rounded-2xl hover:bg-indigo-900 transition duration-300 text-lg shadow-md"
            >
              Sign Up
            </button>
          </form>

          <p className="text-sm text-gray-600 text-center mt-8">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="text-indigo-600 font-medium hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
