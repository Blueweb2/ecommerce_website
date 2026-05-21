"use client";

import CheckoutHeader from "@/components/checkout/new/CheckoutHeader";
import CompleteStep from "@/components/checkout/CompleteStep";

export default function CheckoutCompletePage() {
  return (
    <div className="min-h-screen bg-[#f7f7f5]">
      <CheckoutHeader />

      <main className="mx-auto max-w-3xl px-6 py-16">
        <CompleteStep />
      </main>
    </div>
  );
}
