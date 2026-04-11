import api from "@/lib/api/axios";

export const addressAPI = {
  getAll: () => api.get("/address"),
  create: (data: any) => api.post("/address", data),
  update: (id: string, data: any) => api.put(`/address/${id}`, data),
  delete: (id: string) => api.delete(`/address/${id}`),
   setDefault: (id: string) =>
    api.patch(`/address/${id}/default`),
};