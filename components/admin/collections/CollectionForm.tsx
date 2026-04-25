"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import ImageUpload from "@/components/admin/ui/ImageUpload";
import {
  COLLECTION_TAG_OPTIONS,
  COLLECTION_TYPE_OPTIONS,
  slugifyCollectionTitle,
} from "@/lib/constants/admin-collections";
import { uploadSingleImage } from "@/lib/cloudinary/upload";
import { deleteImage } from "@/lib/cloudinary/delete";
import { useCategoryStore } from "@/store/admin/useCategoryStore";
import { Collection, CollectionPayload } from "@/types/collection";

type Props = {
  initialData?: Collection | null;
  onSubmit: (data: CollectionPayload) => Promise<void>;
};

type CollectionFormState = CollectionPayload;

const defaultForm: CollectionFormState = {
  title: "",
  slug: "",
  description: "",
  bannerImage: undefined,
  filters: {
    category: "",
    type: "",
    tags: [],
    priceRange: {},
  },
  isActive: true,
};

export default function CollectionForm({ initialData, onSubmit }: Props) {
  const router = useRouter();
  const { categories, fetchCategories } = useCategoryStore();

  const [form, setForm] = useState<CollectionFormState>(defaultForm);
  const [loading, setLoading] = useState(false);
  const [slugTouched, setSlugTouched] = useState(false);

  useEffect(() => {
    void fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    if (!initialData) return;

    const bannerImage =
      initialData.bannerImage && typeof initialData.bannerImage !== "string"
        ? {
          url: initialData.bannerImage.url || "",
          public_id: initialData.bannerImage.public_id || "",
          altText:
            initialData.bannerImage.altText || initialData.bannerImage.alt || "",
        }
        : undefined;

    setForm({
      title: initialData.title || initialData.name || "",
      slug: initialData.slug || "",
      description: initialData.description || "",
      bannerImage,
      filters: {
        category: initialData.filters?.category || "",
        type: initialData.filters?.type || "",
        tags: initialData.filters?.tags || [],
        priceRange: {
          min: initialData.filters?.priceRange?.min,
          max: initialData.filters?.priceRange?.max,
        },
      },
      isActive: initialData.isActive ?? true,
    });
    setSlugTouched(true);
  }, [initialData]);

  const selectedCategoryName = useMemo(() => {
    return (
      categories.find((category) => category._id === form.filters.category)?.name ||
      "All categories"
    );
  }, [categories, form.filters.category]);

  const selectedTypeLabel = useMemo(() => {
    return (
      COLLECTION_TYPE_OPTIONS.find((type) => type.value === form.filters.type)
        ?.label || "Any type"
    );
  }, [form.filters.type]);

  const handleTitleChange = (value: string) => {
    setForm((prev) => ({
      ...prev,
      title: value,
      slug: slugTouched ? prev.slug : slugifyCollectionTitle(value),
    }));
  };

  const handleSlugChange = (value: string) => {
    setSlugTouched(true);
    setForm((prev) => ({
      ...prev,
      slug: slugifyCollectionTitle(value),
    }));
  };

  const handleTagToggle = (tag: string) => {
    setForm((prev) => {
      const nextTags = prev.filters.tags.includes(tag)
        ? prev.filters.tags.filter((item) => item !== tag)
        : [...prev.filters.tags, tag];

      return {
        ...prev,
        filters: {
          ...prev.filters,
          tags: nextTags,
        },
      };
    });
  };

  const handlePriceChange = (key: "min" | "max", value: string) => {
    setForm((prev) => ({
      ...prev,
      filters: {
        ...prev.filters,
        priceRange: {
          ...prev.filters.priceRange,
          [key]: value === "" ? undefined : Number(value),
        },
      },
    }));
  };

  const handleBannerUpload = async (file: File) => {
    try {
      setLoading(true);

      const previousImage = form.bannerImage;
      const uploaded = await uploadSingleImage(file, "ecommerce/collections");

      if (previousImage?.public_id) {
        await deleteImage(previousImage.public_id);
      }

      setForm((prev) => ({
        ...prev,
        bannerImage: uploaded,
      }));
    } catch (error) {
      console.error(error);
      toast.error("Banner upload failed");
    } finally {
      setLoading(false);
    }
  };

  const validate = () => {
    if (!form.title.trim()) {
      toast.error("Collection title is required");
      return false;
    }

    if (!form.slug.trim()) {
      toast.error("Slug is required");
      return false;
    }

    const { min, max } = form.filters.priceRange;
    if (
      typeof min === "number" &&
      typeof max === "number" &&
      min > max
    ) {
      toast.error("Minimum price cannot be greater than maximum price");
      return false;
    }

    return true;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (loading) return;
    if (!validate()) return;

    try {
      setLoading(true);

      await onSubmit({
        title: form.title.trim(),
        slug: slugifyCollectionTitle(form.slug),
        description: form.description?.trim() || "",
        bannerImage: form.bannerImage,
        filters: {
          category: form.filters.category || undefined,
          type: form.filters.type || undefined,
          tags: form.filters.tags,
          priceRange: {
            min: form.filters.priceRange.min,
            max: form.filters.priceRange.max,
          },
        },
        isActive: form.isActive,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-col gap-3 border-b border-slate-200 pb-6 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9a7b53]">
              Basic Info
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
              Collection setup
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Define the collection identity, public slug, supporting copy, and
              banner image shown on the storefront.
            </p>
          </div>

          <label className="inline-flex items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  isActive: event.target.checked,
                }))
              }
              className="h-4 w-4 accent-emerald-600"
            />
            Active collection
          </label>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-5">
            <div>
              <label className="text-sm font-medium text-slate-700">
                Title
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(event) => handleTitleChange(event.target.value)}
                placeholder="e.g. Summer Linen Edit"
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Slug</label>
              <input
                type="text"
                value={form.slug}
                onChange={(event) => handleSlugChange(event.target.value)}
                placeholder="summer-linen-edit"
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
              <p className="mt-2 text-xs text-slate-500">
                Auto-generated from the title, but still editable.
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    description: event.target.value,
                  }))
                }
                placeholder="Describe the mood, use case, or shopper intent behind this collection."
                rows={5}
                className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </div>
          </div>

          <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-medium text-slate-700">Banner image</p>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              Upload a strong visual for the collection hero on the storefront.
            </p>

            <div className="mt-4">
              <ImageUpload
                multiple={false}
                onFilesSelect={(files) => {
                  if (files[0]) {
                    void handleBannerUpload(files[0]);
                  }
                }}
              />
            </div>

            <div className="mt-5 overflow-hidden rounded-[24px] border border-slate-200 bg-white">
              {form.bannerImage?.url ? (
                <div className="relative h-64 w-full">
                  <Image
                    src={form.bannerImage.url}
                    alt={form.title || "Collection banner preview"}
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="flex h-64 items-center justify-center bg-[linear-gradient(135deg,#f5efe3_0%,#ece3d2_100%)] px-6 text-center text-sm text-slate-500">
                  Banner preview will appear here
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div className="border-b border-slate-200 pb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9a7b53]">
            Filters
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
            Product matching rules
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">
            These filters are stored with the collection, then applied by the
            backend to decide which products appear on the storefront.
          </p>
        </div>

        <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-slate-700">
                  Category
                </label>
                <select
                  value={form.filters.category}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      filters: {
                        ...prev.filters,
                        category: event.target.value,
                      },
                    }))
                  }
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                >
                  <option value="">All categories</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700">
                  Type
                </label>
                <select
                  value={form.filters.type}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      filters: {
                        ...prev.filters,
                        type: event.target.value,
                      },
                    }))
                  }
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                >
                  <option value="">Any type</option>
                  {COLLECTION_TYPE_OPTIONS.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">Tags</label>
              <p className="mt-1 text-xs text-slate-500">
                Multi-select tags stored with the collection for backend product
                matching.
              </p>

              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {COLLECTION_TAG_OPTIONS.map((tag) => {
                  const checked = form.filters.tags.includes(tag.value);

                  return (
                    <label
                      key={tag.value}
                      className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm transition ${checked
                          ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                          : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                        }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => handleTagToggle(tag.value)}
                        className="h-4 w-4 accent-emerald-600"
                      />
                      {tag.label}
                    </label>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700">
                Price range
              </label>
              <div className="mt-2 grid gap-4 sm:grid-cols-2">
                <input
                  type="number"
                  min="0"
                  value={form.filters.priceRange.min ?? ""}
                  onChange={(event) =>
                    handlePriceChange("min", event.target.value)
                  }
                  placeholder="Minimum price"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
                <input
                  type="number"
                  min="0"
                  value={form.filters.priceRange.max ?? ""}
                  onChange={(event) =>
                    handlePriceChange("max", event.target.value)
                  }
                  placeholder="Maximum price"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>
            </div>
          </div>

          <aside className="rounded-[24px] border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
              Summary
            </p>
            <div className="mt-5 space-y-4 text-sm text-slate-600">
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                  Category
                </p>
                <p className="mt-2 font-medium text-slate-900">
                  {selectedCategoryName}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                  Type
                </p>
                <p className="mt-2 font-medium text-slate-900">
                  {selectedTypeLabel}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                  Tags
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {form.filters.tags.length ? (
                    form.filters.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-slate-900 px-3 py-1 text-xs font-medium text-white"
                      >
                        {COLLECTION_TAG_OPTIONS.find((item) => item.value === tag)
                          ?.label || tag}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-500">No tags selected</span>
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                  Price
                </p>
                <p className="mt-2 font-medium text-slate-900">
                  {form.filters.priceRange.min ?? 0} -{" "}
                  {form.filters.priceRange.max ?? "Any"}
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <div className="flex flex-col gap-3 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-slate-500">
          Admin saves the filters, backend applies them, storefront shows the
          matching products.
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            disabled={loading}
            onClick={() => router.back()}
            className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? initialData
                ? "Updating..."
                : "Creating..."
              : initialData
                ? "Update Collection"
                : "Create Collection"}
          </button>
        </div>
      </div>
    </form>
  );
}
