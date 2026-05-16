"use client";

import Link from "next/link";
import { CartItem, useCartStore } from "@/store/user/cart/useCartStore";
import { ShoppingCart } from "lucide-react";
import { bodoni, inter } from "@/lib/fonts";
import { useState } from "react";
import CartEditModal from "@/components/cart/CartEditModal";
import { validatePromo } from "@/lib/api/promo.api";
import toast from "react-hot-toast";

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
    <section className="mt-8 w-full bg-[#f5f5f5] py-10 font-sans">
      <div className="mx-auto grid max-w-[2000px] gap-14 px-4 p-6 md:mt-20 md:grid-cols-[1fr_420px] md:px-24">

        {/* LEFT SIDE */}
        <div>
          <h1
            className={`${bodoni.className} border-b border-[#d8d8d8] pb-6 text-[42px] font-normal tracking-[-0.5px] text-black`}
          >
            Shopping Bag
          </h1>

          <div className="space-y-10 pt-8">
            {items.map((item, index) => (
              <div
                key={`${item.productId}-${item.variantId || "base"}-${index}`}
                className="group flex gap-7"
              >
                {/* CLICKABLE PRODUCT */}
                <button
                  onClick={() => setSelectedItem(item)}
                  className="flex flex-1 gap-7 text-left"
                >
                  {/* IMAGE */}
                  <div className="overflow-hidden bg-[#f1f1f1]">
                    <img
                      src={item.image || "/placeholder.png"}
                      alt={item.name}
                      className="h-[210px] w-[160px] object-cover transition duration-500 group-hover:scale-[1.02]"
                    />
                  </div>

                  {/* CONTENT */}
                  <div className="flex flex-1 flex-col pt-1">

                    {/* BRAND */}
                    <h2
                      className={`${inter.className} text-[26px] font-semibold uppercase tracking-[-0.3px] text-black`}
                    >
                      {item.name}
                    </h2>

                    {/* TITLE */}
                    <p
                      className={`${inter.className} mt-1 text-[20px] font-light leading-[1.5] text-[#4a4a4a]`}
                    >
                      {item.name}
                    </p>

                    {/* OPTIONS */}
                    <div
                      className={`${inter.className} mt-4 flex flex-wrap items-center gap-3 text-[18px] text-[#5d5d5d]`}
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
                      className={`${inter.className} mt-5 text-[30px] font-semibold tracking-[-0.5px] text-black`}
                    >
                      ₹{item.price}
                    </p>

                    {/* LOW STOCK */}
                    <p
                      className={`${inter.className} mt-4 text-[15px] uppercase tracking-[4px] text-[#6e6e6e]`}
                    >
                      Low Stock
                    </p>

                    {/* ACTIONS */}
                    <div
                      className={`${inter.className} mt-10 flex items-center gap-5 text-[15px] text-[#6a6a6a]`}
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
        <div className="h-fit md:sticky md:top-28">
          <div className="border border-[#e5e5e5] bg-white p-8">

            {/* TITLE */}
            <h2
              className={`${inter.className} text-[18px] uppercase tracking-[5px] text-black`}
            >
              Order Summary
            </h2>

            {/* SUMMARY */}
            <div className="mt-8 space-y-6">
              <div className="flex items-center justify-between text-[17px] text-[#4a4a4a]">
                <span>Item subtotal</span>
                <span>₹{totalPrice}</span>
              </div>

              <div className="flex items-center justify-between text-[17px] text-[#4a4a4a]">
                <span>Shipping</span>
                <span>FREE</span>
              </div>

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

              <div className="border-t border-[#e5e5e5] pt-6">
                <div className="flex items-center justify-between">
                  <span
                    className={`${inter.className} text-[18px] font-semibold text-black`}
                  >
                    Total
                  </span>

                  <span
                    className={`${inter.className} text-[30px] font-semibold tracking-[-0.5px] text-black`}
                  >
                    ₹{totalPrice + totalGstAmount - (appliedPromo?.discountAmount || 0)}
                  </span>
                </div>
              </div>
            </div>

            {/* PROMO */}
            {!appliedPromo && (
              <div className="mt-10 border-t border-[#ececec] pt-8">
                <h3
                  className={`${inter.className} text-[16px] uppercase tracking-[4px] text-black`}
                >
                  Add a Promo Code
                </h3>

                <div className="mt-5 flex gap-3">
                  <input
                    type="text"
                    placeholder="Enter code"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                    className="h-[54px] flex-1 border border-[#d7d7d7] bg-white px-5 text-[15px] outline-none placeholder:text-[#a1a1a1] focus:border-black"
                  />

                  <button
                    onClick={handleApplyPromo}
                    disabled={loadingPromo}
                    className="h-[54px] min-w-[120px] border border-[#d7d7d7] bg-[#f7f7f7] px-6 text-[15px] transition hover:bg-black hover:text-white disabled:opacity-50"
                  >
                    {loadingPromo ? "..." : "Apply"}
                  </button>
                </div>
              </div>
            )}

            {/* CHECKOUT */}
            <Link
              href="/checkout"
              className="mt-10 flex h-[60px] w-full items-center justify-center bg-black text-[16px] font-medium text-white transition hover:bg-[#1d1d1d]"
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
