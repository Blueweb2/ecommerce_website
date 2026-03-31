import axios from "@/lib/api/axios";
import { CategoryPayload } from "@/lib/constants/admin-catalog";

export const getCategories = () => axios.get("/categories");

export const createCategory = (data: CategoryPayload) =>
  axios.post("/categories", data);

export const updateCategory = (id: string, data: CategoryPayload) =>
  axios.put(`/categories/${id}`, data);

export const deleteCategory = (id: string) =>
  axios.delete(`/categories/${id}`);


  export const getCategoryById = (id: string) => axios.get(`/categories/${id}`);
