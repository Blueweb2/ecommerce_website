"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import LoginForm from "@/components/auth/LoginForm";
import CheckoutContainer from "@/components/checkout/new/CheckoutContainer";
import { bodoni, inter } from "@/lib/fonts";
import { useAuthStore } from "@/store/auth/useAuthStore";
import { useCartStore } from "@/store/user/cart/useCartStore";

export default function CheckoutLoginPage() {
  const router = useRouter();
  const { initialized, isAuthenticated } = useAuthStore();
  const { items } = useCartStore();

  useEffect(() => {
    if (!initialized) {
      return;
    }

    if (items.length === 0) {
      router.replace("/cart");
      return;
    }

    if (isAuthenticated) {
      router.replace("/checkout/shipping-address");
    }
  }, [initialized, isAuthenticated, items.length, router]);

  if (!initialized || items.length === 0) {
    return null;
  }

  return (
    <CheckoutContainer>
      <div className="pt-8">
        <h1 className={`text-[42px] font-light text-black ${bodoni.className}`}>
          Sign in to continue checkout
        </h1>

        <p className={`mt-4 max-w-xl text-[14px] leading-6 text-[#666] ${inter.className}`}>
          Use your ZENFAZ account to access saved delivery addresses and place your
          order securely.
        </p>

        <div className="mt-10 max-w-[460px] border border-[#d9d9d9] bg-white p-8">
          <LoginForm
            redirectPath="/checkout/shipping-address"
            buttonLabel="Sign In To Checkout"
          />

          <div className={`mt-8 border-t border-[#ececec] pt-6 text-sm text-[#666] ${inter.className}`}>
            Need an account?{" "}
            <Link href="/register" className="text-black underline underline-offset-4">
              Create one here
            </Link>
          </div>
        </div>
      </div>
    </CheckoutContainer>
  );
}
