"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import CheckoutAddress from "@/components/checkout/CheckoutAddress";
import CheckoutContainer from "@/components/checkout/new/CheckoutContainer";
import CheckoutSteps from "@/components/checkout/new/CheckoutSteps";
import { bodoni, inter } from "@/lib/fonts";
import {
  getStoredCheckoutAddress,
  getStoredCheckoutMode,
  setStoredCheckoutAddress,
} from "@/lib/utils/checkoutSession";
import { useAuthStore } from "@/store/auth/useAuthStore";
import { useCartStore } from "@/store/user/cart/useCartStore";
import type { Address } from "@/types/address";

type GuestAddressField =
  | "fullName"
  | "phone"
  | "street"
  | "city"
  | "state"
  | "postalCode"
  | "country";

const emptyGuestAddress: Address = {
  fullName: "",
  phone: "",
  street: "",
  city: "",
  state: "",
  postalCode: "",
  country: "India",
};

const guestAddressFields: GuestAddressField[] = [
  "fullName",
  "phone",
  "street",
  "city",
  "state",
  "postalCode",
  "country",
];

const fieldLabels: Record<GuestAddressField, string> = {
  fullName: "Full Name",
  phone: "Phone Number",
  street: "Street Address",
  city: "City",
  state: "State",
  postalCode: "Postal Code",
  country: "Country",
};

export default function ShippingAddressPage() {
  const router = useRouter();
  const { initialized, isAuthenticated } = useAuthStore();
  const { items } = useCartStore();
  const [checkoutMode] = useState(getStoredCheckoutMode);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [guestAddress, setGuestAddress] = useState<Address>(() => {
    const storedAddress = getStoredCheckoutAddress();
    return storedAddress ?? emptyGuestAddress;
  });

  const isGuestCheckout = !isAuthenticated && checkoutMode === "guest";

  useEffect(() => {
    if (!initialized) {
      return;
    }

    if (items.length === 0) {
      router.replace("/cart");
      return;
    }

    if (!isAuthenticated && checkoutMode !== "guest") {
      router.replace("/checkout/login");
    }
  }, [checkoutMode, initialized, isAuthenticated, items.length, router]);

  const handleContinue = () => {
    if (isGuestCheckout) {
      const hasEmptyField = guestAddressFields.some(
        (field) => !String(guestAddress[field] || "").trim()
      );

      if (hasEmptyField) {
        toast.error("Please complete your shipping address to continue.");
        return;
      }

      if (!/^\d{10}$/.test(guestAddress.phone)) {
        toast.error("Please enter a valid 10 digit phone number.");
        return;
      }

      setStoredCheckoutAddress(guestAddress);
      router.push("/checkout/shipping-options");
      return;
    }

    if (!selectedAddress) {
      toast.error("Please select a delivery address to continue.");
      return;
    }

    setStoredCheckoutAddress(selectedAddress);
    router.push("/checkout/shipping-options");
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

      {isGuestCheckout ? (
        <div className={`${inter.className} space-y-4`}>
          <div className="rounded border border-[#e5e5e5] bg-white p-6">
            <p className="text-sm text-[#666]">
              You&apos;re checking out as a guest. Enter the delivery address for this order.
            </p>
          </div>

          {guestAddressFields.map((field) => (
            <input
              key={field}
              value={guestAddress[field] || ""}
              onChange={(event) =>
                setGuestAddress((current) => ({
                  ...current,
                  [field]: event.target.value,
                }))
              }
              placeholder={fieldLabels[field]}
              className="w-full border border-[#8D8B9D] bg-white p-3 text-[#5C5A58] outline-none"
            />
          ))}
        </div>
      ) : (
        <CheckoutAddress onSelect={setSelectedAddress} />
      )}

      <button
        onClick={handleContinue}
        className="mt-8 flex h-[54px] w-full items-center justify-center bg-black text-sm uppercase tracking-[0.15em] text-white transition hover:bg-[#222]"
      >
        Continue
      </button>
    </CheckoutContainer>
  );
}
