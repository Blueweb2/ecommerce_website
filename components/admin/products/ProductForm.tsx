"use client";

import { useEffect, useState } from "react";
import { useCategoryStore } from "@/store/admin/useCategoryStore";
import { useDesignerStore } from "@/store/admin/useDesignerStore"; // ✅ Added
import { generateVariants } from "@/lib/utils/generateVariants";
import { calculateVariantStock, hasVariants } from "@/lib/utils/product-stock";
import { uploadMultipleImages } from "@/lib/cloudinary/upload";

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
import PricingSection from "./PricingSection";
import SpecificationsSection from "./SpecificationsSection";
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
  designer: string; // ✅ ADD THIS
  sections: string[];
  images: CatalogImage[];
  stock: number | string;
  isPublished: boolean;
  isOnSale: boolean;
  gstPercentage: number | string;
  primaryImageIndex?: number;

  variants: {
    attributes: Record<string, string>;
    stock?: number | string;
    price?: number | string;
    discountPrice?: number | string;
    images?: {
      file?: File;
      preview?: string;
      url?: string;
      public_id?: string;
      isPrimary?: boolean;
    }[];
  }[];
  specifications: {
    name: string;
    value: string;
  }[];

  isFabric: boolean;
  unit: string;
  minOrderQty: number | string;
  stepQty: number | string;

  customizable?: {
    isCustomizable: boolean;
    fields: {
      name: string;
      type: "text" | "number" | "select";
      required?: boolean;
      options?: string[];
      unit?: string;
    }[];
  };
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
  deliveryDetails: "",
  keyFeatures: [],
  category: "",
  designer: "", // ✅ ADD THIS
  sections: [],
  images: [],
  stock: "",
  isPublished: true,
  isOnSale: false,
  gstPercentage: 0,
  variants: [],
  specifications: [],
  primaryImageIndex: 0,
  isFabric: false,
  unit: "meter",
  minOrderQty: 1,
  stepQty: 0.5,
};

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
    designer: (initialData as any)?.designer?._id || (initialData as any)?.designer || "", // ✅ Added
    sections: initialData?.sections || [],
    variants:
      initialData?.variants?.map((v) => ({
        attributes: v.attributes || {},
        stock: v.stock ?? "",
        price: v.price ?? "",
        discountPrice: v.discountPrice ?? "",
        images: v.images || [],
      })) || [],
    specifications: initialData?.specifications || [],
    isFabric: initialData?.isFabric ?? false,
    unit: initialData?.unit || "meter",
    minOrderQty: initialData?.minOrderQty ?? 1,
    stepQty: initialData?.stepQty ?? 0.5,
  });

  const [customizable, setCustomizable] = useState({
    isCustomizable: initialData?.customizable?.isCustomizable || false,
    fields: initialData?.customizable?.fields || [] as {
      name: string;
      type: "text" | "number" | "select";
      required?: boolean;
      options?: string[];
      unit?: string;
    }[],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [files, setFiles] = useState<File[]>([]);
  const [attributes, setAttributes] = useState<{ name: string; values: string[] }[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [saleType, setSaleType] = useState<"percentage" | "fixed">("percentage");

  const steps = [
    "Basic Info",
    "Media",
    "Attributes & Variants",
    "Pricing & Sale",
    "Customization",
    "Preview & Publish",
  ];

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 6));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  useEffect(() => {
    const combos = generateVariants(attributes);
    setForm((prev) => {
      const existingMap = new Map(prev.variants.map((v) => [normalize(v.attributes), v]));
      return {
        ...prev,
        variants: combos.map((combo) => {
          const key = normalize(combo);
          const existing = existingMap.get(key);
          return existing || { attributes: combo, stock: "", price: "", discountPrice: "" };
        }),
      };
    });
  }, [attributes]);

  useEffect(() => {
    if (initialData?.variants?.length) {
      const first = initialData.variants[0];
      const keys = Object.keys(first.attributes || {});
      const attrs = keys.map((key) => ({
        name: key,
        values: [...new Set(initialData.variants!.map((v) => v.attributes[key]))],
      }));
      setAttributes(attrs);
    }

    if (initialData?.customizable) {
      setCustomizable({
        isCustomizable: initialData.customizable.isCustomizable,
        fields: initialData.customizable.fields || [],
      });
    }
  }, [initialData]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    if (!hasVariants(form.variants)) {
      return;
    }

    const totalStock = calculateVariantStock(form.variants);

    setForm((prev) =>
      Number(prev.stock) === totalStock ? prev : { ...prev, stock: totalStock }
    );
  }, [form.variants]);

  const { designers, fetchDesigners } = useDesignerStore();
  useEffect(() => {
    fetchDesigners();
  }, [fetchDesigners]);

  const validateForm = () => {
    const nextErrors: Record<string, string> = {};
    if (!form.name.trim()) nextErrors.name = "Product name is required";
    if (!form.category) nextErrors.category = "Category is required";
    if (files.length === 0 && form.images.length === 0) nextErrors.images = "At least one product image is required";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    if (!validateForm()) return;
    try {
      setLoading(true);
      const cleanedVariants = form.variants.filter((v) =>
        Object.values(v.attributes).every((val) => val.trim() !== "")
      );
      const preparedVariants = await Promise.all(
        cleanedVariants.map(async (variant) => {
          const existingImages =
            variant.images?.filter((image) => image.url && image.public_id).map((image) => ({
              url: image.url!,
              public_id: image.public_id!,
              isPrimary: image.isPrimary,
            })) || [];

          const newVariantFiles =
            variant.images?.filter((image) => image.file).map((image) => image.file!) || [];

          const uploadedVariantImages =
            newVariantFiles.length > 0
              ? await uploadMultipleImages(
                  newVariantFiles,
                  "ecommerce/products/variants"
                )
              : [];

          return {
            attributes: variant.attributes,
            stock: variant.stock === "" ? 0 : Number(variant.stock),
            price: variant.price === "" ? undefined : Number(variant.price),
            discountPrice:
              variant.discountPrice === ""
                ? undefined
                : Number(variant.discountPrice),
            images: [...existingImages, ...uploadedVariantImages],
          };
        })
      );
      const totalStock =
        preparedVariants.length > 0
          ? calculateVariantStock(preparedVariants)
          : Number(form.stock) || 0;

      const payload: ProductPayload = {
        name: form.name.trim(),
        description: form.description.trim(),
        deliveryDetails: form.deliveryDetails.trim(),
        keyFeatures: form.keyFeatures.map((f) => f.trim()).filter(Boolean),
        price: Number(form.price),
        discountPrice: Number(form.discountPrice) || undefined,
        category: form.category,
        designer: form.designer || undefined, // ✅ Added
        brand: designers.find(d => d._id === form.designer)?.brandName || "", // ✅ Added
        sections: form.sections,
        images: form.images,
        stock: totalStock,
        isPublished: form.isPublished,
        isOnSale: Boolean(form.isOnSale),
        gstPercentage: Number(form.gstPercentage) || 0,
        attributes:
          preparedVariants.length > 0
            ? Object.keys(preparedVariants[0].attributes).map((key) => ({
              name: key,
              values: [
                ...new Set(preparedVariants.map((v) => v.attributes[key])),
              ],
            }))
            : [],
        variants: preparedVariants,
        primaryImageIndex: form.primaryImageIndex || 0,
        customizable: customizable.isCustomizable ? customizable : undefined,
        specifications: form.specifications.filter(s => s.name.trim() && s.value.trim()),
        isFabric: form.isFabric,
        unit: form.isFabric ? form.unit.trim() : "piece",
        minOrderQty: form.isFabric ? Number(form.minOrderQty) || 1 : 1,
        stepQty: form.isFabric ? Number(form.stepQty) || 1 : 1,
      };

      await onSubmit(payload, files);
      toast.success(initialData ? "Product updated" : "Product created");
      router.replace("/admin/products");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      <ProductHeader
        isPublished={form.isPublished}
        isOnSale={form.isOnSale}
        setForm={setForm}
        loading={loading}
        isEdit={!!initialData}
        currentStep={currentStep}
        totalSteps={steps.length}
        stepTitle={steps[currentStep - 1]}
      />

      <div className="flex items-center justify-between px-4 py-2 bg-slate-50 rounded-2xl border border-slate-200 overflow-x-auto gap-4">
        {steps.map((step, idx) => {
          const stepNum = idx + 1;
          const isActive = currentStep === stepNum;
          const isCompleted = currentStep > stepNum;
          return (
            <div key={step} className="flex items-center shrink-0">
              <div
                onClick={() => isCompleted && setCurrentStep(stepNum)}
                className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-all ${isActive ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200" : isCompleted ? "bg-emerald-100 text-emerald-700 cursor-pointer" : "bg-slate-200 text-slate-500"
                  }`}
              >
                {isCompleted ? "✓" : stepNum}
              </div>
              <span className={`ml-2 text-xs font-bold hidden md:block ${isActive ? "text-slate-900" : "text-slate-400"}`}>{step}</span>
              {idx < steps.length - 1 && <div className={`w-4 md:w-8 h-0.5 mx-2 ${isCompleted ? "bg-emerald-500" : "bg-slate-200"}`} />}
            </div>
          );
        })}
      </div>

      <div className="min-h-[400px]">
        {currentStep === 1 && (
          <div className="space-y-8">
            <CoreDetails form={form} setForm={setForm} errors={errors} />
            <CatalogSection form={form} setForm={setForm} categories={categories} designers={designers} errors={errors} />
            {/* Features section merged here for Step 1 */}
            <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm space-y-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Key Features</h3>
                <p className="text-sm text-slate-500">Highlights of this product.</p>
              </div>
              <div className="space-y-3">
                {form.keyFeatures.map((f: string, i: number) => (
                  <div key={i} className="flex gap-2">
                    <input value={f} onChange={(e) => {
                      const updated = [...form.keyFeatures];
                      updated[i] = e.target.value;
                      setForm((prev: any) => ({ ...prev, keyFeatures: updated }));
                    }} className="flex-1 rounded-xl border border-slate-200 px-4 py-2 text-sm" />
                    <button type="button" onClick={() => setForm((prev: any) => ({ ...prev, keyFeatures: prev.keyFeatures.filter((_: any, idx: any) => idx !== i) }))} className="text-red-500 font-bold">×</button>
                  </div>
                ))}
                <button type="button" onClick={() => setForm((prev: any) => ({ ...prev, keyFeatures: [...prev.keyFeatures, ""] }))} className="text-emerald-600 text-sm font-bold">+ Add Feature</button>
              </div>
            </section>
            <SpecificationsSection specifications={form.specifications} setForm={setForm} />
          </div>
        )}
        {currentStep === 2 && <MediaSection files={files} setFiles={setFiles} form={form} setForm={setForm} errors={errors} />}
        {currentStep === 3 && (
          <div className="space-y-8">
            <AttributeBuilder attributes={attributes} setAttributes={setAttributes} />
            <VariantSection variants={form.variants} setForm={setForm} errors={errors} />
          </div>
        )}
        {currentStep === 4 && <PricingSection form={form} setForm={setForm} errors={errors} saleType={saleType} setSaleType={setSaleType} />}
        {currentStep === 5 && (
          <section className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm space-y-8">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
              <div>
                <h3 className="font-bold text-slate-900">Allow Customization</h3>
                <p className="text-sm text-slate-500">Add input fields for buyer personalization.</p>
              </div>
              <input type="checkbox" checked={customizable.isCustomizable} onChange={(e) => setCustomizable({ ...customizable, isCustomizable: e.target.checked })} className="h-6 w-6 accent-emerald-500" />
            </div>
            {customizable.isCustomizable && (
              <div className="space-y-4">
                {customizable.fields.map((field, idx) => (
                  <div key={idx} className="p-4 border border-slate-100 rounded-2xl bg-white shadow-sm space-y-4">
                    <input placeholder="Field Name (e.g. Size)" value={field.name} onChange={(e) => {
                      const updated = [...customizable.fields];
                      updated[idx].name = e.target.value;
                      setCustomizable({ ...customizable, fields: updated });
                    }} className="w-full rounded-xl border border-slate-200 px-4 py-2" />
                    <select value={field.type} onChange={(e) => {
                      const updated = [...customizable.fields];
                      updated[idx].type = e.target.value as any;
                      setCustomizable({ ...customizable, fields: updated });
                    }} className="w-full rounded-xl border border-slate-200 px-4 py-2 bg-white">
                      <option value="text">Text</option>
                      <option value="number">Number</option>
                      <option value="select">Dropdown</option>
                    </select>

                    {field.type === "select" && (
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">Options (comma separated)</label>
                        <input
                          placeholder="Small, Medium, Large"
                          value={field.options?.join(", ") || ""}
                          onChange={(e) => {
                            const updated = [...customizable.fields];
                            updated[idx].options = e.target.value.split(",").map(o => o.trim()).filter(Boolean);
                            setCustomizable({ ...customizable, fields: updated });
                          }}
                          className="w-full rounded-xl border border-slate-200 px-4 py-2"
                        />
                      </div>
                    )}

                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase">
                        <input
                          type="checkbox"
                          checked={field.required}
                          onChange={(e) => {
                            const updated = [...customizable.fields];
                            updated[idx].required = e.target.checked;
                            setCustomizable({ ...customizable, fields: updated });
                          }}
                        />
                        Required
                      </label>
                      <button type="button" onClick={() => setCustomizable({ ...customizable, fields: customizable.fields.filter((_, i) => i !== idx) })} className="text-red-500 text-xs font-bold uppercase">Remove</button>
                    </div>
                  </div>
                ))}
                <button type="button" onClick={() => setCustomizable({ ...customizable, fields: [...customizable.fields, { name: "", type: "text" }] })} className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-bold hover:bg-slate-50 hover:border-emerald-200 hover:text-emerald-600 transition-all">+ Add custom field</button>
              </div>
            )}
          </section>
        )}
        {currentStep === 6 && <PreviewSection form={form} files={files} setFiles={setFiles} />}
      </div>

      <div className="flex items-center justify-between p-6 bg-white border border-slate-200 rounded-[32px] shadow-xl shadow-slate-100">
        <button type="button" onClick={prevStep} disabled={currentStep === 1} className="px-8 py-3 rounded-2xl text-slate-500 font-bold hover:bg-slate-50 disabled:opacity-30">Back</button>
        {currentStep < 6 ? (
          <button type="button" onClick={nextStep} className="px-10 py-4 bg-slate-900 text-white font-bold rounded-2xl shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all active:scale-95">Continue to {steps[currentStep]}</button>
        ) : (
          <button type="submit" disabled={loading} className="px-10 py-4 bg-emerald-600 text-white font-bold rounded-2xl shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all active:scale-95 disabled:opacity-50">
            {loading ? "Publishing..." : "Finish & Publish"}
          </button>
        )}
      </div>
    </form>
  );
}
