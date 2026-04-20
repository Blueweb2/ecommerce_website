"use client";

import { useRouter } from "next/navigation";
import CategoryForm from "@/components/admin/categories/CategoryForm";
import toast from "react-hot-toast";

export default function CreateCategoryPage() {
  const router = useRouter();

  const handleSuccess = () => {
    toast.success("Category created successfully");
    router.push("/admin/categories");
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

      <CategoryForm onSuccess={handleSuccess} />
    </div>
  );
}
