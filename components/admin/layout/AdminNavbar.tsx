"use client";

import { useRouter } from "next/navigation";
import { useAdminAuthStore } from "@/store/admin/useAdminAuthStore";
import { LogOut } from "lucide-react";

export default function AdminNavbar() {
  const { user, logout } = useAdminAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/admin/login"); // ✅ redirect here
  };

  return (
    <div className="h-16 bg-white border-b flex items-center justify-between px-6">
      <h2 className="text-lg font-semibold">Dashboard</h2>

      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">
          {user?.name}
        </span>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-red-600 hover:text-red-800"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );
}