"use client";

import { useEffect } from "react";
import { useCategoryStore } from "@/store/admin/useCategoryStore";
import CategoryItem from "./CategoryItem";

export default function CategoryTree() {
  const { fetchCategories, getCategoryTree, loading } =
    useCategoryStore();

  useEffect(() => {
    fetchCategories();
  }, []);

  const tree = getCategoryTree();

  if (loading) {
    return <div className="p-6">Loading categories...</div>;
  }

  if (!tree.length) {

    return (
      <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 border-dashed">
        <p className="text-slate-400 font-medium">No categories found.</p>
        <p className="text-sm text-slate-400 mt-1">Create your first category to get started.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Category Hierarchy
          </h2>
          <p className="text-sm text-slate-500">Organize your store structure</p>
        </div>
      </div>

      <div className="space-y-1">
        {tree.map((cat) => (
          <CategoryItem key={cat._id} category={cat} />
        ))}
      </div>
    </div>
  );
}