"use client";

import Link from "next/link";

export default function CompleteStep() {
  return (
    <div className="text-center py-10 space-y-4">
      <h2 className="text-2xl font-semibold">🎉 Order Placed!</h2>

      <p className="text-gray-500">
        Your order has been successfully placed.
      </p>

      <Link
        href="/"
        className="inline-block px-6 py-2 bg-black text-white rounded"
      >
        Continue Shopping
      </Link>
    </div>
  );
}