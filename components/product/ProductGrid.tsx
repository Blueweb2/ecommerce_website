"use client";

import { useMemo, useState } from "react";
import ProductCard from "@/components/product/ProductCard";
import ProductCardSkeleton from "@/components/ui/ProductCardSkeleton";
import { Product } from "@/types/product";

type SortOption = "featured" | "price-low" | "price-high" | "name";

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  emptyMessage?: string;
}

export default function ProductGrid({
  products,
  isLoading = false,
  emptyMessage = "No products found.",
}: ProductGridProps) {
  const [sortBy, setSortBy] = useState<SortOption>("featured");

  const sortedProducts = useMemo(() => {
    const nextProducts = [...products];

    switch (sortBy) {
      case "price-low":
        return nextProducts.sort(
          (first, second) =>
            (first.discountPrice ?? first.price) -
            (second.discountPrice ?? second.price)
        );
      case "price-high":
        return nextProducts.sort(
          (first, second) =>
            (second.discountPrice ?? second.price) -
            (first.discountPrice ?? first.price)
        );
      case "name":
        return nextProducts.sort((first, second) =>
          first.name.localeCompare(second.name)
        );
      case "featured":
      default:
        return nextProducts;
    }
  }, [products, sortBy]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <ProductCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="rounded-[28px] border border-dashed border-neutral-300 bg-white/80 px-6 py-14 text-center text-neutral-600">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 rounded-[24px] border border-black/5 bg-white/70 p-4 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-neutral-600">
          Showing {sortedProducts.length} product
          {sortedProducts.length === 1 ? "" : "s"}
        </p>

        <label className="flex items-center gap-3 text-sm text-neutral-600">
          <span>Sort by</span>
          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value as SortOption)}
            className="rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm text-neutral-900 outline-none transition focus:border-neutral-900"
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="name">Name: A to Z</option>
          </select>
        </label>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {sortedProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}
