"use client";

import { useState, useEffect } from "react";
import { Handbag } from "lucide-react";
import api from "@/lib/api/axios";

type Product = {
  _id: string;
  name: string;
  price: number;
  images: string[];
  description: string;
};

type Props = {
  product?: any;
};

export default function RelatedProducts({ product }: Props) {
  const [activeTab, setActiveTab] = useState<"like" | "recent">("like");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  // 🔥 Fetch data
useEffect(() => {
  let isMounted = true;

  const fetchProducts = async () => {
    try {
      if (activeTab === "like" && !product?._id) return;

      setLoading(true);

      let res;

      if (activeTab === "like") {
        res = await api.get(`/products/${product._id}/related`);
      } else {
        res = await api.get("/products/recent");
      }

      if (isMounted) {
        setProducts(res.data?.data || []);
      }
    } catch (error: any) {
      console.error("❌ API ERROR:", error);
    } finally {
      if (isMounted) setLoading(false);
    }
  };

  fetchProducts();

  return () => {
    isMounted = false;
  };
}, [activeTab, product?._id]);

  return (
    <section className="max-w-7xl lg:mx-auto pb-10 pl-5 lg:pl-0">

      {/* Tabs */}
      <div className="flex justify-center gap-8 text-sm tracking-wide mt-10 mb-8">
        <button
          onClick={() => setActiveTab("like")}
          className={`pb-2 border-b ${
            activeTab === "like"
              ? "border-black text-black"
              : "border-transparent text-gray-400"
          }`}
        >
          YOU MAY ALSO LIKE
        </button>

        <button
          onClick={() => setActiveTab("recent")}
          className={`pb-2 border-b ${
            activeTab === "recent"
              ? "border-black text-black"
              : "border-transparent text-gray-400"
          }`}
        >
          RECENTLY VIEWED
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center text-gray-500">Loading...</div>
      )}

      {/* Products */}
      <div className="flex overflow-x-auto gap-6 scrollbar-hide">
        {products.map((item) => (
          <div
            key={item._id}
            className="group cursor-pointer flex-shrink-0 w-[150px] lg:w-[290px]"
          >
            {/* Image */}
            <div className="bg-gray-100 relative">
              <img
                src={item.images?.[0]}
                alt={item.name}
                className="object-cover w-full h-[150px] lg:h-[190px]"
              />

              <div className="absolute bottom-0 right-0 w-7 h-7 flex items-center justify-center bg-white/30 backdrop-blur-md text-white">
                <Handbag size={16} />
              </div>
            </div>

            {/* Content */}
            <div className="mt-3">
              <h3 className="text-xs font-semibold tracking-wide">
                {item.name}
              </h3>
              <p className="text-xs text-gray-500">
                {item.description}
              </p>
              <p className="text-sm mt-2">₹{item.price}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {!loading && products.length === 0 && (
        <p className="text-center text-gray-400 mt-10">
          No products found
        </p>
      )}
    </section>
  );
}