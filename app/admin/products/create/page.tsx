"use client";

import ProductForm from "@/components/admin/products/ProductForm";
import { useProductStore } from "@/store/admin/useProductStore";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  ApiErrorResponse,
  ProductPayload,
} from "@/lib/constants/admin-catalog";
import { uploadMultipleImages } from "@/lib/cloudinary/upload";


export default function CreateProductPage() {
  const { createProduct } = useProductStore();
  const router = useRouter();

  // ✅ FIXED: now receives files also

const handleSubmit = async (
  data: ProductPayload,
  files: File[]
) => {
  try {
    // 🔥 STEP 1: Upload images to Cloudinary
    const uploadedImages = await uploadMultipleImages(files);

    // 🔥 STEP 2: Attach images to payload
    const payload = {
      ...data,
      images: uploadedImages, // ✅ THIS IS THE FIX
    };

    // 🔥 STEP 3: Send to backend
    await createProduct(payload, []); // no need files anymore

    toast.success("Product created successfully");
    router.push("/admin/products");
  } catch (error: unknown) {
    const apiError = error as ApiErrorResponse;

    toast.error(
      apiError.response?.data?.message ||
        "Error creating product"
    );
  }
};

  return (
    <div className="space-y-6">
      
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          Create Product
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Add a new product with category, section tags, and media.
        </p>
      </div>

      {/* ✅ IMPORTANT: ProductForm must send (data, files) */}
      <ProductForm onSubmit={handleSubmit} />
      
    </div>
  );
}