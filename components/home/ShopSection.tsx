"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { productAPI } from "@/lib/api/product.api";

// ✅ Match backend structure
type Product = {
  _id: string;
  name: string;
  price: number;
  description: string;
  slug: string;
  images?: { url: string }[];
};

const tabs = ["Featured", "Best Sellers", "Top Rated"];

export default function ShopSection() {
  const [activeTab, setActiveTab] = useState("Featured");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        let data: Product[] = [];

        switch (activeTab) {
          case "Featured":
            data = await productAPI.getFeatured().then(res => res.data.data);
            break;

          case "Best Sellers":
            data = await productAPI.getBestSellers().then(res => res.data.data);
            break;

          case "Top Rated":
            data = await productAPI.getTopRated().then(res => res.data.data);
            break;
        }

        setProducts(data);
      } catch (err) {
        console.error("Fetch products error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [activeTab]); // ✅ FIXED (removed products)

  return (
    <section className="bg-[#f5f5f5] pt-6 md:pt-0 md:py-12">
      <div className="max-w-7xl mx-auto px-4 md:px-8">

        {/* TITLE */}
        <h2 className="text-center text-2xl font-semibold mb-6 border-t-2 border-gray-300 pt-8">
          Shop Fazzmi
        </h2>

        {/* TABS */}
        <div className="flex justify-center gap-6 mb-10 text-sm">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-1 border-b transition ${
                activeTab === tab
                  ? "border-black text-black"
                  : "border-transparent text-gray-500 hover:text-black"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* PRODUCTS */}
        <div className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth">

          {loading ? (
            <p className="w-full text-center">Loading products...</p>
          ) : products.length === 0 ? (
            <p className="w-full text-center">No products found</p>
          ) : (
            products.map((product) => (
              <div
                key={product._id}
                className="w-[200px] md:w-[250px] flex flex-col justify-between flex-shrink-0 rounded-xl"
              >
                {/* IMAGE */}
                <Link
                  href={`/product/${product.slug}`}
                  className="flex justify-center mb-4"
                >
                  <img
                    src={product.images?.[0]?.url || "/placeholder.png"}
                    alt={product.name}
                    className="h-40 md:h-60 object-contain w-full"
                  />
                </Link>

                {/* CONTENT */}
                <div>
                  <h3 className="text-sm font-semibold mb-2">
                    {product.name}
                  </h3>

                  <p className="text-xs text-gray-500 mb-3 h-[45px]">
                    {product.description}
                  </p>

                  <p className="text-sm font-medium mb-4">
                    ₹{product.price}
                  </p>
                </div>
              </div>
            ))
          )}

        </div>

      </div>
    </section>
  );
}