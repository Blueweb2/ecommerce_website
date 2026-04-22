"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ProductForm from "@/components/admin/products/ProductForm";
import { useProductStore } from "@/store/admin/useProductStore";
import api from "@/lib/api/axios";
import toast from "react-hot-toast";
import {
  ApiErrorResponse,
  CatalogProduct,
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
    if (!id) return;

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

    fetchProduct();
  }, [id]);

  // ✅ Submit
  const handleSubmit = async (data: ProductPayload, files: File[]) => {
    try {
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

  // ✅ Map product → form initialData (memoized)
  const initialData = useMemo(() => {
    if (!product) return undefined;

    return {
      name: product.name || "",
      price: product.price ?? "",
      discountPrice: product.discountPrice ?? "",

      description: product.description || "",
      deliveryDetails: product.deliveryDetails || "",
      keyFeatures: product.keyFeatures || [],

      category:
        typeof product.category === "string"
          ? product.category
          : product.category?._id || "",

      sections: product.sections || [],
      brand: product.brand || "",
      sku: product.sku || "",

      stock: product.stock ?? "",
      isPublished: product.isPublished ?? true,

      images: product.images || [],

      attributes: product.attributes || [],

      variants:
        product.variants?.map((variant) => ({
          attributes: variant.attributes || {},
          stock: variant.stock ?? "",
          price: variant.price ?? "",
          discountPrice: variant.discountPrice ?? "",
          sku: variant.sku || "",
        })) || [],

      customizable: product.customizable || {
        isCustomizable: false,
        fields: [],
      },
    };
  }, [product]);

  // ✅ Loading / Not found
  if (loading) {
    return (
      <div className="p-10 text-center text-slate-500">
        Loading product...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-10 text-center text-red-500">
        Product not found
      </div>
    );
  }

  // ✅ UI
  return (
    <div className="max-w-6xl mx-auto space-y-8">

      {/* HEADER */}
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-slate-900">
          Edit Product
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Update product details, pricing, sale, variants and media.
        </p>
      </div>

      {/* FORM */}
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <ProductForm
          initialData={initialData}
          onSubmit={handleSubmit}
        />
      </div>

    </div>
  );
}