"use client";

import type { ReactNode } from "react";

import CheckoutHeader from "./CheckoutHeader";
import CheckoutOrderSummary from "./CheckoutOrderSummary";

interface Props {
  children: ReactNode;
  shippingCharge?: number;
}

export default function CheckoutContainer({
  children,
  shippingCharge = 0,
}: Props) {
  return (
    <div className="min-h-screen">
      <CheckoutHeader />

      <div className="flex flex-col lg:flex-row">

        <main className="flex-1 px-6 py-12 lg:px-16">
          <div className="mx-auto max-w-[720px]">
            {children}
          </div>
        </main>

        <CheckoutOrderSummary shippingCharge={shippingCharge} />

      </div>
    </div>
  );
}
