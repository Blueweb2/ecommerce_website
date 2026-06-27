"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import api from "@/lib/api/axios";
import axios from "axios";
import { setAccessToken } from "@/lib/auth";
import { setStoredCheckoutMode } from "@/lib/utils/checkoutSession";
import { useAuthStore } from "@/store/auth/useAuthStore";
import { useCartStore } from "@/store/user/cart/useCartStore";

export default function VerifyOtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setUser } = useAuthStore();
  const mergeCart = useCartStore((state) => state.mergeCart);

  const email = searchParams.get("email") || "";
  const isAdminFlow = searchParams.get("admin") === "true";
  const step = searchParams.get("step") || "email";
  const redirect = searchParams.get("redirect") || "";
  const restored = searchParams.get("restored") === "true";

  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Redirect if no email
  useEffect(() => {
    if (!email) {
      toast.error("Invalid access. Please login again");
      if (redirect === "/checkout") {
        router.push("/checkout/login");
      } else {
        router.push("/account/login");
      }
    }
  }, [email, router, redirect]);

  //  Auto focus first input
  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  // Cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return;

    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  // Handle OTP typing
  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }

    const otpValue = newOtp.join("");
    if (otpValue.length === 6 && !otpValue.includes("")) {
      setTimeout(() => handleVerify(otpValue), 300);
    }
  };

  // Backspace navigation
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  // Paste OTP
  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pasted)) return;

    const newOtp = pasted.split("");
    setOtp(newOtp);

    setTimeout(() => {
      inputsRef.current[5]?.focus();
      if (pasted.length === 6) {
        handleVerify(pasted);
      }
    }, 0);
  };

  //  VERIFY OTP
  const handleVerify = async (otpParam?: string) => {
    const otpValue = otpParam || otp.join("");

    if (otpValue.length !== 6) {
      return toast.error("Enter complete 6-digit OTP");
    }

    try {
      setLoading(true);

      const endpoint = step === "phone" ? "/auth/verify-phone-otp" : "/auth/verify-otp";

      const res = await api.post(endpoint, {
        email,
        otp: otpValue,
      });

      const { accessToken, user, phoneVerified } = res.data;

      //  If Email verified but Phone is NOT verified yet, redirect to Phone Verification step
      if (step === "email" && phoneVerified === false) {
        toast.success("Email verified successfully! 🎉");
        setOtp(["", "", "", "", "", ""]);
        let nextUrl = `/verify-otp?email=${email}&step=phone`;
        if (redirect) {
          nextUrl += `&redirect=${encodeURIComponent(redirect)}`;
        }
        router.replace(nextUrl);
        return;
      }

      if (!accessToken || !user) {
        throw new Error("Invalid response from server");
      }

      //  Save auth
      setAccessToken(accessToken);
      setUser(user);

      if (redirect.startsWith("/checkout")) {
  setStoredCheckoutMode("account");

  const cartItems = useCartStore.getState().items;

  if (cartItems.length > 0) {
    await mergeCart();
  }
}

      toast.success("Verified successfully 🎉");

      // ROLE-BASED SECURITY
      if (isAdminFlow) {
        if (user.role !== "admin" && user.role !== "superadmin") {
          toast.error("Access denied: Admin only");
          return;
        }

        router.replace("/admin/dashboard");
      } else {
        router.replace(redirect || "/account"); // Redirect to custom page (like /checkout) or fallback to dashboard /profile
      }

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

  // RESEND OTP
  const handleResend = async () => {
    if (cooldown > 0) return;

    try {
      const endpoint = step === "phone" ? "/auth/resend-phone-otp" : "/auth/resend-otp";
      await api.post(endpoint, { email });
      toast.success(step === "phone" ? "Phone OTP resent successfully" : "Email OTP resent successfully");
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

        {restored && (
  <div className="rounded-lg border border-[#d4af37]/30 bg-[#fffdf6] p-4">
    <h3 className="text-[16px] font-medium text-[#1a1f1a] mb-2">
      Welcome Back
    </h3>

    <p className="text-[13px] leading-6 text-[#555]">
      We found a previously closed account associated with this
      email and restored it for you. Please verify your email to
      continue.
    </p>
  </div>
)}

        {/* HEADER */}
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-[#1a1f1a]">
            {step === "phone" ? "Verify Mobile" : (isAdminFlow ? "Admin Verification" : "Verify OTP")}
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            {step === "phone" ? "Enter the code sent to your mobile number" : "Enter the code sent to your email"}
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
