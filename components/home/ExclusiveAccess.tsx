"use client";

import { useState } from "react";
import { Bodoni_Moda, Inter } from 'next/font/google';
import { newsletterAPI } from "@/lib/api/newsletter.api";
import toast from "react-hot-toast";

const inter = Inter({
  subsets: ['latin'],
});

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function ExclusiveAccess() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      toast.error("Please enter your email address.");
      return;
    }

    if (!validateEmail(trimmedEmail)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    try {
      setLoading(true);
      const response = await newsletterAPI.subscribe(trimmedEmail);

      if (response.data.success) {
        toast.success("Thank you for subscribing!");
        setEmail("");
      }
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to subscribe. Please try again.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-[#f5f5f5] pb-3 lg:pb-16 lg:pt-5">
      <div className="max-w-2xl mx-auto px-4 text-center">
        {/* TITLE */}
        <h2 className={`${bodoni.className} text-2xl text-neutral-600 font-semibold mb-3`}>
          Exclusive Access
        </h2>

        {/* DESCRIPTION */}
        <p className={`${inter.className} text-sm text-[#8D8B9D] mb-6`}>
          Get updates on new designs, trends, and special offers straight to
          your inbox.
        </p>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="flex items-stretch border border-gray-300 rounded-md overflow-hidden bg-white max-w-md mx-auto"
        >
          <input
            type="email"
            placeholder="example@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            className="flex-1 px-4 py-3 outline-none text-sm disabled:bg-gray-50"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white px-6 py-3 text-sm font-semibold uppercase tracking-wider transition hover:bg-neutral-800 disabled:bg-gray-400 disabled:cursor-not-allowed min-w-[120px]"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>
            ) : (
              "Subscribe"
            )}
          </button>
        </form>

        <p className="mt-4 text-[11px] text-gray-400">
          By subscribing, you agree to our Privacy Policy and consent to receive
          updates from us.
        </p>
      </div>
    </section>
  );
}