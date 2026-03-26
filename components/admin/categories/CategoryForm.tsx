"use client";

import { useState } from "react";
import { CategoryPayload } from "@/lib/constants/admin-catalog";
import ImageUpload from "@/components/admin/ui/ImageUpload";

type CategoryFormProps = {
  onSubmit: (data: CategoryPayload) => void | Promise<void>;
  initialData?: Partial<CategoryPayload>;
};

export default function CategoryForm({
  onSubmit,
  initialData,
}: CategoryFormProps) {
  const [form, setForm] = useState<CategoryPayload>({
    name: initialData?.name || "",
    description: initialData?.description || "",
    image: initialData?.image || "",
    imageAlt: initialData?.imageAlt || "",
  });
  const [files, setFiles] = useState<File[]>([]);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(form);
      }}
      className="space-y-6"
    >
      <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          Category details
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Keep category grouping clear for rings, necklaces, earrings, and more.
        </p>

        <div className="mt-6 grid gap-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium text-slate-700">
              Category name
            </label>
            <input
              required
              placeholder="Rings"
              value={form.name}
              onChange={(event) =>
                setForm({ ...form, name: event.target.value })
              }
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-400"
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium text-slate-700">
              Upload category image
            </label>
            <ImageUpload onFilesSelect={setFiles} multiple={false} />
            <p className="text-xs text-slate-500">
              {files.length > 0
                ? "1 image selected"
                : "You can upload an image here or use the hosted image URL below."}
            </p>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium text-slate-700">
              Image URL
            </label>
            <input
              placeholder="https://example.com/rings-banner.jpg"
              value={form.image}
              onChange={(event) =>
                setForm({ ...form, image: event.target.value })
              }
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-400"
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium text-slate-700">
              Image alt text
            </label>
            <input
              placeholder="Gold rings arranged on a textured ivory background"
              value={form.imageAlt}
              onChange={(event) =>
                setForm({ ...form, imageAlt: event.target.value })
              }
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-400"
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium text-slate-700">
              Description
            </label>
            <textarea
              rows={5}
              placeholder="Elegant rings for gifting, engagement, and everyday sparkle."
              value={form.description}
              onChange={(event) =>
                setForm({ ...form, description: event.target.value })
              }
              className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-slate-400"
            />
          </div>
        </div>
      </section>

      {form.image ? (
        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Preview</h2>
          <div className="mt-4 overflow-hidden rounded-[24px] bg-slate-100">
            <img
              src={form.image}
              alt={form.imageAlt || `${form.name || "Category"} preview`}
              className="h-64 w-full object-cover"
            />
          </div>
        </section>
      ) : null}

      <button className="rounded-full bg-[#12251a] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1c3424]">
        Save Category
      </button>
    </form>
  );
}
