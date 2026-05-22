"use client";

import { calculateCheckoutTotals } from "@/lib/utils/pricing";
import type { CartItem } from "@/store/user/cart/useCartStore";

interface CheckoutTotalsBreakdownProps {
  items: CartItem[];
  shippingCharge?: number;
  discountAmount?: number;
  className?: string;
}

const formatCurrency = (amount: number) => `₹${Math.round(amount)}`;

export default function CheckoutTotalsBreakdown({
  items,
  shippingCharge = 0,
  discountAmount = 0,
  className = "",
}: CheckoutTotalsBreakdownProps) {
  const totals = calculateCheckoutTotals({
    items,
    shippingCharge,
    discountAmount,
  });

  return (
    <div className={`space-y-3 rounded border border-[#e5e5e5] bg-white p-6 ${className}`}>
      <div className="flex justify-between text-[15px]">
        <span>Item subtotal (excl. GST)</span>
        <span>{formatCurrency(totals.subtotal)}</span>
      </div>

      <div className="flex justify-between text-[15px]">
        <span>GST (from product slabs)</span>
        <span>{formatCurrency(totals.totalGstAmount)}</span>
      </div>

      <div className="flex justify-between text-[15px]">
        <span>Shipping</span>
        <span>{shippingCharge === 0 ? "FREE" : formatCurrency(shippingCharge)}</span>
      </div>

      {discountAmount > 0 && (
        <div className="flex justify-between text-[15px] text-emerald-700">
          <span>Discount</span>
          <span>-{formatCurrency(discountAmount)}</span>
        </div>
      )}

      <div className="flex justify-between border-t border-[#ececec] pt-4 text-[18px] font-medium">
        <span>Amount payable</span>
        <span>{formatCurrency(totals.grandTotal)}</span>
      </div>
    </div>
  );
}
