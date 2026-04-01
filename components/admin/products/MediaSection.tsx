"use client";

import { ImagePlus } from "lucide-react";
import ImageUpload from "@/components/admin/ui/ImageUpload";
import { useEffect, useState } from "react";

type Props = {
  files: File[];
  setFiles: (files: File[] | ((prev: File[]) => File[])) => void;
  form: any;
  setForm: (updater: any) => void;
  errors: Record<string, string>;
};

export default function MediaSection({
  files,
  setFiles,
  form,
  setForm,
  errors,
}: Props) {
  const [previews, setPreviews] = useState<string[]>([]);

  // ✅ Generate previews safely
  useEffect(() => {
    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviews(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [files]);

  // 🔥 Primary image index
  const primaryIndex = form.primaryImageIndex ?? 0;

  const setPrimary = (index: number) => {
    setForm((prev: any) => ({
      ...prev,
      primaryImageIndex: index,
    }));
  };

  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      
      {/* Header */}
      <div className="flex items-center gap-2">
        <ImagePlus className="h-5 w-5 text-slate-500" />
        <h3 className="text-xl font-semibold tracking-tight text-slate-900">
          Media
        </h3>
      </div>

      <div className="mt-6 grid gap-4">
        
        {/* Upload */}
        <div className="grid gap-2">
          <label className="text-sm font-medium text-slate-700">
            Upload product images
          </label>

          <ImageUpload onFilesSelect={setFiles} />

          <p className="text-xs text-slate-500">
            {files.length > 0
              ? `${files.length} image${files.length > 1 ? "s" : ""} selected`
              : "Upload multiple product images"}
          </p>

          {errors.images && (
            <p className="text-sm text-rose-600">{errors.images}</p>
          )}
        </div>

        {/* 🔥 EXISTING IMAGES (EDIT MODE) */}
        {form.images?.length > 0 && (
          <div>
            <p className="text-sm font-medium text-slate-700 mb-2">
              Existing Images
            </p>

            <div className="flex gap-3 flex-wrap">
              {form.images.map((img: any, i: number) => (
                <div key={i} className="relative">
                  
                  <img
                    src={img.url}
                    className="h-20 w-20 object-cover rounded-lg border"
                  />

                  {img.isPrimary && (
                    <span className="absolute top-1 left-1 bg-black text-white text-xs px-2 py-0.5 rounded">
                      Primary
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 🔥 NEW FILE PREVIEW */}
        {files.length > 0 && (
          <div>
            <p className="text-sm font-medium text-slate-700 mb-2">
              New Images
            </p>

            <div className="flex gap-3 flex-wrap">
              {previews.map((src, i) => (
                <div key={i} className="relative">
                  
                  <img
                    src={src}
                    alt={`preview-${i}`}
                    className="h-20 w-20 object-cover rounded-lg border"
                  />

                  {/* Primary */}
                  {i === primaryIndex && (
                    <span className="absolute top-1 left-1 bg-black text-white text-xs px-2 py-0.5 rounded">
                      Primary
                    </span>
                  )}

                  {/* Set Primary */}
                  <button
                    type="button"
                    onClick={() => setPrimary(i)}
                    className="absolute bottom-1 left-1 text-xs bg-blue-500 text-white px-2 rounded"
                  >
                    Set
                  </button>

                  {/* Remove */}
                  <button
                    type="button"
                    onClick={() =>
                      setFiles((prev) =>
                        prev.filter((_, index) => index !== i)
                      )
                    }
                    className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-0.5 rounded"
                  >
                    ✕
                  </button>

                </div>
              ))}
            </div>
          </div>
        )}

        {/* Alt text */}
        <div className="grid gap-2">
          <label className="text-sm font-medium text-slate-700">
            Image alt text
          </label>

          <input
            placeholder="Product displayed on clean background"
            value={form.altText}
            onChange={(e) =>
              setForm((prev: any) => ({
                ...prev,
                altText: e.target.value,
              }))
            }
            className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-400"
          />

          <p className="text-xs text-slate-500">
            Helps with SEO and accessibility.
          </p>
        </div>

      </div>
    </section>
  );
}