"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDesignerAuthStore } from "@/store/designer/useDesignerAuthStore";
import { designerLogin } from "@/lib/api/designer-portal.api";
import { persistVendorToken } from "@/lib/vendor/auth";
import {
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";

export default function DesignerLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const { login, setLoading, loading, error, setError, setDesigner } = useDesignerAuthStore();
  useEffect(() => {
  console.log("designerToken", localStorage.getItem("designerToken"));
  console.log("accessToken", localStorage.getItem("accessToken"));
}, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      const data = await designerLogin({ email, password });

      if (!data.success) {
        throw new Error(data.message || "Login failed");
      }

      if (data.token) {
        login(data.token, data.data);
      } else {
        setDesigner(data.data);
        localStorage.setItem(
          "designer",
          JSON.stringify(data.data)
        );
      }

console.log("Designer Token:", localStorage.getItem("designerToken"));
console.log("Access Token:", localStorage.getItem("accessToken"));
console.log("Designer Data:", data.data);
      router.push("/designer/dashboard");
    } catch (err: unknown) {
      const message =
        err &&
          typeof err === "object" &&
          "response" in err
          ? (err as any)?.response?.data?.message
          : err instanceof Error
            ? err.message
            : "Failed to login";

      setError(message);
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100">
              <span className="text-2xl font-bold text-emerald-600">
                D
              </span>
            </div>

            <h1 className="text-3xl font-bold text-slate-900">
              Designer Portal
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Welcome back! Sign in to manage your products,
              orders, and brand.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4">
              <p className="text-sm font-medium text-red-600">
                {error}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Email Address
              </label>

              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 transition-all focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-100"
              />
            </div>

            {/* Password */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-700">
                  Password
                </label>

                <button
                  type="button"
                  className="text-xs text-emerald-600 hover:text-emerald-700"
                >
                  Forgot Password?
                </button>
              </div>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pr-12 text-slate-900 transition-all focus:border-emerald-500 focus:outline-none focus:ring-4 focus:ring-emerald-100"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
                >
                  {showPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 px-4 py-3 font-semibold text-white transition-all hover:shadow-lg hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 border-t border-slate-100 pt-6 text-center">
            <p className="text-xs text-slate-500">
              Secure Designer Management Portal
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
