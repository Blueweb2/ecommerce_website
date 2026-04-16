"use client";

import { useEffect } from "react";
import { useCartStore } from "@/store/user/cart/useCartStore";

export default function CompleteStep() {

  useEffect(() => {
    useCartStore.getState().clearCartAsync(); // safety fallback
  }, []);

  return (
    <div className="text-center py-10 space-y-4">
      <h2 className="text-2xl font-semibold">🎉 Order Placed!</h2>
      <p className="text-gray-500">
        Your order has been successfully placed.
      </p>
    </div>
  );
}