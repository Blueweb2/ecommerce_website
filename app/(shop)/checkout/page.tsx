"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuthStore } from "@/store/auth/useAuthStore";
import { useCartStore } from "@/store/user/cart/useCartStore";

export default function CheckoutEntryPage() {
  const router = useRouter();
  const { initialized, isAuthenticated } = useAuthStore();
  const { items, hydrated, ensureServerCartForCheckout } = useCartStore();

  useEffect(() => {
    if (!initialized || !hydrated) {
      return;
    }

    const proceedToCheckout = async () => {
      if (items.length === 0) {
        router.replace("/cart");
        return;
      }

      if (isAuthenticated) {
        const cartReady = await ensureServerCartForCheckout();

        if (!cartReady) {
          router.replace("/cart");
          return;
        }
      }

      router.replace(
        isAuthenticated
          ? "/checkout/shipping-address"
          : "/checkout/login"
      );
    };

    void proceedToCheckout();
  }, [
    ensureServerCartForCheckout,
    hydrated,
    initialized,
    isAuthenticated,
    items.length,
    router,
  ]);

  return null;
}
