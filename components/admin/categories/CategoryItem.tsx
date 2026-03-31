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
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div>
      {/* ROW */}
      <div
        className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-100 transition"
        style={{ paddingLeft: `${level * 16}px` }}
      >
        {/* LEFT */}
        <div className="flex items-center gap-2">
          {hasChildren ? (
            <button onClick={() => setOpen(!open)}>
              {open ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>
          ) : (
            <span className="w-4" />
          )}

          {/* NAME */}
          <span className="font-medium text-gray-800">
            {category.name}
          </span>
        </div>

        {/* ACTIONS */}
        <div className="flex items-center gap-2">
          {/* EDIT */}
          <button
            onClick={() =>
              router.push(`/admin/categories/${category._id}/edit`)
            }
            className="p-1 text-blue-600 hover:bg-blue-100 rounded"
          >
            <Pencil className="w-4 h-4" />
          </button>

          {/* DELETE */}
          <button
            onClick={handleDelete}
            className="p-1 text-red-600 hover:bg-red-100 rounded"
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