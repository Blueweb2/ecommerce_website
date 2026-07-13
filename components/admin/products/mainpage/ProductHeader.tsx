import Link from "next/link";
import {
  ArrowRight,
  FolderKanban,
  Package2,
  Plus,
  Sparkles,
} from "lucide-react";

import type {
  CatalogEntity,
  CatalogProduct,
} from "@/lib/constants/admin-catalog";

interface ProductHeaderProps {
  products: CatalogProduct[];
  categories: CatalogEntity[];
}

export default function ProductHeader({
  products,
  categories,
}: ProductHeaderProps) {
  const publishedCount = products.filter(
    (product) => product.isPublished
  ).length;
  const onSaleCount = products.filter(
    (product) => product.isOnSale
  ).length;

  const spotlightItems = [
    {
      label: "Products",
      value: products.length,
    },
    {
      label: "Categories",
      value: categories.length,
    },
    {
      label: "Published",
      value: publishedCount,
    },
    {
      label: "On Sale",
      value: onSaleCount,
    },
  ];

  return (
    <div className="relative overflow-hidden rounded-[32px] border border-black/10 bg-[linear-gradient(135deg,#fffdf9_0%,#f7f0e6_45%,#f3f3f0_100%)] shadow-sm">
      <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-[#d9c0a0]/30 blur-3xl" />
      <div className="absolute -left-16 bottom-0 h-40 w-40 rounded-full bg-white/90 blur-2xl" />

      <div className="relative flex flex-col gap-10 p-6 md:p-8 xl:flex-row xl:items-end xl:justify-between">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/80 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.32em] text-[#8a7356]">
            <Sparkles className="h-3.5 w-3.5" />
            Catalog Atelier
          </div>

          <h1 className="mt-5 max-w-2xl font-brand-display text-4xl leading-none text-[#171717] md:text-5xl xl:text-6xl">
            Shape the catalog with the same polish shoppers see on the storefront.
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#5c5a58] md:text-base">
            Manage pricing, merchandising, and availability in a cleaner workspace
            that follows the brand language of the customer-facing experience.
          </p>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {spotlightItems.map((item) => (
              <div
                key={item.label}
                className="rounded-[24px] border border-black/10 bg-white/80 px-5 py-4 backdrop-blur"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[#8a7356]">
                  {item.label}
                </p>
                <p className="mt-2 font-brand-display text-3xl text-[#171717]">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 xl:min-w-[280px]">
          <div className="rounded-[28px] border border-black/10 bg-white/75 p-5 backdrop-blur">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-white">
                <Package2 className="h-5 w-5" />
              </div>

              <div>
                <p className="text-sm font-semibold text-[#171717]">
                  Product Collection
                </p>
                <p className="mt-1 text-sm leading-6 text-[#5c5a58]">
                  Keep assortments fresh, balanced, and aligned with active
                  storefront categories.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row xl:flex-col">
            <Link
              href="/admin/products/create"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#2b2b2b]"
            >
              <Plus className="h-4 w-4" />
              Add Product
            </Link>

            <Link
              href="/admin/categories"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-black/15 bg-white px-6 py-3 text-sm font-semibold text-[#171717] transition hover:border-black hover:bg-[#faf7f2]"
            >
              <FolderKanban className="h-4 w-4" />
              Manage Categories
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
