"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { categoryAPI } from "@/lib/api/category.api";
import { productAPI } from "@/lib/api/product.api";

export default function CategoryPage() {
  const { slug } = useParams();

  const [category, setCategory] = useState<any>(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          categoryAPI.getBySlug(slug as string),
          productAPI.getAll({ category: slug as string }),
        ]);

        setCategory(catRes.data.data);
        setProducts(prodRes.data.data.products || []);
      } catch (err) {
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (slug) fetchData();
  }, [slug]);

  return (
    <section className="px-4 md:px-20 bg-white mt-16">

      {/* TITLE */}
      <div className="flex flex-col items-center justify-center mt-20">
        <h1 className="text-3xl font-semibold mb-2 capitalize">
          {category?.name || slug}
        </h1>

        <p className="text-gray-500 mb-6">
          Explore all products in this category
        </p>
      </div>

      {/* PRODUCTS */}
      {loading ? (
        <p>Loading...</p>
      ) : products.length === 0 ? (
        <p>No products found</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product: any) => (
            <div key={product._id} className="p-4 h-[300px] lg:h-[444px]">

              <img
                src={product.images?.[0]?.url}
                alt={product.name}
                className="w-full h-[40%] lg:h-[70%] object-cover"
              />

              <h3 className="mt-2 font-medium">{product.name}</h3>
              <p className="text-gray-600">{product.description}</p>
              <p className="mt-5">
                ₹{product.price}
              </p>

            </div>
          ))}
        </div>
      )}
      
    </section>
  );
};