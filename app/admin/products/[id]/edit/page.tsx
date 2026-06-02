"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ProductForm, {
  ProductFormInitialData,
} from "@/components/admin/products/ProductForm";
import { useProductStore } from "@/store/admin/useProductStore";
import api from "@/lib/api/axios";
import toast from "react-hot-toast";
import {
  ApiErrorResponse,
  CatalogProduct,
  CatalogImage,
  ProductPayload,
} from "@/lib/constants/admin-catalog";
import { calculateVariantStock, hasVariants } from "@/lib/utils/product-stock";

const OMITTED_PRODUCT_FIELDS = new Set(["_id", "createdAt", "updatedAt"]);

function getPreservedProductFields(
  product: CatalogProduct | null
): Record<string, unknown> {
  if (!product) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(product).filter(
      ([key]) => !OMITTED_PRODUCT_FIELDS.has(key)
    )
  );
}

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
      const payload: ProductPayload = {
        ...getPreservedProductFields(product),
        ...data,
      };

      await updateProduct(id, payload, files);
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
  const initialData = useMemo<ProductFormInitialData | undefined>(() => {
    if (!product) return undefined;

    const primaryImageIndex = Math.max(
      product.images?.findIndex((image: CatalogImage) => image.isPrimary) ?? -1,
      0
    );

    return {
      sku: product.sku || "",
      slug: product.slug || "",
      name: product.name || "",
      price: product.price ?? "",
      discountPrice: product.discountPrice ?? "",

      description: product.description || "",
      deliveryDetails: product.deliveryDetails || "",
      keyFeatures: product.keyFeatures || [],
      brand: product.brand || "",

      category:
        typeof product.category === "string"
          ? product.category
          : product.category?._id || "",
      designer:
        typeof product.designer === "string"
          ? product.designer
          : product.designer?._id || "",

      sections: product.sections || [],
      attributes:
        product.attributes?.map((attribute) => ({
          name: attribute.name,
          values: [...attribute.values],
        })) || [],

      stock: hasVariants(product.variants)
        ? calculateVariantStock(product.variants)
        : product.stock ?? "",
      isPublished: product.isPublished ?? true,
      isOnSale: product.isOnSale ?? false,
      gstPercentage: product.gstPercentage ?? 0,
      primaryImageIndex,
      isFabric: product.isFabric ?? false,
      unit: product.unit || "meter",
      minOrderQty: product.minOrderQty ?? 1,
      stepQty: product.stepQty ?? (product.isFabric ? 0.5 : 1),

      images: product.images?.map((image) => ({ ...image })) || [],

      variants:
        product.variants?.map((variant) => ({
          ...variant,
          attributes: variant.attributes || {},
          stock: variant.stock ?? "",
          price: variant.price ?? "",
          discountPrice: variant.discountPrice ?? "",
          sku: variant.sku || "",
          images: variant.images?.map((image) => ({ ...image })) || [],
        })) || [],

      customizable: product.customizable
        ? {
            isCustomizable: product.customizable.isCustomizable,
            fields:
              product.customizable.fields?.map((field) => ({
                ...field,
                options: field.options ? [...field.options] : undefined,
              })) || [],
          }
        : {
            isCustomizable: false,
            fields: [],
          },
      specifications:
        product.specifications?.map((specification) => ({
          ...specification,
        })) || [],
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
    <div className="max-w-6xl mx-auto space-y-8 pb-20">

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
