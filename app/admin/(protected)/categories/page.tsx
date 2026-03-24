"use client";

import Link from "next/link";
import CategoryTable from "@/components/admin/categories/CategoryTable";

export default function CategoriesPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Categories</h1>

        <Link href="/admin/categories/create">
          <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">
            + Add Category
          </button>
        </Link>
      </div>

      {/* Table */}
      <CategoryTable />
    </div>
  );
}
