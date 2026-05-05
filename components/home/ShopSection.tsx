"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Bodoni_Moda, Inter } from 'next/font/google';
import { productAPI } from "@/lib/api/product.api";

type Product = {
  _id: string;
  name: string;
  price: number;
  description: string;
  slug: string;
  images?: { url: string }[];
};

const tabs = ["Featured", "Best Sellers", "Top Rated"];

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ['latin'],
});

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
            data = await productAPI.getFeatured().then(res => Array.isArray(res.data.data) ? res.data.data : res.data.data.products || []);
            break;

          case "Best Sellers":
            data = await productAPI.getBestSellers().then(res => Array.isArray(res.data.data) ? res.data.data : res.data.data.products || []);
            break;

          case "Top Rated":
            data = await productAPI.getTopRated().then(res => Array.isArray(res.data.data) ? res.data.data : res.data.data.products || []);
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
  }, [activeTab]);

  return (
    <section className="bg-[#f5f5f5] pt-6 md:pt-14 md:py-0">
      <div className="max-w-[2000px] mx-auto px-4 md:px-32">

        {/* TITLE */}
        <h2 className={`${bodoni.className} mb-6 border-t-2 border-gray-300 pt-8 text-center 
        text-[30px] font-normal tracking-tight text-neutral-600`}>
          Shop ZENFAZ
        </h2>

        {/* TABS */}
        <div className="flex justify-center gap-6 mb-10 text-sm">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-1 border-b transition ${
                activeTab === tab
                  ? "border-neutral-600 text-neutral-600"
                  : "border-transparent text-[#8D8B9D] hover:text-neutral-600"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* PRODUCTS */}
        <div className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth">

          {loading ? (
            <div className="w-full h-[300px] md:h-[377px] lg:h-[455px] flex items-center justify-center">
              <div className="w-10 h-10 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
            </div>
          ) : products.length === 0 ? (
            <p className="w-full text-center">No products found</p>
          ) : (
            products.map((product) => (
              <div
                key={product._id}
                className="w-[200px] md:w-[250px] flex flex-col justify-between flex-shrink-0 overflow-hidden"
              >
                {/* IMAGE */}
                <Link
                  href={`/product/${product.slug}`}
                  className="flex justify-center mb-4"
                >
                  <img
                    src={product.images?.[0]?.url || "/placeholder.png"}
                    alt={product.name}
                    className="h-40 md:h-60 object-cover w-full"
                  />
                </Link>

                {/* CONTENT */}
                <div>
                  <h3 className={`${bodoni.className} text-sm font-semibold mb-2 text-neutral-600`}>
                    {product.name}
                  </h3>

                  <p className={`${inter.className} text-xs text-[#8D8B9D] mb-3 h-[45px]`}>
                    {product.description}
                  </p>

                  <p className={`${inter.className}text-sm font-medium text-[#8D8B9D] mb-4`}>
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
