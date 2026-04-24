export const COLLECTION_TYPE_OPTIONS = [
  { value: "apparel", label: "Apparel" },
  { value: "footwear", label: "Footwear" },
  { value: "accessories", label: "Accessories" },
  { value: "jewelry", label: "Jewelry" },
  { value: "beauty", label: "Beauty" },
  { value: "home", label: "Home" },
] as const;

export const COLLECTION_TAG_OPTIONS = [
  { value: "new-arrival", label: "New Arrival" },
  { value: "best-seller", label: "Best Seller" },
  { value: "minimal", label: "Minimal" },
  { value: "premium", label: "Premium" },
  { value: "everyday", label: "Everyday" },
  { value: "occasion", label: "Occasion" },
  { value: "statement", label: "Statement" },
  { value: "limited-edition", label: "Limited Edition" },
] as const;

export function slugifyCollectionTitle(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
