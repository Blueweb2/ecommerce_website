"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import api from "@/lib/api/axios";
import { useAuthStore } from "@/store/auth/useAuthStore";
import { setAccessToken } from "@/lib/auth";

export default function AdminLoginPage() {
  const router = useRouter();
  const { setUser, user } = useAuthStore();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  // 🔥 Redirect if already logged in


  useEffect(() => {
    if (user && (user.role === "admin" || user.role === "superadmin")) {
      router.replace("/admin/dashboard");
    }
  }, [user]);

// const handleLogin = async (e: any) => {
//   e.preventDefault();
//   setLoading(true);

//   try {
//     const emailNormalized = form.email.trim().toLowerCase();

//     const res = await api.post("/auth/login", {
//       email: emailNormalized,
//       password: form.password,
//     });

//     toast.success(res.data.message || "OTP sent");

//     router.push(`/verify-otp?email=${encodeURIComponent(emailNormalized)}&admin=true`);

//   } catch (error: any) {
//     toast.error(error?.response?.data?.message || "Login failed");
//   } finally {
//     setLoading(false);
//   }
const handleLogin = async (e: any) => {
  e.preventDefault();
  setLoading(true);

  try {
    const emailNormalized = form.email.trim().toLowerCase();

    const res = await api.post("/auth/login", {
      email: emailNormalized,
      password: form.password,
    });

    toast.success(res.data.message || "OTP sent");

    // 🔥 DEV MODE OTP DISPLAY
    if (res.data.otp) {
      alert(`DEV OTP: ${res.data.otp}`);
      console.log("OTP:", res.data.otp);
    }

    router.push(`/verify-otp?email=${encodeURIComponent(emailNormalized)}&admin=true`);

  } catch (error: any) {
    toast.error(error?.response?.data?.message || "Login failed");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] to-[#1a1f1a] px-4">
      <div className="w-full max-w-md bg-white/95 backdrop-blur rounded-2xl shadow-xl p-8 space-y-6">

        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Admin Login
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Access your dashboard
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">

          {/* Email */}
          <div>
            <label className="text-sm text-gray-600">Email</label>
            <input
              type="email"
              required
              placeholder="admin@example.com"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-sm text-gray-600">Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400">
          Admin access only
        </p>
      </div>
    </div>
  );
}
