"use client";

import Link from "next/link";
import { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import api from "@/lib/api/axios";
import axios from "axios";
import { User, Mail, Phone, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { bodoni, inter } from "@/lib/fonts";

type RegisterForm = {
  name: string;
  email: string;
  password: string;
  phone: string;
};

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState<RegisterForm>({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const checks = {
    length: form.password.length >= 6,
    uppercase: /[A-Z]/.test(form.password),
    number: /\d/.test(form.password),
  };

  const handleChange =
    (field: keyof RegisterForm) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      setForm((current) => ({
        ...current,
        [field]: event.target.value,
      }));
    };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // 🔥 Validation
    if (!form.name || !form.email || !form.password || !form.phone) {
      return toast.error("Please fill all required fields");
    }

    if (!checks.length) {
      return toast.error("Password must be at least 6 characters");
    }

    if (!checks.uppercase) {
      return toast.error("Password must contain at least one uppercase letter");
    }

    if (!checks.number) {
      return toast.error("Password must contain at least one number");
    }

    setLoading(true);

    try {
      const emailNormalized = form.email.trim().toLowerCase();

      await api.post("/auth/register", {
        name: form.name.trim(),
        email: emailNormalized,
        password: form.password,
        phone: form.phone.trim() || undefined,
      });

      toast.success("OTP sent to your email");

      // ✅ redirect to OTP page
      router.push(`/verify-otp?email=${emailNormalized}`);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Registration failed");
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-[#0c130e] via-[#12251a] to-[#0c130e] px-4 py-42 flex items-center justify-center ${inter.className}`}>
      <div className="w-full max-w-5xl overflow-hidden rounded-[2rem] bg-[#f8f6f2] shadow-2xl flex min-h-[600px]">

        {/* LEFT PANEL */}
        <section className="hidden flex-1 bg-[linear-gradient(145deg,#0d1a12_0%,#1a2a1f_55%,#614b19_100%)] p-12 text-white lg:flex lg:flex-col lg:justify-between relative overflow-hidden">
          {/* Decorative radial glows */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-[#d4af37]/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-emerald-500/5 blur-3xl pointer-events-none" />
          
          <div className="relative z-10">
            <span className="text-xs uppercase tracking-[0.4em] font-semibold text-[#e3c67c] border-b border-[#e3c67c]/20 pb-2 inline-block">
              Zenfaz
            </span>
            <h1 className={`mt-8 text-4xl font-light leading-tight text-white ${bodoni.className}`}>
              Create your account and start building your jewelry wishlist.
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-emerald-100/70">
              Save favorites, track your orders, and check out faster with custom designs.
            </p>
          </div>

          <div className="relative z-10 rounded-[1.5rem] border border-white/10 bg-white/5 p-6 backdrop-blur-md">
            <p className="text-sm font-semibold tracking-wide text-[#e3c67c]">
              Password Security Tips
            </p>
            <ul className="mt-3 space-y-2 text-xs text-emerald-100/80 list-disc list-inside">
              <li>Use at least 6 characters</li>
              <li>Include one uppercase letter</li>
              <li>Add at least one number</li>
            </ul>
          </div>
        </section>

        {/* FORM */}
        <section className="flex w-full flex-1 items-center justify-center p-8 sm:p-12">
          <div className="w-full max-w-md space-y-6">

            <div className="text-center lg:text-left">
              <h2 className={`text-3xl font-normal tracking-tight text-[#1a1f1a] ${bodoni.className}`}>
                Create Account
              </h2>
              <p className="mt-2 text-sm text-[#5C5A58]">
                Join zenfaz to shop and manage your orders.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <User className="h-4.5 w-4.5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={handleChange("name")}
                    disabled={loading}
                    placeholder="John Doe"
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] outline-none transition-all placeholder:text-slate-400 text-[#1a1f1a] text-sm"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1">
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
                    onChange={handleChange("email")}
                    disabled={loading}
                    placeholder="john.doe@example.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] outline-none transition-all placeholder:text-slate-400 text-[#1a1f1a] text-sm"
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Phone className="h-4.5 w-4.5 text-slate-400" />
                  </div>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={handleChange("phone")}
                    disabled={loading}
                    placeholder="1234567890"
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] outline-none transition-all placeholder:text-slate-400 text-[#1a1f1a] text-sm"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="h-4.5 w-4.5 text-slate-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={form.password}
                    onChange={handleChange("password")}
                    disabled={loading}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] outline-none transition-all placeholder:text-slate-400 text-[#1a1f1a] text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                  </button>
                </div>

                {/* Password strength checklist */}
                {form.password && (
                  <div className="mt-2 p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1.5 transition-all animate-fadeIn">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                      Password strength checklist:
                    </p>
                    <div className="flex items-center gap-2 text-xs">
                      <span className={`h-1.5 w-1.5 rounded-full ${checks.length ? "bg-emerald-500" : "bg-slate-300"}`} />
                      <span className={checks.length ? "text-emerald-700 font-medium" : "text-slate-500"}>At least 6 characters</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className={`h-1.5 w-1.5 rounded-full ${checks.uppercase ? "bg-emerald-500" : "bg-slate-300"}`} />
                      <span className={checks.uppercase ? "text-emerald-700 font-medium" : "text-slate-500"}>At least one uppercase letter</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className={`h-1.5 w-1.5 rounded-full ${checks.number ? "bg-emerald-500" : "bg-slate-300"}`} />
                      <span className={checks.number ? "text-emerald-700 font-medium" : "text-slate-500"}>At least one number</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-[#1a1f1a] py-3 text-white font-medium hover:bg-black transition-all shadow-md hover:shadow-lg disabled:opacity-70 flex items-center justify-center gap-2 text-sm mt-6 cursor-pointer"
              >
                {loading ? "Creating account..." : "Create Account"}
                {!loading && <ArrowRight className="h-4 w-4" />}
              </button>
            </form>

            <p className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link href="/login" className="text-[#d4af37] font-semibold hover:underline">
                Login
              </Link>
            </p>

          </div>
        </section>
      </div>
    </div>
  );
}