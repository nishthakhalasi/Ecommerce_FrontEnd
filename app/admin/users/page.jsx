"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Spinner from "../../components/Spinner";
import { deleteUser, fetchUsers } from "../../store/Slices/userSlice";

export default function UsersPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { token, loading } = useSelector((state) => state.auth);
  const { users, usersLoading, usersError } = useSelector(
    (state) => state.user
  );

  useEffect(() => {
    if (token) {
      dispatch(fetchUsers(token));
    } else {
      router.push("/auth/login");
    }
  }, [token, dispatch, router]);

  if (loading || usersLoading) return <Spinner />;
  if (usersError) return <p className="text-red-500">{usersError}</p>;

  const uniqueUsers = Array.from(new Map(users.map((u) => [u.id, u])).values());

  return (
    <div className="p-6 md:p-12 bg-gray-50 min-h-[70vh]">
      <h2 className="text-4xl font-bold text-gray-800 mb-6 border-l-4 border-blue-600 pl-4 drop-shadow-lg">
        Users Management
      </h2>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {uniqueUsers.length ? (
          uniqueUsers.map((user) => (
            <div
              key={user.id}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 p-6 flex flex-col justify-between"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full overflow-hidden relative bg-gray-200 flex items-center justify-center">
                  {user.profilePicture ? (
                    <Image
                      src={
                        user.profilePicture.startsWith("http")
                          ? user.profilePicture
                          : `http://localhost:3000${user.profilePicture}`
                      }
                      alt={user.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <span className="text-gray-400 text-2xl">
                      {user.name?.charAt(0).toUpperCase() || "U"}
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    {user.name}
                  </h3>
                  <p className="text-gray-500 text-sm">{user.email}</p>
                  <p className="text-gray-500 text-sm">
                    {user.phone || "No phone"}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end mt-auto mb-2">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    user.status
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {user.status ? "Active" : "Inactive"}
                </span>
              </div>

              <div className="flex gap-2 mt-4">
                <button
                  className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors text-sm"
                  onClick={() => router.push(`/admin/users/${user.id}/edit`)}
                >
                  Edit
                </button>

                <button
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                  onClick={async () => {
                    if (!confirm("Are you sure you want to delete this user?"))
                      return;

                    try {
                      await dispatch(
                        deleteUser({ token, userId: user.id })
                      ).unwrap();
                      alert(" User deleted successfully!");
                    } catch (err) {
                      alert(`Error: ${err}`);
                    }
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 text-lg col-span-full">
            No users found
          </p>
        )}
      </div>
    </div>
  );
}
