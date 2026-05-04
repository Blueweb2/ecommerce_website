"use client";

import { useState, useEffect } from "react";
import { Handbag } from "lucide-react";
import api from "@/lib/api/axios";

type Product = {
  _id: string;
  name: string;
  price: number;
  gstPercentage?: number;
  images: { url: string }[];
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
        res = await api.get("/products/new");
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
            <div className="bg-gray-100 relative overflow-hidden aspect-[4/5]">
              <img
                src={item.images?.[0]?.url || "/placeholder.png"}
                alt={item.name}
                className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
              />

              <div className="absolute bottom-4 right-4 w-10 h-10 rounded-full flex items-center justify-center bg-white/80 backdrop-blur-sm text-black shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                <Handbag size={18} />
              </div>
            </div>

            {/* Content */}
            <div className="mt-4 space-y-1">
              <h3 className="text-xs font-black uppercase tracking-widest text-gray-900 group-hover:text-emerald-600 transition-colors">
                {item.name}
              </h3>
              <p className="text-[10px] text-gray-400 font-medium line-clamp-1">
                {item.description}
              </p>
              <div className="flex items-center gap-2 pt-1">
                <p className="text-sm font-black text-gray-900">
                  ₹{Math.round(item.price * (1 + (item.gstPercentage || 0) / 100))}
                </p>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Incl. GST</span>
              </div>
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