"use client";

import Link from "next/link";
import { useCartStore } from "@/store/user/cart/useCartStore";
import { ShoppingCart } from "lucide-react";
import { bodoni, inter } from "@/lib/fonts";

export default function CartPage() {
  
  const { items, totalPrice, totalGstAmount, removeItem, updateQuantity } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 pt-36 pb-20">
        <ShoppingCart className="h-12 w-12 text-gray-400" />

        <h2 className="text-xl font-semibold">Your cart is empty</h2>

        <p className="text-sm text-gray-500">
          Looks like you haven&apos;t added anything yet
        </p>

        <Link
          href="/"
          className="mt-2 rounded border px-6 py-2 transition hover:bg-black hover:text-white"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <section className="w-full bg-[#f5f5f5] py-10 font-sans">
      <div className="mx-auto grid max-w-[2000px] gap-8 px-4 p-6 md:mt-20 md:grid-cols-3 md:px-32">
        <div className="space-y-6 md:col-span-2">
          <h1
            className={`${bodoni.className} border-b border-gray-300 pb-5 text-[30px] font-semibold text-neutral-600`}
          >
            Shopping Cart
          </h1>

          {items.map((item, index) => (
            <div
              key={`${item.productId}-${item.variantId || "base"}-${index}`}
              className="flex gap-4"
            >
              <img
                src={item.image || "/placeholder.png"}
                alt={item.name}
                className="h-33 w-30 object-cover"
              />

              <div className="flex-1 space-y-2">
                <h2 className={`${bodoni.className} font-medium text-neutral-600`}>
                  {item.name}
                </h2>

                {item.selectedOptions && item.selectedOptions.length > 0 && (
                  <div className="space-y-1 text-sm text-gray-500">
                    {item.selectedOptions.map((opt, optionIndex) => (
                      <p key={optionIndex} className={inter.className}>
                        {opt.fieldName}: {opt.value}
                      </p>
                    ))}
                  </div>
                )}

                <p className={`${inter.className} font-semibold text-[#8D8B9D]`}>
                  Rs. {item.price}
                  {item.isFabric && (
                    <span className="text-xs"> / {item.unit || "meter"}</span>
                  )}
                </p>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const step = item.isFabric ? (item.stepQty || 1) : 1;
                      const min = item.isFabric ? (item.minOrderQty || 1) : 1;
                      const newQty = Math.max(
                        min,
                        Number((item.quantity - step).toFixed(2))
                      );
                      updateQuantity(item, newQty);
                    }}
                    className="rounded-[50%] border border-[#8D8B9D] px-2 text-[#8D8B9D]"
                  >
                    -
                  </button>

                  <span
                    className={`${bodoni.className} text-sm font-medium text-neutral-600`}
                  >
                    {item.quantity}
                    {item.isFabric && ` ${item.unit || "meters"}`}
                  </span>

                  <button
                    onClick={() => {
                      const step = item.isFabric ? (item.stepQty || 1) : 1;
                      const newQty = Number((item.quantity + step).toFixed(2));
                      updateQuantity(item, newQty);
                    }}
                    className="rounded-[50%] border border-[#8D8B9D] px-2 text-[#8D8B9D]"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => removeItem(item)}
                  className="text-sm text-[#8D8B9D]"
                  title="remove from cart"
                >
                  Remove from cart
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="h-fit space-y-4 md:mt-14">
          <h2
            className={`${bodoni.className} mb-3 font-normal tracking-tight text-neutral-600`}
          >
            ORDER SUMMARY
          </h2>

          <div className="text-sm">
            <div className="flex justify-between border-b border-gray-300 pb-3 text-gray-600">
              <span>Item subtotal</span>
              <span>Rs. {totalPrice}</span>
            </div>
            <div className="flex justify-between border-b border-gray-300 py-3 text-gray-600">
              <span>GST</span>
              <span>Rs. {totalGstAmount}</span>
            </div>
            <div className="flex justify-between pt-6 text-lg font-bold text-neutral-600">
              <span className={bodoni.className}>Total</span>
              <span>Rs. {totalPrice + totalGstAmount}</span>
            </div>
          </div>

          <Link
            href="/checkout"
            className="block w-full bg-black py-2 text-center text-white hover:bg-gray-800"
          >
            Proceed to Checkout -&gt;
          </Link>
        </div>
      </div>
    </section>
  );
}
