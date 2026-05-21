"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import CheckoutContainer from "@/components/checkout/new/CheckoutContainer";
import CheckoutSteps from "@/components/checkout/new/CheckoutSteps";
import { bodoni } from "@/lib/fonts";
import {
  getStoredCheckoutAddress,
  getStoredPackagingOption,
  setStoredPackagingOption,
  type PackagingOption,
} from "@/lib/utils/checkoutSession";
import { useAuthStore } from "@/store/auth/useAuthStore";
import { useCartStore } from "@/store/user/cart/useCartStore";
import type { Address } from "@/types/address";

export default function PackagingOptionsPage() {
  const router = useRouter();
  const { initialized, isAuthenticated } = useAuthStore();
  const { items } = useCartStore();
  const [selectedPackaging, setSelectedPackaging] = useState<PackagingOption>(
    getStoredPackagingOption
  );
  const [shippingAddress] = useState<Address | null>(getStoredCheckoutAddress);

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
      return;
    }

    const storedAddress = getStoredCheckoutAddress();

    if (!storedAddress) {
      router.replace("/checkout/shipping-address");
      return;
    }

  }, [initialized, isAuthenticated, items.length, router]);

  const handleContinue = () => {
    setStoredPackagingOption(selectedPackaging);
    router.push("/checkout/payment-options");
  };

  if (!initialized || items.length === 0 || !shippingAddress) {
    return null;
  }

  return (
    <CheckoutContainer>
      <CheckoutSteps step={2} />

      <div className="border-b border-[#e5e5e5] pb-10">
        <h1 className={`mb-8 text-[36px] text-black ${bodoni.className}`}>
          Shipping Details
        </h1>

        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <p className="mb-4 text-[12px] uppercase tracking-[0.15em] text-[#666]">
              Ship To
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

            <button
              onClick={() => router.push("/checkout/shipping-address")}
              className="mt-5 text-[14px] underline underline-offset-4"
            >
              Change
            </button>
          </div>

          <div>
            <p className="mb-4 text-[12px] uppercase tracking-[0.15em] text-[#666]">
              Shipping Option
            </p>

            <ul className="space-y-2 text-[15px] leading-7 text-black">
              <li>Standard Delivery - Free</li>
              <li>Delivery within 3 business days</li>
              <li>Signature on delivery</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-14">
        <h2 className={`mb-10 text-[36px] text-black ${bodoni.className}`}>
          Packaging & Gifting
        </h2>

        <label
          className={`flex cursor-pointer items-center justify-between border p-6 transition ${
            selectedPackaging === "standard"
              ? "border-black bg-white"
              : "border-[#dcdcdc] bg-[#fafafa]"
          }`}
        >
          <div className="flex items-start gap-5">
            <input
              type="radio"
              checked={selectedPackaging === "standard"}
              onChange={() => setSelectedPackaging("standard")}
              className="mt-2 h-5 w-5"
            />

            <div>
              <p className="text-[12px] font-semibold uppercase tracking-[0.15em] text-[#4c7c61]">
                We Recommend
              </p>

              <h3 className="mt-2 text-[18px] font-medium uppercase text-black">
                Standard Packaging
              </h3>

              <p className="mt-3 max-w-[300px] text-[14px] leading-6 text-[#666]">
                A discreet recyclable box using fewer materials with a lower
                environmental impact.
              </p>
            </div>
          </div>

          <div className="relative hidden h-[120px] w-[160px] overflow-hidden bg-[#f2f2f2] md:block">
            <Image
              src="/home/herosection/hero-center.png"
              alt="Standard packaging"
              fill
              className="object-cover"
            />
          </div>
        </label>

        <label
          className={`mt-6 flex cursor-pointer items-center justify-between border p-6 transition ${
            selectedPackaging === "gift"
              ? "border-black bg-white"
              : "border-[#dcdcdc] bg-[#fafafa]"
          }`}
        >
          <div className="flex items-start gap-5">
            <input
              type="radio"
              checked={selectedPackaging === "gift"}
              onChange={() => setSelectedPackaging("gift")}
              className="mt-2 h-5 w-5"
            />

            <div>
              <h3 className="text-[18px] font-medium uppercase text-black">
                Gift Packaging
              </h3>

              <p className="mt-3 max-w-[300px] text-[14px] leading-6 text-[#666]">
                Elevate your order with our signature luxury black box and ribbon.
              </p>
            </div>
          </div>

          <div className="relative hidden h-[120px] w-[160px] overflow-hidden bg-[#f2f2f2] md:block">
            <Image
              src="/home/herosection/hero-center.png"
              alt="Gift packaging"
              fill
              className="object-cover"
            />
          </div>
        </label>

        <div className="mt-8 flex gap-4 border border-[#e5e5e5] bg-[#fafafa] p-5">
          <div className="flex h-6 w-6 items-center justify-center rounded-full border border-[#999] text-[13px]">
            i
          </div>

          <p className="text-[14px] leading-6 text-[#666]">
            Every ZENFAZ order is carefully wrapped using responsibly sourced and
            recyclable packaging materials.
          </p>
        </div>

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
}
