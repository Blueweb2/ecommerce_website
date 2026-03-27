"use client";

import Link from "next/link";
import { Tag } from "lucide-react";
import CategoryTable from "@/components/admin/categories/CategoryTable";

export default function CategoriesPage() {
  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[32px] bg-[#12251a] text-white shadow-xl">
        <div className="flex flex-col gap-6 p-6 md:flex-row md:items-end md:justify-between md:p-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.24em] text-emerald-100">
              <Tag className="h-3.5 w-3.5" />
              Category management
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
              Shape how shoppers browse your jewelry catalog
            </h1>
            <p className="mt-3 text-sm leading-6 text-emerald-50/80 md:text-base">
              Keep your catalog clean with product groupings like Rings,
              Necklaces, Earrings, and more.
            </p>
          </div>

          <Link
            href="/admin/categories/create"
            className="inline-flex items-center justify-center rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-emerald-50"
          >
            + Add Category
          </Link>
        </div>
      </section>

      <CategoryTable />
    </div>
  );
}
