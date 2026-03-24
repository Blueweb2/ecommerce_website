"use client";

import { useAdminAuthStore } from "@/store/admin/useAdminAuthStore";

export default function ProfilePage() {
  const { user } = useAdminAuthStore();

  return (
    <div className="p-6 max-w-xl bg-white rounded-2xl shadow">
      <h2 className="text-xl font-semibold mb-4">My Profile</h2>

      <div className="space-y-3 text-gray-700">
        <p><strong>Name:</strong> {user?.name}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Role:</strong> {user?.role}</p>
      </div>
    </div>
  );
}