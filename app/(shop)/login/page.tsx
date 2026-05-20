"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import api from "@/lib/api/axios";
import axios from "axios";

export default function CustomerLoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: any) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      return toast.error("Please fill all fields");
    }

    setLoading(true);

    try {
      const emailNormalized = form.email.trim().toLowerCase();

      const res = await api.post("/auth/login", {
        email: emailNormalized,
        password: form.password,
      });

      const { emailVerified, phoneVerified, message } = res.data;

      toast.success(message || "OTP sent successfully");

      // 👉 redirect to correct OTP step
      if (emailVerified === true && phoneVerified === false) {
        router.push(`/verify-otp?email=${emailNormalized}&step=phone`);
      } else {
        router.push(`/verify-otp?email=${emailNormalized}`);
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Login failed");
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] px-4 mt-16">

      <div className="w-full max-w-md bg-[#f8f6f2] rounded-2xl shadow-xl p-8 space-y-6">

        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-[#1a1f1a]">
            Welcome Back
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Login to continue
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">

          <div>
            <label className="text-sm text-gray-700">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#d4af37]"
            />
          </div>

          <div>
            <label className="text-sm text-gray-700">Password</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#d4af37]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1a1f1a] hover:bg-black text-white py-2 rounded-lg transition"
          >
            {loading ? "Sending OTP..." : "Login"}
          </button>
        </form>

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