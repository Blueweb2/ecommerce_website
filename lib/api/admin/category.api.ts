import api from "@/lib/api/axios";
import { CategoryPayload } from "@/lib/constants/admin-catalog";

export const getCategories = () => api.get("/categories");

export const createCategory = (data: CategoryPayload) =>
  api.post("/categories", data);

export const updateCategory = (id: string, data: CategoryPayload) =>
  api.put(`/categories/${id}`, data);

export const deleteCategory = (id: string) =>
  api.delete(`/categories/${id}`);


  export const getCategoryById = (id: string) => api.get(`/categories/${id}`);
