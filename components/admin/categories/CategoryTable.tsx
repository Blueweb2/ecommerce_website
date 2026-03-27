"use client";

import { useEffect } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { Pencil, Trash2 } from "lucide-react";
import { useCategoryStore } from "@/store/admin/useCategoryStore";

export default function CategoryTable() {
  const { categories, fetchCategories, deleteCategory, loading } =
    useCategoryStore();

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("Are you sure you want to delete this category?");

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
      <div className="rounded-[28px] border border-slate-200 bg-white p-6 text-slate-500 shadow-sm">
        Loading categories...
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="rounded-[28px] border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500 shadow-sm">
        No categories found yet.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            <tr>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Slug</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {categories.map((category) => (
              <tr
                key={category._id}
                className="border-t border-slate-100 transition hover:bg-slate-50/70"
              >
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#12251a] text-sm font-semibold text-white">
                      {category.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">
                        {category.name}
                      </p>
                      <p className="text-sm text-slate-500">
                        {category.description || "No description added"}
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-6 py-5 text-sm text-slate-600">
                  {category.slug || "No slug available"}
                </td>

                <td className="px-6 py-5">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                      category.isActive ?? true
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-rose-50 text-rose-700"
                    }`}
                  >
                    {category.isActive ?? true ? "Active" : "Inactive"}
                  </span>
                </td>

                <td className="px-6 py-5">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/categories/${category._id}/edit`}
                      className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                    >
                      <Pencil className="h-4 w-4" />
                      Edit
                    </Link>

                    <button
                      onClick={() => handleDelete(category._id)}
                      className="inline-flex items-center gap-2 rounded-full border border-rose-200 px-3 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-50"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
