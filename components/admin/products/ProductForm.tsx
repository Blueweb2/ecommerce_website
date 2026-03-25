"use client";

import { useEffect, useState } from "react";
import { useCategoryStore } from "@/store/admin/useCategoryStore";

export default function ProductForm({ onSubmit, initialData }: any) {
  const { categories, fetchCategories } = useCategoryStore();

  const [form, setForm] = useState(
    initialData || {
      name: "",
      price: "",
      category: "",
    }
  );

  // Load categories
  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();

        onSubmit({
          ...form,
          price: Number(form.price),
        });
      }}
      className="space-y-4"
    >
      {/* Product Name */}
      <input
        placeholder="Product Name"
        value={form.name}
        onChange={(e) =>
          setForm({ ...form, name: e.target.value })
        }
        className="border p-2 w-full"
      />

      {/* Price */}
      <input
        type="number"
        placeholder="Price"
        value={form.price}
        onChange={(e) =>
          setForm({ ...form, price: e.target.value })
        }
        className="border p-2 w-full"
      />

      {/* 🔥 CATEGORY DROPDOWN */}
      <select
        value={form.category}
        onChange={(e) =>
          setForm({ ...form, category: e.target.value })
        }
        className="border p-2 w-full"
      >
        <option value="">Select Category</option>

        {categories.map((cat) => (
          <option key={cat._id} value={cat._id}>
            {cat.name}
          </option>
        ))}
      </select>

      <button className="bg-green-600 text-white px-4 py-2 rounded">
        Save Product
      </button>
    </form>
  );
}