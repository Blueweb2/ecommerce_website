"use client";

import { useState } from "react";
import Image from "next/image";
import { StorySection, StoryImage } from "@/types/story";
import LayoutSelector from "./LayoutSelector";
import ProductSelector from "./ProductSelector";
import RichEditor from "@/components/admin/ui/RichEditor";
import ImageUpload from "@/components/admin/ui/ImageUpload";
import { uploadSingleImage } from "@/lib/cloudinary/upload";

type SectionCardProps = {
  section: StorySection;
  index: number;
  total: number;
  onChange: (section: StorySection) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
};

type UploadState = "idle" | "uploading" | "done" | "error";

const NEEDS_IMAGE = (layout: StorySection["layout"]) =>
  layout === "image-left" || layout === "image-right" || layout === "full-image";

const NEEDS_TEXT = (layout: StorySection["layout"]) =>
  layout === "image-left" || layout === "image-right" || layout === "text";

const NEEDS_PRODUCTS = (layout: StorySection["layout"]) =>
  layout === "image-left" || layout === "image-right";

export default function SectionCard({
  section,
  index,
  total,
  onChange,
  onRemove,
  onMoveUp,
  onMoveDown,
}: SectionCardProps) {
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [showProducts, setShowProducts] = useState(false);

  const update = (patch: Partial<StorySection>) =>
    onChange({ ...section, ...patch });

  const handleImageFile = async (files: File[]) => {
    const file = files[0];
    if (!file) return;
    setUploadState("uploading");
    try {
      const uploaded = await uploadSingleImage(file, "ecommerce/stories");
      update({ image: { ...uploaded, alt: file.name } as StoryImage });
      setUploadState("done");
    } catch {
      setUploadState("error");
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between bg-slate-50 px-4 py-3 border-b border-slate-200">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#12251a] text-[10px] font-bold text-white">
            {index + 1}
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-600">
            {section.layout.replace("-", " ")}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onMoveUp}
            disabled={index === 0}
            className="rounded-lg px-2 py-1 text-xs text-slate-500 hover:bg-slate-200 disabled:opacity-30"
            title="Move up"
          >
            ↑
          </button>
          <button
            type="button"
            onClick={onMoveDown}
            disabled={index === total - 1}
            className="rounded-lg px-2 py-1 text-xs text-slate-500 hover:bg-slate-200 disabled:opacity-30"
            title="Move down"
          >
            ↓
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="rounded-lg px-2 py-1 text-xs text-rose-500 hover:bg-rose-50"
            title="Remove section"
          >
            ✕
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Layout Selector */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Layout
          </label>
          <LayoutSelector
            value={section.layout}
            onChange={(layout) => update({ layout })}
          />
        </div>

        {/* Heading */}
        {NEEDS_TEXT(section.layout) && (
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Heading
            </label>
            <input
              value={section.heading ?? ""}
              onChange={(e) => update({ heading: e.target.value })}
              placeholder="Section heading..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-[#12251a] focus:ring-1 focus:ring-[#12251a]"
            />
          </div>
        )}

        {/* Content */}
        {NEEDS_TEXT(section.layout) && (
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Content
            </label>
            <RichEditor
              value={section.content ?? ""}
              onChange={(content) => update({ content })}
            />
          </div>
        )}

        {/* Image */}
        {NEEDS_IMAGE(section.layout) && (
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Image
            </label>
            <ImageUpload
              multiple={false}
              showPreview={false}
              onFilesSelect={handleImageFile}
            />
            {uploadState === "uploading" && (
              <p className="text-xs text-slate-500">Uploading image…</p>
            )}
            {uploadState === "error" && (
              <p className="text-xs text-rose-500">Upload failed. Please try again.</p>
            )}
            {section.image?.url && (
              <div className="relative h-32 w-full overflow-hidden rounded-xl bg-slate-100">
                <Image
                  src={section.image.url}
                  alt={section.image.alt || "Section image"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            )}
          </div>
        )}

        {/* Caption */}
        {NEEDS_IMAGE(section.layout) && (
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Caption <span className="font-normal text-slate-400">(optional)</span>
            </label>
            <input
              value={section.caption ?? ""}
              onChange={(e) => update({ caption: e.target.value })}
              placeholder="Image caption..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm outline-none focus:border-[#12251a] focus:ring-1 focus:ring-[#12251a]"
            />
          </div>
        )}

        {/* Products */}
        {NEEDS_PRODUCTS(section.layout) && (
          <div className="space-y-1.5">
            <button
              type="button"
              onClick={() => setShowProducts((v) => !v)}
              className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 hover:bg-white"
            >
              <span>
                Related Products{" "}
                {section.products && section.products.length > 0 && (
                  <span className="ml-1 rounded-full bg-emerald-100 px-1.5 py-0.5 text-emerald-700">
                    {section.products.length}
                  </span>
                )}
              </span>
              <span>{showProducts ? "▲" : "▼"}</span>
            </button>
            {showProducts && (
              <ProductSelector
                selectedIds={section.products ?? []}
                onChange={(ids) => update({ products: ids })}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
