import api from "@/lib/api/axios";

export const createStory = (data: any) =>
  api.post("/stories", data);

export const getStories = () =>
  api.get("/stories");

export const deleteStory = (id: string) =>
  api.delete(`/stories/${id}`);