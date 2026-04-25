"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import api from "@/lib/api/axios";
import axios from "axios";
import { setAccessToken } from "@/lib/auth";
import { useAuthStore } from "@/store/auth/useAuthStore";

export default function VerifyOtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useAuthStore();

  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // 🚨 Redirect if no email
  useEffect(() => {
    if (!email) {
      toast.error("Invalid access. Please login again");
      router.push("/login");
    }
  }, [email, router]);

  // 🔥 Auto focus first input
  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  // ⏱️ Cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // 👉 move forward
    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }

    // 🔥 auto submit when full
    const otpValue = newOtp.join("");
    if (otpValue.length === 6 && !otpValue.includes("")) {
      setTimeout(() => handleVerify(otpValue), 300);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pasted)) return;

    const newOtp = pasted.split("");
    setOtp(newOtp);

    // 🔥 focus last
    setTimeout(() => {
      inputsRef.current[5]?.focus();
    }, 0);
  };

  const handleVerify = async (otpParam?: string) => {
    const otpValue = otpParam || otp.join("");

    if (otpValue.length !== 6) {
      return toast.error("Enter complete 6-digit OTP");
    }

    try {
      setLoading(true);

      const res = await api.post("/auth/verify-otp", {
        email,
        otp: otpValue,
      });

      const { accessToken, user } = res.data;

      setAccessToken(accessToken);
      setUser(user);

      toast.success("Verified successfully 🎉");

      router.replace("/");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Verification failed");
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0) return;

    try {
      await api.post("/auth/resend-otp", { email });
      toast.success("OTP resent successfully");
      setCooldown(30);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to resend OTP");
      } else {
        toast.error("Something went wrong");
      }
    }
  };

  const otpValue = otp.join("");

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl bg-[#f8f6f2] p-8 shadow-2xl space-y-6">

        {/* HEADER */}
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-[#1a1f1a]">
            Verify OTP
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            Enter the code sent to your email
          </p>
          <p className="text-xs text-gray-400 mt-1 break-all">
            {email}
          </p>
        </div>

        {/* OTP INPUT */}
        <div className="flex justify-between gap-2" onPaste={handlePaste}>
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputsRef.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-12 h-12 text-center text-xl font-semibold border rounded-lg focus:ring-2 focus:ring-[#d4af37] outline-none"
            />
          ))}
        </div>

        {/* VERIFY BUTTON */}
        <button
          onClick={() => handleVerify()}
          disabled={loading || otpValue.length !== 6}
          className="w-full rounded-lg bg-[#1a1f1a] py-2 text-white hover:bg-black transition disabled:opacity-50"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        {/* RESEND */}
        <div className="text-center">
          <button
            onClick={handleResend}
            disabled={cooldown > 0}
            className="text-sm text-[#d4af37] hover:underline disabled:opacity-50"
          >
            {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend OTP"}
          </button>
        </div>

      </div>
    </div>
  );
}