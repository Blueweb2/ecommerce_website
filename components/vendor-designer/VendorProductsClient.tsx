"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { PackageSearch, Plus, Search } from "lucide-react";
import { useVendorPortalData } from "@/hooks/useVendorPortalData";

function getCategoryLabel(category: unknown) {
  if (typeof category === "string") {
    return category;
  }

  if (category && typeof category === "object" && "name" in category) {
    const name = category.name;
    return typeof name === "string" ? name : "Uncategorized";
  }

  return "Uncategorized";
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function VendorProductsClient() {
  const { products, stats, loading, error, notice } = useVendorPortalData();
  const [query, setQuery] = useState("");
  const [stockFilter, setStockFilter] = useState<"all" | "instock" | "low">("all");

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return products.filter((product) => {
      const matchesQuery =
        !normalizedQuery ||
        product.name.toLowerCase().includes(normalizedQuery) ||
        product.slug.toLowerCase().includes(normalizedQuery) ||
        product.brand?.toLowerCase().includes(normalizedQuery);

      const matchesStock =
        stockFilter === "all" ||
        (stockFilter === "instock" && product.stock > 5) ||
        (stockFilter === "low" && product.stock <= 5);

      return matchesQuery && matchesStock;
    });
  }, [products, query, stockFilter]);

  if (loading) {
    return <div className="h-40 animate-pulse rounded-[32px] bg-slate-200" />;
  }

  if (error) {
    return (
      <div className="rounded-[28px] border border-rose-200 bg-rose-50 p-6 text-rose-700">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[32px] bg-[linear-gradient(135deg,#111827_0%,#1f2937_55%,#dbeafe_180%)] text-white shadow-xl">
        <div className="flex flex-col gap-4 p-6 md:flex-row md:items-end md:justify-between md:p-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.24em] text-slate-100">
              <PackageSearch className="h-3.5 w-3.5" />
              Product Inventory
            </div>
            <h1 className="mt-4 text-3xl font-semibold">Vendor products</h1>
            <p className="mt-2 text-sm text-slate-200/90">
              Review pricing, stock levels, and which items need attention.
            </p>
          </div>

          <Link
            href="/vendor/products/create"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-100"
          >
            <Plus className="h-4 w-4" />
            Add Product
          </Link>
        </div>
      </section>

      {notice ? (
        <section className="rounded-[24px] border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800">
          {notice}
        </section>
      ) : null}

      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-[24px] border bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Total products</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">
            {stats.totalProducts}
          </p>
        </article>
        <article className="rounded-[24px] border bg-emerald-50 p-5 shadow-sm">
          <p className="text-sm text-emerald-700">Healthy stock</p>
          <p className="mt-3 text-3xl font-semibold text-emerald-900">
            {stats.inStockProducts}
          </p>
        </article>
        <article className="rounded-[24px] border bg-amber-50 p-5 shadow-sm">
          <p className="text-sm text-amber-700">Low stock</p>
          <p className="mt-3 text-3xl font-semibold text-amber-900">
            {stats.lowStockProducts}
          </p>
        </article>
      </section>

      <section className="rounded-[28px] border bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b p-6 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search products by name or slug"
              className="w-full rounded-2xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-slate-400"
            />
          </div>

          <div className="flex gap-2">
            {[
              ["all", "All"],
              ["instock", "In stock"],
              ["low", "Low stock"],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setStockFilter(value as "all" | "instock" | "low")}
                className={`rounded-full px-4 py-2 text-sm font-medium ${
                  stockFilter === value
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          {filteredProducts.length ? (
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-6 py-3 text-left font-medium">Product</th>
                  <th className="px-6 py-3 text-left font-medium">Category</th>
                  <th className="px-6 py-3 text-left font-medium">Price</th>
                  <th className="px-6 py-3 text-left font-medium">Stock</th>
                  <th className="px-6 py-3 text-left font-medium">Sections</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product._id} className="border-t border-slate-100">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative h-14 w-14 overflow-hidden rounded-2xl bg-slate-100">
                          <Image
                            src={product.images?.[0]?.url || "/placeholder.png"}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate font-medium text-slate-900">
                            {product.name}
                          </p>
                          <p className="mt-1 truncate text-xs text-slate-500">
                            /{product.slug}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {getCategoryLabel(product.category)}
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-900">
                      {formatCurrency(product.discountPrice || product.price)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          product.stock <= 5
                            ? "bg-amber-100 text-amber-800"
                            : "bg-emerald-100 text-emerald-800"
                        }`}
                      >
                        {product.stock} available
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {(product.sections || []).length
                        ? product.sections?.join(", ")
                        : "Standard"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="px-6 py-14 text-center">
              <p className="text-sm text-slate-500">
                No vendor products matched the current filter.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
