import api from "@/lib/api/axios";

export const getBanners = async () => {
  const res = await api.get("/banner");
  return res.data.data;
};