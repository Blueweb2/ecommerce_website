// ✅ SECTION OPTIONS
export const PRODUCT_SECTION_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "best-seller", label: "Best Seller" },
  { value: "new-arrival", label: "New Arrival" },
  { value: "top-rated", label: "Top Rated" },
] as const;

export type ProductSectionValue =
  (typeof PRODUCT_SECTION_OPTIONS)[number]["value"];


// 🔥 COMMON IMAGE TYPE (FINAL)
export type CatalogImage = {
  _id?: string;
  url: string;
  public_id: string;
  altText?: string;
  isPrimary?: boolean;
};


// ✅ CATEGORY / GENERIC ENTITY
export type CatalogEntity = {
  _id: string;
  name: string;
  slug?: string;
  description?: string;
  image?: CatalogImage;
  isActive?: boolean;
};


// ✅ CATEGORY PAYLOAD
export type CategoryPayload = {
  name: string;
  description?: string;
  image?: CatalogImage;
};


// ✅ PRODUCT VARIANT
export type ProductVariant = {
  size: string;
  color: string;
  stock?: number;
  price?: number;
};


// ❌ REMOVE string | ... → STRICT TYPE
export type CatalogProductImage = CatalogImage;


// ✅ PRODUCT TYPE
export type CatalogProduct = {
  _id: string;
  sku?: string;
  name: string;
  description?: string;
  price: number;
  stock?: number;
  isPublished?: boolean;
  images?: CatalogProductImage[];
  category?: CatalogEntity | string | null; // keep union (backend reality)
  sections?: string[];
  variants?: ProductVariant[];
  createdAt?: string;
  updatedAt?: string;
};


// ✅ PRODUCT PAYLOAD
export type ProductPayload = {
  name: string;
  price: number;
  description: string;
  category: string;
  sections: string[];
  images: CatalogImage[];
  stock: number;
  isPublished: boolean;
  variants?: ProductVariant[];
};


// ✅ API ERROR TYPE
export type ApiErrorResponse = {
  response?: {
    data?: {
      message?: string;
    };
  };
};


// 🔥 HELPERS

export function getSectionLabel(section: string) {
  return (
    PRODUCT_SECTION_OPTIONS.find((item) => item.value === section)?.label ||
    section
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ")
  );
}


// ✅ SAFE (NO string case anymore)
export function getProductImageUrl(image?: CatalogProductImage | null) {
  return image?.url || "";
}


// ✅ PRIMARY IMAGE
export function getPrimaryProductImage(
  images?: CatalogProductImage[] | null
) {
  if (!images?.length) return undefined;

  return images.find((img) => img.isPrimary) || images[0];
}


// ✅ IMAGE ID
export function getProductImageId(image?: CatalogProductImage | null) {
  return image?._id || "";
}