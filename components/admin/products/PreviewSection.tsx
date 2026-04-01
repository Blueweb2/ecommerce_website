"use client";

import { useEffect, useState } from "react";
import { PRODUCT_SECTION_OPTIONS } from "@/lib/constants/admin-catalog";

type Props = {
  form: any;
  files: File[];
  setFiles: (files: File[] | ((prev: File[]) => File[])) => void;
};

export default function PreviewSection({ form, files, setFiles }: Props) {
  const [previews, setPreviews] = useState<string[]>([]);

  // ✅ Safe preview generation
  useEffect(() => {
    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviews(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [files]);

  // 🔥 Primary image
  const primaryIndex = form.primaryImageIndex ?? 0;
  const mainImage = previews[primaryIndex];

  // 🔥 Variant stock total
  const totalStock =
    form.variants?.length > 0
      ? form.variants.reduce(
          (sum: number, v: any) => sum + (Number(v.stock) || 0),
          0
        )
      : form.stock || 0;

  // 🔥 Attribute keys
  const attributeKeys =
    form.variants?.length > 0
      ? Object.keys(form.variants[0].attributes || {})
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
          ) : form.images?.length > 0 ? (
            <img
              src={
                form.images.find((img: any) => img.isPrimary)?.url ||
                form.images[0].url
              }
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
          {previews.length > 0 && (
            <div className="flex gap-3 flex-wrap">
              {previews.map((src, i) => (
                <div key={i} className="relative">
                  
                  <img
                    src={src}
                    className="h-20 w-20 object-cover rounded"
                  />

                  {i === primaryIndex && (
                    <span className="absolute top-1 left-1 bg-black text-white text-xs px-2 rounded">
                      Primary
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={() =>
                      setFiles((prev) =>
                        prev.filter((_, index) => index !== i)
                      )
                    }
                    className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 rounded"
                  >
                    ✕
                  </button>
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
          {form.variants?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {form.variants.map((v: any, i: number) => (
                <span
                  key={i}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-600"
                >
                  {attributeKeys
                    .map((key) => v.attributes?.[key] || "-")
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