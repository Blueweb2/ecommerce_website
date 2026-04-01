import axios from "@/lib/api/axios";
import { ProductPayload } from "@/lib/constants/admin-catalog";

// ✅ GET PRODUCTS
export const getProducts = () => axios.get("/products");

// ✅ CREATE PRODUCT (FIXED FOR MULTIPART)
export const createProduct = async (
  data: ProductPayload,
  files: File[]
) => {
  const formData = new FormData();

  // 🔹 Basic fields
  formData.append("name", data.name);
  formData.append("description", data.description);
  formData.append("price", String(data.price));
  formData.append("category", data.category);
  formData.append("stock", String(data.stock));
  formData.append("isPublished", String(data.isPublished));

  // 🔹 Sections (array)
  data.sections.forEach((section) => {
    formData.append("sections", section);
  });

  // 🔥 Attributes (JSON → string)
  if (data.attributes) {
    formData.append("attributes", JSON.stringify(data.attributes));
  }

  // 🔥 Variants (JSON → string)
  if (data.variants) {
    formData.append("variants", JSON.stringify(data.variants));
  }

  // 🔥 Images (FILES)
  files.forEach((file) => {
    formData.append("images", file);
  });

  return axios.post("/products", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    withCredentials: true,
  });
};

// ✅ UPDATE PRODUCT (KEEP JSON unless adding file upload later)
export const updateProduct = (id: string, data: ProductPayload) =>
  axios.put(`/products/${id}`, data);

// ✅ DELETE PRODUCT
export const deleteProduct = (id: string) =>
  axios.delete(`/products/${id}`);