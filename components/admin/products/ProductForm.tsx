"use client";

import { useEffect, useState } from "react";
import { useCategoryStore } from "@/store/admin/useCategoryStore";
import { generateVariants } from "@/lib/utils/generateVariants";

import {
  CatalogImage,
  ProductPayload,
} from "@/lib/constants/admin-catalog";

import ProductHeader from "./ProductHeader";
import CoreDetails from "./CoreDetails";
import CatalogSection from "./CatalogSection";
import VariantSection from "./VariantSection";
import MediaSection from "./MediaSection";
import PreviewSection from "./PreviewSection";
import AttributeBuilder from "./AttributeBuilder";
import toast from "react-hot-toast";
import router from "next/router";

type ProductFormValues = {
  name: string;
  price: number | string;
  description: string;
  deliveryDetails: string;
  keyFeatures: string[];
  category: string;
  sections: string[];
  images: CatalogImage[];
  stock: number | string;
  isPublished: boolean;
   primaryImageIndex?: number;

  variants: {
    attributes: Record<string, string>;
    stock?: number | string;
    price?: number | string;
  }[];
};

type Props = {
  onSubmit: (data: ProductPayload, files: File[]) => Promise<void>;
  initialData?: Partial<ProductFormValues>;
};

const defaultValues: ProductFormValues = {
  name: "",
  price: "",
  description: "",
  deliveryDetails: "",   // ✅ ADD
  keyFeatures: [],
  category: "",
  sections: [],
  images: [],
  stock: "",
  isPublished: true,
  variants: [],
   primaryImageIndex: 0,
  
};

// 🔹 Normalize helper (important)
const normalize = (obj: Record<string, string>) =>
  JSON.stringify(
    Object.keys(obj)
      .sort()
      .reduce((acc, key) => {
        acc[key] = obj[key];
        return acc;
      }, {} as Record<string, string>)
  );

