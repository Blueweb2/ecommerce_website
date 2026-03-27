import axios from "@/lib/api/axios";
import { ProductPayload } from "@/lib/constants/admin-catalog";

export const getProducts = () => axios.get("/products");

export const createProduct = (data: ProductPayload) =>
  axios.post("/products", data);

export const updateProduct = (id: string, data: ProductPayload) =>
  axios.put(`/products/${id}`, data);

export const deleteProduct = (id: string) =>
  axios.delete(`/products/${id}`);
