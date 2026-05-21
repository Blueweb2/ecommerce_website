"use client";

import Link from "next/link";
import { FormEvent, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";
import api from "@/lib/api/axios";
import { Lock, Eye, EyeOff, ShieldCheck, ArrowRight } from "lucide-react";
import { bodoni, inter } from "@/lib/fonts";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [checks, setChecks] = useState({
    length: false,
    uppercase: false,
    number: false,
  });

  // Track validation changes
  useEffect(() => {
    setChecks({
      length: password.length >= 6,
      uppercase: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
    });
  }, [password]);

  // Redirect if params missing
  useEffect(() => {
    if (!email || !token) {
      toast.error("Invalid reset link. Request a new password reset.");
      router.push("/account/forgot-password");
    }
  }, [email, token, router]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      return toast.error("Please fill all fields");
    }

    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    if (!checks.length || !checks.uppercase || !checks.number) {
      return toast.error("Please meet all password requirements");
    }

    try {
      setLoading(true);

      await api.post("/auth/reset-password", {
        email: email.trim().toLowerCase(),
        token,
        newPassword: password,
      });

      toast.success("Password reset successfully 🎉");
      router.push("/account/login");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Failed to reset password"
        );
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen bg-[#f3f3f1] ${inter.className}`}>
      
      {/* TOP BAR */}
      <div className="border-b border-[#e5e5e5] bg-white py-2 text-center text-[11px] tracking-wide text-[#666]">
        Secure Account Password Recovery
      </div>

      {/* HEADER */}
      <header className="bg-black text-white">
        <div className="mx-auto flex h-[82px] max-w-[1400px] items-center justify-between px-6 lg:px-12">
          <div className="hidden lg:block text-sm">
            Italy
          </div>

          <h1 className={`text-[34px] tracking-[0.22em] ${bodoni.className}`}>
            GOLDLAND
          </h1>

          <div className="hidden items-center gap-6 text-sm lg:flex">
            <span>Search</span>
            <span>Wishlist</span>
            <span>Bag</span>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex justify-center px-4 py-20">
        <div className="w-full max-w-[430px]">
          
          <div className="mb-10">
            <h2 className={`text-[42px] font-light text-black leading-tight ${bodoni.className}`}>
              Create new password
            </h2>
            <p className="mt-3 text-[13px] leading-6 text-[#666]">
              Please choose a strong, secure password for your account linked to:
            </p>
            <p className="text-[13px] font-semibold text-black break-all mt-1">
              {email}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* New Password */}
            <div>
              <label className="mb-2 block text-[13px] font-medium text-black">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#777]" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="h-[50px] w-full border border-[#d7d7d7] bg-white pl-11 pr-12 text-sm text-black outline-none transition focus:border-black"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#777]"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="mb-2 block text-[13px] font-medium text-black">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#777]" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  className="h-[50px] w-full border border-[#d7d7d7] bg-white pl-11 pr-4 text-sm text-black outline-none transition focus:border-black"
                />
              </div>
            </div>

            {/* PASSWORD CHECKS */}
            {password && (
              <div className="space-y-2 border border-[#e5e5e5] bg-white p-4">
                <div className="flex items-center gap-2 text-[12px]">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      checks.length ? "bg-green-600" : "bg-gray-300"
                    }`}
                  />
                  <span className="text-[#444]">
                    At least 6 characters
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[12px]">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      checks.uppercase ? "bg-green-600" : "bg-gray-300"
                    }`}
                  />
                  <span className="text-[#444]">
                    One uppercase letter
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[12px]">
                  <span
                    className={`h-2 w-2 rounded-full ${
                      checks.number ? "bg-green-600" : "bg-gray-300"
                    }`}
                  />
                  <span className="text-[#444]">
                    One number
                  </span>
                </div>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="h-[50px] w-full bg-black text-sm font-medium text-white transition hover:bg-[#222] disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {loading ? "Resetting Password..." : "Update Password"}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </button>

          </form>

          <div className="mt-8 text-center">
            <Link
              href="/account/login"
              className="text-[13px] text-black underline underline-offset-4 hover:text-[#555]"
            >
              Back to Sign in
            </Link>
          </div>

        </div>
      </main>

      {/* FOOTER */}
      <footer className="mt-20 border-t border-[#e5e5e5] bg-[#ececeb]">
        <div className="mx-auto grid max-w-[1400px] gap-10 px-6 py-14 lg:grid-cols-2 lg:px-12">
          <div>
            <h3 className={`text-[30px] font-light text-black ${bodoni.className}`}>
              Secure Recovery
            </h3>
            <p className="mt-4 max-w-md text-[13px] leading-6 text-[#666]">
              If you have any difficulty updating your credentials, please feel free to reach out.
            </p>
          </div>
          <div className="lg:pl-20">
            <h4 className="text-[13px] font-semibold uppercase tracking-wide text-black">
              Need Help?
            </h4>
            <p className="mt-4 text-[13px] leading-6 text-[#666]">
              Our customer care team is available 24/7.
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
