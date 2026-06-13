"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ExploreGrid from "@/components/explore/ExploreGrid";
import { getDesigners } from "@/lib/api/designer.api";
import { productAPI } from "@/lib/api/product.api";
import { PLACEHOLDER_IMAGE } from "@/lib/utils/image";
import type { Designer } from "@/types/designer";
import type { Product } from "@/types/product";

function getDesignerHref(designer: Designer) {
  if (designer.slug) {
    return `/designers/${designer.slug}`;
  }

  return `/designers/${designer.name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")}`;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q")?.trim() || "";

  const [products, setProducts] = useState<Product[]>([]);
  const [designers, setDesigners] = useState<Designer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!query) {
      setProducts([]);
      setDesigners([]);
      setLoading(false);
      setError("");
      return;
    }

    let cancelled = false;

    const loadResults = async () => {
      try {
        setLoading(true);
        setError("");

        const [nextProducts, nextDesigners] = await Promise.all([
          productAPI.searchCatalog(query),
          getDesigners({ search: query }),
        ]);

        if (cancelled) {
          return;
        }

        setProducts(nextProducts);
        setDesigners(nextDesigners || []);
      } catch (searchError) {
        if (cancelled) {
          return;
        }

        setProducts([]);
        setDesigners([]);
        setError(
          searchError instanceof Error
            ? searchError.message
            : "We could not load search results right now."
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadResults();

    return () => {
      cancelled = true;
    };
  }, [query]);

  return (
    <section className="min-h-screen bg-[#fcfaf5] pb-16 pt-24 md:pb-20 md:pt-36">
      <div className="mx-auto max-w-[1880px] px-4 md:px-8 xl:px-12">
        <div className="space-y-10">
          <div className="rounded-[32px] border border-black/10 bg-white px-6 py-8 shadow-[0_20px_60px_rgba(15,23,42,0.05)] md:px-8 md:py-10">
            <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-black/45">
              Search
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-black md:text-5xl">
              {query ? `Results for "${query}"` : "Search the catalog"}
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-black/60 md:text-base">
              Explore products and designers across the ZENFAZ storefront.
            </p>

            {query && !loading && !error && (
              <div className="mt-6 flex flex-wrap gap-2">
                <span className="rounded-full border border-black/10 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.12em] text-black/70">
                  {products.length} Products
                </span>
                <span className="rounded-full border border-black/10 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.12em] text-black/70">
                  {designers.length} Designers
                </span>
              </div>
            )}
          </div>

          {!query ? (
            <div className="rounded-[28px] border border-dashed border-black/15 bg-white px-6 py-16 text-center">
              <h2 className="text-2xl font-semibold tracking-tight text-black md:text-4xl">
                Enter a search term from the navbar
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-black/60">
                Try a product name, designer, collection keyword, or category.
              </p>
            </div>
          ) : loading ? (
            <div className="flex min-h-[320px] items-center justify-center">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-black" />
            </div>
          ) : error ? (
            <div className="rounded-[28px] border border-red-200 bg-red-50 px-6 py-10 text-center text-red-700">
              <p className="text-base font-semibold">Search failed</p>
              <p className="mt-2 text-sm">{error}</p>
            </div>
          ) : products.length === 0 && designers.length === 0 ? (
            <div className="rounded-[28px] border border-black/10 bg-white px-6 py-16 text-center">
              <h2 className="text-2xl font-semibold tracking-tight text-black md:text-4xl">
                No results for <span className="italic">{query}</span>
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-black/60">
                Try another product name, collection keyword, or designer.
              </p>
            </div>
          ) : (
            <>
              {designers.length > 0 && (
                <section className="rounded-[28px] border border-black/10 bg-white px-6 py-8 shadow-sm md:px-8">
                  <div className="mb-5 flex items-center justify-between gap-4">
                    <h2 className="text-xs font-semibold uppercase tracking-[0.32em] text-black/45">
                      Designers
                    </h2>
                    <Link
                      href={`/designers?search=${encodeURIComponent(query)}`}
                      className="text-xs font-medium uppercase tracking-[0.2em] text-black/55 transition hover:text-black"
                    >
                      View designer page
                    </Link>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {designers.map((designer) => (
                      <Link
                        key={designer._id || designer.slug || designer.name}
                        href={getDesignerHref(designer)}
                        className="rounded-full border border-black/10 px-4 py-2 text-sm text-black/80 transition hover:border-black/25 hover:bg-black hover:text-white"
                      >
                        {designer.name}
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              <section className="rounded-[28px] border border-black/10 bg-white px-6 py-8 shadow-sm md:px-8">
                <div className="mb-8 flex items-center justify-between gap-4">
                  <h2 className="text-xs font-semibold uppercase tracking-[0.32em] text-black/45">
                    Products
                  </h2>
                </div>

                <ExploreGrid
                  products={products}
                  fallbackImage={PLACEHOLDER_IMAGE}
                  categoryTitle={query}
                />
              </section>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
