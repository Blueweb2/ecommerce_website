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
    slug: "",
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
      slug: initialData.slug || "",
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

  // 🔥 IMAGE UPLOAD
  const handleImageUpload = async (file: File) => {
    try {
      setLoading(true);

      const previous = form.image;
      const uploaded = await uploadSingleImage(file, "collections");

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

  // 🔥 VALIDATION
  const validate = () => {
    if (!form.title.trim()) {
      toast.error("Title required");
      return false;
    }

    if (!form.slug.trim()) {
      toast.error("Slug required");
      return false;
    }

    if (!form.category) {
      toast.error("Category required");
      return false;
    }

    return true;
  };

  // 🔥 SUBMIT
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    if (!validate()) return;

    try {
      setLoading(true);

      await onSubmit({
        ...form,
        title: form.title.trim(),
        slug: form.slug.trim(),
        description: form.description?.trim(),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* BASIC INFO */}
      <div className="bg-white p-6 rounded-xl border space-y-4">
        <h2 className="text-lg font-semibold">Collection Details</h2>

        <input
          placeholder="Title"
          value={form.title}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, title: e.target.value }))
          }
          className="input"
        />

        <input
          placeholder="Slug"
          value={form.slug}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, slug: e.target.value }))
          }
          className="input"
        />

        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, description: e.target.value }))
          }
          className="input"
        />

        {/* CATEGORY */}
        <select
          value={form.category}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, category: e.target.value }))
          }
          className="input"
        >
          <option value="">Select category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* IMAGE */}
      <div className="bg-white p-6 rounded-xl border space-y-4">
        <h2 className="text-lg font-semibold">Image</h2>

        <ImageUpload
          multiple={false}
          onFilesSelect={(files) => {
            if (files[0]) void handleImageUpload(files[0]);
          }}
        />

        <div className="relative h-52 bg-gray-100">
          <Image
            src={form.image?.url || FALLBACK_IMAGE}
            alt="preview"
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* EXTRA */}
      <div className="bg-white p-6 rounded-xl border space-y-4">
        <input
          placeholder="CTA (optional)"
          value={form.cta}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, cta: e.target.value }))
          }
          className="input"
        />

        <input
          type="number"
          placeholder="Priority"
          value={form.priority}
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              priority: Number(e.target.value),
            }))
          }
          className="input"
        />

        <label className="flex gap-2">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                isActive: e.target.checked,
              }))
            }
          />
          Active
        </label>
      </div>

      {/* ACTIONS */}
      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="btn-secondary"
        >
          Cancel
        </button>

        <button type="submit" className="btn-primary">
          {loading ? "Saving..." : "Save Collection"}
        </button>
      </div>
    </form>
  );
}
