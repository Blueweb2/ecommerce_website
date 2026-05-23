"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import CheckoutContainer from "@/components/checkout/new/CheckoutContainer";
import CheckoutSteps from "@/components/checkout/new/CheckoutSteps";
import { bodoni } from "@/lib/fonts";
import {
  getShippingCharge,
  getStoredCheckoutAddress,
  getStoredCheckoutMode,
  getStoredShippingOption,
  setStoredShippingOption,
  type ShippingOption,
} from "@/lib/utils/checkoutSession";
import { useAuthStore } from "@/store/auth/useAuthStore";
import { useCartStore } from "@/store/user/cart/useCartStore";
import type { Address } from "@/types/address";

export default function ShippingOptionsPage() {
  const router = useRouter();
  const { initialized, isAuthenticated } = useAuthStore();
  const { items, hydrated } = useCartStore();
  const [checkoutMode] = useState(getStoredCheckoutMode);
  const [shippingOption, setShippingOption] = useState<ShippingOption>(
    () => getStoredShippingOption() ?? "standard"
  );
  const [shippingAddress] = useState<Address | null>(getStoredCheckoutAddress);

  useEffect(() => {
    if (!initialized || !hydrated) {
      return;
    }

    if (items.length === 0) {
      router.replace("/cart");
      return;
    }

    if (!isAuthenticated && checkoutMode !== "guest") {
      router.replace("/checkout/login");
      return;
    }

    if (!getStoredCheckoutAddress()) {
      router.replace("/checkout/shipping-address");
    }
  }, [checkoutMode, hydrated, initialized, isAuthenticated, items.length, router]);

  const handleContinue = () => {
    setStoredShippingOption(shippingOption);
    router.push("/checkout/packaging-options");
  };

  if (!initialized || !hydrated || items.length === 0 || !shippingAddress) {
    return null;
  }

  return (
    <CheckoutContainer shippingCharge={getShippingCharge(shippingOption)}>
      <CheckoutSteps step={2} />

      <div className="border-b border-[#e5e5e5] pb-10">
        <h1 className={`mb-8 text-[24px] text-black ${bodoni.className}`}>
          Shipping Method
        </h1>

        <div className="rounded border border-[#e5e5e5] bg-white p-6">
          <p className="mb-3 text-[12px] uppercase tracking-[0.15em] text-[#666]">
            Deliver To
          </p>

          <div className="space-y-1 text-[15px] leading-7 text-black">
            <p className="uppercase">{shippingAddress.fullName}</p>
            <p>{shippingAddress.street}</p>
            <p>
              {shippingAddress.city}, {shippingAddress.state}, {shippingAddress.postalCode}
            </p>
            <p>{shippingAddress.country}</p>
            <p>{shippingAddress.phone}</p>
          </div>
        </div>
      </div>

      <div className="mt-14">
        <h2 className={`mb-10 text-[24px] text-black ${bodoni.className}`}>
          Choose Shipping
        </h2>

        <label
          className={`flex cursor-pointer items-center justify-between border p-6 transition ${
            shippingOption === "standard"
              ? "border-black bg-white"
              : "border-[#dcdcdc] bg-[#fafafa]"
          }`}
        >
          <div className="flex items-start gap-5">
            <input
              type="radio"
              checked={shippingOption === "standard"}
              onChange={() => setShippingOption("standard")}
              className="mt-2 h-5 w-5"
            />

            <div>
              <h3 className="text-[13px] font-medium uppercase text-black">
                Standard Delivery
              </h3>

              <p className="mt-3 max-w-[300px] text-[12px] leading-6 text-[#666]">
                Free delivery within 3 business days with signature on delivery.
              </p>
            </div>
          </div>

          <span className="text-sm font-medium uppercase text-black">Free</span>
        </label>

        <label
          className={`mt-6 flex cursor-pointer items-center justify-between border p-6 transition ${
            shippingOption === "express"
              ? "border-black bg-white"
              : "border-[#dcdcdc] bg-[#fafafa]"
          }`}
        >
          <div className="flex items-start gap-5">
            <input
              type="radio"
              checked={shippingOption === "express"}
              onChange={() => setShippingOption("express")}
              className="mt-2 h-5 w-5"
            />

            <div>
              <h3 className="text-[13px] font-medium uppercase text-black">
                Express Delivery
              </h3>

              <p className="mt-3 max-w-[300px] text-[12px] leading-6 text-[#666]">
                Priority delivery within 1 to 2 business days.
              </p>
            </div>
          </div>

          <span className="text-sm font-medium uppercase text-black">₹50</span>
        </label>

        <div className="mt-10 flex gap-5">
          <button
            onClick={() => router.push("/checkout/shipping-address")}
            className="flex h-[54px] flex-1 items-center justify-center border border-black bg-white text-sm uppercase tracking-[0.15em] text-black transition hover:bg-black hover:text-white"
          >
            Back
          </button>

          <button
            onClick={handleContinue}
            className="flex h-[54px] flex-1 items-center justify-center bg-black text-sm uppercase tracking-[0.15em] text-white transition hover:bg-[#222]"
          >
            Continue
          </button>
        </div>
      </div>
    </CheckoutContainer>
  );
};