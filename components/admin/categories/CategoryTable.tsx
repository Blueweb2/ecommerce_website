"use client";

import { useEffect } from "react";
import { useCategoryStore } from "@/store/admin/useCategoryStore";
import CategoryRow from "./CategoryRow";
import toast from "react-hot-toast";

export default function CategoryTable() {
  const { categories, fetchCategories, deleteCategory, loading } =
    useCategoryStore();

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("Are you sure you want to delete?");

    if (!confirmDelete) return;

    try {
      await deleteCategory(id);
      toast.success("Category deleted");
    } catch {
      toast.error("Failed to delete category");
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-gray-500">Loading categories...</div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="p-6 text-gray-500 text-center">
        No categories found
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow border">
      <table className="w-full text-left">
        <thead className="bg-gray-100 text-sm text-gray-600">
          <tr>
            <th className="p-3">Name</th>
            <th className="p-3">Slug</th>
            <th className="p-3">Status</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>

        <tbody>
          {categories.map((category) => (
            <CategoryRow
              key={category._id}
              category={category}
              onDelete={handleDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}