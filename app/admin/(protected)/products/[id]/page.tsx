"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import axios from "@/lib/api/axios";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Package2,
  ShieldCheck,
  Tag,
} from "lucide-react";
import {
  CatalogProduct,
  getPrimaryProductImage,
  getProductImageUrl,
  getSectionLabel,
} from "@/lib/constants/admin-catalog";

export default function ViewProductPage() {
  const params = useParams();
  const id = params.id as string;

  const [product, setProduct] = useState<CatalogProduct | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProduct = useCallback(async () => {
    try {
      const res = await axios.get(`/products/${id}`);
      setProduct(res.data?.data ?? null);
    } catch {
      toast.error("Failed to fetch product");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) fetchProduct();
  }, [fetchProduct, id]);


  if (loading) return <div className="p-6">Loading...</div>;
  if (!product) return <div className="p-6 text-red-500">Not found</div>;

  const primaryImageUrl = getProductImageUrl(
    getPrimaryProductImage(product.images)
  );

  return (
    <div className="space-y-6">
      <Link
        href="/admin/products"
        className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to products
      </Link>

      <section className="overflow-hidden rounded-[32px] bg-[#12251a] text-white shadow-xl">
        <div className="flex flex-col gap-6 p-6 md:flex-row md:items-end md:justify-between md:p-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.24em] text-emerald-100">
              <Package2 className="h-3.5 w-3.5" />
              Product details
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
              {product.name}
            </h1>
            {product.sku ? (
              <p className="mt-3 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-100">
                SKU {product.sku}
              </p>
            ) : null}
            <p className="mt-3 text-sm leading-6 text-emerald-50/80 md:text-base">
              {product.description || "No description added yet."}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {(product.sections || []).map((section: string) => (
              <span
                key={section}
                className="rounded-full bg-white px-3 py-2 text-xs font-semibold text-slate-900"
              >
                {getSectionLabel(section)}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_0.95fr]">
        <article className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
          <div className="bg-[radial-gradient(circle_at_top,#fdf7e7,transparent_55%),linear-gradient(180deg,#ffffff_0%,#f5f5f5_100%)] p-6">

            {primaryImageUrl ? (
              <img
                src={primaryImageUrl}
                alt={
                  getPrimaryProductImage(product.images)?.altText ||
                  `${product.name} product image`
                }
                className="h-[420px] w-full rounded-[24px] object-cover"
              />
            ) : (
              <div className="flex h-[420px] items-center justify-center rounded-[24px] bg-slate-100 text-slate-400">
                No image available
              </div>
            )}

          </div>
        </article>

        <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold tracking-tight text-slate-900">
            Catalog metadata
          </h2>

          <div className="mt-6 space-y-4">
            <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-500">SKU</p>
              <p className="mt-2 text-base font-semibold text-slate-900">
                {product.sku || "Auto generated after creation"}
              </p>
            </div>

            <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-500">Price</p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">
                ₹ {product.price}
              </p>
            </div>

            <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-start gap-3">
                <div className="rounded-2xl bg-white p-3 text-slate-700 shadow-sm">
                  <Tag className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Category</p>
                  <p className="mt-1 text-base font-semibold text-slate-900">
                    {typeof product.category === "object" && product.category !== null
                      ? product.category.name
                      : "Uncategorized"}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-start gap-3">
                <div className="rounded-2xl bg-white p-3 text-slate-700 shadow-sm">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">Status</p>
                  <p className="mt-1 text-base font-semibold text-slate-900">
                    {product.isPublished ? "Published" : "Draft"} | Stock{" "}
                    {product.stock ?? 0}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-medium text-slate-500">Variants</p>

              {product.variants?.length ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {product.variants.map((variant, index) => {
                    const attributes = variant.attributes || {};

                    // Convert attributes → "size: M / color: Red"
                    const label = Object.entries(attributes)
                      .map(([key, value]) => `${key}: ${value}`)
                      .join(" / ");

                    return (
                      <span
                        key={`${Object.values(attributes).join("-")}-${index}`}
                        className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-700"
                      >
                        {label || "No attributes"}
                      </span>
                    );
                  })}
                </div>
              ) : (
                <p className="mt-2 text-base font-semibold text-slate-900">
                  No variants added
                </p>
              )}
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}
