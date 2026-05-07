type OrderLineItem = {
  price?: number;
  quantity?: number;
  gstPercentage?: number;
  gstAmount?: number;
};

type OrderTotalsInput = {
  items?: OrderLineItem[];
  totalPrice?: number;
  totalGstAmount?: number;
  grandTotal?: number;
};

const roundCurrency = (amount: number) =>
  Math.round((amount + Number.EPSILON) * 100) / 100;

export function getOrderTotals(order: OrderTotalsInput) {
  const items = Array.isArray(order.items) ? order.items : [];
  const hasItems = items.length > 0;

  const calculatedSubtotal = items.reduce((sum, item) => {
    const price = Number(item.price) || 0;
    const quantity = Number(item.quantity) || 0;
    return sum + price * quantity;
  }, 0);

  const calculatedGst = items.reduce((sum, item) => {
    const price = Number(item.price) || 0;
    const quantity = Number(item.quantity) || 0;
    const unitGst =
      typeof item.gstAmount === "number"
        ? item.gstAmount
        : (price * (Number(item.gstPercentage) || 0)) / 100;

    return sum + unitGst * quantity;
  }, 0);

  const subtotal = hasItems
    ? roundCurrency(calculatedSubtotal)
    : Number(order.totalPrice) || 0;
  const totalGstAmount = hasItems
    ? roundCurrency(calculatedGst)
    : Number(order.totalGstAmount) || 0;
  const grandTotal = hasItems
    ? roundCurrency(subtotal + totalGstAmount)
    : Number(order.grandTotal) || roundCurrency(subtotal + totalGstAmount);

  return {
    subtotal,
    totalGstAmount,
    grandTotal,
  };
}
