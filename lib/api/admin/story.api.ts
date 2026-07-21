// lib/api/admin/story.api.ts

import api from "@/lib/api/axios";
import type { Story, StoryPayload } from "@/types/story";

type StoryEnvelope<T> = {
  data: T;
  message?: string;
};

// ---------------------------------------------------------------------------
// Admin CRUD
// ---------------------------------------------------------------------------

export const getAdminStories = () =>
  api.get<StoryEnvelope<Story[]>>("/admin/stories");

export const getStories = getAdminStories;

export const getStoryById = async (id: string): Promise<Story | null> => {
  try {
    const res = await api.get<StoryEnvelope<Story>>(`/admin/stories/${id}`);
    return res.data.data;
  } catch {
    return null;
  }
};

export const createStory = (data: StoryPayload) =>
  api.post<StoryEnvelope<Story>>("/admin/stories", data);

export const updateStory = (id: string, data: StoryPayload) =>
  api.put<StoryEnvelope<Story>>(`/admin/stories/${id}`, data);

export const deleteStory = (id: string) =>
  api.delete(`/admin/stories/${id}`);
