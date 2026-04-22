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
import { useRouter } from "next/navigation";

type ProductFormValues = {
  name: string;
  price: number | string;
  discountPrice: number | string;
  description: string;
  deliveryDetails: string;
  keyFeatures: string[];
  category: string;
  sections: string[];
  images: CatalogImage[];
  stock: number | string;
  isPublished: boolean;
  isOnSale: boolean;
  primaryImageIndex?: number;

  variants: {
    attributes: Record<string, string>;
    stock?: number | string;
    price?: number | string;
    discountPrice?: number | string;
  }[];
};

type Props = {
  onSubmit: (data: ProductPayload, files: File[]) => Promise<void>;
  initialData?: Partial<ProductFormValues>;
};

const defaultValues: ProductFormValues = {
  name: "",
  price: "",
  discountPrice: "",
  description: "",
  deliveryDetails: "",   // ✅ ADD
  keyFeatures: [],
  category: "",
  sections: [],
  images: [],
  stock: "",
  isPublished: true,
  isOnSale: false,
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
  const router = useRouter();
  const { categories, fetchCategories } = useCategoryStore();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<ProductFormValues>({
    ...defaultValues,
    ...initialData,
    isOnSale: initialData?.isOnSale ?? false,
    sections: initialData?.sections || [],
    variants:
      initialData?.variants?.map((v) => ({
        attributes: v.attributes || {},
        stock: v.stock ?? "",
        price: v.price ?? "",
        discountPrice: v.discountPrice ?? "",
      })) || [],
  });


  const [customizable, setCustomizable] = useState({
    isCustomizable: false,
    fields: [] as {
      name: string;
      type: "text" | "number" | "select";
      required?: boolean;
      options?: string[];
      unit?: string;
    }[],
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

          return existing || {
            attributes: combo,
            stock: "",
            price: "",
            discountPrice: "",
          };
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

      let payload: ProductPayload;

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
          discountPrice: Number(form.discountPrice) || undefined,
          category: form.category,
          sections: form.sections,
          images: form.images,
          stock: Number(form.stock) || 0,
          isPublished: form.isPublished,
          isOnSale: Boolean(form.isOnSale),
          attributes: [],
          variants: [],
          customizable: customizable.isCustomizable ? customizable : undefined,
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
          discountPrice: v.discountPrice === "" ? undefined : Number(v.discountPrice),
        }));

        payload = {
          name: form.name.trim(),
          description: form.description.trim(),
          deliveryDetails: form.deliveryDetails.trim(),
          keyFeatures: form.keyFeatures.map((f) => f.trim()).filter(Boolean),
          price: Number(form.price),
          discountPrice: Number(form.discountPrice) || undefined,
          category: form.category,
          sections: form.sections,
          images: form.images,
          stock: Number(form.stock) || 0,
          isPublished: form.isPublished,
          isOnSale: Boolean(form.isOnSale),
          attributes: attributesPayload,
          variants: variantsPayload,
          primaryImageIndex: form.primaryImageIndex || 0,
          customizable: customizable.isCustomizable ? customizable : undefined,
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
        isOnSale={form.isOnSale}
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

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">

          {/* HEADER */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Product Content
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Add description, delivery info, and highlight key features
            </p>
          </div>

          {/* DESCRIPTION */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
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
              placeholder="Describe the product, materials, usage..."
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              rows={4}
            />
          </div>

          {/* DELIVERY DETAILS */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
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
              placeholder="Shipping time, packaging info, return policy..."
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              rows={3}
            />
          </div>

          {/* KEY FEATURES */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-700">
              Key Features
            </label>

            <div className="space-y-2">
              {form.keyFeatures.map((feature: string, index: number) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                >
                  <input
                    value={feature}
                    placeholder="e.g. 100% Cotton, Handmade, Waterproof"
                    onChange={(e) => {
                      const updated = [...form.keyFeatures];
                      updated[index] = e.target.value;

                      setForm((prev) => ({
                        ...prev,
                        keyFeatures: updated,
                      }));
                    }}
                    className="flex-1 bg-transparent outline-none text-sm"
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
                    className="text-red-500 text-sm hover:text-red-700"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {/* ADD BUTTON */}
            <button
              type="button"
              onClick={() =>
                setForm((prev) => ({
                  ...prev,
                  keyFeatures: [...prev.keyFeatures, ""],
                }))
              }
              className="inline-flex items-center gap-2 text-sm font-medium text-green-600 hover:text-green-700"
            >
              + Add Feature
            </button>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">

          {/* HEADER */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Customization
            </h3>
            <p className="text-sm text-slate-500 mt-1">
              Add custom input fields (e.g. size, engraving, measurements)
            </p>
          </div>

          {/* TOGGLE */}
          <div className="flex items-center justify-between border rounded-xl px-4 py-3 bg-slate-50">
            <span className="text-sm font-medium text-slate-700">
              Enable Customization
            </span>

            <input
              type="checkbox"
              checked={customizable.isCustomizable}
              onChange={(e) =>
                setCustomizable((prev) => ({
                  ...prev,
                  isCustomizable: e.target.checked,
                }))
              }
              className="h-4 w-4 accent-green-600"
            />
          </div>

          {/* FIELDS */}
          {customizable.isCustomizable && (
            <div className="space-y-4">

              {customizable.fields.map((field, index) => (
                <div
                  key={index}
                  className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-3"
                >

                  {/* FIELD NAME */}
                  <input
                    placeholder="Field name (e.g. Chest Size)"
                    value={field.name}
                    onChange={(e) => {
                      const updated = [...customizable.fields];
                      updated[index].name = e.target.value;
                      setCustomizable({ ...customizable, fields: updated });
                    }}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />

                  {/* TYPE */}
                  <select
                    value={field.type}
                    onChange={(e) => {
                      const updated = [...customizable.fields];
                      updated[index].type = e.target.value as any;
                      setCustomizable({ ...customizable, fields: updated });
                    }}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="text">Text Input</option>
                    <option value="number">Number Input</option>
                    <option value="select">Dropdown</option>
                  </select>

                  {/* REQUIRED */}
                  <label className="flex items-center gap-2 text-sm text-slate-600">
                    <input
                      type="checkbox"
                      checked={field.required || false}
                      onChange={(e) => {
                        const updated = [...customizable.fields];
                        updated[index].required = e.target.checked;
                        setCustomizable({ ...customizable, fields: updated });
                      }}
                    />
                    Required field
                  </label>

                  {/* OPTIONS (ONLY FOR SELECT) */}
                  {field.type === "select" && (
                    <input
                      placeholder="Options (e.g. S, M, L)"
                      value={field.options?.join(", ") || ""}
                      onChange={(e) => {
                        const updated = [...customizable.fields];
                        updated[index].options = e.target.value
                          .split(",")
                          .map((o) => o.trim());
                        setCustomizable({ ...customizable, fields: updated });
                      }}
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  )}

                  {/* REMOVE BUTTON */}
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        const updated = customizable.fields.filter(
                          (_, i) => i !== index
                        );
                        setCustomizable({ ...customizable, fields: updated });
                      }}
                      className="text-sm text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}

              {/* ADD BUTTON */}
              <button
                type="button"
                onClick={() =>
                  setCustomizable((prev) => ({
                    ...prev,
                    fields: [
                      ...prev.fields,
                      { name: "", type: "text" },
                    ],
                  }))
                }
                className="w-full border border-dashed border-slate-300 rounded-xl py-3 text-sm font-medium text-green-600 hover:bg-slate-50"
              >
                + Add Custom Field
              </button>
            </div>
          )}
        </section>
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`px-4 py-2 rounded ${loading ? "opacity-50 cursor-not-allowed" : "bg-green-600"
          }`}
      >
        {loading ? "Creating..." : "Create Product"}
      </button>
    </form>
  );
}