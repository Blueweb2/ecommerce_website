"use client";

import Image from "next/image";

import { useCartStore } from "@/store/user/cart/useCartStore";
import { resolveImageSrc } from "@/lib/utils/image";
import {
  calculateCheckoutTotals,
  getLineGstAmount,
} from "@/lib/utils/pricing";

interface CheckoutOrderSummaryProps {
  shippingCharge?: number;
}

const formatCurrency = (amount: number) =>
  `₹${Math.round(amount).toLocaleString("en-IN")}`;

const formatSelectedOptions = (
  selectedOptions: { fieldName: string; value: string }[] = []
) =>
  selectedOptions
    .map((option) => `${option.fieldName}: ${option.value}`)
    .join(" • ");

export default function CheckoutOrderSummary({
  shippingCharge = 0,
}: CheckoutOrderSummaryProps) {
  const { items, appliedPromo } = useCartStore();

  const discountAmount = appliedPromo?.discountAmount || 0;

  const totals = calculateCheckoutTotals({
    items,
    shippingCharge,
    discountAmount,
  });

  return (
    <aside className="w-full border-t border-[#ececec] bg-[#f8f8f8] lg:sticky lg:top-0 lg:h-screen lg:w-[430px] lg:border-l lg:border-t-0">
      
      <div className="flex h-full flex-col px-7 py-8 lg:px-8">
        
        {/* HEADER */}
        <div className="border-b border-[#dfdfdf] pb-8">
          <h2 className="text-[14px] uppercase tracking-[0.22em] text-[#222]">
            Your Order ({items.length})
          </h2>
        </div>

        {/* PRODUCTS */}
        {items.length === 0 ? (
          <div className="flex flex-1 items-center justify-center">
            <div className="rounded border border-dashed border-[#d6d6d6] bg-white px-8 py-10 text-center text-sm text-[#666]">
              Your cart is empty.
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto py-6 pr-1">
              <div className="space-y-7">
                {items.map((item, index) => (
                  <div
                    key={`${item.productId}-${item.variantId || "base"}-${index}`}
                    className="flex gap-5 border-b border-[#e7e7e7] pb-7"
                  >
                    {/* IMAGE */}
                    <div className="relative h-[135px] w-[100px] flex-shrink-0 overflow-hidden bg-[#f1f1f1]">
                      <Image
                        src={resolveImageSrc(item.image)}
                        alt={item.name}
                        fill
                        className="object-cover object-top"
                      />
                    </div>

                    {/* INFO */}
                    <div className="min-w-0 flex-1">
                      
                      {/* BRAND */}
                      <h3 className="text-[13px] font-medium uppercase tracking-[0.14em] text-black">
                        ZENFAZ
                      </h3>

                      {/* PRODUCT NAME */}
                      <p className="mt-2 text-[14px] leading-6 text-[#4b4b4b]">
                        {item.name}
                      </p>

                      {/* OPTIONS */}
                      {item.selectedOptions &&
                        item.selectedOptions.length > 0 && (
                          <p className="mt-3 text-[12px] leading-5 text-[#7a7a7a]">
                            {formatSelectedOptions(item.selectedOptions)}
                          </p>
                        )}

                      {/* QTY */}
                      <p className="mt-3 text-[12px] uppercase tracking-[0.08em] text-[#777]">
                        Qty: {item.quantity}
                        {item.isFabric
                          ? ` ${item.unit || "meter"}`
                          : ""}
                      </p>

                      {/* GST */}
                      {/* <p className="mt-2 text-[12px] text-[#8a8a8a]">
                        GST {item.gstPercentage || 0}% ·{" "}
                        {formatCurrency(getLineGstAmount(item))}
                      </p> */}

                      {/* PRICE */}
                      <p className="mt-4 text-[17px] font-medium text-black">
                        {formatCurrency(
                          item.price * item.quantity +
                            getLineGstAmount(item)
                        )}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* TOTALS */}
            <div className="border-t border-[#dcdcdc] pt-7">
              <div className="space-y-5">
                
                {/* SUBTOTAL */}
                <div className="flex items-center justify-between text-[15px] text-[#333]">
                  <span>Item subtotal</span>
                  <span>{formatCurrency(totals.subtotal)}</span>
                </div>

                {/* GST */}
                {/* <div className="flex items-center justify-between text-[15px] text-[#333]">
                  <span>GST</span>
                  <span>
                    {formatCurrency(totals.totalGstAmount)}
                  </span>
                </div> */}

                {/* SHIPPING */}
                <div className="flex items-center justify-between text-[15px] text-[#333]">
                  <span>Shipping</span>

                  <span>
                    {shippingCharge === 0
                      ? "FREE"
                      : formatCurrency(shippingCharge)}
                  </span>
                </div>

                {/* DISCOUNT */}
                {appliedPromo && (
                  <div className="flex items-center justify-between text-[15px] text-emerald-700">
                    <span>
                      Discount ({appliedPromo.code})
                    </span>

                    <span>
                      -{formatCurrency(discountAmount)}
                    </span>
                  </div>
                )}
              </div>

              {/* GRAND TOTAL */}
              <div className="mt-7 flex items-center justify-between border-t border-[#dcdcdc] pt-7">
                <span className="text-[24px] tracking-[0.03em] text-black">
                  Total
                </span>

                <span className="text-[26px] font-medium tracking-[0.01em] text-black">
                  {formatCurrency(totals.grandTotal)}
                </span>
              </div>

              {/* TAX NOTE */}
              <p className="mt-4 text-[11px] leading-5 text-[#8a8a8a]">
                Including all applicable GST charges.
              </p>
            </div>
          </>
        )}
      </div>
    </aside>
  );
}