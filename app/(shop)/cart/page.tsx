"use client";

import Link from "next/link";
import { CartItem, useCartStore } from "@/store/user/cart/useCartStore";
import { ShoppingCart } from "lucide-react";
import {  inter } from "@/lib/fonts";
import { useState } from "react";
import CartEditModal from "@/components/cart/CartEditModal";
import { validatePromo } from "@/lib/api/promo.api";
import toast from "react-hot-toast";
import { headingClassName } from "@/components/ui/headingClassNames";
import { getInclusivePrice } from "@/lib/utils/pricing";

export default function CartPage() {
  const [selectedItem, setSelectedItem] = useState<CartItem | null>(null);

  const { items, totalPrice, totalGstAmount, removeItem, updateQuantity, appliedPromo, applyPromo, removePromo } = useCartStore();
  const [promoInput, setPromoInput] = useState("");
  const [loadingPromo, setLoadingPromo] = useState(false);

  const handleApplyPromo = async () => {
    if (!promoInput.trim()) return;
    setLoadingPromo(true);
    try {
      const res = await validatePromo(promoInput, totalPrice);
      applyPromo(res.data.code, res.data.discountAmount);
      toast.success("Promo code applied!");
      setPromoInput("");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Invalid promo code");
    } finally {
      setLoadingPromo(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 pt-36 md:pt-44 pb-20">
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
  };

  return (
    <section className="mt-8 w-full py-10 font-sans">
      <div className="mx-auto grid max-w-[2000px] gap-14 px-4 p-6 md:mt-20 md:grid-cols-[1fr_420px] md:px-24">

        {/* LEFT SIDE */}
        <div>
          <h1
            className={`${headingClassName} border-b border-gray-300 pb-5`}
          >
            Shopping Bag
          </h1>

          <div className="space-y-10 pt-8">
            {items.map((item, index) => (
              <div
                key={`${item.productId}-${item.variantId || "base"}-${index}`}
                className="flex gap-7"
              >
                {/* CLICKABLE PRODUCT */}
                <button
                  onClick={() => setSelectedItem(item)}
                  className="flex flex-1 gap-7 text-left"
                >
                  {/* IMAGE */}
                  <div className="overflow-hidden">
                    <img
                      src={item.image || "/placeholder.png"}
                      alt={item.name}
                      className="h-[150px] w-[150px] object-cover"
                    />
                  </div>

                  {/* CONTENT */}
                  <div className="flex flex-1 flex-col">

                    {/* BRAND */}
                    <h2
                      className={`${inter.className} text-[15px] font-semibold uppercase tracking-[-0.3px] text-black`}
                    >
                      {item.name}
                    </h2>

                    {/* TITLE */}
                    <p
                      className={`${inter.className} text-[13px] mt-1 font-light leading-[1.5] text-[#4a4a4a]`}
                    >
                      {item.name}
                    </p>

                    {/* OPTIONS */}
                    <div
                      className={`${inter.className} text-[14px] flex flex-wrap items-center gap-3 text-[#5d5d5d]`}
                    >
                      {item.selectedOptions?.map((opt, optionIndex) => (
                        <div
                          key={optionIndex}
                          className="flex items-center gap-3"
                        >
                          <span>{opt.value}</span>

                          {optionIndex !==
                            (item.selectedOptions?.length ?? 0) - 1 && (
                              <span className="text-[#b0b0b0]">•</span>
                            )}
                        </div>
                      ))}

                      <span className="text-[#b0b0b0]">•</span>

                      <span>
                        Qty: {item.quantity}
                        {item.isFabric &&
                          ` ${item.unit || "meters"}`}
                      </span>
                    </div>

                    {/* PRICE */}
                    <p
                      className={`${inter.className} text-[15px] font-semibold tracking-[-0.5px] text-black`}
                    >
                      ₹{getInclusivePrice(item.price, item.gstPercentage)}
                    </p>

                    {/* LOW STOCK */}
                    <p
                      className={`${inter.className} text-[13px] mt-3 text-sm uppercase tracking-[1px] text-[#6e6e6e]`}
                    >
                      Low Stock
                    </p>

                    {/* ACTIONS */}
                    <div
                      className={`${inter.className} text-xs mt-5 flex items-center gap-5 text-[#6a6a6a]`}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeItem(item);
                        }}
                        className="transition hover:text-black"
                      >
                        Remove from Bag
                      </button>

                      <span className="text-[#c7c7c7]">•</span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        className="transition hover:text-black"
                      >
                        Move to your Wish List
                      </button>
                    </div>
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="h-fit md:sticky md:top-40 md:mt-12">
          <div className="md:pl-5">

            {/* TITLE */}
            <h2
              className={`${inter.className} uppercase tracking-[3px] text-black`}
            >
              Order Summary
            </h2>

            {/* SUMMARY */}
            <div className="space-y-3 mt-4">
              {appliedPromo && (
                <div className="flex items-center justify-between text-[17px] text-emerald-600 font-medium">
                  <div className="flex items-center gap-2">
                    <span>Discount ({appliedPromo.code})</span>
                    <button
                      onClick={removePromo}
                      className="text-[12px] uppercase underline tracking-wider hover:text-rose-500"
                    >
                      Remove
                    </button>
                  </div>
                  <span>-₹{appliedPromo.discountAmount}</span>
                </div>
              )}

              <div className="border-t border-[#e5e5e5] py-6">
                <div className="flex items-center justify-between">
                  <span
                    className={`${inter.className} text-[15px] font-semibold text-black`}
                  >
                    Total
                  </span>

                  <span
                    className={`${inter.className} text-[15px] font-semibold tracking-[-0.5px] text-black`}
                  >
                    ₹{totalPrice + totalGstAmount - (appliedPromo?.discountAmount || 0)}
                  </span>
                </div>
              </div>
            </div>

            {/* PROMO */}
            {!appliedPromo && (
              <div className="border-t border-[#ececec] pt-4">
                <h3
                  className={`${inter.className} text-[16px] uppercase text-black`}
                >
                  Add a Promo Code
                </h3>

                <div className="mt-5 flex gap-3">
                  <input
                    type="text"
                    placeholder="Enter code"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                    className="flex-1 border border-[#d7d7d7] bg-white text-[13px] outline-none placeholder:text-[#a1a1a1] focus:border-black p-2"
                  />

                  <button
                    onClick={handleApplyPromo}
                    disabled={loadingPromo}
                    className="min-w-24 border border-[#d7d7d7] bg-[#f7f7f7] text-[13px] transition hover:bg-black hover:text-white disabled:opacity-50 p-2"
                  >
                    {loadingPromo ? "..." : "Apply"}
                  </button>
                </div>
              </div>
            )}

            {/* CHECKOUT */}
            <Link
              href="/checkout"
              className="mt-10 flex h-[40px] w-full items-center justify-center bg-black text-[14px] font-medium text-white transition hover:bg-[#1d1d1d]"
            >
              Continue to checkout
            </Link>

            {/* PAYMENT METHODS IMAGE */}
            <div className="mt-8">
              <img
                src="/home/footer/payment-method-69e7ec.svg"
                alt="Payment Methods"
                className="h-auto w-full max-w-[420px] object-contain"
              />
            </div>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {selectedItem && (
        <CartEditModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </section>
  );
}