export default function ProductForm({ onSubmit, initialData }: Props) {
  const { categories, fetchCategories } = useCategoryStore();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<ProductFormValues>({
    ...defaultValues,
    ...initialData,
    sections: initialData?.sections || [],
    variants:
      initialData?.variants?.map((v) => ({
        attributes: v.attributes || {},
        stock: v.stock ?? "",
        price: v.price ?? "",
      })) || [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [files, setFiles] = useState<File[]>([]);
  const [attributes, setAttributes] = useState<
    { name: string; values: string[] }[]
  >([]);

  // 🔥 Generate variants (NO SKU here)
  useEffect(() => {
    const combos = generateVariants(attributes);

    setForm((prev) => {
      const existingMap = new Map(
        prev.variants.map((v) => [normalize(v.attributes), v])
      );

      return {
        ...prev,
        variants: combos.map((combo) => {
          const key = normalize(combo);
          const existing = existingMap.get(key);

          return (
            existing || {
              attributes: combo,
              stock: "",
              price: "",
            }
          );
        }),
      };
    });
  }, [attributes]);

  // 🔥 Load attributes in edit mode
  useEffect(() => {
    if (initialData?.variants?.length) {
      const first = initialData.variants[0];

      const keys = Object.keys(first.attributes || {});

      const attrs = keys.map((key) => ({
        name: key,
        values: [
          ...new Set(
            initialData.variants!.map((v) => v.attributes[key])
          ),
        ],
      }));

      setAttributes(attrs);
    }
  }, [initialData]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // ✅ Validation
  const validateForm = () => {
    const nextErrors: Record<string, string> = {};

    const price = Number(form.price);
    const stock = Number(form.stock);

    if (!form.name.trim()) nextErrors.name = "Product name is required";
    if (!form.category) nextErrors.category = "Category is required";

    if (isNaN(price) || price <= 0)
      nextErrors.price = "Price must be greater than 0";

    if (isNaN(stock) || stock < 0)
      nextErrors.stock = "Stock cannot be negative";

    if (files.length === 0 && form.images.length === 0) {
      nextErrors.images = "At least one product image is required";
    }

    const hasInvalidVariant = form.variants.some((v) =>
      Object.keys(v.attributes).length > 0 &&
      Object.values(v.attributes).some((val) => val.trim() === "")
    );

    if (hasInvalidVariant) {
      nextErrors.variants = "All variant attributes must be filled";
      toast.error("Please fill all variant attributes");
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  // ✅ SUBMIT
 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // ❗ prevent double submit
  if (loading) return;

  if (!validateForm()) return;

  try {
    setLoading(true);

    const cleanedVariants = form.variants.filter((v) =>
      Object.values(v.attributes).every((val) => val.trim() !== "")
    );

    // ✅ Show warning only if needed
    if (form.variants.length > cleanedVariants.length) {
      toast.error("Some variants were removed due to missing attributes");
    }

    let payload: any;

    // ===============================
    // ✅ CASE 1: NO VARIANTS
    // ===============================
    if (cleanedVariants.length === 0) {
      payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        deliveryDetails: form.deliveryDetails.trim(),
        keyFeatures: form.keyFeatures.map((f) => f.trim()).filter(Boolean),
        price: Number(form.price),
        category: form.category,
        sections: form.sections,
        images: form.images,
        stock: Number(form.stock) || 0,
        isPublished: form.isPublished,
        attributes: [],
        variants: [],
        primaryImageIndex: Number(form.primaryImageIndex) || 0,
      };
    } else {
      // ===============================
      // ✅ CASE 2: WITH VARIANTS
      // ===============================

      const attributeKeys = Object.keys(cleanedVariants[0].attributes);

      const attributesPayload = attributeKeys.map((key) => ({
        name: key,
        values: [
          ...new Set(cleanedVariants.map((v) => v.attributes[key])),
        ],
      }));

      const variantsPayload = cleanedVariants.map((v) => ({
        attributes: v.attributes,
        stock: v.stock === "" ? 0 : Number(v.stock),
        price: v.price === "" ? undefined : Number(v.price),
      }));

      payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        deliveryDetails: form.deliveryDetails.trim(),
        keyFeatures: form.keyFeatures.map((f) => f.trim()).filter(Boolean),
        price: Number(form.price),
        category: form.category,
        sections: form.sections,
        images: form.images,
        stock: Number(form.stock) || 0,
        isPublished: form.isPublished,
        attributes: attributesPayload,
        variants: variantsPayload,
        primaryImageIndex: form.primaryImageIndex || 0,
      };
    }

    // ===============================
    // ✅ API CALL
    // ===============================
    await onSubmit(payload, files);

    // ===============================
    // ✅ SUCCESS UX
    // ===============================
    toast.success("Product created successfully");

    // ✅ redirect
    router.replace("/admin/products");

  } catch (error: any) {
    console.error(error);

    toast.error(
      error?.response?.data?.message || "Failed to create product"
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <form onSubmit={handleSubmit}>
      <ProductHeader
        isPublished={form.isPublished}
        setForm={setForm}
      />

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr] my-6">
        <div className="space-y-6">
          <CoreDetails form={form} setForm={setForm} errors={errors} />

          <CatalogSection
            form={form}
            setForm={setForm}
            categories={categories}
            errors={errors}
          />

          <AttributeBuilder
            attributes={attributes}
            setAttributes={setAttributes}
          />

          <VariantSection
            variants={form.variants}
            setForm={setForm}
            errors={errors}
          />
        </div>

        <div className="space-y-6">
          <MediaSection
            files={files}
            setFiles={setFiles}
            form={form}
            setForm={setForm}
            errors={errors}
          />

          <PreviewSection
            form={form}
            files={files}
            setFiles={setFiles}
          />
        </div>

        {/* Product Content Section */}
        <section className="rounded-2xl border p-6 bg-white space-y-4">
          <h3 className="text-lg font-semibold">Product Content</h3>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Product Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className="w-full border rounded px-3 py-2"
              rows={4}
            />
          </div>

          {/* Delivery Details */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Delivery Details
            </label>
            <textarea
              value={form.deliveryDetails}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  deliveryDetails: e.target.value,
                }))
              }
              className="w-full border rounded px-3 py-2"
              rows={3}
            />
          </div>

          {/* Key Features */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Key Features
            </label>

            {form.keyFeatures.map((feature: string, index: number) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  value={feature}
                  onChange={(e) => {
                    const updated = [...form.keyFeatures];
                    updated[index] = e.target.value;

                    setForm((prev) => ({
                      ...prev,
                      keyFeatures: updated,
                    }));
                  }}
                  className="border px-3 py-2 rounded w-full"
                />

                <button
                  type="button"
                  onClick={() => {
                    const updated = form.keyFeatures.filter(
                      (_, i) => i !== index
                    );
                    setForm((prev) => ({
                      ...prev,
                      keyFeatures: updated,
                    }));
                  }}
                >
                  ❌
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={() =>
                setForm((prev) => ({
                  ...prev,
                  keyFeatures: [...prev.keyFeatures, ""],
                }))
              }
              className="text-blue-600 text-sm"
            >
              + Add Feature
            </button>
          </div>
        </section>
      </div>

    <button
  onClick={handleSubmit}
  disabled={loading}
  className={`px-4 py-2 rounded ${
    loading ? "opacity-50 cursor-not-allowed" : "bg-green-600"
  }`}
>
  {loading ? "Creating..." : "Create Product"}
</button>
    </form>
  );
}