export function getDiscountPercent(
  price?: number,
  discountPrice?: number
) {
  if (!price || !discountPrice || discountPrice >= price) return 0;

  return Math.round(((price - discountPrice) / price) * 100);
}

// optional helper (very useful)
export function getYouSave(
  price?: number,
  discountPrice?: number
) {
  if (!price || !discountPrice || discountPrice >= price) return 0;

  return price - discountPrice;
}