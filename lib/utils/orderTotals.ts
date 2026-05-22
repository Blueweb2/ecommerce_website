import {
  calculateCheckoutTotals,
  getLineGstAmount,
  roundCurrency,
  type PricedLineItem,
} from "@/lib/utils/pricing";

type OrderLineItem = PricedLineItem;

type OrderTotalsInput = {
  items?: OrderLineItem[];
  totalPrice?: number;
  totalGstAmount?: number;
  grandTotal?: number;
  shippingCharge?: number;
  discountAmount?: number;
};

export function getOrderTotals(order: OrderTotalsInput) {
  const items = Array.isArray(order.items) ? order.items : [];
  const shippingCharge = Number(order.shippingCharge) || 0;
  const discountAmount = Number(order.discountAmount) || 0;

  if (items.length > 0) {
    const calculated = calculateCheckoutTotals({
      items,
      shippingCharge,
      discountAmount,
    });

    return {
      subtotal: calculated.subtotal,
      totalGstAmount: calculated.totalGstAmount,
      shippingCharge: calculated.shippingCharge,
      discountAmount: calculated.discountAmount,
      grandTotal:
        typeof order.grandTotal === "number" && order.grandTotal > 0
          ? roundCurrency(order.grandTotal)
          : calculated.grandTotal,
    };
  }

  const subtotal = Number(order.totalPrice) || 0;
  const totalGstAmount = Number(order.totalGstAmount) || 0;

  return {
    subtotal: roundCurrency(subtotal),
    totalGstAmount: roundCurrency(totalGstAmount),
    shippingCharge: roundCurrency(shippingCharge),
    discountAmount: roundCurrency(discountAmount),
    grandTotal: roundCurrency(
      typeof order.grandTotal === "number" && order.grandTotal > 0
        ? order.grandTotal
        : subtotal + totalGstAmount + shippingCharge - discountAmount
    ),
  };
}

export { getLineGstAmount };
