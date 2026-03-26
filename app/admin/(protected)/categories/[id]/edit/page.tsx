"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import CategoryForm from "@/components/admin/categories/CategoryForm";
import { useCategoryStore } from "@/store/admin/useCategoryStore";
import toast from "react-hot-toast";
import axios from "@/lib/api/axios";
import {
  ApiErrorResponse,
  CatalogEntity,
  CategoryPayload,
} from "@/lib/constants/admin-catalog";

export default function EditCategoryPage() {
  const { id } = useParams();
  const router = useRouter();

  const { updateCategory } = useCategoryStore();

  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<CatalogEntity | null>(null);

  // Fetch single category
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await axios.get(`/categories/${id}`);
        setCategory(res.data.data);
      } catch {
        toast.error("Failed to load category");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchCategory();
  }, [id]);

  const handleSubmit = async (data: CategoryPayload) => {
    try {
      await updateCategory(id as string, data);
      toast.success("Category updated successfully");
      router.push("/admin/categories");
    } catch (error: unknown) {
      const apiError = error as ApiErrorResponse;
      toast.error(apiError.response?.data?.message || "Update failed");
    }
  };

  if (loading) {
    return <div className="p-6 text-gray-500">Loading...</div>;
  }

  if (!category) {
    return <div className="p-6 text-red-500">Category not found</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
          Edit Category
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Refine naming, imagery, and copy for this catalog grouping.
        </p>
      </div>

      <CategoryForm
        initialData={{
          name: category.name,
          description: category.description,
          image: category.image,
          imageAlt: category.imageAlt || "",
        }}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
