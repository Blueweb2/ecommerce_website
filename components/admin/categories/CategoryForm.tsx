"use client";

import { useState } from "react";

export default function CategoryForm({ onSubmit, initialData }: any) {
  const [form, setForm] = useState(
    initialData || {
      name: "",
      description: "",
      image: "",
      imageAlt: "",
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

      <input
        placeholder="Image alt text for SEO"
        value={form.imageAlt}
        onChange={(e) =>
          setForm({ ...form, imageAlt: e.target.value })
        }
        className="border p-2 w-full"
      />

      <p className="text-xs text-gray-500">
        Example: Gold pendant category banner with gemstone necklace.
      </p>

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
