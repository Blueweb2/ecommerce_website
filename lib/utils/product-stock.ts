type VariantLike = {
  stock?: number | string | null;
};

export function calculateVariantStock(variants?: VariantLike[] | null) {
  if (!variants?.length) {
    return 0;
  }

  return variants.reduce((sum, variant) => {
    const stock = Number(variant.stock) || 0;
    return sum + Math.max(0, stock);
  }, 0);
}

export function hasVariants(variants?: VariantLike[] | null) {
  return Boolean(variants?.length);
}
