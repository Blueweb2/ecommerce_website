"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import api from "@/lib/api/axios";
import { setAccessToken } from "@/lib/auth";
import { useAuthStore } from "@/store/auth/useAuthStore";
import { useWishlistStore } from "@/store/user/wishlist/useWishlistStore";


export default function CustomerLoginPage() {
  const router = useRouter();
  const { setUser, user, loading: authLoading } = useAuthStore();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const { mergeWishlist, syncWishlist } = useWishlistStore.getState();

  // 🔥 Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user) {
      router.replace("/checkout");
    }
  }, [user, authLoading, router]);

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/auth/login", form);

      const { user, accessToken } = res.data;

      if (!user || !accessToken) {
        throw new Error("Invalid response from server");
      }

      setAccessToken(accessToken);
      setUser(user);

      toast.success("Welcome back!");
      router.replace("/checkout");
      await mergeWishlist();   // send guest wishlist
await syncWishlist();    // fetch backend wishlist
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] px-4">
      
      {/* Card */}
      <div className="w-full max-w-md bg-[#f8f6f2] rounded-2xl shadow-xl p-8 space-y-6">
        
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-[#1a1f1a]">
            Welcome Back
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Login to continue your purchase
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">

          {/* Email */}
          <div>
            <label className="text-sm text-gray-700">
              Email
            </label>
            <input
              type="email"
              required
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-sm text-gray-700">
              Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37]"
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1a1f1a] hover:bg-black text-white py-2 rounded-lg font-medium transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <div className="flex-1 h-px bg-gray-300" />
          OR
          <div className="flex-1 h-px bg-gray-300" />
        </div>

        {/* Register */}
        <p className="text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <span
            onClick={() => router.push("/register")}
            className="text-[#d4af37] cursor-pointer hover:underline"
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}