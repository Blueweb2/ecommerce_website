"use client";

import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { uploadSingleImage } from "@/lib/cloudinary/upload";
import { createStory, updateStory } from "@/lib/api/admin/story.api";
import ImageUpload from "@/components/admin/ui/ImageUpload";
import SectionBuilder from "./SectionBuilder";
import {
  type Story,
  type StoryFieldErrors,
  type StoryPayload,
  type StoryImage,
  type StorySection,
} from "@/types/story";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type StoryFormProps = {
  initialData?: Story | null;
  onSuccess?: () => void | Promise<void>;
  returnUrl?: string;
};

type StoryApiErrorBody = {
  message?: string;
  errors?: Record<string, string | string[]> | string[] | string;
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getTextError(value: unknown): string {
  if (typeof value === "string") return value;
  if (Array.isArray(value))
    return value
      .filter((item): item is string => typeof item === "string")
      .join(", ");
  return "";
}

function parseFieldErrors(
  errors: StoryApiErrorBody["errors"]
): StoryFieldErrors {
  if (!errors || Array.isArray(errors) || typeof errors === "string") return {};
  const nextErrors: StoryFieldErrors = {};
  for (const [key, value] of Object.entries(errors)) {
    const field = key.split(".")[0] as keyof StoryFieldErrors;
    const message = getTextError(value);
    if (message && (field === "title" || field === "heroImage" || field === "excerpt")) {
      nextErrors[field] = message;
    }
  }
  return nextErrors;
}

function getApiErrorDetails(error: unknown, fallbackMessage: string) {
  if (!axios.isAxiosError<StoryApiErrorBody>(error)) {
    return { message: fallbackMessage, fieldErrors: {} as StoryFieldErrors };
  }
  const fieldErrors = parseFieldErrors(error.response?.data?.errors);
  const directErrors = getTextError(error.response?.data?.errors);
  const message =
    error.response?.data?.message ||
    directErrors ||
    Object.values(fieldErrors)[0] ||
    fallbackMessage;
  return { message, fieldErrors };
}

// ---------------------------------------------------------------------------
// Defaults
// ---------------------------------------------------------------------------

const DEFAULT_FORM: StoryPayload = {
  title: "",
  excerpt: "",
  author: "",
  publishDate: "",
  featured: false,
  heroImage: undefined,
  sections: [],
  isActive: true,
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function StoryForm({
  initialData,
  onSuccess,
  returnUrl,
}: StoryFormProps) {
  const router = useRouter();
  const isEditing = Boolean(initialData?._id);

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<StoryPayload>(DEFAULT_FORM);
  const [selectedHeroImage, setSelectedHeroImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [formError, setFormError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<StoryFieldErrors>({});

  // Hydrate form from initialData
  useEffect(() => {
    if (!initialData) {
      setForm(DEFAULT_FORM);
      setSelectedHeroImage(null);
      setFieldErrors({});
      setFormError("");
      return;
    }

    // Normalise product refs: backend may return populated objects, we only store ids
    const normalisedSections: StorySection[] = (initialData.sections ?? []).map(
      (section) => ({
        ...section,
        products: (section.products ?? []).map((p: any) =>
          typeof p === "string" ? p : p._id ?? p
        ),
      })
    );

    setForm({
      title: initialData.title || "",
      excerpt: initialData.excerpt || "",
      author: initialData.author || "",
      publishDate: initialData.publishDate
        ? new Date(initialData.publishDate).toISOString().split("T")[0]
        : "",
      featured: initialData.featured ?? false,
      heroImage: initialData.heroImage ?? undefined,
      sections: normalisedSections,
      isActive: initialData.isActive ?? true,
    });
    setSelectedHeroImage(null);
    setFieldErrors({});
    setFormError("");
  }, [initialData]);

  // Hero image preview
  useEffect(() => {
    if (!selectedHeroImage) {
      setPreviewUrl("");
      return;
    }
    const url = URL.createObjectURL(selectedHeroImage);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [selectedHeroImage]);

  const currentHeroPreview = useMemo(
    () => previewUrl || form.heroImage?.url || "",
    [previewUrl, form.heroImage]
  );

  // ---------------------------------------------------------------------------
  // State helpers
  // ---------------------------------------------------------------------------

  const clearFieldError = (field: keyof StoryFieldErrors) =>
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }));

  const resetForm = () => {
    setForm(DEFAULT_FORM);
    setSelectedHeroImage(null);
    setFieldErrors({});
    setFormError("");
  };

  const validateForm = () => {
    const errors: StoryFieldErrors = {};
    if (!form.title.trim()) errors.title = "Title is required";
    if (!selectedHeroImage && !form.heroImage?.url)
      errors.heroImage = "Please choose a hero image";
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      setFormError("Please correct the highlighted fields.");
      toast.error("Please correct the highlighted fields.");
      return false;
    }
    setFormError("");
    return true;
  };

  // ---------------------------------------------------------------------------
  // Submit
  // ---------------------------------------------------------------------------

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (loading || !validateForm()) return;
    setLoading(true);

    let uploadedHeroImage: StoryImage | undefined;

    try {
      if (selectedHeroImage) {
        uploadedHeroImage = await uploadSingleImage(
          selectedHeroImage,
          "ecommerce/stories"
        );
      }

      const payload: StoryPayload = {
        title: form.title.trim(),
        excerpt: form.excerpt?.trim(),
        author: form.author?.trim(),
        publishDate: form.publishDate || undefined,
        featured: form.featured,
        heroImage: uploadedHeroImage ?? form.heroImage,
        sections: (form.sections ?? []).map((s, i) => ({ ...s, order: i })),
        isActive: form.isActive,
      };

      if (isEditing && initialData?._id) {
        await updateStory(initialData._id, payload);
        toast.success("Story updated successfully");
        await onSuccess?.();
        if (returnUrl) router.push(returnUrl);
      } else {
        await createStory(payload);
        toast.success("Story published!");
        await onSuccess?.();
        resetForm();
      }
    } catch (error: unknown) {
      const fallback = isEditing ? "Failed to update story" : "Failed to create story";
      const { message, fieldErrors: errs } = getApiErrorDetails(error, fallback);
      setFormError(message);
      setFieldErrors((prev) => ({ ...prev, ...errs }));
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* ── Story Metadata ─────────────────────────────────── */}
      <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm space-y-5">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold tracking-tight">
            {isEditing ? "Edit Story" : "New Story"}
          </h2>
          <p className="text-sm text-slate-500">
            {isEditing
              ? "Update story metadata, hero image and sections."
              : "Create a new editorial story with sections."}
          </p>
        </div>

        {formError && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {formError}
          </div>
        )}

        {/* Title */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">Title</label>
          <input
            value={form.title}
            onChange={(e) => {
              setForm((prev) => ({ ...prev, title: e.target.value }));
              clearFieldError("title");
              setFormError("");
            }}
            placeholder="Story title..."
            className={`w-full rounded-2xl border bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#12251a] focus:ring-1 focus:ring-[#12251a] ${
              fieldErrors.title ? "border-rose-300 bg-rose-50" : "border-slate-200"
            }`}
          />
          {fieldErrors.title && (
            <p className="text-xs font-medium text-rose-600">{fieldErrors.title}</p>
          )}
        </div>

        {/* Excerpt */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">
            Excerpt{" "}
            <span className="font-normal text-slate-400">(optional)</span>
          </label>
          <textarea
            rows={2}
            value={form.excerpt ?? ""}
            onChange={(e) => setForm((prev) => ({ ...prev, excerpt: e.target.value }))}
            placeholder="A short summary shown below the title..."
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#12251a] focus:ring-1 focus:ring-[#12251a] resize-none"
          />
        </div>

        {/* Author & Publish Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">
              Author{" "}
              <span className="font-normal text-slate-400">(optional)</span>
            </label>
            <input
              value={form.author ?? ""}
              onChange={(e) => setForm((prev) => ({ ...prev, author: e.target.value }))}
              placeholder="e.g. Jane Smith"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#12251a] focus:ring-1 focus:ring-[#12251a]"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">
              Publish Date{" "}
              <span className="font-normal text-slate-400">(optional)</span>
            </label>
            <input
              type="date"
              value={form.publishDate ?? ""}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, publishDate: e.target.value }))
              }
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#12251a] focus:ring-1 focus:ring-[#12251a]"
            />
          </div>
        </div>

        {/* Hero Image */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">Hero Image</label>
          <ImageUpload
            multiple={false}
            showPreview={false}
            onFilesSelect={(files) => {
              const file = files[0];
              if (!file) return;
              setSelectedHeroImage(file);
              clearFieldError("heroImage");
              setFormError("");
            }}
          />
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
            {currentHeroPreview ? (
              <img
                src={currentHeroPreview}
                alt="Hero preview"
                className="h-52 w-full object-cover"
              />
            ) : (
              <div className="flex h-52 items-center justify-center text-sm text-slate-400">
                No hero image selected
              </div>
            )}
          </div>
          {fieldErrors.heroImage && (
            <p className="text-xs font-medium text-rose-600">{fieldErrors.heroImage}</p>
          )}
        </div>

        {/* Status & Featured */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Active toggle */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-800">Published</h3>
                <p className="text-xs text-slate-500">
                  {form.isActive ? "Visible on storefront" : "Hidden from customers"}
                </p>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  className="peer sr-only"
                  checked={form.isActive}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, isActive: e.target.checked }))
                  }
                />
                <div className="peer h-6 w-11 rounded-full bg-slate-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-emerald-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300" />
              </label>
            </div>
          </div>

          {/* Featured toggle */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-800">Featured</h3>
                <p className="text-xs text-slate-500">
                  {form.featured ? "Shown in featured section" : "Regular story"}
                </p>
              </div>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  className="peer sr-only"
                  checked={form.featured ?? false}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, featured: e.target.checked }))
                  }
                />
                <div className="peer h-6 w-11 rounded-full bg-slate-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-amber-500 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300" />
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* ── Section Builder ──────────────────────────────────── */}
      <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
        <SectionBuilder
          sections={form.sections ?? []}
          onChange={(sections) => setForm((prev) => ({ ...prev, sections }))}
        />
      </div>

      {/* ── Form Actions ─────────────────────────────────────── */}
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        {isEditing && (
          <button
            type="button"
            disabled={loading}
            onClick={() => router.push(returnUrl || "/admin/stories")}
            className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center rounded-2xl bg-[#12251a] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#1a3528] disabled:opacity-60"
        >
          {loading ? "Saving…" : isEditing ? "Save Story" : "Publish Story"}
        </button>
      </div>
    </form>
  );
}
