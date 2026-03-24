// view peoduct page
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "@/lib/api/axios";
import toast from "react-hot-toast";

export default function ViewProductPage() {
  const params = useParams();
  const id = params.id as string;

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`/products/${id}`);
        setProduct(res.data.data);
      } catch {
        toast.error("Failed to fetch product");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (!product) return <div className="p-6 text-red-500">Not found</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">{product.name}</h1>

      <p className="text-gray-600">₹ {product.price}</p>

      <p>
        <strong>Category:</strong>{" "}
        {product.category?.name || "N/A"}
      </p>

      {product.description && (
        <p>{product.description}</p>
      )}

      {product.images?.length > 0 && (
        <img
          src={product.images[0]}
          className="w-64 rounded"
        />
      )}
    </div>
  );
}