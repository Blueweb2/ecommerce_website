import axios, { type AxiosResponse } from "axios";
import api from "@/lib/api/axios";
import type { Story, StoryPayload } from "@/types/story";

type StoryEnvelope<T> = {
  data: T;
  message?: string;
};

function unwrapStoryResponse<T>(response: AxiosResponse<StoryEnvelope<T>>) {
  return response.data.data;
}

async function tryGetStory(url: string): Promise<Story | null> {
  try {
    const response = await api.get<StoryEnvelope<Story>>(url);
    return unwrapStoryResponse(response);
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
    throw error;
  }
}

export const createStory = (data: StoryPayload) =>
  api.post<StoryEnvelope<Story>>("/admin/stories", data);

export const getStories = () =>
  api.get<StoryEnvelope<Story[]>>("/stories");

export const getStoryById = async (id: string): Promise<Story | null> => {
  const primaryStory = await tryGetStory(`/stories/${id}`);
  if (primaryStory) return primaryStory;

  const adminStory = await tryGetStory(`/admin/stories/${id}`);
  if (adminStory) return adminStory;

  const response = await getStories();
  return unwrapStoryResponse(response).find((story) => story._id === id) ?? null;
};

export const updateStory = async (id: string, data: StoryPayload) => {
  try {
    return await api.put<StoryEnvelope<Story>>(`/admin/stories/${id}`, data);
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return api.put<StoryEnvelope<Story>>(`/stories/${id}`, data);
    }
    throw error;
  }
};

export const deleteStory = (id: string) =>
  api.delete(`/admin/stories/${id}`);
