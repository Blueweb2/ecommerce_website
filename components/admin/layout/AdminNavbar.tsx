"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth/useAuthStore";
import { LogOut, User, Settings, Key } from "lucide-react";

export default function AdminNavbar() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    router.push("/admin-login");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: any) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="h-16 bg-white border-b flex items-center justify-between px-6">
      <h2 className="text-lg font-semibold">Dashboard</h2>

      <div className="relative" ref={dropdownRef}>
        {/* Profile Button */}
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 text-gray-700 hover:text-black"
        >
          <User size={18} />
          <span className="text-sm">{user?.name}</span>
        </button>

        {/* Dropdown */}
        {open && (
          <div className="absolute right-0 mt-2 w-52 bg-white border rounded-lg shadow-lg py-2 z-50">
            
            <button
              onClick={() => {
                router.push("/admin/profile");
                setOpen(false);
              }}
              className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
            >
              <Settings size={16} />
              Profile Settings
            </button>

            <button
              onClick={() => {
                router.push("/admin/change-email");
                setOpen(false);
              }}
              className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
            >
              <User size={16} />
              Change Email
            </button>

            <button
              onClick={() => {
                router.push("/admin/change-password");
                setOpen(false);
              }}
              className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100"
            >
              <Key size={16} />
              Change Password
            </button>

            <div className="border-t my-2"></div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-gray-100"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}