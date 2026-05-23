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
    getStoredGiftMessage,
    getStoredPackagingOption,
    getStoredShippingOption,
    setStoredGiftMessage,
    setStoredPackagingOption,
    type PackagingOption,
    type ShippingOption,
} from "@/lib/utils/checkoutSession";
import { useAuthStore } from "@/store/auth/useAuthStore";
import { useCartStore } from "@/store/user/cart/useCartStore";
import type { Address } from "@/types/address";
import PersonalMessageModal from "@/components/checkout/new/PersonalMessageModal";

export default function PackagingOptionsPage() {
  const router = useRouter();
  const { initialized, isAuthenticated } = useAuthStore();
  const { items, hydrated } = useCartStore();
    const [checkoutMode] = useState(getStoredCheckoutMode);
    const [selectedPackaging, setSelectedPackaging] = useState<PackagingOption>(
        () => getStoredPackagingOption() ?? "standard"
    );
    const [shippingAddress] = useState<Address | null>(getStoredCheckoutAddress);
    const [shippingOption] = useState<ShippingOption>(
        () => getStoredShippingOption() ?? "standard"
    );

    const [messageModalOpen, setMessageModalOpen] = useState(false);
    const [giftMessage, setGiftMessage] = useState(() => getStoredGiftMessage());

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
            return;
        }

        if (getStoredShippingOption() === null) {
            router.replace("/checkout/shipping-options");
        }

  }, [checkoutMode, hydrated, initialized, isAuthenticated, items.length, router]);

    const handleContinue = () => {
        setStoredPackagingOption(selectedPackaging);

        if (selectedPackaging === "gift") {
            setStoredGiftMessage(giftMessage);
        } else {
            setStoredGiftMessage("");
        }

        router.push("/checkout/payment-options");
    };

    const handleGiftMessageConfirm = () => {
        setStoredGiftMessage(giftMessage);
        setMessageModalOpen(false);
    };

  if (!initialized || !hydrated || items.length === 0 || !shippingAddress) {
    return null;
  }

    return (
        <CheckoutContainer shippingCharge={getShippingCharge(shippingOption)}>
            <CheckoutSteps step={3} />

            <div className="border-b border-[#e5e5e5] pb-10">
                <h1 className={`mb-8 text-[24px] text-black ${bodoni.className}`}>
                    Shipping Details
                </h1>

                <div className="grid gap-10 md:grid-cols-2">
                    <div>
                        <p className="mb-4 text-[12px] uppercase tracking-[0.15em] text-[#666]">
                            Ship To
                        </p>

                        <div className="space-y-1 text-[13px] leading-7 text-black">
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

                        <ul className="space-y-2 text-[13px] leading-7 text-black">
                            {shippingOption === "express" ? (
                                <>
                                    <li>Express Delivery - ₹50</li>
                                    <li>Delivery within 1 to 2 business days</li>
                                    <li>Priority dispatch</li>
                                </>
                            ) : (
                                <>
                                    <li>Standard Delivery - Free</li>
                                    <li>Delivery within 3 business days</li>
                                    <li>Signature on delivery</li>
                                </>
                            )}
                        </ul>

                        <button
                            onClick={() => router.push("/checkout/shipping-options")}
                            className="mt-5 text-[14px] underline underline-offset-4"
                        >
                            Change
                        </button>
                    </div>
                </div>
            </div>

            <div className="mt-14">
                {/* TITLE */}
                <h2
                    className={`mb-6 text-[24px] font-light text-black ${bodoni.className}`}
                >
                    Packaging and Gifting
                </h2>

                {/* STANDARD PACKAGING */}
                <label className="flex cursor-pointer items-center justify-between border-t border-[#e5e5e5] py-8">
                    <div className="flex items-start gap-5">
                        <input
                            type="radio"
                            checked={selectedPackaging === "standard"}
                            onChange={() => {
                                setSelectedPackaging("standard");
                                setGiftMessage("");
                            }}
                            className="mt-1 h-5 w-5 accent-black"
                        />

                        <div>
                            <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#3c7a5c]">
                                We Recommend
                            </p>

                            <h3 className="mt-1 text-[15px] font-normal uppercase text-black">
                                Standard Packaging
                            </h3>

                            <p className="mt-3 max-w-[340px] text-[13px] leading-7 text-[#333]">
                                A discreet, recyclable box that uses fewer
                                materials and has a lighter footprint.
                            </p>
                        </div>
                    </div>

                    <div
                        aria-hidden
                        className="relative hidden h-[120px] w-[210px] overflow-hidden bg-[#f0f0f0] md:block"
                    >
                        <div className="absolute inset-4 border border-[#d9d9d9] bg-white" />
                    </div>
                </label>

                {/* GIFT PACKAGING */}
                <label className="flex cursor-pointer items-center justify-between border-t border-b border-[#e5e5e5] py-8">
                    <div className="flex items-start gap-5">
                        <input
                            type="radio"
                            checked={selectedPackaging === "gift"}
                            onChange={() => setSelectedPackaging("gift")}
                            className="mt-1 h-5 w-5 accent-black"
                        />

                        <div>
                            <h3 className="text-[15px] font-normal uppercase text-black">
                                Gift Packaging
                            </h3>

                            <p className="mt-3 max-w-[340px] text-[13px] leading-7 text-[#333]">
                                A touch of luxury — elevate your gift with our
                                signature black box and ribbon.
                            </p>

                            <button
                                type="button"
                                onClick={() => setMessageModalOpen(true)}
                                className="mt-4 text-[14px] text-[#777] underline underline-offset-4"
                            >
                                {giftMessage.trim()
                                    ? "Edit personal message"
                                    : "Add a personal message"}
                            </button>

                            {giftMessage.trim() && (
                                <p className="mt-3 max-w-[340px] text-[14px] italic leading-6 text-[#555]">
                                    &ldquo;{giftMessage.trim()}&rdquo;
                                </p>
                            )}
                        </div>
                    </div>

                    <PersonalMessageModal
                        open={messageModalOpen}
                        onClose={() => setMessageModalOpen(false)}
                        message={giftMessage}
                        setMessage={setGiftMessage}
                        onConfirm={handleGiftMessageConfirm}
                    />

                    <div
                        aria-hidden
                        className="relative hidden h-[120px] w-[210px] overflow-hidden bg-[#111] md:block"
                    >
                        <div className="absolute inset-4 border border-[#444] bg-[#1a1a1a]" />
                    </div>
                </label>

                {/* INFO */}
                <div className="mt-7 flex items-start gap-4">
                    <div className="flex h-7 w-7 min-w-[28px] items-center justify-center rounded-full border border-black text-[14px]">
                        i
                    </div>

                    <p className="max-w-[700px] text-[13px] leading-6 text-[#444]">
                        Each ZENFAZ order is carefully wrapped in
                        your packaging of choice made from certified
                        paper. Both options are fully recyclable.
                        <span className="ml-1 underline underline-offset-4">
                            Learn more
                        </span>
                    </p>
                </div>

                {/* BUTTON */}
                <div className="mt-10">
                    <button
                        onClick={handleContinue}
                        className="flex h-[54px] w-full items-center justify-center bg-black text-[13px] uppercase tracking-[0.18em] text-white transition hover:bg-[#222]"
                    >
                        Continue
                    </button>
                </div>
            </div>
        </CheckoutContainer>
    );
}
