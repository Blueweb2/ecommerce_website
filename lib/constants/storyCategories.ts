// lib/constants/storyCategories.ts
// Single source of truth for editorial categories on the frontend.

export const STORY_CATEGORIES = [
  { label: "Fashion", slug: "fashion" },
  { label: "Beauty", slug: "beauty" },
  { label: "Jewelry & Watches", slug: "jewelry-watches" },
  { label: "Reporter", slug: "reporter" },
  { label: "Cover Stories", slug: "cover-stories" },
  { label: "Incredible Women", slug: "incredible-women" },
  { label: "Lifestyle", slug: "lifestyle" },
  { label: "Video", slug: "video" },
] as const;

export type StoryCategorySlug = (typeof STORY_CATEGORIES)[number]["slug"];

/** Slug → display label map for quick lookups */
export const STORY_CATEGORY_MAP = Object.fromEntries(
  STORY_CATEGORIES.map((c) => [c.slug, c.label])
) as Record<StoryCategorySlug, string>;

/** Default category slug */
export const DEFAULT_STORY_CATEGORY_SLUG: StoryCategorySlug = "fashion";
