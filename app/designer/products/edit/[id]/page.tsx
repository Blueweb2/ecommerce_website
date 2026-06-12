"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

import ProductForm from "@/components/admin/products/ProductForm";

import {
  getMyProductById,
  updateMyProduct,
} from "@/lib/api/designer/designer-portal.api";
import { uploadMultipleImages } from "@/lib/cloudinary/upload";
import {
  ApiErrorResponse,
  ProductPayload,
} from "@/lib/constants/admin-catalog";

export default function EditProductPage() {
  const { id } = useParams();
  const router = useRouter();

  const [product, setProduct] = useState<any>(null);

  useEffect(() => {
    loadProduct();
  }, []);

  const loadProduct = async () => {
    try {
      const data = await getMyProductById(id as string);
      setProduct(data);
    } catch {
      toast.error("Product not found");
    }
  };

  const handleUpdate = async (
    data: ProductPayload,
    files: File[]
  ) => {
    try {
      let uploadedImages = data.images || [];

      if (files && files.length > 0) {
        const primaryIndex = data.primaryImageIndex ?? 0;
        const newUploadedImages = await uploadMultipleImages(files, "ecommerce/products", primaryIndex, true);
        uploadedImages = [...uploadedImages, ...newUploadedImages];
      }

      const payload = {
        ...data,
        images: uploadedImages,
      };

      await updateMyProduct(id as string, payload);

      toast.success("Product updated successfully");
      router.push("/designer/products");
    } catch (error: unknown) {
      const apiError = error as ApiErrorResponse;
      toast.error(
        apiError.response?.data?.message ||
          "Failed to update product"
      );
    }
  };

  if (!product) {
    return (
      <div className="p-10 text-slate-500 font-medium flex items-center justify-center">
        Loading product...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          Edit Product
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Update your product information.
        </p>
      </div>

      <ProductForm
        initialData={product}
        onSubmit={handleUpdate}
        isDesignerPortal={true}
      />
    </div>
  );
}