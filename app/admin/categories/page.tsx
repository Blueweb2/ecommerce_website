"use client";

import Link from "next/link";
import CategoryTree from "@/components/admin/categories/CategoryTree";
import { Plus } from "lucide-react";

export default function CategoriesPage() {
  return (
    <div className="space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Categories
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Manage your store's product categories and subcategories.
          </p>
        </div>

        <Link href="/admin/categories/create">
          <button className="flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 hover:-translate-y-0.5 transition-all active:translate-y-0">
            <Plus size={18} />
            Add Category
          </button>
        </Link>
      </div>

      {/* TREE */}
      <CategoryTree />
    </div>
  );
}