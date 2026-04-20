import api from "@/lib/api/axios";


export const createBanner = async (data: any) => {
  const res = await api.post("/banner", data);
  return res.data;
};

export const getBanners = async () => {
  const res = await api.get("/banner");
  return res.data.data;
};

export const deleteBanner = async (id: string) => {
  const res = await api.delete(`/banner/${id}`);
  return res.data;
};