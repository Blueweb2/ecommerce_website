// lib/api/story.api.ts

import api from "@/lib/api/axios";
import type { Story } from "@/types/story";
import type { StoryCategorySlug } from "@/lib/constants/storyCategories";

// ---------------------------------------------------------------------------
// GET /stories  – all active stories
// ---------------------------------------------------------------------------
export const getStories = async (): Promise<Story[]> => {
  const res = await api.get<{ data: Story[] }>("/stories");
  return Array.isArray(res.data.data) ? res.data.data : [];
};

// ---------------------------------------------------------------------------
// GET /stories/slug/:slug  – single story by slug
// ---------------------------------------------------------------------------
export const getStoryBySlug = async (slug: string): Promise<Story> => {
  const res = await api.get<{ data: Story }>(`/stories/slug/${slug}`);
  return res.data.data;
};

/** Alias used across editorial components */
export const getStory = getStoryBySlug;

// ---------------------------------------------------------------------------
// GET /stories/category/:category  – stories filtered by category (backend)
// ---------------------------------------------------------------------------
export const getStoriesByCategory = async (
  category: StoryCategorySlug
): Promise<Story[]> => {
  const res = await api.get<{ data: Story[] }>(
    `/stories/category/${category}`
  );
  return Array.isArray(res.data.data) ? res.data.data : [];
};

// ---------------------------------------------------------------------------
// GET /stories/featured/:category  – featured story for a category (backend)
// ---------------------------------------------------------------------------
export const getFeaturedStoryByCategory = async (
  category: StoryCategorySlug
): Promise<Story | null> => {
  const res = await api.get<{ data: Story | null }>(
    `/stories/featured/${category}`
  );
  return res.data.data ?? null;
};

// ---------------------------------------------------------------------------
// GET /stories/related/:slug?category=...  – related stories (backend)
// ---------------------------------------------------------------------------
export const getRelatedStories = async (
  slug: string,
  category: StoryCategorySlug,
  limit = 3
): Promise<Story[]> => {
  const res = await api.get<{ data: Story[] }>(`/stories/related/${slug}`, {
    params: { category, limit },
  });
  return Array.isArray(res.data.data) ? res.data.data : [];
};
