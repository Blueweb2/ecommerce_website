// lib/api/cloudinary/delete.ts
import api from "@/lib/api/axios";

export const deleteImage = async (public_id: string) => {
  try {
    const res = await api.delete("/cloudinary/delete", {
      data: { public_id },
    });

    return res.data;
  } catch (error: any) {
    console.error("Delete image error:", error);
    throw error?.response?.data || error;
  }
};