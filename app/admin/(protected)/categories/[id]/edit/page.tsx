"use client";



import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";




import CategoryForm from "@/components/admin/categories/CategoryForm";
import { CatalogEntity } from "@/lib/constants/admin-catalog";
import { getCategoryById } from "@/lib/api/admin/category.api";

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

      const [loading, setLoading] = useState(true);
      const [category, setCategory] = useState<CatalogEntity | null>(null);


const fetchCategory = async () => {
  try {
    const res = await getCategoryById(id);
    setCategory(res.data.data);
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};


  
  useEffect(() => {
    fetchCategory();

  }, []);

  const handleSuccess = () => {

    router.push("/admin/categories");
  };



  if (loading) return <p className="text-white p-6">Loading...</p>;

  return (
    <div className="p-6 text-white max-w-xl">
      <CategoryForm
        initialData={category}
        onSuccess={handleSuccess}
      />
    </div>
      
    );
}