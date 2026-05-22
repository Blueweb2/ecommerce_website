"use client";

import Image from "next/image";

import { useCartStore } from "@/store/user/cart/useCartStore";
import { resolveImageSrc } from "@/lib/utils/image";
import { calculateCheckoutTotals, getLineGstAmount } from "@/lib/utils/pricing";

interface CheckoutOrderSummaryProps {
  shippingCharge?: number;
}

const formatCurrency = (amount: number) => `₹${Math.round(amount)}`;

const formatSelectedOptions = (
  selectedOptions: { fieldName: string; value: string }[] = []
) => selectedOptions.map((option) => `${option.fieldName}: ${option.value}`).join(", ");

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
    <aside className="w-full border-l border-[#ececec] bg-[#fafafa] p-8 lg:w-[360px]">
      <h2 className="mb-8 text-[14px] uppercase tracking-[0.2em] text-[#555]">
        Your Order ({items.length})
      </h2>

      {items.length === 0 ? (
        <div className="rounded border border-dashed border-[#d6d6d6] bg-white p-6 text-center text-sm text-[#666]">
          Your cart is empty.
        </div>
      ) : (
        <div className="space-y-8">
          {items.map((item, index) => (
            <div
              key={`${item.productId}-${item.variantId || "base"}-${index}`}
              className="flex gap-4 border-b border-[#ececec] pb-8"
            >
              <div className="relative h-[110px] w-[85px] overflow-hidden bg-[#f5f5f5]">
                <Image
                  src={resolveImageSrc(item.image)}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex-1">
                <h3 className="text-[14px] font-semibold uppercase text-black">
                  ZENFAZ
                </h3>

                <p className="mt-1 text-[13px] leading-6 text-[#666]">
                  {item.name}
                </p>

                {item.selectedOptions && item.selectedOptions.length > 0 && (
                  <p className="mt-1 text-[12px] text-[#777]">
                    {formatSelectedOptions(item.selectedOptions)}
                  </p>
                )}

                <p className="mt-2 text-[12px] uppercase tracking-[0.08em] text-[#777]">
                  Qty: {item.quantity}
                  {item.isFabric ? ` ${item.unit || "meter"}` : ""}
                </p>

                <p className="mt-2 text-[12px] text-[#777]">
                  GST {item.gstPercentage || 0}% · {formatCurrency(getLineGstAmount(item))}
                </p>

                <p className="mt-2 text-[14px] font-medium">
                  {formatCurrency(item.price * item.quantity + getLineGstAmount(item))}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-10 space-y-4 border-t border-[#e5e5e5] pt-8">
        <div className="flex justify-between text-[15px]">
          <span>Item subtotal (excl. GST)</span>
          <span>{formatCurrency(totals.subtotal)}</span>
        </div>

        <div className="flex justify-between text-[15px]">
          <span>GST</span>
          <span>{formatCurrency(totals.totalGstAmount)}</span>
        </div>

        <div className="flex justify-between text-[15px]">
          <span>Shipping</span>
          <span>{shippingCharge === 0 ? "FREE" : formatCurrency(shippingCharge)}</span>
        </div>

        {appliedPromo && (
          <div className="flex justify-between text-[15px] text-emerald-700">
            <span>Discount ({appliedPromo.code})</span>
            <span>-{formatCurrency(discountAmount)}</span>
          </div>
        )}

        <div className="flex justify-between border-t border-[#ececec] pt-5 text-[20px]">
          <span>Total</span>
          <span>{formatCurrency(totals.grandTotal)}</span>
        </div>
      </div>
    </aside>
  );
}
