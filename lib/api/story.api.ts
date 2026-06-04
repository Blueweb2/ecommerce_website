import api from "@/lib/api/axios";

//  GET ALL STORIES
export const getStories = async () => {
  const res = await api.get("/stories");
  return res.data.data;
};

//  GET STORY BY SLUG (ADD THIS)
export const getStoryBySlug = async (slug: string) => {
  const res = await api.get(`/stories/slug/${slug}`);
  return res.data.data;
};