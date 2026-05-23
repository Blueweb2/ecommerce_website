import api from "@/lib/api/axios";
import type { AddressInput } from "@/types/address";

export const addressAPI = {
  getAll: () => api.get("/address"),
  create: (data: AddressInput) => api.post("/address", data),
  update: (id: string, data: Partial<AddressInput>) =>
    api.put(`/address/${id}`, data),
  delete: (id: string) => api.delete(`/address/${id}`),
  setDefault: (id: string) => api.patch(`/address/${id}/default`),
};
