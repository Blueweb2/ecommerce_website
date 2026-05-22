export type PricedLineItem = {
  price: number;
  quantity: number;
  gstPercentage?: number;
  gstAmount?: number;
};

export const roundCurrency = (amount: number) =>
  Math.round((amount + Number.EPSILON) * 100) / 100;

/** GST per single unit (from product slab %). */
export const getUnitGstAmount = (item: PricedLineItem): number => {
  const price = Number(item.price) || 0;
  const gstPercentage = Number(item.gstPercentage) || 0;
  return roundCurrency((price * gstPercentage) / 100);
};

/** GST for the full line (unit GST × quantity). */
export const getLineGstAmount = (item: PricedLineItem): number => {
  const quantity = Number(item.quantity) || 0;
  return roundCurrency(getUnitGstAmount(item) * quantity);
};

export const calculateCheckoutTotals = (params: {
  items: PricedLineItem[];
  shippingCharge?: number;
  discountAmount?: number;
}) => {
  const items = Array.isArray(params.items) ? params.items : [];
  const shippingCharge = Number(params.shippingCharge) || 0;
  const discountAmount = Number(params.discountAmount) || 0;

  const subtotal = roundCurrency(
    items.reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 0), 0)
  );

  const totalGstAmount = roundCurrency(
    items.reduce((sum, item) => sum + getLineGstAmount(item), 0)
  );

  const grandTotal = roundCurrency(
    Math.max(0, subtotal + totalGstAmount + shippingCharge - discountAmount)
  );

  return {
    subtotal,
    totalGstAmount,
    shippingCharge,
    discountAmount,
    grandTotal,
  };
};
