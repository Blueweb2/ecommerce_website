"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { productAPI } from "@/lib/api/product.api";
import { bodoni, inter } from "@/lib/fonts";
import { resolveImageSrc } from "@/lib/utils/image";

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
    <section className="pt-6 md:pt-14 md:py-0">
      <div className="max-w-[2000px] mx-auto px-4 md:px-32">

        {/* TITLE */}
        <h2 className={`${bodoni.className} mb-6 border-t-[2px] border-[#e5e5e5] pt-8 text-center 
        text-[clamp(25px,2.5vw,32px)] font-normal tracking-tight`}>
          Discover ZENFAZ Collection
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
        <div className="flex gap-2 overflow-x-auto scrollbar-hide scroll-smooth lg:grid lg:grid-cols-6 lg:gap-6">

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
                className="min-w-[200px] md:min-w-[250px] lg:min-w-0  flex flex-col justify-between overflow-hidden"
              >
                {/* IMAGE */}
                <Link
                  href={`/product/${product.slug}`}
                  className="flex justify-center items-center mb-4"
                >
                  <img
                    src={resolveImageSrc(
                      (product.images?.find((img: any) => img.isPrimary) ||
                        product.images?.[0])?.url
                    )}
                    alt={product.name}
                    className="h-44 lg:h-60 2xl:h-80 object-fill w-full"
                  />
                </Link>

                {/* CONTENT */}
                <div>
                  <h3 className={`${inter.className} text-sm font-semibold mb-2`}>
                    {product.name}
                  </h3>

                  <p className={`${inter.className} text-xs text-[#5C5A58] mb-3 h-[45px]`}>
                    {product.description}
                  </p>

                  <p className={`${inter.className} text-sm font-medium mb-4`}>
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
