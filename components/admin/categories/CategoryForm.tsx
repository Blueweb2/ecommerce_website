"use client";

import { useState } from "react";

export default function CategoryForm({ onSubmit, initialData }: any) {
  const [form, setForm] = useState(
    initialData || {
      name: "",
      description: "",
      image: "",
    }
  );

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(form);
      }}
      className="space-y-4"
    >
      <input
        placeholder="Category Name"
        value={form.name}
        onChange={(e) =>
          setForm({ ...form, name: e.target.value })
        }
        className="border p-2 w-full"
      />

      <input
        placeholder="Image URL"
        value={form.image}
        onChange={(e) =>
          setForm({ ...form, image: e.target.value })
        }
        className="border p-2 w-full"
      />

      <textarea
        placeholder="Description"
        value={form.description}
        onChange={(e) =>
          setForm({ ...form, description: e.target.value })
        }
        className="border p-2 w-full"
      />

      <button className="bg-green-600 text-white px-4 py-2 rounded">
        Save Category
      </button>
    </form>
  );
}