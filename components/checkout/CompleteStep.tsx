"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useCartStore } from "@/store/user/cart/useCartStore";

export default function CompleteStep() {
  useEffect(() => {
    void useCartStore.getState().clearCartAsync();
  }, []);

  return (
    <div className="space-y-4 py-10 text-center">
      <h2 className="text-2xl font-semibold">Order Placed!</h2>
      <p className="text-gray-500">
        Your order has been successfully placed.
      </p>

      <div className="flex justify-center gap-3 pt-2">
        <Link
          href="/profile?tab=orders"
          className="rounded bg-black px-5 py-2 text-white"
        >
          View Orders
        </Link>
        <Link
          href="/"
          className="rounded border px-5 py-2 text-black"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
