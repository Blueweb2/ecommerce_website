"use client";

import { useRouter } from "next/navigation";
import CategoryForm from "@/components/admin/categories/CategoryForm";
import { useCategoryStore } from "@/store/admin/useCategoryStore";
import toast from "react-hot-toast";

export default function CreateCategoryPage() {
  const router = useRouter();
  const { createCategory } = useCategoryStore();

  const handleSubmit = async (data: any) => {
    try {
      await createCategory(data);
      toast.success("Category created successfully");
      router.push("/admin/categories");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Error creating category");
    }
  };

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-2xl font-semibold">Create Category</h1>

      <CategoryForm onSubmit={handleSubmit} />
    </div>
  );
}
