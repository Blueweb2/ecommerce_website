"use client";

import { useState } from "react";

interface ProductFormProps {
  initialData?: any;
  onSubmit: (data: any) => Promise<void>;
  loading?: boolean;
}

export default function ProductForm({
  initialData,
  onSubmit,
  loading,
}: ProductFormProps) {
  const [form, setForm] = useState({
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    description: initialData?.description || "",
    price: initialData?.price || "",
    discountPrice: initialData?.discountPrice || "",
    stock: initialData?.stock || "",
    brand: initialData?.brand || "",
    images: initialData?.images || [],
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();
    await onSubmit(form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-3xl bg-white p-8 shadow"
    >
      <div>
        <label className="block mb-2 text-sm font-medium">
          Product Name
        </label>

        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full border rounded-xl px-4 py-3"
          required
        />
      </div>

      <div>
        <label className="block mb-2 text-sm font-medium">
          Slug
        </label>

        <input
          name="slug"
          value={form.slug}
          onChange={handleChange}
          className="w-full border rounded-xl px-4 py-3"
          required
        />
      </div>

      <div>
        <label className="block mb-2 text-sm font-medium">
          Description
        </label>

        <textarea
          rows={5}
          name="description"
          value={form.description}
          onChange={handleChange}
          className="w-full border rounded-xl px-4 py-3"
        />
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <input
          name="price"
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          className="border rounded-xl px-4 py-3"
        />

        <input
          name="discountPrice"
          type="number"
          placeholder="Discount Price"
          value={form.discountPrice}
          onChange={handleChange}
          className="border rounded-xl px-4 py-3"
        />

        <input
          name="stock"
          type="number"
          placeholder="Stock"
          value={form.stock}
          onChange={handleChange}
          className="border rounded-xl px-4 py-3"
        />
      </div>

      <div>
        <label className="block mb-2 text-sm font-medium">
          Brand
        </label>

        <input
          name="brand"
          value={form.brand}
          onChange={handleChange}
          className="w-full border rounded-xl px-4 py-3"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-black text-white py-3"
      >
        {loading ? "Saving..." : "Save Product"}
      </button>
    </form>
  );
}