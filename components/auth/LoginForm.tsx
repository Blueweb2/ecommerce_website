"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import api from "@/lib/api/axios";
import axios from "axios";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { inter } from "@/lib/fonts";

interface LoginFormProps {
  redirectPath?: string;
  buttonLabel?: string;
  onSuccess?: () => void;
}

export default function LoginForm({
  redirectPath = "/",
  buttonLabel = "Login",
  onSuccess,
}: LoginFormProps) {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
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

      if (onSuccess) {
        onSuccess();
      }

      // Build target OTP URL with redirect parameter
      let otpUrl = `/verify-otp?email=${emailNormalized}`;
      if (emailVerified === true && phoneVerified === false) {
        otpUrl += `&step=phone`;
      }
      if (redirectPath) {
        otpUrl += `&redirect=${encodeURIComponent(redirectPath)}`;
      }

      router.push(otpUrl);
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
    <form onSubmit={handleLogin} className={`space-y-5 ${inter.className}`}>
      {/* Email */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">
          Email Address
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Mail className="h-4.5 w-4.5 text-slate-400" />
          </div>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="john.doe@example.com"
            disabled={loading}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200  focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] outline-none transition-all placeholder:text-slate-400 text-[#1a1f1a] text-sm"
          />
        </div>
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">
            Password
          </label>
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Lock className="h-4.5 w-4.5 text-slate-400" />
          </div>
          <input
            type={showPassword ? "text" : "password"}
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            placeholder="••••••••"
            disabled={loading}
            className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-200  focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] outline-none transition-all placeholder:text-slate-400 text-[#1a1f1a] text-sm"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition cursor-pointer"
          >
            {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full  bg-[#1a1f1a] py-3 text-white font-medium hover:bg-black transition-all shadow-md hover:shadow-lg disabled:opacity-70 flex items-center justify-center gap-2 text-sm mt-6 cursor-pointer"
      >
        {loading ? "Sending Verification OTP..." : buttonLabel}
        {!loading && <ArrowRight className="h-4 w-4" />}
      </button>
    </form>
  );
}
