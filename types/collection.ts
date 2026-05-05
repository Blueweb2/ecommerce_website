import { Product } from "@/types/product";

type CollectionImage =
  | string
  | {
      url?: string;
      alt?: string;
      altText?: string;
      public_id?: string;
      isPrimary?: boolean;
    }
  | null
  | undefined;

export type CollectionPriceRange = {
  min?: number;
  max?: number;
};

export type CollectionFilters = {
  category?: string | { _id: string; slug: string; name?: string };
  type?: string;
  tags?: string[];
  priceRange?: CollectionPriceRange;
};

export type CollectionCategory =
  | string
  | {
      _id?: string;
      slug: string;
      name?: string;
    }
  | null
  | undefined;

export type Collection = {
  _id?: string;
  slug: string;
  title?: string;
  name?: string;
  description?: string;
  excerpt?: string;
  bannerImage?: CollectionImage;
  image?: CollectionImage;
  category?: CollectionCategory;
  filters?: CollectionFilters;
  cta?: string;
  priority?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type CollectionResponse = {
  success: boolean;
  collection: Collection;
  products: Product[];
};

export type CollectionListResponse =
  | {
      success?: boolean;
      collections?: Collection[];
      data?: Collection[] | { collections?: Collection[] };
    }
  | Collection[];

export type CollectionDetailResponse =
  | {
      success?: boolean;
      collection?: Collection;
      data?: Collection | { collection?: Collection };
    }
  | Collection;

export type CollectionPayload = {
  title: string;
  slug: string;
  description?: string;
  category: string;
  image?: Exclude<CollectionImage, string | null | undefined>;
  bannerImage?: Exclude<CollectionImage, string | null | undefined>;
  cta?: string;
  priority?: number;
  isActive?: boolean;
  filters?: {
    category?: string;
    type?: string;
    tags: string[];
    priceRange: CollectionPriceRange;
  };
};
