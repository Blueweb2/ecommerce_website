"use client";

import { X, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useCartUIStore } from "@/store/ui/useCartUIStore";
import { useCartStore } from "@/store/user/cart/useCartStore";

export default function CartDrawer() {
  const { isOpen, closeCart } = useCartUIStore();
  const { items, totalPrice, removeItem, updateQuantity } = useCartStore();

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
          <Link href='/'>
            <ShoppingCart />
          </Link>
          <h2 className="text-lg font-semibold">Your Cart</h2>
          <button onClick={closeCart}>
            <X />
          </button>
        </div>

        {/* Items */}
        <div className="p-4 space-y-4 overflow-y-auto h-[70%]">
          {items.length === 0 ? (
            <p className="text-gray-500">Cart is empty</p>
          ) : (
            items.map((item) => (
              <div key={item.product._id} className="flex gap-3">
                <img
                  src={item.product.images?.[0]}
                  alt={item.product.name}
                  className="w-16 h-16 object-cover rounded"
                />

                <div className="flex-1">
                  <p className="font-medium">{item.product.name}</p>
                  <p className="text-sm text-gray-500">
                    ₹{item.price}
                  </p>

                  {/* Quantity */}
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() =>
                        updateQuantity(item.product._id, item.quantity - 1)
                      }
                      className="px-2 border"
                    >
                      -
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      onClick={() =>
                        updateQuantity(item.product._id, item.quantity + 1)
                      }
                      className="px-2 border"
                    >
                      +
                    </button>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeItem(item.product._id)}
                    className="text-red-500 text-sm mt-1"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 w-full p-4 border-t border-b border-gray-300 bg-white pb-20">
          <div className="flex justify-between mb-3">
            <span>Total</span>
            <span className="font-semibold">₹{totalPrice}</span>
          </div>

          <Link
            href="/checkout"
            onClick={closeCart}
            className="block text-center w-full bg-black text-white py-2 rounded border 
                      transition-all duration-300 
                      hover:bg-white hover:text-black hover:border-black"
          >
            Continue to Checkout →
          </Link>
        </div>
      </div>
    </>
  );
}