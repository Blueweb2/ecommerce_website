"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ProductForm from "@/components/admin/products/ProductForm";
import { useProductStore } from "@/store/admin/useProductStore";
import axios from "@/lib/api/axios";
import toast from "react-hot-toast";

export default function EditProductPage() {
  const params = useParams();
  const id = params.id as string;

  const router = useRouter();
  const { updateProduct } = useProductStore();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fetch product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`/products/${id}`);
        setProduct(res.data.data);
      } catch {
        toast.error("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  const handleSubmit = async (data: any) => {
    try {
      await updateProduct(id, data);
      toast.success("Product updated");
      router.push("/admin/products");
    } catch {
      toast.error("Update failed");
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (!product) return <div className="p-6 text-red-500">Not found</div>;

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="text-2xl font-semibold">Edit Product</h1>

      <ProductForm
        initialData={{
          name: product.name,
          price: product.price,
          category: product.category?._id,
          imageUrl: product.images?.[0] || "",
          imageAlt: product.imageAlt || "",
        }}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
