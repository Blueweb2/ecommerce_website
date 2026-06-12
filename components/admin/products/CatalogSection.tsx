//  (category + sections)
"use client";

import { Tags } from "lucide-react";
import { PRODUCT_SECTION_OPTIONS } from "@/lib/constants/admin-catalog";

type Props = {
  form: any;
  setForm: (updater: any) => void;
  categories: any[];
  designers?: any[]; //  Added
  errors: Record<string, string>;
  isDesignerPortal?: boolean;
};

export default function CatalogSection({
  form,
  setForm,
  categories,
  designers = [], //  Added
  errors,
  isDesignerPortal,
}: Props) {
  
  //  toggle logic inside component
  const toggleSection = (section: string) => {
    setForm((prev: any) => ({
      ...prev,
      sections: prev.sections.includes(section)
        ? prev.sections.filter((item: string) => item !== section)
        : [...prev.sections, section],
    }));
  };

  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      
      {/* Header */}
      <div className="flex items-center gap-2">
        <Tags className="h-5 w-5 text-slate-500" />
        <h3 className="text-xl font-semibold tracking-tight text-slate-900">
          Catalog placement
        </h3>
      </div>

      <div className="mt-6 grid gap-6">
        
        {/* Category */}
        <div className="grid gap-2">
          <label className="text-sm font-medium text-slate-700">
            Category
          </label>

          <select
            value={form.category}
            onChange={(e) =>
              setForm((prev: any) => ({
                ...prev,
                category: e.target.value,
              }))
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

          {errors.category && (
            <p className="text-sm text-rose-600">{errors.category}</p>
          )}
        </div>

        {/* Designer / Brand */}
        {!isDesignerPortal && (
          <div className="grid gap-2">
            <label className="text-sm font-medium text-slate-700">
              Designer / Brand
            </label>

            <select
              value={form.designer}
              onChange={(e) =>
                setForm((prev: any) => ({
                  ...prev,
                  designer: e.target.value,
                }))
              }
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-slate-400"
            >
              <option value="">Select Designer</option>

              {designers.map((designer) => (
                <option key={designer._id} value={designer._id}>
                  {designer.name} {designer.brandName ? `(${designer.brandName})` : ''}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Sections */}
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
                  className={`rounded-[20px] border px-4 py-4 text-left transition ${
                    active
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
  );
}