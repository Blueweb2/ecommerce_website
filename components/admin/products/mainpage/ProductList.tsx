import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  LayoutGrid,
  List,
  Package,
} from "lucide-react";

import ProductCard from "./ProductCard";
import {
  getPrimaryProductImage,
  getProductImageUrl,
  getSectionLabel,
  type CatalogEntity,
  type CatalogProduct,
} from "@/lib/constants/admin-catalog";

interface ProductListProps {
  products: CatalogProduct[];
  loading: boolean;
  categories: CatalogEntity[];
  onDelete: (id: string) => void;
}

const formatPrice = (value?: number) =>
  `Rs. ${Math.round(value ?? 0).toLocaleString("en-IN")}`;

const getCategoryName = (
  product: CatalogProduct,
  categories: CatalogEntity[]
) => {
  if (product.category && typeof product.category !== "string") {
    return product.category.name;
  }

  return (
    categories.find((category) => category._id === product.category)
      ?.name || "Unassigned"
  );
};

export default function ProductList({
  products,
  loading,
  categories,
  onDelete,
}: ProductListProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<
    "name" | "price" | "stock" | "created"
  >("created");

  if (loading) {
    return (
      <div className="flex items-center justify-center rounded-[28px] border border-black/10 bg-white py-20 shadow-sm">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-black/20 border-t-black" />
        <span className="ml-3 text-sm text-[#5c5a58]">
          Loading products...
        </span>
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="rounded-[28px] border border-dashed border-black/15 bg-white px-6 py-14 text-center shadow-sm">
        <Package className="mx-auto h-14 w-14 text-[#b6aea4]" />
        <h3 className="mt-5 font-brand-display text-3xl text-[#171717]">
          No products found
        </h3>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#5c5a58]">
          Adjust the filters or start a new product entry to build out the
          catalog.
        </p>
        <Link
          href="/admin/products/create"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#2b2b2b]"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
          Add the First Product
        </Link>
      </div>
    );
  }

  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "price":
        return (a.discountPrice || a.price) - (b.discountPrice || b.price);
      case "stock":
        return (b.stock ?? 0) - (a.stock ?? 0);
      case "created":
      default:
        return (
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
        );
    }
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 rounded-[28px] border border-black/10 bg-white p-5 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#8a7356]">
            Product Library
          </p>
          <p className="mt-2 text-sm text-[#5c5a58]">
            Showing {sortedProducts.length} curated
            {sortedProducts.length === 1 ? " style" : " styles"}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <label className="text-sm text-[#5c5a58]">Sort by</label>
            <select
              value={sortBy}
              onChange={(event) =>
                setSortBy(
                  event.target.value as
                    | "name"
                    | "price"
                    | "stock"
                    | "created"
                )
              }
              className="rounded-full border border-black/10 bg-[#faf7f2] px-4 py-2 text-sm text-[#171717] outline-none transition focus:border-black"
            >
              <option value="created">Newest First</option>
              <option value="name">Name A-Z</option>
              <option value="price">Price: Low to High</option>
              <option value="stock">Stock: High to Low</option>
            </select>
          </div>

          <div className="inline-flex rounded-full border border-black/10 bg-[#faf7f2] p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
                viewMode === "grid"
                  ? "bg-black text-white"
                  : "text-[#5c5a58] hover:text-black"
              }`}
              title="Grid View"
            >
              <LayoutGrid className="h-4 w-4" />
              Grid
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
                viewMode === "list"
                  ? "bg-black text-white"
                  : "text-[#5c5a58] hover:text-black"
              }`}
              title="List View"
            >
              <List className="h-4 w-4" />
              List
            </button>
          </div>
        </div>
      </div>

      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {sortedProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              categories={categories}
              onDelete={onDelete}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {sortedProducts.map((product) => {
            const stock = product.stock ?? 0;
            const primaryImage = getPrimaryProductImage(product.images);
            const imageUrl =
              getProductImageUrl(primaryImage) || "/placeholder.png";
            const categoryName = getCategoryName(product, categories);
            const primarySection = product.sections?.[0];

            return (
              <div
                key={product._id}
                className="rounded-[28px] border border-black/10 bg-white p-4 shadow-sm transition hover:shadow-md md:p-5"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
                  <div className="flex gap-4">
                    <div className="relative h-28 w-24 shrink-0 overflow-hidden rounded-[20px] bg-[#f6f1ea]">
                      <Image
                        src={imageUrl}
                        alt={product.name}
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        {product.isOnSale && (
                          <span className="rounded-full bg-[#b84f4f] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-white">
                            Sale
                          </span>
                        )}
                        {!product.isPublished && (
                          <span className="rounded-full bg-[#f1dfb5] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#6f5524]">
                            Draft
                          </span>
                        )}
                        {primarySection && (
                          <span className="rounded-full bg-[#f6f1ea] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#8a7356]">
                            {getSectionLabel(primarySection)}
                          </span>
                        )}
                      </div>

                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#8a7356]">
                          {product.brand || "Catalog Product"}
                        </p>
                        <h3 className="mt-1 font-brand-display text-2xl text-[#171717]">
                          {product.name}
                        </h3>
                        <p className="mt-1 text-sm text-[#5c5a58]">
                          {categoryName}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2 text-xs text-[#5c5a58]">
                        <span className="rounded-full bg-[#faf7f2] px-3 py-1">
                          Stock: {stock}
                        </span>
                        <span className="rounded-full bg-[#faf7f2] px-3 py-1">
                          GST: {product.gstPercentage || 0}%
                        </span>
                        {product.sku && (
                          <span className="rounded-full bg-[#faf7f2] px-3 py-1">
                            SKU: {product.sku}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col gap-3 lg:items-end">
                    <div className="text-left lg:text-right">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#8a7356]">
                        Selling Price
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-2 lg:justify-end">
                        <span className="font-brand-display text-2xl text-[#171717]">
                          {formatPrice(
                            product.isOnSale
                              ? product.discountPrice || product.price
                              : product.price
                          )}
                        </span>
                        {product.isOnSale &&
                          product.discountPrice &&
                          product.discountPrice < product.price && (
                            <span className="text-sm text-[#8f8a83] line-through">
                              {formatPrice(product.price)}
                            </span>
                          )}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <Link
                        href={`/admin/products/${product._id}/edit`}
                        className="inline-flex items-center justify-center rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2b2b2b]"
                      >
                        Edit Product
                      </Link>
                      <button
                        onClick={() => onDelete(product._id)}
                        className="inline-flex items-center justify-center rounded-full border border-[#b84f4f]/20 px-5 py-2.5 text-sm font-semibold text-[#b84f4f] transition hover:bg-[#fff5f5]"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
