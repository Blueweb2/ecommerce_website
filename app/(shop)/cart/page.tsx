"use client";

import Link from "next/link";
import { useCartStore } from "@/store/user/cart/useCartStore";
import { ShoppingCart } from "lucide-react";
import { bodoni, inter } from "@/lib/fonts";

export default function CartPage() {

  const { items, totalPrice, totalGstAmount, removeItem, updateQuantity } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center pt-36 pb-20 space-y-4">
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
    <section className="w-full bg-[#f5f5f5] py-10 font-sans">
      <div className="max-w-[2000px] mx-auto p-6 grid md:grid-cols-3 md:mt-20 gap-8 px-4 md:px-32">
      
        {/* ================= LEFT: ITEMS ================= */}
        <div className="md:col-span-2 space-y-6">
          <h1 className={`${bodoni.className} text-[30px] text-neutral-600 font-semibold border-b border-gray-300 pb-5`}>Shopping Cart</h1>

          {items.map((item, index) => (
            <div
              key={`${item.productId}-${item.variantId || "base"}-${index}`}
              className="flex gap-4"
            >
              {/* Image */}
              <img
                src={item.image || "/placeholder.png"}
                alt={item.name}
                className="w-30 h-33 object-cover"
              />

              {/* Details */}
              <div className="flex-1 space-y-2">
                <h2 className={`${bodoni.className} font-medium text-neutral-600`}>{item.name}</h2>

                {/* ✅ SELECTED OPTIONS */}
                {item.selectedOptions && item.selectedOptions.length > 0 && (
                  <div className="text-sm text-gray-500 space-y-1">
                    {item.selectedOptions.map((opt, i) => (
                      <p key={i} className={inter.className}>
                        {opt.fieldName}: {opt.value}
                      </p>
                    ))}
                  </div>
                )}

                {/* PRICE */}
                <p className={`${inter.className} font-semibold text-[#8D8B9D]`}>₹{item.price}</p>

                {/* QUANTITY */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      updateQuantity(item, item.quantity - 1)
                    }
                    className="px-2 border rounded-[50%] border-[#8D8B9D] text-[#8D8B9D]"
                  >
                    -
                  </button>

                  <span className={bodoni.className}>{item.quantity}</span>

                  <button
                    onClick={() =>
                      updateQuantity(item, item.quantity + 1)
                    }
                    className="px-2 border rounded-[50%] border-[#8D8B9D] text-[#8D8B9D]"
                  >
                    +
                  </button>
                </div>

                {/* REMOVE */}
                <button
                  onClick={() => removeItem(item)}
                  className="text-[#8D8B9D] text-sm"
                >
                  Remove from cart
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ================= RIGHT: SUMMARY ================= */}
        <div className="h-fit space-y-4 md:mt-14">
          <h2
            className={`${bodoni.className} mb-3 font-normal tracking-tight text-neutral-600`}
          >
            ORDER SUMMERY
          </h2>

          <div className="text-sm">
            <div className="flex justify-between text-gray-600 pb-3 border-b border-gray-300">
              <span>Item subtotal</span>
              <span>₹{totalPrice}</span>
            </div>
            <div className="flex justify-between text-gray-600 py-3 border-b border-gray-300">
              <span>GST</span>
              <span>₹{totalGstAmount}</span>
            </div>
            <div className='flex justify-between font-bold pt-6 text-lg text-neutral-600'>
              <span className={bodoni.className} >Total</span>
              <span>₹{totalPrice + totalGstAmount}</span>
            </div>
          </div>

          <Link
            href="/checkout"
            className="block w-full text-center bg-black text-white py-2 hover:bg-gray-800"
          >
            Proceed to Checkout →
          </Link>
        </div>
      </div>
    </section>
  );
}
