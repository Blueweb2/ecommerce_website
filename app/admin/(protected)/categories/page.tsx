"use client";

import Link from "next/link";
import CategoryTree from "@/components/admin/categories/CategoryTree";

export default function CategoriesPage() {
  return (
    <div className="p-6 space-y-6">
      
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Categories</h1>

        <Link href="/admin/categories/create">
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
            + Add Category
          </button>
        </Link>
      </div>

      {/* TREE */}
      <CategoryTree />
    </div>
  );
}