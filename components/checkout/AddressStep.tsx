"use client";

import CheckoutAddress from "@/components/checkout/CheckoutAddress";

export default function AddressStep({
  onNext,
  setAddress,
  selectedAddress,
}: any) {
  return (
    <div>
      <CheckoutAddress onSelect={setAddress} />

      <div className="flex justify-end mt-4">
        <button
          disabled={!selectedAddress}
          onClick={onNext}
          className="bg-black text-white px-6 py-2 disabled:opacity-50"
        >
          Continue →
        </button>
      </div>
    </div>
  );
}