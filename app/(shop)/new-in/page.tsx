"use client";

import { useEffect } from "react";
import Link from "next/link";
import ProductCard from "@/components/product/ProductCard";
import ProductCardSkeleton from "@/components/ui/ProductCardSkeleton";
import { useProductStore } from "@/store/user/product/useProductStore";

export default function NewInPage() {
  
  const { products, loading, error, fetchNewProducts } = useProductStore();

  useEffect(() => {
    fetchNewProducts();
  }, [fetchNewProducts]);

  return (
    <section className="py-12 mt-10 md:mt-28">
      <div className="px-4 md:px-10">

        <div className="text-center mb-10">
          <h1 className="text-3xl font-serif">New In</h1>
          <p className="mt-3 text-gray-500 text-sm max-w-2xl mx-auto">
            Discover the latest and greatest arrivals from our newest collections. Shop fresh styles added for modern elegance and everyday luxury.
          </p>
        </div>

        {error && (
          <div className="mb-8 text-center text-rose-600">{error}</div>
        )}

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No new in products are available right now.</p>
            <Link
              href="/"
              className="inline-block mt-4 rounded-full border border-black px-6 py-2 text-sm font-semibold hover:bg-black hover:text-white transition"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
