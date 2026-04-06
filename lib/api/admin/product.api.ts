import axios from "@/lib/api/axios";
import { ProductPayload } from "@/lib/constants/admin-catalog";
import { uploadMultipleImages } from "@/lib/cloudinary/upload";

// ✅ GET PRODUCTS
export const getProducts = () => axios.get("/products");

// ✅ CREATE PRODUCT (WITH CLOUDINARY)
export const createProduct = async (data: any, files: File[]) => {
  try {
    let images: any[] = data.images || [];

    if (files.length > 0) {
      const uploadedImages = await uploadMultipleImages(files);
      images = [...images, ...uploadedImages];
    }

    // ✅ set primary
    images = images.map((img, index) => ({
      ...img,
      isPrimary: index === (data.primaryImageIndex || 0),
    }));

    return axios.post("/products", {
      ...data,
      images,
    });

  } catch (error) {
    console.error("Create product error:", error);
    throw error;
  }
};

// ✅ UPDATE PRODUCT (NOW SUPPORTS IMAGE UPLOAD)
export const updateProduct = async (
  id: string,
  data: ProductPayload,
  files: File[] = []
) => {
  try {
    let images = data.images || [];

    // 🔥 If new files exist → upload
    if (files.length > 0) {
      const uploadedImages = await uploadMultipleImages(files);

      // ✅ Merge old + new images
      images = [...images, ...uploadedImages];
    }

    return axios.put(`/products/${id}`, {
      ...data,
      images,
    });

  } catch (error) {
    console.error("Update product error:", error);
    throw error;
  }
};

// ✅ DELETE PRODUCT
export const deleteProduct = (id: string) =>
  axios.delete(`/products/${id}`);