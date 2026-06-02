"use client";

import { useEffect, useMemo } from "react";
import { PRODUCT_SECTION_OPTIONS } from "@/lib/constants/admin-catalog";
import { calculateVariantStock, hasVariants } from "@/lib/utils/product-stock";
import type { ProductFormVariant } from "./ProductForm";

type Props = {
  form: {
    images?: { url: string; isPrimary?: boolean }[];
    primaryImageIndex?: number;
    variants?: ProductFormVariant[];
    stock?: number | string;
    sections: string[];
    sku?: string;
    name: string;
    description: string;
    price: number | string;
  };
  files: File[];
};

export default function PreviewSection({ form, files }: Props) {
  const firstVariantAttributes = form.variants?.[0]?.attributes;

  const previews = useMemo(
    () => files.map((file) => URL.createObjectURL(file)),
    [files]
  );

  useEffect(() => {
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previews]);

  // 🔥 Primary image
  const existingImages = form.images || [];
  const totalImages = existingImages.length + previews.length;
  const primaryIndex = totalImages
    ? Math.min(form.primaryImageIndex ?? 0, totalImages - 1)
    : 0;
  const mainImage =
    primaryIndex < existingImages.length
      ? existingImages[primaryIndex]?.url
      : previews[primaryIndex - existingImages.length];

  // 🔥 Variant stock total
  const totalStock = hasVariants(form.variants)
    ? calculateVariantStock(form.variants)
    : Number(form.stock) || 0;

  // 🔥 Attribute keys
  const variantAttributeKeys =
    hasVariants(form.variants) &&
    firstVariantAttributes &&
    typeof firstVariantAttributes === "object" &&
    !Array.isArray(firstVariantAttributes)
      ? Object.keys(firstVariantAttributes)
      : [];

  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      
      <h3 className="text-xl font-semibold tracking-tight text-slate-900">
        Preview
      </h3>

      <div className="mt-6 overflow-hidden rounded-[28px] border border-slate-200 bg-slate-50">
        
        {/* Main Image */}
        <div className="flex h-72 items-center justify-center bg-[radial-gradient(circle_at_top,#fdf7e7,transparent_55%),linear-gradient(180deg,#ffffff_0%,#f5f5f5_100%)]">
          
          {mainImage ? (
            <img
              src={mainImage}
              alt="Preview"
              className="h-full w-full object-cover"
            />
          ) : existingImages.length > 0 ? (
            <img
              src={
                existingImages.find((img) => img.isPrimary)?.url ||
                existingImages[0].url
              }
              alt={form.name || "Product preview"}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="text-sm text-slate-400">
              Upload images to preview
            </div>
          )}
        </div>

        <div className="space-y-3 p-5">
          
          {/* Thumbnails */}
          {totalImages > 0 && (
            <div className="flex gap-3 flex-wrap">
              {existingImages.map((image, i: number) => (
                <div key={`existing-${i}`} className="relative">
                  <img
                    src={image.url}
                    alt={`Saved product image ${i + 1}`}
                    className="h-20 w-20 object-cover rounded"
                  />

                  {i === primaryIndex && (
                    <span className="absolute top-1 left-1 bg-black text-white text-xs px-2 rounded">
                      Primary
                    </span>
                  )}
                </div>
              ))}

              {previews.map((src, i) => (
                <div key={`new-${i}`} className="relative">
                  <img
                    src={src}
                    alt={`New product image ${i + 1}`}
                    className="h-20 w-20 object-cover rounded"
                  />

                  {existingImages.length + i === primaryIndex && (
                    <span className="absolute top-1 left-1 bg-black text-white text-xs px-2 rounded">
                      Primary
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Sections */}
          <div className="flex flex-wrap gap-2">
            {form.sections.map((section: string) => (
              <span
                key={section}
                className="rounded-full bg-[#12251a] px-3 py-1 text-xs font-semibold text-white"
              >
                {PRODUCT_SECTION_OPTIONS.find(
                  (option) => option.value === section
                )?.label || section}
              </span>
            ))}
          </div>

          {/* 🔥 Variants (dynamic attributes) */}
          {hasVariants(form.variants) && (
            <div className="flex flex-wrap gap-2">
              {form.variants.map((variant, i: number) => (
                <span
                  key={i}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600"
                >
                  {variantAttributeKeys
                    .map((key) => variant.attributes?.[key] || "-")
                    .join(" / ")}
                </span>
              ))}
            </div>
          )}

          {/* Info */}
          <div>
            {form.sku && (
              <p className="mb-2 text-xs uppercase tracking-[0.18em] text-slate-400">
                SKU {form.sku}
              </p>
            )}

            <p className="text-lg font-semibold text-slate-900">
              {form.name || "Product title"}
            </p>

            <p className="mt-2 text-sm text-slate-500">
              {form.description || "Product description preview..."}
            </p>
          </div>

          {/* Price + Stock */}
          <div className="flex items-center justify-between">
            <p className="text-xl font-semibold text-slate-900">
              ₹ {form.price || "0"}
            </p>

            <span className="text-sm text-slate-500">
              Stock: {totalStock}
            </span>
          </div>

        </div>
      </div>
    </section>
  );
}
