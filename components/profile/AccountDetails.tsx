"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/auth/useAuthStore";
import { bodoni, inter } from "@/lib/fonts";

export default function AccountDetails() {
  const { user, logout, loading: authLoading } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    router.replace("/login");
  };

  if (authLoading || !user) {
    return (
      <div className="flex h-[60vh] items-center justify-center text-gray-500">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto bg-gray-50 p-6 md:p-10">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <h1 className={`${bodoni.className} text-2xl font-semibold text-neutral-600`}>
          My Profile
        </h1>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 text-sm transition"
        >
          Logout
        </button>
      </div>

      {/* USER INFO */}
      <div className={`${bodoni.className} space-y-4`}>
        <div>
          <p className={`${inter.className} text-sm text-gray-500`}>Name</p>
          <p className="text-lg font-medium text-gray-800">
            {user.name}
          </p>
        </div>

        <div>
          <p className={`${inter.className} text-sm text-gray-500`}>Email</p>
          <p className="text-lg font-medium text-gray-800">
            {user.email}
          </p>
        </div>

        <div>
          <p className={`${inter.className}text-sm text-gray-500`}>Role</p>
          <p className="text-lg font-medium text-gray-800 capitalize">
            {user.role}
          </p>
        </div>
      </div>
    </div>
  );
}