export const PRODUCT_SECTION_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "best-seller", label: "Best Seller" },
  { value: "new-arrival", label: "New Arrival" },
  { value: "top-rated", label: "Top Rated" },
] as const;

export type ProductSectionValue =
  (typeof PRODUCT_SECTION_OPTIONS)[number]["value"];

export type CatalogEntity = {
  _id: string;
  name: string;
  slug?: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  banner?: string;
  isActive?: boolean;
};

export type CategoryPayload = {
  name: string;
  description: string;
  image: string;
  imageAlt: string;
};

export type ProductVariant = {
  size: string;
  color: string;
  stock?: number;
  price?: number;
};

export type CatalogProductImage =
  | string
  | {
      _id?: string;
      url: string;
      isPrimary?: boolean;
      alt?: string;
    };

export type CatalogProduct = {
  _id: string;
  sku?: string;
  name: string;
  description?: string;
  price: number;
  stock?: number;
  isPublished?: boolean;
  imageAlt?: string;
  images?: CatalogProductImage[];
  category?: CatalogEntity | string | null;
  sections?: string[];
  variants?: ProductVariant[];
  createdAt?: string;
  updatedAt?: string;
};

export type ProductPayload = {
  name: string;
  price: number;
  description: string;
  category: string;
  sections: string[];
  images: string[];
  imageAlt: string;
  stock: number;
  isPublished: boolean;
  variants?: ProductVariant[];
};

export type ApiErrorResponse = {
  response?: {
    data?: {
      message?: string;
    };
  };
};

export function getSectionLabel(section: string) {
  return (
    PRODUCT_SECTION_OPTIONS.find((item) => item.value === section)?.label ||
    section
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ")
  );
}

export function getProductImageUrl(image?: CatalogProductImage | null) {
  if (!image) return "";
  return typeof image === "string" ? image : image.url;
}

export function getPrimaryProductImage(images?: CatalogProductImage[] | null) {
  if (!images?.length) return undefined;

  return (
    images.find((image) => typeof image !== "string" && image.isPrimary) ||
    images[0]
  );
}

export function getProductImageId(image?: CatalogProductImage | null) {
  if (!image || typeof image === "string") return "";
  return image._id || "";
}
