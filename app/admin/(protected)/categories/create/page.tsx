"use client";

import { useRouter } from "next/navigation";
import CategoryForm from "@/components/admin/categories/CategoryForm";
import { useCategoryStore } from "@/store/admin/useCategoryStore";
import toast from "react-hot-toast";
import {
  ApiErrorResponse,
  CategoryPayload,
} from "@/lib/constants/admin-catalog";

export default function CreateCategoryPage() {
  const router = useRouter();
  const { createCategory } = useCategoryStore();

  const handleSubmit = async (data: CategoryPayload) => {
    try {
      await createCategory(data);
      toast.success("Category created successfully");
      router.push("/admin/categories");
    } catch (error: unknown) {
      const apiError = error as ApiErrorResponse;
      toast.error(apiError.response?.data?.message || "Error creating category");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          Create Category
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Define a new catalog group for product browsing and admin filters.
        </p>
      </div>

      <CategoryForm onSubmit={handleSubmit} />
    </div>
  );
}
