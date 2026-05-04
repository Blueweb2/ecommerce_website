"use client";

import { useState } from "react";
import { CatalogEntity } from "@/lib/constants/admin-catalog";
import { useCategoryStore } from "@/store/admin/useCategoryStore";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronRight, Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

interface Props {
  category: CatalogEntity & { children?: CatalogEntity[] };
  level?: number;
}

export default function CategoryItem({ category, level = 0 }: Props) {
  const router = useRouter();
  const { deleteCategory } = useCategoryStore();

  const [open, setOpen] = useState(true);

  const hasChildren = category.children && category.children.length > 0;

  const handleDelete = async () => {
    const confirmDelete = confirm("Delete this category?");
    if (!confirmDelete) return;

    try {
      await deleteCategory(category._id);
      toast.success("Category deleted");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="relative">
      {/* HIERARCHY LINE */}
      {level > 0 && (
        <div
          className="absolute left-0 top-0 bottom-0 w-px bg-slate-200"
          style={{ left: `${(level - 1) * 24 + 20}px` }}
        />
      )}

      {/* ROW */}
      <div
        className="group flex items-center justify-between py-3 px-4 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all duration-200 relative z-10"
        style={{ paddingLeft: `${level * 24 + 16}px` }}
      >
        {/* LEFT */}
        <div className="flex items-center gap-3">
          {hasChildren ? (
            <button
              onClick={() => setOpen(!open)}
              className="p-1 rounded-md hover:bg-slate-200 text-slate-500 transition-colors"
            >
              {open ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
          ) : (
            <span className="w-6" /> // spacer for alignment
          )}

          {/* NAME */}
          <span className="font-semibold text-slate-700 group-hover:text-emerald-700 transition-colors">
            {category.name}
          </span>
          <span className="text-xs text-slate-400 font-medium px-2 py-0.5 bg-slate-100 rounded-full hidden group-hover:inline-block">
            {hasChildren ? `${category.children!.length} subcategories` : 'Leaf'}
          </span>
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {/* EDIT */}
          <button
            onClick={() =>
              router.push(`/admin/categories/${category._id}/edit`)
            }
            className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors"
            title="Edit Category"
          >
            <Pencil className="w-4 h-4" />
          </button>

          {/* DELETE */}
          <button
            onClick={handleDelete}
            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
            title="Delete Category"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* CHILDREN */}
      {open &&
        hasChildren &&
        category.children!.map((child) => (
          <CategoryItem
            key={child._id}
            category={child}
            level={level + 1}
          />
        ))}
    </div>
  );
}