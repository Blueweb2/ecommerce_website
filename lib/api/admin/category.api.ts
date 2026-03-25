import axios from "@/lib/api/axios";

export const getCategories = () => axios.get("/categories");

export const createCategory = (data: any) =>
  axios.post("/categories", data);

export const updateCategory = (id: string, data: any) =>
  axios.put(`/categories/${id}`, data);

export const deleteCategory = (id: string) =>
  axios.delete(`/categories/${id}`);