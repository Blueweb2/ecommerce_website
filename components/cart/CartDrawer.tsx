"use client";

import { X, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useCartUIStore } from "@/store/ui/useCartUIStore";
import { useCartStore } from "@/store/user/cart/useCartStore";
import { resolveImageSrc } from "@/lib/utils/image";
import { bodoni, inter } from "@/lib/fonts";
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
        className={`fixed top-0 right-0 h-screen w-[300px] md:w-[380px] bg-white z-50 shadow-xl transform transition-transform duration-300 z-9999 mt-16
        ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-300">
          <Link href='/' className="text-neutral-600">
            <ShoppingCart />
          </Link>
          <h2 className={`${bodoni.className} text-lg font-semibold text-neutral-600`}>Your Cart</h2>
          <button onClick={closeCart} className="text-neutral-600">
            <X />
          </button>
        </div>

        {/* Items */}
        <div className="p-4 space-y-4 overflow-y-auto h-[45%]">
          {items.length === 0 ? (
            <p className="text-gray-500">Cart is empty</p>
          ) : (
            items.map((item) => (
              <div key={`${item.productId}-${item.variantId || 'base'}`} className="flex gap-3">
                <img
                  src={resolveImageSrc(item.image)}
                  alt={item.name}
                  className="w-16 h-full object-cover"
                />

                <div className="flex-1">
                  <p className={`${bodoni.className} font-medium text-neutral-600`}>{item.name}</p>
                  
                  {item.selectedOptions && item.selectedOptions.length > 0 && (
                    <p className="text-xs text-gray-500">
                      {item.selectedOptions.map((opt) => `${opt.fieldName}: ${opt.value}`).join(', ')}
                    </p>
                  )}

                  <p className="text-sm text-gray-500">
                    ₹{getInclusivePrice(item.price, item.gstPercentage)} {item.isFabric && <span className="text-xs">/ {item.unit || "meter"}</span>}
                  </p>

                  {/* Quantity */}
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => {
                        const step = item.isFabric ? (item.stepQty || 1) : 1;
                        const min = item.isFabric ? (item.minOrderQty || 1) : 1;
                        const newQty = Math.max(min, Number((item.quantity - step).toFixed(2)));
                        updateQuantity(item, newQty);
                      }}
                      className="px-2 border rounded-[50%] text-gray-600 hover:bg-gray-50"
                    >
                      -
                    </button>

                    <span className="text-sm">
                      {item.quantity} {item.isFabric && (item.unit || "meters")}
                    </span>

                    <button
                      onClick={() => {
                        const step = item.isFabric ? (item.stepQty || 1) : 1;
                        const newQty = Number((item.quantity + step).toFixed(2));
                        updateQuantity(item, newQty);
                      }}
                      className="px-2 border rounded-[50%] text-gray-600 hover:bg-gray-50"
                    >
                      +
                    </button>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeItem(item)}
                    className={`${inter.className} text-red-500 text-sm mt-1`}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-300 bg-white pb-20">
          <div className="space-y-1 mb-4 text-sm">
            <div className={`${bodoni.className} text-neutral-600 flex justify-between font-bold text-lg pt-2`}>
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