"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import CheckoutAddress from "@/components/checkout/CheckoutAddress";
import CheckoutContainer from "@/components/checkout/new/CheckoutContainer";
import CheckoutSteps from "@/components/checkout/new/CheckoutSteps";
import { bodoni } from "@/lib/fonts";
import { setStoredCheckoutAddress } from "@/lib/utils/checkoutSession";
import { useAuthStore } from "@/store/auth/useAuthStore";
import { useCartStore } from "@/store/user/cart/useCartStore";
import type { Address } from "@/types/address";

export default function ShippingAddressPage() {
  const router = useRouter();
  const { initialized, isAuthenticated } = useAuthStore();
  const { items } = useCartStore();
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

  useEffect(() => {
    if (!initialized) {
      return;
    }

    if (items.length === 0) {
      router.replace("/cart");
      return;
    }

    if (!isAuthenticated) {
      router.replace("/checkout/login");
    }
  }, [initialized, isAuthenticated, items.length, router]);

  const handleContinue = () => {
    if (!selectedAddress) {
      toast.error("Please select a delivery address to continue.");
      return;
    }

    setStoredCheckoutAddress(selectedAddress);
    router.push("/checkout/packaging-options");
  };

  if (!initialized || items.length === 0) {
    return null;
  }

  return (
    <CheckoutContainer>
      <CheckoutSteps step={1} />

      <h1 className={`mb-8 text-[38px] font-light text-black ${bodoni.className}`}>
        Shipping Details
      </h1>

      <CheckoutAddress onSelect={setSelectedAddress} />

      <button
        onClick={handleContinue}
        className="mt-8 flex h-[54px] w-full items-center justify-center bg-black text-sm uppercase tracking-[0.15em] text-white transition hover:bg-[#222]"
      >
        Continue
      </button>
    </CheckoutContainer>
  );
}
