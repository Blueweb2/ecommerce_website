"use client";

import Link from "next/link";
import { useCartStore } from "@/store/user/cart/useCartStore";
import { ShoppingCart } from "lucide-react";

export default function CartPage() {
  const { items, totalPrice, removeItem, updateQuantity } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
  <ShoppingCart className="w-12 h-12 text-gray-400" />
  
  <h2 className="text-xl font-semibold">
    Your cart is empty
  </h2>

  <p className="text-gray-500 text-sm">
    Looks like you haven’t added anything yet
  </p>

  <Link
    href="/"
    className="mt-2 px-6 py-2 border rounded hover:bg-black hover:text-white transition"
  >
    Continue Shopping
  </Link>
</div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 grid md:grid-cols-3 gap-8">
      
      {/* ================= LEFT: ITEMS ================= */}
      <div className="md:col-span-2 space-y-6">
        <h1 className="text-2xl font-semibold">Shopping Cart</h1>

        {items.map((item, index) => (
          <div
            key={`${item.productId}-${item.variantId || "base"}-${index}`}
            className="flex gap-4 border p-4 rounded-lg"
          >
            {/* Image */}
            <img
              src={item.image || "/placeholder.png"}
              alt={item.name}
              className="w-24 h-24 object-cover rounded"
            />

            {/* Details */}
            <div className="flex-1 space-y-2">
              <h2 className="font-medium">{item.name}</h2>

              {/* ✅ SELECTED OPTIONS */}
              {item.selectedOptions && item.selectedOptions.length > 0 && (
                <div className="text-sm text-gray-500 space-y-1">
                  {item.selectedOptions.map((opt, i) => (
                    <p key={i}>
                      {opt.fieldName}: {opt.value}
                    </p>
                  ))}
                </div>
              )}

              {/* PRICE */}
              <p className="font-semibold">₹{item.price}</p>

              {/* QUANTITY */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    updateQuantity(item, item.quantity - 1)
                  }
                  className="px-2 border"
                >
                  -
                </button>

                <span>{item.quantity}</span>

                <button
                  onClick={() =>
                    updateQuantity(item, item.quantity + 1)
                  }
                  className="px-2 border"
                >
                  +
                </button>
              </div>

              {/* REMOVE */}
              <button
                onClick={() => removeItem(item)}
                className="text-red-500 text-sm"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ================= RIGHT: SUMMARY ================= */}
      <div className="border p-6 rounded-lg h-fit space-y-4">
        <h2 className="text-lg font-semibold">Order Summary</h2>

        <div className="flex justify-between">
          <span>Total</span>
          <span className="font-semibold">₹{totalPrice}</span>
        </div>

        <Link
          href="/checkout"
          className="block w-full text-center bg-black text-white py-2 rounded hover:bg-gray-800"
        >
          Proceed to Checkout →
        </Link>
      </div>
    </div>
  );
}