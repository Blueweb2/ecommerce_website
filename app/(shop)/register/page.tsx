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

  const [restoredMessage, setRestoredMessage] =
    useState("");
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

      const res = await api.post("/auth/register", {
        name: form.name.trim(),
        email: emailNormalized,
        password: form.password,
        phone: form.phone.trim() || undefined,
      });

      if (res.data.restored) {
        toast.success(
          "Welcome back! Your account has been restored."
        );
      } else {
        toast.success(
          "OTP sent to your email"
        );
      }
      if (res.data.restored) {
        setRestoredMessage(
          "We found a previously closed account associated with this email and restored it for you."
        );
      }

      if (res.data.restored) {
        router.push(
          `/verify-otp?email=${emailNormalized}&restored=true`
        );
      } else {
        router.push(
          `/verify-otp?email=${emailNormalized}`
        );
      }
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
  <div className={`min-h-screen bg-[#f3f3f1] ${inter.className} mt-8 md:mt-20`}>

      {/* REGISTER FORM */}
      <main className="flex justify-center px-4 py-16">
        <div className="w-full max-w-[420px]">

          <h2
            className={`mb-10 text-[42px] font-light text-black ${bodoni.className}`}
          >
            Register
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* EMAIL */}
            <div>
              <label className="mb-2 block text-[13px] font-medium text-black">
                Email
              </label>

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#777]" />

                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange("email")}
                  disabled={loading}
                  className="h-[48px] w-full border border-[#d7d7d7] bg-white pl-11 pr-4 text-sm outline-none transition focus:border-black"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label className="mb-2 block text-[13px] font-medium text-black">
                Password
              </label>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#777]" />

                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={form.password}
                  onChange={handleChange("password")}
                  disabled={loading}
                  className="h-[48px] w-full border border-[#d7d7d7] bg-white pl-11 pr-12 text-sm outline-none transition focus:border-black"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#777]"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              <p className="mt-2 text-[12px] leading-5 text-[#666]">
                Your password must contain at least 6 characters,
                one uppercase letter and one number.
              </p>
            </div>

            {/* FULL NAME */}
            <div>
              <label className="mb-2 block text-[13px] font-medium text-black">
                Full Name
              </label>

              <div className="relative">
                <User className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#777]" />

                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={handleChange("name")}
                  disabled={loading}
                  className="h-[48px] w-full border border-[#d7d7d7] bg-white pl-11 pr-4 text-sm outline-none transition focus:border-black"
                />
              </div>
            </div>

            {/* PHONE */}
            <div>
              <label className="mb-2 block text-[13px] font-medium text-black">
                Phone Number
              </label>

              <div className="relative">
                <Phone className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#777]" />

                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={handleChange("phone")}
                  disabled={loading}
                  className="h-[48px] w-full border border-[#d7d7d7] bg-white pl-11 pr-4 text-sm outline-none transition focus:border-black"
                />
              </div>
            </div>

            {/* PASSWORD CHECKS */}
            {form.password && (
              <div className="space-y-2 border border-[#e5e5e5] bg-white p-4">
                <div className="flex items-center gap-2 text-[12px]">
                  <span
                    className={`h-2 w-2 rounded-full ${checks.length ? "bg-green-600" : "bg-gray-300"
                      }`}
                  />
                  <span className="text-[#444]">
                    At least 6 characters
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[12px]">
                  <span
                    className={`h-2 w-2 rounded-full ${checks.uppercase ? "bg-green-600" : "bg-gray-300"
                      }`}
                  />
                  <span className="text-[#444]">
                    One uppercase letter
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[12px]">
                  <span
                    className={`h-2 w-2 rounded-full ${checks.number ? "bg-green-600" : "bg-gray-300"
                      }`}
                  />
                  <span className="text-[#444]">
                    One number
                  </span>
                </div>
              </div>
            )}

            {/* NEWSLETTER */}
            <div className="flex items-start gap-3 pt-2">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 border border-black accent-black"
              />

              <p className="text-[12px] leading-5 text-[#333]">
                Sign up to receive exclusive ZENFAZ updates,
                promotions and early access to new collections.
              </p>
            </div>

            {/* TERMS */}
            <p className="text-[11px] leading-5 text-[#777]">
              By clicking "Create Account" you agree to our
              Terms & Conditions and Privacy Policy.
            </p>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className="mt-4 h-[50px] w-full bg-black text-sm font-medium text-white transition hover:bg-[#222] disabled:opacity-70"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          {/* LOGIN LINK */}
          <div className="mt-10 border-t border-[#dddddd] pt-8 text-center">
            <p className="text-[14px] text-[#555]">
              Already have an account?
            </p>

            <Link
              href="/account/login"
              className="mt-3 inline-block text-[14px] font-medium text-black underline underline-offset-4"
            >
              Sign In
            </Link>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="mt-20 border-t border-[#e5e5e5] bg-[#ececeb]">
        <div className="mx-auto grid max-w-[1400px] gap-10 px-6 py-14 lg:grid-cols-2 lg:px-12">

          <div>
            <h3
              className={`text-[30px] font-light text-black ${bodoni.className}`}
            >
              Enjoy 10% off your next order
            </h3>

            <p className="mt-4 max-w-md text-[13px] leading-6 text-[#666]">
              Claim your exclusive ZENFAZ discount code when you
              subscribe to our newsletter.
            </p>

            <div className="mt-6 flex max-w-md">
              <input
                type="email"
                placeholder="your@email.com"
                className="h-[48px] flex-1 border border-[#cfcfcf] bg-white px-4 text-sm outline-none"
              />

              <button className="h-[48px] border border-l-0 border-black bg-black px-6 text-sm text-white">
                Sign Up
              </button>
            </div>
          </div>

          <div className="lg:pl-20">
            <h4 className="text-[13px] font-semibold uppercase tracking-wide text-black">
              Need Help?
            </h4>

            <p className="mt-4 text-[13px] leading-6 text-[#666]">
              For any enquiries please contact our customer care team.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}