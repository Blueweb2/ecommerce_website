"use client";

import { useEffect, useMemo, useState } from "react";
import { ImagePlus, Package2, Plus, Tags, Trash2 } from "lucide-react";
import { useCategoryStore } from "@/store/admin/useCategoryStore";
import ImageUpload from "@/components/admin/ui/ImageUpload";
import { uploadMultipleImages } from "@/lib/cloudinary/upload";

import {
  CatalogImage,
  PRODUCT_SECTION_OPTIONS,
  ProductPayload,
  ProductVariant,
} from "@/lib/constants/admin-catalog";

type ProductFormValues = {
  sku: string;
  name: string;
  price: number | string;
  description: string;
  category: string;
  sections: string[];

  // ✅ FIXED
  images: CatalogImage[];

  altText: string;
  stock: number | string;
  isPublished: boolean;

  variants: {
    size: string;
    color: string;
    stock?: number | string;
    price?: number | string;
  }[];
};

type ProductFormProps = {
  onSubmit: (data: ProductPayload) => void | Promise<void>;
  initialData?: Partial<ProductFormValues>;
};

const defaultValues: ProductFormValues = {
  sku: "",
  name: "",
  price: "",
  description: "",
  category: "",
  sections: [],
  images: [],
  altText: "",
  stock: "",
  isPublished: true,
  variants: [],
};



export default function ProductForm({
  onSubmit,
  initialData,
}: ProductFormProps) {
  const { categories, fetchCategories } = useCategoryStore();

const defaultValues: ProductFormValues = {
  sku: "",
  name: "",
  price: 0,
  description: "",
  category: "",
  sections: [],
  images: [],
  altText: "",
  stock: 0,
  isPublished: true,
  variants: [],
};

const [form, setForm] = useState<ProductFormValues>({
  ...defaultValues,
  ...initialData,

  sections: initialData?.sections || [],

  variants:
    initialData?.variants?.map((v) => ({
      size: v.size || "",
      color: v.color || "",
      stock: v.stock ?? "",
      price: v.price ?? "",
    })) || [],
});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);



  const toggleSection = (section: string) => {
    setForm((current) => ({
      ...current,
      sections: current.sections.includes(section)
        ? current.sections.filter((item) => item !== section)
        : [...current.sections, section],
    }));
  };

  const addVariant = () => {
    setForm((current) => ({
      ...current,
      variants: [
        ...current.variants,
        { size: "", color: "", stock: "", price: "" },
      ],
    }));
  };

  const updateVariant = (
    index: number,
    field: "size" | "color" | "stock" | "price",
    value: string
  ) => {
    setForm((current) => ({
      ...current,
      variants: current.variants.map((variant, variantIndex) =>
        variantIndex === index
          ? {
            ...variant,
            [field]: value,
          }
          : variant
      ),
    }));
  };

  const removeVariant = (index: number) => {
    setForm((current) => ({
      ...current,
      variants: current.variants.filter((_, variantIndex) => variantIndex !== index),
    }));
  };

