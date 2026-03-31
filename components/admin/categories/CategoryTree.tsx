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
      <div className="p-6 text-gray-500">
        No categories found
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow p-4">
      <h2 className="text-lg font-semibold mb-4">
        Category Tree
      </h2>

      <div className="space-y-1">
        {tree.map((cat) => (
          <CategoryItem key={cat._id} category={cat} />
        ))}
      </div>
    </div>
  );
}