"use client";

import { ImagePlus, Maximize2, Star, GripVertical, Trash2, Upload, Plus, Image as ImageIcon } from "lucide-react";
import { useEffect, useState, useRef, useCallback, useMemo } from "react";
import ImageModal from "@/components/admin/ui/ImageModal";
import { CatalogImage } from "@/lib/constants/admin-catalog";
import { ProductFormValues } from "./ProductForm";

type MediaFormState = {
  images: CatalogImage[];
  primaryImageIndex?: number;
  altText?: string;
  [key: string]: unknown;
};

type Props = {
  files: File[];
  setFiles: (files: File[] | ((prev: File[]) => File[])) => void;
  form: ProductFormValues;
setForm: React.Dispatch<React.SetStateAction<ProductFormValues>>;
  errors: Record<string, string>;
};

export default function MediaSection({
  files,
  setFiles,
  form,
  setForm,
  errors,
}: Props) {
  const [zoomedImage, setZoomedImage] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const addMoreInputRef = useRef<HTMLInputElement>(null);
  const existingImageCount = form.images?.length || 0;

  const previews = useMemo(
    () => files.map((file) => URL.createObjectURL(file)),
    [files]
  );

  useEffect(() => {
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previews]);

  const totalImages = existingImageCount + files.length;
  const primaryIndex = totalImages
    ? Math.min(form.primaryImageIndex ?? 0, totalImages - 1)
    : 0;
  const mainPreviewUrl =
    primaryIndex < existingImageCount
      ? form.images?.[primaryIndex]?.url
      : previews[primaryIndex - existingImageCount];

  const setPrimary = (index: number) => {
    setForm((prev) => ({
      ...prev,
      primaryImageIndex: index,
      images: (prev.images || []).map((image: CatalogImage, imageIndex: number) => ({
        ...image,
        isPrimary: imageIndex === index,
      })),
    }));
  };

  // Handle file selection (initial or add more)
  const handleFilesSelected = useCallback((newFiles: File[], append = false) => {
    if (append) {
      setFiles((prev) => [...prev, ...newFiles]);
    } else {
      setFiles(newFiles);
    }
  }, [setFiles]);

  // Drag & drop zone handlers
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Only set false if leaving the container (not entering a child)
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setIsDragOver(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    const droppedFiles = Array.from(e.dataTransfer.files).filter(f =>
      f.type.startsWith("image/")
    );
    if (droppedFiles.length > 0) {
      handleFilesSelected(droppedFiles, files.length > 0);
    }
  };

  // Reorder via drag
  const handleReorderDragStart = (index: number) => {
    setDragIndex(index);
  };

  const handleReorderDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleReorderDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === dropIndex) {
      setDragIndex(null);
      setDragOverIndex(null);
      return;
    }

    setFiles((prev) => {
      const updated = [...prev];
      const [moved] = updated.splice(dragIndex, 1);
      updated.splice(dropIndex, 0, moved);
      return updated;
    });

    // Adjust primary index if needed
    const draggedGlobalIndex = existingImageCount + dragIndex;
    const droppedGlobalIndex = existingImageCount + dropIndex;

    if (primaryIndex === draggedGlobalIndex) {
      setPrimary(droppedGlobalIndex);
    } else if (
      draggedGlobalIndex < primaryIndex &&
      droppedGlobalIndex >= primaryIndex
    ) {
      setPrimary(primaryIndex - 1);
    } else if (
      draggedGlobalIndex > primaryIndex &&
      droppedGlobalIndex <= primaryIndex
    ) {
      setPrimary(primaryIndex + 1);
    }

    setDragIndex(null);
    setDragOverIndex(null);
  };

  const handleReorderDragEnd = () => {
    setDragIndex(null);
    setDragOverIndex(null);
  };

  const removeExistingImage = (index: number) => {
    setForm((prev) => {
      const nextImages = (prev.images || []).filter(
        (_: CatalogImage, imageIndex: number) => imageIndex !== index
      );
      const nextTotalImages = nextImages.length + files.length;
      let nextPrimaryIndex = prev.primaryImageIndex ?? 0;

      if (index === nextPrimaryIndex) {
        nextPrimaryIndex = 0;
      } else if (index < nextPrimaryIndex) {
        nextPrimaryIndex -= 1;
      }

      if (!nextTotalImages) {
        nextPrimaryIndex = 0;
      } else if (nextPrimaryIndex >= nextTotalImages) {
        nextPrimaryIndex = nextTotalImages - 1;
      }

      return {
        ...prev,
        images: nextImages.map((image: CatalogImage, imageIndex: number) => ({
          ...image,
          isPrimary: imageIndex === nextPrimaryIndex,
        })),
        primaryImageIndex: nextPrimaryIndex,
      };
    });
  };

  // Remove single new image
  const removeImage = (index: number) => {
    const removedGlobalIndex = existingImageCount + index;
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setForm((prev) => {
      const nextTotalImages = (prev.images?.length || 0) + Math.max(files.length - 1, 0);
      let nextPrimaryIndex = prev.primaryImageIndex ?? 0;

      if (removedGlobalIndex === nextPrimaryIndex) {
        nextPrimaryIndex = 0;
      } else if (removedGlobalIndex < nextPrimaryIndex) {
        nextPrimaryIndex -= 1;
      }

      if (!nextTotalImages) {
        nextPrimaryIndex = 0;
      } else if (nextPrimaryIndex >= nextTotalImages) {
        nextPrimaryIndex = nextTotalImages - 1;
      }

      return {
        ...prev,
        primaryImageIndex: nextPrimaryIndex,
        images: (prev.images || []).map((image: CatalogImage, imageIndex: number) => ({
          ...image,
          isPrimary: imageIndex === nextPrimaryIndex,
        })),
      };
    });
  };

  // Format file size
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <section className="rounded-[28px] border border-slate-200 bg-white shadow-sm overflow-hidden">

      {/* Header */}
      <div className="px-8 pt-8 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-200">
              <ImagePlus className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">
                Product Media
              </h3>
              <p className="text-sm text-slate-500">
                {totalImages > 0
                  ? `${totalImages} image${totalImages > 1 ? "s" : ""} added`
                  : "Upload beautiful product images"}
              </p>
            </div>
          </div>

          {/* Add More Button */}
          {files.length > 0 && (
            <button
              type="button"
              onClick={() => addMoreInputRef.current?.click()}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-bold rounded-2xl shadow-lg shadow-emerald-200 hover:shadow-xl hover:shadow-emerald-200 hover:from-emerald-600 hover:to-teal-600 transition-all active:scale-95"
            >
              <Plus className="h-4 w-4" />
              Add More Images
            </button>
          )}

          <input
            ref={addMoreInputRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const newFiles = Array.from(e.target.files || []);
              if (newFiles.length > 0) {
                handleFilesSelected(newFiles, true);
              }
              e.target.value = "";
            }}
          />
        </div>
      </div>

      <div className="px-8 pb-8 space-y-6">

        {/* Drop Zone */}
        {files.length === 0 && (form.images?.length || 0) === 0 && (
          <div
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative cursor-pointer rounded-3xl border-2 border-dashed transition-all duration-300 ${
              isDragOver
                ? "border-violet-400 bg-violet-50 scale-[1.01] shadow-xl shadow-violet-100"
                : "border-slate-200 bg-gradient-to-b from-slate-50 to-white hover:border-violet-300 hover:bg-violet-50/50 hover:shadow-lg"
            }`}
          >
            <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
              <div className={`flex items-center justify-center w-20 h-20 rounded-3xl mb-6 transition-all duration-300 ${
                isDragOver
                  ? "bg-violet-100 scale-110"
                  : "bg-gradient-to-br from-slate-100 to-slate-50"
              }`}>
                <Upload className={`h-8 w-8 transition-colors duration-300 ${
                  isDragOver ? "text-violet-500" : "text-slate-400"
                }`} />
              </div>

              <p className="text-lg font-bold text-slate-700 mb-1">
                {isDragOver ? "Drop images here" : "Drag & drop product images"}
              </p>
              <p className="text-sm text-slate-400 mb-6">
                or click to browse from your device
              </p>

              <div className="flex items-center gap-3">
                <span className="px-4 py-2 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition-all">
                  Browse Files
                </span>
                <span className="text-xs text-slate-400">
                  JPG, PNG, WebP • Max 10MB each
                </span>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const selected = Array.from(e.target.files || []);
                if (selected.length > 0) {
                  handleFilesSelected(selected, false);
                }
                e.target.value = "";
              }}
            />
          </div>
        )}

        {/* Compact Drop Zone (when images exist) */}
        {(files.length > 0 || (form.images?.length || 0) > 0) && (
          <div
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => addMoreInputRef.current?.click()}
            className={`cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-200 ${
              isDragOver
                ? "border-violet-400 bg-violet-50"
                : "border-slate-200 bg-slate-50/50 hover:border-violet-300 hover:bg-violet-50/30"
            }`}
          >
            <div className="flex items-center justify-center gap-3 py-5 px-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-sm">
                <Plus className={`h-5 w-5 transition-colors ${isDragOver ? "text-violet-500" : "text-slate-400"}`} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-600">
                  {isDragOver ? "Drop to add more" : "Drop or click to add more images"}
                </p>
                <p className="text-xs text-slate-400">Add additional product photos</p>
              </div>
            </div>
          </div>
        )}

        {errors.images && (
          <div className="flex items-center gap-2 px-4 py-3 bg-rose-50 border border-rose-200 rounded-2xl">
            <span className="text-sm text-rose-600 font-medium">{errors.images}</span>
          </div>
        )}

        {/* EXISTING IMAGES (EDIT MODE) */}
        {form.images?.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <ImageIcon className="h-4 w-4 text-slate-400" />
              <p className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                Current Images
              </p>
              <span className="px-2 py-0.5 bg-slate-100 text-slate-500 text-xs font-bold rounded-lg">
                {form.images.length}
              </span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
              {form.images.map((img: CatalogImage, i: number) => (
                <div
                  key={i}
                  className={`relative group overflow-hidden rounded-2xl border-2 transition-all duration-200 ${
                    i === primaryIndex
                      ? "border-amber-400 shadow-lg shadow-amber-100 ring-2 ring-amber-200"
                      : "border-slate-200 hover:border-slate-300 hover:shadow-md"
                  }`}
                >
                  <div className="aspect-square">
                    <img
                      src={img.url}
                      alt={`Current product image ${i + 1}`}
                      className="h-full w-full object-cover cursor-pointer transition-transform duration-300 group-hover:scale-105"
                      onClick={() => setZoomedImage(img.url)}
                    />
                  </div>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200 flex items-center justify-center">
                    <Maximize2 className="h-5 w-5 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </div>

                  {/* Primary Badge */}
                  {i === primaryIndex && (
                    <div className="absolute top-2 left-2 flex items-center gap-1 bg-amber-500 text-white text-[10px] px-2.5 py-1 rounded-lg font-bold uppercase tracking-wider shadow-lg">
                      <Star className="h-3 w-3 fill-current" />
                      Main
                    </div>
                  )}

                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-200 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                    {i !== primaryIndex && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPrimary(i);
                        }}
                        className="flex items-center justify-center w-8 h-8 bg-amber-500 text-white rounded-xl shadow-lg hover:bg-amber-600 transition-all hover:scale-110 active:scale-95"
                        title="Set as main image"
                      >
                        <Star className="h-4 w-4" />
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setZoomedImage(img.url);
                      }}
                      className="flex items-center justify-center w-8 h-8 bg-white/90 text-slate-700 rounded-xl shadow-lg hover:bg-white transition-all hover:scale-110 active:scale-95"
                      title="View full size"
                    >
                      <Maximize2 className="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeExistingImage(i);
                      }}
                      className="flex items-center justify-center w-8 h-8 bg-red-500 text-white rounded-xl shadow-lg hover:bg-red-600 transition-all hover:scale-110 active:scale-95"
                      title="Remove image"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* NEW FILE PREVIEWS — Main Image + Grid */}
        {files.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <ImagePlus className="h-4 w-4 text-emerald-500" />
              <p className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                New Images
              </p>
              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-xs font-bold rounded-lg">
                {files.length}
              </span>
            </div>

            {/* Main Image (Primary) — Large Preview */}
            <div className="mb-4">
              <div className="relative group overflow-hidden rounded-3xl border-2 border-amber-400 shadow-xl shadow-amber-100 ring-2 ring-amber-200 bg-slate-50">
                <div className="aspect-video max-h-[350px] w-full">
                  <img
                    src={mainPreviewUrl || previews[0]}
                    alt="Main product image"
                    className="h-full w-full object-contain cursor-pointer transition-transform duration-500 group-hover:scale-[1.02]"
                    onClick={() => setZoomedImage(mainPreviewUrl || previews[0])}
                  />
                </div>

                {/* Main Badge */}
                <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-amber-500 text-white text-xs px-3.5 py-1.5 rounded-xl font-bold uppercase tracking-wider shadow-lg">
                  <Star className="h-3.5 w-3.5 fill-current" />
                  Main Image
                </div>

                {/* Zoom overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-200 flex items-center justify-center pointer-events-none">
                  <Maximize2 className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
                </div>
              </div>
            </div>

            {/* Thumbnail Grid — Draggable & Reorderable */}
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
              {previews.map((src, i) => (
                <div
                  key={`${i}-${files[i]?.name}`}
                  draggable
                  onDragStart={() => handleReorderDragStart(i)}
                  onDragOver={(e) => handleReorderDragOver(e, i)}
                  onDrop={(e) => handleReorderDrop(e, i)}
                  onDragEnd={handleReorderDragEnd}
                  className={`relative group overflow-hidden rounded-2xl border-2 transition-all duration-200 cursor-grab active:cursor-grabbing ${
                    dragIndex === i
                      ? "opacity-40 scale-95 border-violet-400"
                      : dragOverIndex === i
                        ? "border-violet-400 scale-105 shadow-xl shadow-violet-100"
                        : existingImageCount + i === primaryIndex
                          ? "border-amber-400 shadow-lg shadow-amber-100 ring-2 ring-amber-200"
                          : "border-slate-200 hover:border-slate-300 hover:shadow-md"
                  }`}
                >
                  {/* Image */}
                  <div className="aspect-square">
                    <img
                      src={src}
                      alt={`Product image ${i + 1}`}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onClick={() => setZoomedImage(src)}
                    />
                  </div>

                  {/* Drag Handle */}
                  <div className="absolute top-1.5 left-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-black/50 backdrop-blur-sm">
                      <GripVertical className="h-3.5 w-3.5 text-white" />
                    </div>
                  </div>

                  {/* Primary Badge */}
                  {existingImageCount + i === primaryIndex && (
                    <div className="absolute top-1.5 left-1.5 flex items-center gap-0.5 bg-amber-500 text-white text-[9px] px-2 py-1 rounded-lg font-bold uppercase tracking-wider shadow-md">
                      <Star className="h-2.5 w-2.5 fill-current" />
                      Main
                    </div>
                  )}

                  {/* Image number */}
                  <div className="absolute bottom-1.5 left-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[10px] bg-black/50 backdrop-blur-sm text-white px-2 py-0.5 rounded-md font-bold">
                      {i + 1}/{files.length}
                    </span>
                  </div>

                  {/* File size */}
                  {files[i] && (
                    <div className="absolute bottom-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-[10px] bg-black/50 backdrop-blur-sm text-white px-2 py-0.5 rounded-md font-medium">
                        {formatSize(files[i].size)}
                      </span>
                    </div>
                  )}

                  {/* Action Buttons Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-200 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                    {/* Set as Main */}
                    {existingImageCount + i !== primaryIndex && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPrimary(existingImageCount + i);
                        }}
                        className="flex items-center justify-center w-8 h-8 bg-amber-500 text-white rounded-xl shadow-lg hover:bg-amber-600 transition-all hover:scale-110 active:scale-95"
                        title="Set as main image"
                      >
                        <Star className="h-4 w-4" />
                      </button>
                    )}

                    {/* Zoom */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setZoomedImage(src);
                      }}
                      className="flex items-center justify-center w-8 h-8 bg-white/90 text-slate-700 rounded-xl shadow-lg hover:bg-white transition-all hover:scale-110 active:scale-95"
                      title="View full size"
                    >
                      <Maximize2 className="h-4 w-4" />
                    </button>

                    {/* Remove */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage(i);
                      }}
                      className="flex items-center justify-center w-8 h-8 bg-red-500 text-white rounded-xl shadow-lg hover:bg-red-600 transition-all hover:scale-110 active:scale-95"
                      title="Remove image"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}

              {/* Add More Card */}
              <button
                type="button"
                onClick={() => addMoreInputRef.current?.click()}
                className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 flex flex-col items-center justify-center gap-2 hover:border-emerald-300 hover:bg-emerald-50/50 transition-all group"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white border border-slate-200 group-hover:border-emerald-200 group-hover:bg-emerald-50 transition-all shadow-sm">
                  <Plus className="h-5 w-5 text-slate-400 group-hover:text-emerald-500 transition-colors" />
                </div>
                <span className="text-[11px] font-bold text-slate-400 group-hover:text-emerald-600 transition-colors uppercase tracking-wider">
                  Add More
                </span>
              </button>
            </div>

            {/* Reorder Hint */}
            <div className="flex items-center gap-2 mt-3 px-1">
              <GripVertical className="h-3.5 w-3.5 text-slate-300" />
              <p className="text-xs text-slate-400">
                Drag thumbnails to reorder • Click the <Star className="h-3 w-3 text-amber-500 inline fill-amber-500" /> to set as main image
              </p>
            </div>
          </div>
        )}

        {/* Alt text */}
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">
            Image Alt Text
          </label>
          <input
            placeholder="e.g. Red cotton kurta displayed on white background"
            value={form.altText || ""}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                altText: e.target.value,
              }))
            }
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition-all focus:border-violet-400 focus:ring-4 focus:ring-violet-50 placeholder:text-slate-300"
          />
          <p className="text-xs text-slate-400">
            Improves SEO and accessibility. Describe the product clearly.
          </p>
        </div>
      </div>

      {/* Full Screen Image Modal */}
      <ImageModal
        isOpen={zoomedImage !== null}
        onClose={() => setZoomedImage(null)}
        imageUrl={zoomedImage}
      />
    </section>
  );
}
