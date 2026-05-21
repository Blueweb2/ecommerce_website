"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useProductStore } from "@/store/user/product/useProductStore";
import { ChevronDown, SlidersHorizontal } from "lucide-react";
import { CatalogProduct } from "@/lib/constants/admin-catalog";
import { bodoni, inter } from "@/lib/fonts";

const SORT_OPTIONS = [
  { value: "createdAt-desc", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

function getDiscountPercent(price: number, discountPrice: number) {
  if (!price || !discountPrice || discountPrice >= price) return 0;
  return Math.round(((price - discountPrice) / price) * 100);
};

function SkeletonCard() {
  return (
    <div className="animate-pulse">
      <div className="w-full aspect-[3/4] bg-gray-200 rounded" />
      <div className="mt-3 space-y-2">
        <div className="h-3 w-16 bg-gray-200 rounded" />
        <div className="h-3 w-3/4 bg-gray-200 rounded" />
        <div className="h-3 w-1/2 bg-gray-200 rounded" />
      </div>
    </div>
  );
};

export default function SalePage() {

  const { products, loading, fetchSaleProducts } = useProductStore();
  const [sort, setSort] = useState("createdAt-desc");

  useEffect(() => {
    fetchSaleProducts(sort);
  }, [sort]);

  return (
    <>
      {/* ─── HERO SECTION ─── */}
      <div className="relative left-1/2 right-1/2 w-screen -translate-x-1/2 h-[380px] md:h-[calc(100vh-120px)] overflow-hidden mt-20 md:mt-32">
        <Image
          src="/sale-banner.jpg"
          alt="Sale Banner"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70 flex flex-col items-center justify-center gap-3">
          <span className={`${bodoni.className} text-xs md:text-sm tracking-[0.35em] uppercase text-white/70 font-medium`}>
            Limited Time Offer
          </span>
          <h1
            className={`${bodoni.className} text-5xl font-bold tracking-widest text-white md:text-7xl`}
          >
            SALE
          </h1>
          <p className={`${bodoni.className} text-white/60 text-sm md:text-base mt-1`}>
            Up to 50% off on selected items
          </p>
        </div>
      </div>

      <section className="w-full max-w-[2000px] mx-auto px-4 md:px-32">
        {/* ─── PROMO STRIP ─── */}
        <div className="text-center py-6 ">
          <h2 className={`${bodoni.className} text-base font-semibold tracking-wide text-neutral-600`}>
            Promotion
          </h2>
          <p className={`${inter.className} text-sm text-[#5C5A58] mt-1`}>
            All promotion items are listed at the lowest price in 30 days
          </p>
        </div>

        {/* ─── SORT BAR ─── */}
        <div className="flex flex-col md:flex-row justify-between items-center px-4 md:px-20 py-5 gap-4">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-gray-500 animate-pulse" />
            <p className={`${inter.className} text-sm font-medium text-[#5C5A58]`}>
              {loading ? "Discovering offers..." : `Showing ${products.length} exclusive deals`}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-neutral-400 flex items-center gap-2">
              <SlidersHorizontal className="h-3 w-3" />
              Sort By
            </span>
            <div className="relative group">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className={`${inter.className} appearance-none bg-transparent border p-3 border-neutral-200 pr-8 py-1 text-sm font-medium focus:outline-none focus:border-neutral-400 transition-colors cursor-pointer text-neutral-600`}
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none group-hover:text-black transition-colors" />
            </div>
          </div>
        </div>

        {/* ─── PRODUCT GRID ─── */}
        <div className="py-10">

          {/* Loading Skeletons */}
          {loading && products.length === 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
              {Array.from({ length: 8 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && products.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">No sale items available right now</p>
              <Link
                href="/"
                className="inline-block mt-4 px-6 py-2 border border-black text-sm hover:bg-black hover:text-white transition"
              >
                Continue Shopping
              </Link>
            </div>
          )}

          {/* Product Cards */}
          {products.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-10">
              {products.map((product: CatalogProduct) => {
                const imageUrl =
                  (product.images?.find((img: any) => img.isPrimary) || product.images?.[0])?.url || "/placeholder.png";
                const discount = getDiscountPercent(
                  product.price,
                  product.discountPrice ?? 0
                );

                return (
                  <Link
                    key={product._id}
                    href={`/product/${product.slug}`}
                    className="group cursor-pointer"
                  >
                    {/* IMAGE */}
                    <div className="relative w-full aspect-[3/4] bg-gray-100 overflow-hidden">
                      <Image
                        src={imageUrl}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover transition-transform duration-500 ease-out"
                      />

                      {/* DISCOUNT BADGE */}
                      {discount > 0 && (
                        <span className="absolute top-2 left-2 bg-[#BE5555] text-white text-[10px] font-bold px-2 py-0.5 tracking-wide">
                          -{discount}%
                        </span>
                      )}
                    </div>

                    {/* DETAILS */}
                    <div className="mt-3 space-y-1">
                      {product.brand && (
                        <p className="text-[11px] text-[#5C5A58] uppercase tracking-wider">
                          {product.brand}
                        </p>
                      )}
                      <h3 className="text-sm font-medium text-[#5C5A58] line-clamp-1 group-hover:text-neutral-600 transition">
                        {product.name}
                      </h3>

                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">
                          ₹{product.discountPrice}
                        </span>
                        <span className="line-through text-[#BE5555] text-xs">
                          ₹{product.price}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
};