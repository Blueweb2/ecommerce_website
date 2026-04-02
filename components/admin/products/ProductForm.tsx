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

type ProductFormValues = {
  name: string;
  price: number | string;
  description: string;
  category: string;
  sections: string[];
  images: CatalogImage[];
  stock: number | string;
  isPublished: boolean;

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
  category: "",
  sections: [],
  images: [],
  stock: "",
  isPublished: true,
  variants: [],
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
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  // ✅ SUBMIT
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const cleanedVariants = form.variants.filter((v) =>
      Object.values(v.attributes).every((val) => val.trim() !== "")
    );

    // ✅ No variants
    if (cleanedVariants.length === 0) {
      await onSubmit(
        {
          name: form.name.trim(),
          description: form.description.trim(),
          price: Number(form.price),
          category: form.category,
          sections: form.sections,
          images: [],
          stock: Number(form.stock) || 0,
          isPublished: form.isPublished,
          attributes: [],
          variants: [],
        },
        files
      );
      return;
    }

    // ✅ Attributes payload
    const attributeKeys = Object.keys(cleanedVariants[0].attributes);

    const attributesPayload = attributeKeys.map((key) => ({
      name: key,
      values: [
        ...new Set(cleanedVariants.map((v) => v.attributes[key])),
      ],
    }));

    // ✅ Variants payload (NO SKU)
    const variantsPayload = cleanedVariants.map((v) => ({
      attributes: v.attributes,
      stock: v.stock === "" ? 0 : Number(v.stock),
      price: v.price === "" ? undefined : Number(v.price),
    }));

    await onSubmit(
      {
        name: form.name.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        category: form.category,
        sections: form.sections,
        images: [],
        stock: Number(form.stock) || 0,
        isPublished: form.isPublished,
        attributes: attributesPayload,
        variants: variantsPayload,
      },
      files
    );
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
      </div>

      <button className="rounded-full bg-[#12251a] px-5 py-3 text-sm font-semibold text-white hover:bg-[#1c3424]">
        Save Product
      </button>
    </form>
  );
}