// types/story.ts

import type { StoryCategorySlug } from "@/lib/constants/storyCategories";
import type { Product } from "./product";

export type { StoryCategorySlug };

// ---------------------------------------------------------------------------
// Section layout
// ---------------------------------------------------------------------------
export type SectionLayout = "image-left" | "image-right" | "full-image" | "text";

// ---------------------------------------------------------------------------
// Image
// ---------------------------------------------------------------------------
export type StoryImage = {
  url: string;
  public_id: string;
  alt?: string;
};

// ---------------------------------------------------------------------------
// Section
// ---------------------------------------------------------------------------
export type StorySection = {
  _id?: string;
  layout: SectionLayout;
  heading?: string;
  content?: string;
  image?: StoryImage;
  caption?: string;
  /** ObjectIds when editing, full product objects when fetched */
  products?: string[] | Product[];
  order: number;
};

// ---------------------------------------------------------------------------
// Story
// ---------------------------------------------------------------------------
export type Story = {
  _id: string;
  title: string;
  slug: string;
  category: StoryCategorySlug;
  excerpt?: string;
  author?: string;
  publishDate?: string;
  featured: boolean;
  heroImage: StoryImage;
  sections: StorySection[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

// ---------------------------------------------------------------------------
// Payload (create / update)
// ---------------------------------------------------------------------------
export type StoryPayload = {
  title: string;
  slug?: string;
  category: StoryCategorySlug;
  excerpt?: string;
  author?: string;
  publishDate?: string;
  featured: boolean;
  heroImage?: StoryImage;
  sections: StorySection[];
  isActive: boolean;
};

// ---------------------------------------------------------------------------
// Form validation errors
// ---------------------------------------------------------------------------
export type StoryFieldErrors = Partial<
  Record<"title" | "category" | "excerpt" | "heroImage" | "sections", string>
>;
