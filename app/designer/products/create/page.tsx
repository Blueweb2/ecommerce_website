"use client";

import ProductForm from "@/components/admin/products/ProductForm";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  ApiErrorResponse,
  ProductPayload,
} from "@/lib/constants/admin-catalog";
import { uploadMultipleImages } from "@/lib/cloudinary/upload";
import { createMyProduct } from "@/lib/api/designer/designer-portal.api";

export default function CreateProductPage() {
  const router = useRouter();

  const handleSubmit = async (
    data: ProductPayload,
    files: File[]
  ) => {
    try {
      // Upload images to Cloudinary
      const primaryIndex = data.primaryImageIndex ?? 0;
      const uploadedImages = await uploadMultipleImages(files, "ecommerce/products", primaryIndex, true);

      const payload = {
        ...data,
        images: uploadedImages,
      };

      await createMyProduct(payload);

      toast.success("Product created successfully");
      router.push("/designer/products");
    } catch (error: unknown) {
      const apiError = error as ApiErrorResponse;
      toast.error(
        apiError.response?.data?.message ||
          "Failed to create product"
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
          Add a new product to your catalog.
        </p>
      </div>

      <ProductForm onSubmit={handleSubmit} isDesignerPortal={true} />
    </div>
  );
}