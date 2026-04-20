"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ProductForm from "@/components/admin/products/ProductForm";
import { useProductStore } from "@/store/admin/useProductStore";
import api from "@/lib/api/axios";
import toast from "react-hot-toast";
import {
  ApiErrorResponse,
  CatalogProduct,
  getPrimaryProductImage,
  ProductPayload,
} from "@/lib/constants/admin-catalog";

export default function EditProductPage() {
  const params = useParams();
  const id = params.id as string;

  const router = useRouter();
  const { updateProduct } = useProductStore();

  const [product, setProduct] = useState<CatalogProduct | null>(null);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data.data);
      } catch {
        toast.error("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  // ✅ FIXED: accepts files also
  const handleSubmit = async (
    data: ProductPayload,
    files: File[]
  ) => {
    try {
      // 🔥 IMPORTANT: for now ignore files (update API is JSON)
      await updateProduct(id, data, files);

      toast.success("Product updated");
      router.push("/admin/products");
    } catch (error: unknown) {
      const apiError = error as ApiErrorResponse;
      toast.error(
        apiError.response?.data?.message || "Update failed"
      );
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!product)
    return <div className="p-6 text-red-500">Not found</div>;

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          Edit Product
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Update category placement, section tags, and product media.
        </p>
      </div>

    <ProductForm
  initialData={{
    name: product.name,
    price: product.price,
    description: product.description || "",

    category:
      typeof product.category === "string"
        ? product.category
        : product.category?._id || "",

    sections: product.sections || [],
    images: product.images || [],

    stock: product.stock ?? "",
    isPublished: product.isPublished ?? true,

    variants:
      product.variants?.map((variant) => ({
        attributes: variant.attributes || {},
        stock: variant.stock ?? "",
        price: variant.price ?? "",
      })) || [],
  }}
  onSubmit={handleSubmit}
/>
    </div>
  );
}