"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserById, updateUser } from "../../../../store/Slices/userSlice";
import Spinner from "../../../../components/Spinner";

export default function AdminEditUserPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id;
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { selectedUser, selectedUserLoading, selectedUserError } = useSelector(
    (state) => state.user
  );

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "user",
    profilePicture: "",
    phone: "",
  });
  const [file, setFile] = useState(null);

  // Fetch user
  useEffect(() => {
    if (token && userId) {
      dispatch(fetchUserById({ token, userId }));
    }
  }, [token, userId, dispatch]);

  // Update user
  useEffect(() => {
    if (selectedUser) {
      setFormData({
        name: selectedUser.name || "",
        email: selectedUser.email || "",
        role: selectedUser.role?.toLowerCase() || "user",
        profilePicture: selectedUser.profilePicture || "",
        phone: selectedUser.phone || "",
      });
    }
  }, [selectedUser]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setFormData({
        ...formData,
        profilePicture: URL.createObjectURL(selectedFile),
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return;

    const updateForm = new FormData();
    updateForm.append("name", formData.name);
    updateForm.append("email", formData.email);
    updateForm.append("role", formData.role);
    updateForm.append("phone", formData.phone);
    if (file) updateForm.append("profilePicture", file);

    try {
      const resultAction = await dispatch(
        updateUser({ token, userId, formData: updateForm })
      );
      if (updateUser.fulfilled.match(resultAction)) {
        router.push("/admin/users");
      } else {
        console.error(
          "Update failed:",
          resultAction.payload || resultAction.error
        );
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  };

  if (selectedUserLoading) return <Spinner />;
  if (selectedUserError)
    return (
      <p className="text-center mt-10 text-red-500 text-lg font-semibold">
        {selectedUserError}
      </p>
    );
  if (!selectedUser) return null;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-3xl p-8 md:p-12">
        <button
          type="button"
          onClick={() => router.back()}
          className="mb-4 flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
        >
          ← Back
        </button>

        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
          Edit User
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col items-center">
            <div className="relative w-32 h-32 mb-4">
              <Image
                src={
                  formData.profilePicture
                    ? formData.profilePicture.startsWith("http") ||
                      formData.profilePicture.startsWith("blob:")
                      ? formData.profilePicture
                      : `http://localhost:3000${formData.profilePicture}`
                    : "/default-avatar.png"
                }
                alt="Profile"
                fill
                className="rounded-full object-cover shadow-md"
              />
            </div>
            <label className="cursor-pointer bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
              Upload New Photo
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Phone
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Status
              </label>
              <input
                type="text"
                value={
                  selectedUser?.status === true
                    ? "Active"
                    : selectedUser?.status === false
                    ? "Inactive"
                    : "Unknown"
                }
                disabled
                className="w-full p-3 border border-gray-200 rounded-xl bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Created At
              </label>
              <input
                type="text"
                value={
                  selectedUser?.createdAt
                    ? new Date(selectedUser.createdAt).toLocaleString()
                    : ""
                }
                disabled
                className="w-full p-3 border border-gray-200 rounded-xl bg-gray-100"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-semibold p-3 rounded-xl hover:bg-indigo-700 transition"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