const validateForm = () => {
  const nextErrors: Record<string, string> = {};

  const price = Number(form.price);
  const stock = Number(form.stock);
  const existingImages = form.images || [];

  // 🔹 Name
  if (!form.name.trim()) {
    nextErrors.name = "Product name is required";
  }

  // 🔹 Category
  if (!form.category) {
    nextErrors.category = "Category is required";
  }

  // 🔹 Price
  if (isNaN(price) || price <= 0) {
    nextErrors.price = "Price must be greater than 0";
  }

  // 🔹 Stock
  if (isNaN(stock) || stock < 0) {
    nextErrors.stock = "Stock cannot be negative";
  }

  // 🔹 Images (NEW + EXISTING)
  if (files.length === 0 && existingImages.length === 0) {
    nextErrors.images = "At least one product image is required";
  }

  // 🔹 Variants validation
  const hasInvalidVariant = form.variants.some((variant) => {
    const hasSize = variant.size.trim() !== "";
    const hasColor = variant.color.trim() !== "";

    // only one filled → invalid
    return (hasSize && !hasColor) || (!hasSize && hasColor);
  });

  if (hasInvalidVariant) {
    nextErrors.variants = "Each variant must have both size and color";
  }

  // 🔹 Optional: duplicate variants check (🔥 advanced)
  const variantSet = new Set();
  for (const v of form.variants) {
    if (!v.size && !v.color) continue;

    const key = `${v.size.trim()}-${v.color.trim()}`;
    if (variantSet.has(key)) {
      nextErrors.variants = "Duplicate variants are not allowed";
      break;
    }
    variantSet.add(key);
  }

  // 🔹 Optional: description length
  if (form.description && form.description.length < 10) {
    nextErrors.description = "Description should be at least 10 characters";
  }

  setErrors(nextErrors);

  return Object.keys(nextErrors).length === 0;
};

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();

        if (!validateForm()) return;

        let uploadedImages: CatalogImage[] = [];
        // 🔥 Upload images to Cloudinary
        if (files.length > 0) {
          uploadedImages = await uploadMultipleImages(files);
        }

        await onSubmit({
          name: form.name.trim(),
          price: Number(form.price),
          description: form.description.trim(),
          category: form.category,
          sections: form.sections,

          // ✅ USE CLOUDINARY IMAGES
          images: uploadedImages,

          stock: form.stock === "" ? 0 : Number(form.stock),
          isPublished: form.isPublished,

          variants: form.variants
            .filter((variant) => variant.size.trim() || variant.color.trim())
            .map((variant) => ({
              size: variant.size.trim(),
              color: variant.color.trim(),
              stock:
                variant.stock === "" ? undefined : Number(variant.stock),
              price:
                variant.price === "" ? undefined : Number(variant.price),
            })),
        });
      }}
    >
      <section className="overflow-hidden rounded-[32px] bg-[#12251a] text-white shadow-xl">
        <div className="flex flex-col gap-4 p-6 md:flex-row md:items-end md:justify-between md:p-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.24em] text-emerald-100">
              <Package2 className="h-3.5 w-3.5" />
              Product setup
            </div>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight">
              Build a product that fits your catalog structure
            </h2>
            <p className="mt-3 text-sm leading-6 text-emerald-50/80">
              Assign one category and tag the product into storefront sections
              like Featured or New Arrival.
            </p>
          </div>

          <label className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-medium">
            <input
              type="checkbox"
              checked={form.isPublished}
              onChange={(event) =>
                setForm({ ...form, isPublished: event.target.checked })
              }
              className="h-4 w-4 accent-white"
            />
            Published
          </label>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-xl font-semibold tracking-tight text-slate-900">
              Core details
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Add the essentials your shoppers and merchandisers need.
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="grid gap-2">
                <label className="text-sm font-medium text-slate-700">
                  SKU
                </label>
                <input
                  value={form.sku}
                  readOnly
                  placeholder="Auto generated after product creation"
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-500 outline-none"
                />
                <p className="text-xs text-slate-500">
                  The backend generates this automatically.
                </p>
              </div>

              <div className="grid gap-2 md:col-span-2">
                <label className="text-sm font-medium text-slate-700">
                  Product name
                </label>
                <input
                  placeholder="Halo diamond engagement ring"
                  value={form.name}
                  onChange={(event) =>
                    setForm({ ...form, name: event.target.value })
                  }
                  className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-400"
                />
                {errors.name ? (
                  <p className="text-sm text-rose-600">{errors.name}</p>
                ) : null}
              </div>

              <div className="grid gap-2 md:col-span-2">
                <label className="text-sm font-medium text-slate-700">
                  Price
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="12999"
                  value={form.price}
                  onChange={(event) =>
                    setForm({ ...form, price: event.target.value })
                  }
                  className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-400"
                />
                {errors.price ? (
                  <p className="text-sm text-rose-600">{errors.price}</p>
                ) : null}
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-medium text-slate-700">
                  Stock
                </label>
                <input
                  type="number"
                  min="0"
                  placeholder="14"
                  value={form.stock}
                  onChange={(event) =>
                    setForm({ ...form, stock: event.target.value })
                  }
                  className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-400"
                />
                {errors.stock ? (
                  <p className="text-sm text-rose-600">{errors.stock}</p>
                ) : null}
              </div>

              <div className="grid gap-2 md:col-span-2">
                <label className="text-sm font-medium text-slate-700">
                  Description
                </label>
                <textarea
                  rows={5}
                  placeholder="An heirloom-inspired ring with a brilliant center stone and polished pavé halo."
                  value={form.description}
                  onChange={(event) =>
                    setForm({ ...form, description: event.target.value })
                  }
                  className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-400"
                />
              </div>
            </div>
          </section>

          <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <Tags className="h-5 w-5 text-slate-500" />
              <h3 className="text-xl font-semibold tracking-tight text-slate-900">
                Catalog placement
              </h3>
            </div>

            <div className="mt-6 grid gap-6">
              <div className="grid gap-2">
                <label className="text-sm font-medium text-slate-700">
                  Category
                </label>
                <select
                  value={form.category}
                  onChange={(event) =>
                    setForm({ ...form, category: event.target.value })
                  }
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-slate-400"
                >
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.category ? (
                  <p className="text-sm text-rose-600">{errors.category}</p>
                ) : null}
              </div>

              <div className="grid gap-3">
                <label className="text-sm font-medium text-slate-700">
                  Storefront sections
                </label>
                <div className="grid gap-3 md:grid-cols-2">
                  {PRODUCT_SECTION_OPTIONS.map((section) => {
                    const active = form.sections.includes(section.value);

                    return (
                      <button
                        key={section.value}
                        type="button"
                        onClick={() => toggleSection(section.value)}
                        className={`rounded-[20px] border px-4 py-4 text-left transition ${active
                          ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                          : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300"
                          }`}
                      >
                        <p className="font-semibold">{section.label}</p>
                        <p className="mt-1 text-sm text-inherit/80">
                          Use this as a dynamic merchandising filter or tab.
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold tracking-tight text-slate-900">
                  Product variants
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Add size and color combinations for the same product.
                </p>
              </div>

              <button
                type="button"
                onClick={addVariant}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
              >
                <Plus className="h-4 w-4" />
                Add variant
              </button>
            </div>

            <div className="mt-6 space-y-4">
              {form.variants.length === 0 ? (
                <div className="rounded-[24px] border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-500">
                  No variants added yet. Use this for sizes like `6`, `7`, `8`
                  or colors like `Gold`, `Rose Gold`, `Silver`.
                </div>
              ) : null}

              {form.variants.map((variant, index) => (
                <div
                  key={`${variant.size}-${variant.color}-${index}`}
                  className="rounded-[24px] border border-slate-200 bg-slate-50 p-4"
                >
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-slate-700">
                      Variant {index + 1}
                    </p>
                    <button
                      type="button"
                      onClick={() => removeVariant(index)}
                      className="inline-flex items-center gap-2 rounded-full border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-50"
                    >
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </button>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <div className="grid gap-2">
                      <label className="text-sm font-medium text-slate-700">
                        Size
                      </label>
                      <input
                        placeholder="7"
                        value={variant.size}
                        onChange={(event) =>
                          updateVariant(index, "size", event.target.value)
                        }
                        className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-slate-400"
                      />
                    </div>

                    <div className="grid gap-2">
                      <label className="text-sm font-medium text-slate-700">
                        Color
                      </label>
                      <input
                        placeholder="Rose Gold"
                        value={variant.color}
                        onChange={(event) =>
                          updateVariant(index, "color", event.target.value)
                        }
                        className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-slate-400"
                      />
                    </div>

                    <div className="grid gap-2">
                      <label className="text-sm font-medium text-slate-700">
                        Variant stock
                      </label>
                      <input
                        type="number"
                        min="0"
                        placeholder="5"
                        value={variant.stock}
                        onChange={(event) =>
                          updateVariant(index, "stock", event.target.value)
                        }
                        className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-slate-400"
                      />
                    </div>

                    <div className="grid gap-2">
                      <label className="text-sm font-medium text-slate-700">
                        Variant price
                      </label>
                      <input
                        type="number"
                        min="0"
                        placeholder="14999"
                        value={variant.price}
                        onChange={(event) =>
                          updateVariant(index, "price", event.target.value)
                        }
                        className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-slate-400"
                      />
                    </div>
                  </div>
                </div>
              ))}

              {errors.variants ? (
                <p className="text-sm text-rose-600">{errors.variants}</p>
              ) : null}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
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
                    : "Upload multiple product images (first image will be primary)"}
                </p>

                {/* 🔥 Validation error */}
                {errors.images && (
                  <p className="text-sm text-rose-600">{errors.images}</p>
                )}
              </div>

              {/* 🔥 Image Preview Grid */}
              {files.length > 0 && (
                <div className="flex gap-3 flex-wrap mt-2">
                  {files.map((file, i) => (
                    <div key={i} className="relative">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`preview-${i}`}
                        className="h-20 w-20 object-cover rounded-lg border"
                      />

                      {/* ⭐ Primary badge */}
                      {i === 0 && (
                        <span className="absolute top-1 left-1 bg-black text-white text-xs px-2 py-0.5 rounded">
                          Primary
                        </span>
                      )}

                      {/* ❌ Remove */}
                      <button
                        type="button"
                        onClick={() =>
                          setFiles((prev) =>
                            prev.filter((_, index) => index !== i)
                          )
                        }
                        className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-0.5 rounded hover:bg-red-600"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Alt text */}
              <div className="grid gap-2">
                <label className="text-sm font-medium text-slate-700">
                  Image alt text
                </label>
                <input
                  placeholder="Diamond ring on a cream satin display"
                  value={form.altText}
                  onChange={(event) =>
                    setForm({ ...form, altText: event.target.value })
                  }
                  className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-400"
                />
              </div>
            </div>
          </section>
          <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-xl font-semibold tracking-tight text-slate-900">
              Preview
            </h3>

            <div className="mt-6 overflow-hidden rounded-[28px] border border-slate-200 bg-slate-50">
              <div className="flex h-72 items-center justify-center bg-[radial-gradient(circle_at_top,#fdf7e7,transparent_55%),linear-gradient(180deg,#ffffff_0%,#f5f5f5_100%)]">

                {files.length > 0 ? (
                  <img
                    src={URL.createObjectURL(files[0])}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="text-sm text-slate-400">
                    Upload images to preview
                  </div>
                )}

              </div>

              <div className="space-y-3 p-5">

                {/* Image grid */}
                {files.length > 0 && (
                  <div className="flex gap-3 flex-wrap">

                    {files.map((file, i) => (
                      <div key={i} className="relative">

                        <img
                          src={URL.createObjectURL(file)}
                          className="h-20 w-20 object-cover rounded"
                        />

                        {i === 0 && (
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
                  {form.sections.map((section) => (
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

                {/* Variants */}
                {form.variants.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {form.variants
                      .filter((variant) => variant.size || variant.color)
                      .map((variant, index) => (
                        <span
                          key={`${variant.size}-${variant.color}-${index}`}
                          className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600"
                        >
                          {variant.size || "No size"} / {variant.color || "No color"}
                        </span>
                      ))}
                  </div>
                )}

                <div>
                  {form.sku && (
                    <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                      SKU {form.sku}
                    </p>
                  )}

                  <p className="text-lg font-semibold text-slate-900">
                    {form.name || "Product title"}
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {form.description || "A quick product description will appear here."}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-xl font-semibold text-slate-900">
                    ₹ {form.price || "0"}
                  </p>

                  <span className="text-sm text-slate-500">
                    Stock: {form.stock || 0}
                  </span>
                </div>

              </div>
            </div>
          </section>
        </div>
      </div>

      <button className="rounded-full bg-[#12251a] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1c3424]">
        Save Product
      </button>
    </form>
  );
}
