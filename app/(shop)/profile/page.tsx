"use client";

import { useAuthStore } from "@/store/auth/useAuthStore";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useRouter } from "next/navigation";
import AddressSection from "@/components/profile/AddressSection";

export default function ProfilePage() {
  useRequireAuth(); // 🔐 protect route

  const { user, logout, loading } = useAuthStore();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-gray-500">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 md:px-10 py-10">
      <div className="max-w-3xl mx-auto bg-white shadow-md rounded-2xl p-6 md:p-10">
        
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">
            My Profile
          </h1>

          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition"
          >
            Logout
          </button>
        </div>

        {/* USER INFO */}
        <div className="space-y-4">
          
          <div>
            <p className="text-sm text-gray-500">Name</p>
            <p className="text-lg font-medium text-gray-800">
              {user.name}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="text-lg font-medium text-gray-800">
              {user.email}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Role</p>
            <p className="text-lg font-medium text-gray-800 capitalize">
              {user.role}
            </p>
          </div>

        </div>
        <AddressSection />

      </div>
    </div>
  );
}