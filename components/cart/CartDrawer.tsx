"use client";

import { X, ShoppingCart, Trash2 } from "lucide-react";
import Link from "next/link";
import { useCartUIStore } from "@/store/ui/useCartUIStore";
import { useCartStore } from "@/store/user/cart/useCartStore";
import { resolveImageSrc } from "@/lib/utils/image";
import { inter } from "@/lib/fonts";
import { getInclusivePrice } from "@/lib/utils/pricing";

export default function CartDrawer() {

  const { isOpen, closeCart } = useCartUIStore();
  const { items, totalPrice, totalGstAmount, removeItem, updateQuantity } = useCartStore();

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-9999"
          onClick={closeCart}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-screen w-[300px] md:w-[380px] bg-white z-50 shadow-xl flex flex-col mt-16 z-9999 transform transition-transform duration-600
        ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >

        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-300">
          <Link href='/' className="text-neutral-600">
            <ShoppingCart />
          </Link>
          <h2 className={`${inter.className} text-lg font-semibold text-neutral-600`}>Your Cart</h2>
          <button onClick={closeCart} className="text-neutral-600">
            <X />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 p-3 space-y-4 overflow-y-auto">
          {items.length === 0 ? (
            <p className="text-gray-500">Cart is empty</p>
          ) : (
            items.map((item) => (
              <div key={`${item.productId}-${item.variantId || 'base'}`} className="flex gap-3 overflow-x-hidden">
                <img
                  src={resolveImageSrc(item.image)}
                  alt={item.name}
                  className="w-20 h-full object-cover"
                />

                <div className="flex-1">
                  <p className={`${inter.className} text-[13px] md:text-[14px] truncate`}>{item.name}</p>

                  <p className="text-xs mt-2">
                    ₹{getInclusivePrice(item.price, item.gstPercentage)} {item.isFabric && <span className="text-xs">/ {item.unit || "meter"}</span>}
                  </p>

                  {/* Quantity */}
                  <div className="flex items-center mt-2">
                    <div className="flex items-center border border-gray-300 overflow-hidden">
                      <button
                        onClick={() => {
                          const step = item.isFabric ? (item.stepQty || 1) : 1;
                          const min = item.isFabric ? (item.minOrderQty || 1) : 1;
                          const newQty = Math.max(min, Number((item.quantity - step).toFixed(2)));
                          updateQuantity(item, newQty);
                        }}
                        className="w-6 h-6 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition"
                      >
                        −
                      </button>

                      <span className="min-w-[50px] text-center text-sm px-2">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => {
                          const step = item.isFabric ? (item.stepQty || 1) : 1;
                          const newQty = Number((item.quantity + step).toFixed(2));
                          updateQuantity(item, newQty);
                        }}
                        className="w-6 h-6 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition"
                      >
                        +
                      </button>
                    </div>

                    {item.isFabric && (
                      <span className="ml-2 text-xs text-gray-500">
                        {item.unit || "meters"}
                      </span>
                    )}
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeItem(item)}
                    className={`${inter.className} flex items-center gap-1 text-xs text-gray-500 hover:text-red-500 transition mt-2`}
                  >
                    <Trash2 size={14} />
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-300 bg-white pb-20">
          <div className="space-y-1 mb-4 text-sm">
            <div className={`${inter.className} flex justify-between font-bold text-lg pt-2`}>
              <span>Total</span>
              <span>₹{totalPrice + totalGstAmount}</span>
            </div>
          </div>

          <div className="space-y-2">
            {/* Go to Cart Page */}
            <Link
              href="/cart"
              onClick={closeCart}
              className="block text-center w-full border border-neutral-600 py-2 
                        hover:bg-gray-100 transition"
            >
              View Cart →
            </Link>

            {/* Checkout */}
            <Link
              href="/checkout"
              onClick={closeCart}
              className="block text-center w-full bg-black text-white py-2 
                        hover:bg-gray-800 transition"
            >
              Checkout →
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}