"use client";

import ProductForm from "@/components/admin/products/ProductForm";
import { useProductStore } from "@/store/admin/useProductStore";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function CreateProductPage() {
  const { createProduct } = useProductStore();
  const router = useRouter();

  const handleSubmit = async (data: any) => {
    try {
      await createProduct(data);
      toast.success("Product created successfully");
      router.push("/admin/products");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Error creating product");
    }
  };

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-2xl font-semibold">Create Product</h1>

      <ProductForm onSubmit={handleSubmit} />
    </div>
  );
}
