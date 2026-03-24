import axios from "@/lib/api/axios";

export const getProducts = () => axios.get("/products");

export const createProduct = (data: any) =>
  axios.post("/products", data);

export const updateProduct = (id: string, data: any) =>
  axios.put(`/products/${id}`, data);

export const deleteProduct = (id: string) =>
  axios.delete(`/products/${id}`);