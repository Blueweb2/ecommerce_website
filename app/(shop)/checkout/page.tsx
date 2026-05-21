"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuthStore } from "@/store/auth/useAuthStore";
import { useCartStore } from "@/store/user/cart/useCartStore";

export default function CheckoutEntryPage() {
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

    router.replace(
      isAuthenticated
        ? "/checkout/shipping-address"
        : "/checkout/login"
    );
  }, [initialized, isAuthenticated, items.length, router]);

  return null;
}
