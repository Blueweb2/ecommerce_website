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
  parent?: string | CatalogEntity | null; // 🔥 important
  isActive?: boolean;
};


// ✅ CATEGORY PAYLOAD
export type CategoryPayload = {
  name: string;
  description?: string;
  image?: CatalogImage;
  parent?: string | null; // 🔥 REQUIRED for subcategory
  slug?: string;
};

// ✅ PRODUCT VARIANT
export interface ProductVariant {
  attributes: Record<string, string>; // 🔥 IMPORTANT
  stock: number;
  price?: number;
  discountPrice?: number;
  sku?: string;
  images?: CatalogImage[];
  isActive?: boolean;
}

export type CustomField = {
  name: string;
  type: "text" | "number" | "select";
  required?: boolean;
  options?: string[];
  unit?: string;
};

export type CustomizableConfig = {
  isCustomizable: boolean;
  fields: CustomField[];
};

export type CustomDataItem = {
  fieldName: string;
  value: string | number;
};

// ❌ REMOVE string | ... → STRICT TYPE
export type CatalogProductImage = CatalogImage;


// ✅ PRODUCT TYPE
export type CatalogProduct = {
  _id: string;

  name: string;
  slug?: string;
  sku?: string;

  description?: string;
  deliveryDetails?: string;
  keyFeatures?: string[];

  price: number;
  discountPrice?: number; // ✅ ADD THIS
  isOnSale: boolean;

  brand?: string; // ✅ ADD THIS

  stock?: number;
  isPublished?: boolean;

  images?: CatalogProductImage[];

  category?: CatalogEntity | string | null;

  sections?: string[];

  attributes?: {
    name: string;
    values: string[];
  }[]; // ✅ ADD THIS

  variants?: ProductVariant[];

  customizable?: CustomizableConfig;

  createdAt?: string;
  updatedAt?: string;
};


// ✅ PRODUCT PAYLOAD
export type ProductPayload = {
  name: string;
  price: number;
  description: string;
  deliveryDetails: string;   // ✅ ADD
  keyFeatures: string[];
  category: string;
  sections: string[];
  images: CatalogImage[];
  stock: number;
  isPublished: boolean;
  isOnSale: boolean;
  discountPrice?: number;

   customizable?: CustomizableConfig;

  attributes?: {
    name: string;
    values: string[];
  }[]; 

  variants?: ProductVariant[];
  primaryImageIndex?: number;
};

export type SelectedOption = {
  fieldName: string;
  value: string;
};



export interface CartItem {
  productId: string;

  name: string;
  image?: string;

  price: number;
  quantity: number;

  variantId?: string; // ✅ FIXED

  selectedOptions?: SelectedOption[]; // ✅ FIXED
}
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