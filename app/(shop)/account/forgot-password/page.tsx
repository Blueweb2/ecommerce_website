// app/account/forgot-password/page.tsx

"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import api from "@/lib/api/axios";
import { Mail } from "lucide-react";
import { bodoni, inter } from "@/lib/fonts";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email) {
      return toast.error("Please enter your email");
    }

    try {
      setLoading(true);

      await api.post("/auth/forgot-password", {
        email: email.trim().toLowerCase(),
      });

      toast.success("Password reset link sent to your email");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message ||
            "Failed to send reset link"
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

     <header className="border-b pt-52 border-[#e5e5e5] bg-[#ececeb]">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center gap-2">
          <Mail className="h-5 w-5 text-[#777]" />
          <span className="text-sm text-[#777]">Need help? Contact support</span>
        </div>
      </header>
 

      {/* MAIN */}
      <main className="flex justify-center px-4 pt-84 pb-20">
        <div className="w-full max-w-[430px]">

          {/* TITLE */}
          <div className="mb-10">
            <h2
              className={`text-[42px] font-light text-black ${bodoni.className}`}
            >
              Reset password
            </h2>

            <p className="mt-3 text-[13px] leading-6 text-[#666]">
              We&apos;ll send you an email with a link to create a new password.
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-6">

            <div>
              <label className="mb-2 block text-[13px] font-medium text-black">
                Email
              </label>

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#777]" />

                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  placeholder="Enter your email"
                  className="h-[50px] w-full border border-[#d7d7d7] bg-white pl-11 pr-4 text-sm text-black outline-none transition focus:border-black"
                />
              </div>
            </div>

            {/* BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="h-[50px] w-full bg-black text-sm font-medium text-white transition hover:bg-[#222] disabled:opacity-70"
            >
              {loading ? "Sending..." : "Send reset link"}
            </button>

          </form>

          {/* BACK */}
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
            <h3
              className={`text-[30px] font-light text-black ${bodoni.className}`}
            >
              Need assistance?
            </h3>

            <p className="mt-4 max-w-md text-[13px] leading-6 text-[#666]">
              Our customer care team is available to help with password recovery,
              account access, and order support.
            </p>

            <div className="mt-6 flex max-w-md">
              <input
                type="email"
                placeholder="your@email.com"
                className="h-[48px] flex-1 border border-[#cfcfcf] bg-white px-4 text-sm outline-none"
              />

              <button className="h-[48px] border border-l-0 border-black bg-black px-6 text-sm text-white">
                Subscribe
              </button>
            </div>
          </div>

          <div className="lg:pl-20">
            <h4 className="text-[13px] font-semibold uppercase tracking-wide text-black">
              Customer Care
            </h4>

            <p className="mt-4 text-[13px] leading-6 text-[#666]">
              Contact our support specialists for any assistance regarding
              your account or orders.
            </p>
          </div>

        </div>
      </footer>

    </div>
  );
}