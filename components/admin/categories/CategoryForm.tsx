"use client";

import { useState } from "react";
import { CategoryPayload } from "@/lib/constants/admin-catalog";
import ImageUpload from "@/components/admin/ui/ImageUpload";

type CategoryFormProps = {
  onSubmit: (data: CategoryPayload) => void | Promise<void>;
  initialData?: Partial<CategoryPayload>;
};

// 🔥 Cloudinary upload
const uploadToCloudinary = async (file: File) => {
  const res = await fetch(
  `${process.env.NEXT_PUBLIC_API_URL}/cloudinary/signature?folder=categories`
);
  const { timestamp, signature, cloudName, apiKey } = await res.json();

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", apiKey);
  formData.append("timestamp", timestamp);
  formData.append("signature", signature);
  formData.append("folder", "categories");

  const uploadRes = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await uploadRes.json();

  return {
    url: data.secure_url,
    public_id: data.public_id,
  };
};

export default function CategoryForm({
  onSubmit,
  initialData,
}: CategoryFormProps) {
  const [form, setForm] = useState<CategoryPayload>({
    name: initialData?.name || "",
    description: initialData?.description || "",
    image: initialData?.image || undefined,
  });

  const [files, setFiles] = useState<File[]>([]);
  const [altText, setAltText] = useState("");

  // 🔥 FINAL SUBMIT HANDLER
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    let imageData = form.image;

    // Upload new image if selected
    if (files.length > 0) {
      const uploaded = await uploadToCloudinary(files[0]);

      imageData = {
        url: uploaded.url,
        public_id: uploaded.public_id,
        altText: altText,
      };
    }

    await onSubmit({
      ...form,
      image: imageData,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          Category details
        </h2>

        <div className="mt-6 grid gap-4">
          {/* Name */}
          <div className="grid gap-2">
            <label className="text-sm font-medium text-slate-700">
              Category name
            </label>
            <input
              required
              placeholder="Rings"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              className="rounded-2xl border px-4 py-3"
            />
          </div>

          {/* Image Upload */}
          <div className="grid gap-2">
            <label className="text-sm font-medium text-slate-700">
              Upload category image
            </label>
            <ImageUpload onFilesSelect={setFiles} multiple={false} />
          </div>

          {/* Alt Text */}
          <div className="grid gap-2">
            <label className="text-sm font-medium text-slate-700">
              Image alt text
            </label>
            <input
              placeholder="Gold rings"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              className="rounded-2xl border px-4 py-3"
            />
          </div>

          {/* Description */}
          <div className="grid gap-2">
            <label className="text-sm font-medium text-slate-700">
              Description
            </label>
            <textarea
              rows={4}
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="rounded-2xl border px-4 py-3"
            />
          </div>
        </div>
      </section>

      {/* 🔥 Preview */}
      {files.length > 0 && (
        <section className="rounded-[28px] border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Preview</h2>
          <img
            src={URL.createObjectURL(files[0])}
            className="mt-4 h-64 w-full object-cover rounded-xl"
          />
        </section>
      )}

      <button className="rounded-full bg-[#12251a] px-5 py-3 text-white">
        Save Category
      </button>
    </form>
  );
}