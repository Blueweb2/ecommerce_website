"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import CategoryForm from "@/components/admin/categories/CategoryForm";
import { useCategoryStore } from "@/store/admin/useCategoryStore";
import toast from "react-hot-toast";

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams();

  const {
    getCategory,
    updateCategory,
    fetchCategories, // ✅ FIX 1
  } = useCategoryStore();

  const category = getCategory(params.id as string);

  // ✅ FIX 2
  useEffect(() => {
    if (!category) {
      fetchCategories();
    }
  }, [category, fetchCategories]);

  const handleSubmit = async (data: any) => {
    try {
      await updateCategory(params.id as string, data);
      toast.success("Category updated successfully");
      router.push("/admin/categories");
    } catch {
      toast.error("Failed to update category");
    }
  };

  if (!category) {
    return <div className="p-6">Loading...</div>;
  }

  return <CategoryForm onSubmit={handleSubmit} initialData={category} />;
}