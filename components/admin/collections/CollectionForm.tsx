"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import ImageUpload from "@/components/admin/ui/ImageUpload";
import { uploadSingleImage } from "@/lib/cloudinary/upload";
import { deleteImage } from "@/lib/cloudinary/delete";
import { useCategoryStore } from "@/store/admin/useCategoryStore";
import { Collection, CollectionPayload } from "@/types/collection";

type Props = {
  initialData?: Collection | null;
  onSubmit: (data: CollectionPayload) => Promise<void>;
};

const FALLBACK_IMAGE = "/placeholder.png";

export default function CollectionForm({ initialData, onSubmit }: Props) {
  const router = useRouter();
  const { categories, fetchCategories } = useCategoryStore();

  const [form, setForm] = useState<CollectionPayload>({
    title: "",
    description: "",
    category: "",
    image: undefined,
    cta: "",
    priority: 0,
    isActive: true,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    void fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    if (!initialData) return;

    setForm({
      title: initialData.title || "",
      description: initialData.description || "",
      category:
        typeof initialData.category === "string"
          ? initialData.category
          : initialData.category?._id || "",
      image:
        initialData.image && typeof initialData.image !== "string"
          ? initialData.image
          : undefined,
      cta: initialData.cta || "",
      priority: initialData.priority || 0,
      isActive: initialData.isActive ?? true,
    });
  }, [initialData]);

  //  IMAGE UPLOAD
  const handleImageUpload = async (file: File) => {
    try {
      setLoading(true);

      const previous = form.image;
      const uploaded = await uploadSingleImage(file, "ecommerce/collections");

      if (previous?.public_id) {
        await deleteImage(previous.public_id);
      }

      setForm((prev) => ({
        ...prev,
        image: uploaded,
      }));
    } catch {
      toast.error("Image upload failed");
    } finally {
      setLoading(false);
    }
  };

  //  VALIDATION
  const validate = () => {
    if (!form.title.trim()) {
      toast.error("Title required");
      return false;
    }

    if (!form.category) {
      toast.error("Category required");
      return false;
    }

    return true;
  };

  //  SUBMIT
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    if (!validate()) return;

    try {
      setLoading(true);

      await onSubmit({
        ...form,
        title: form.title.trim(),
        description: form.description?.trim(),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 pb-20">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-start">
        {/* MAIN COLUMN */}
        <div className="flex-1 space-y-6">
          {/* GENERAL INFO */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-lg font-semibold text-slate-800">
              General Information
            </h2>
            <div className="space-y-5">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Collection Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Summer Essentials"
                  value={form.title}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Description
                </label>
                <textarea
                  rows={4}
                  placeholder="Describe what this collection is about..."
                  value={form.description}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="w-full resize-none rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Call to Action (CTA) Text
                </label>
                <input
                  type="text"
                  placeholder="e.g. Shop Now, Explore Collection"
                  value={form.cta}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, cta: e.target.value }))
                  }
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                />
                <p className="mt-1.5 text-xs text-slate-500">
                  This text will appear on the button linking to this collection.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="w-full space-y-6 xl:w-[380px]">
          {/* STATUS */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-slate-800">
                  Collection Status
                </h2>
                <p className="text-xs text-slate-500">
                  {form.isActive ? "Visible to customers" : "Hidden from store"}
                </p>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  className="peer sr-only"
                  checked={form.isActive}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      isActive: e.target.checked,
                    }))
                  }
                />
                <div className="peer h-6 w-11 rounded-full bg-slate-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-emerald-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300"></div>
              </label>
            </div>
          </div>

          {/* ORGANIZATION */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-lg font-semibold text-slate-800">
              Organization
            </h2>
            <div className="space-y-5">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Linked Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, category: e.target.value }))
                  }
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <p className="mt-1.5 text-xs text-slate-500">
                  Products from this category will populate the collection.
                </p>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Display Priority
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={form.priority}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      priority: Number(e.target.value),
                    }))
                  }
                  className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                />
                <p className="mt-1.5 text-xs text-slate-500">
                  Higher numbers appear first in lists.
                </p>
              </div>
            </div>
          </div>

          {/* MEDIA */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-lg font-semibold text-slate-800">
              Collection Banner
            </h2>
            <div className="space-y-4">
              <ImageUpload
                multiple={false}
                onFilesSelect={(files) => {
                  if (files[0]) void handleImageUpload(files[0]);
                }}
              />

              <div className="relative aspect-[21/9] w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                {form.image?.url ? (
                  <Image
                    src={form.image.url}
                    alt="Collection banner preview"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center text-slate-400">
                    <span className="text-sm">No image uploaded</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="mt-8 flex items-center justify-end gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-full px-6 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-slate-900 px-8 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:opacity-70"
        >
          {loading ? "Saving..." : "Save Collection"}
        </button>
      </div>
    </form>
  );
}
