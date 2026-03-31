import api from "@/lib/api/axios";

export const getAllCategories = async () => {
  return api.get("/categories"); // adjust if needed
  
};