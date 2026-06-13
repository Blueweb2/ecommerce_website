"use client";

import Link from "next/link";
import type { Designer } from "@/types/designer";
import type { Product } from "@/types/product";
import SearchProductCard from "./SearchProductCard";

interface Props {
  products: Product[];
  designers: Designer[];
  query: string;
  loading: boolean;
  error: string;
  hasSearched: boolean;
  onClose: () => void;
}

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

function SearchPrompt() {
  return (
    <div className="border border-dashed border-black/15 bg-white px-6 py-12 text-center md:px-10 md:py-16">
      <p className="text-xs font-semibold uppercase tracking-[0.32em] text-black/45">
        Search ZENFAZ
      </p>
    
      <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-black/60">
        Use at least two characters to see live results from the catalog.
      </p>
    </div>
  );
}

function EmptyState({ query }: { query: string }) {
  return (
    <div className="rounded-[28px] border border-black/10 bg-[#faf8f3] px-6 py-12 text-center md:px-10 md:py-16">
      <p className="text-xs font-semibold uppercase tracking-[0.32em] text-black/45">
        No Matches
      </p>
      <h2 className="mt-4 text-2xl font-semibold tracking-tight text-black md:text-4xl">
        No results for <span className="italic">{query}</span>
      </h2>
      <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-black/60">
        Try a different product name, category, or designer keyword.
      </p>
    </div>
  );
}

export default function SearchResults({
  products,
  designers,
  query,
  loading,
  error,
  hasSearched,
  onClose,
}: Props) {
  if (!query.trim()) {
    return <SearchPrompt />;
  }

  if (query.trim().length < 2) {
    return (
      <div className="rounded-[28px] border border-black/10 bg-white px-6 py-10 text-center text-sm text-black/60">
        Keep typing to search the catalog.
      </div>
    );
  }

  if (!loading && error) {
    return (
      <div className="rounded-[28px] border border-red-200 bg-red-50 px-6 py-10 text-center text-sm text-red-700">
        {error}
      </div>
    );
  }

  if (!loading && hasSearched && products.length === 0 && designers.length === 0) {
    return <EmptyState query={query.trim()} />;
  }

  return (
    <div className="space-y-12 bg-white px-4 py-6 md:px-8 md:py-8 lg:px-12">
      {designers.length > 0 && (
        <section>
          <div className="mb-5 flex items-center justify-between gap-4">
            <h2 className="text-xs font-semibold uppercase tracking-[0.32em] text-black/45">
              Designers
            </h2>

            <Link
              href={`/designers?search=${encodeURIComponent(query.trim())}`}
              onClick={onClose}
              className="text-xs font-medium uppercase tracking-[0.2em] text-black/55 transition hover:text-black"
            >
              View all designers
            </Link>
          </div>

          <div className="flex flex-wrap gap-3">
            {designers.map((designer) => (
              <Link
                key={designer._id || designer.slug || designer.name}
                href={getDesignerHref(designer)}
                onClick={onClose}
                className="rounded-full border border-black/10 px-4 py-2 text-sm text-black/80 transition hover:border-black/25 hover:bg-black hover:text-white"
              >
                {designer.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {products.length > 0 && (
        <section>
          <div className="mb-6 flex items-center justify-between gap-4">
            <h2 className="text-xs font-semibold uppercase tracking-[0.32em] text-black/45">
              Products
            </h2>

            <span className="text-xs uppercase tracking-[0.2em] text-black/45">
              {products.length} shown
            </span>
          </div>

          <div className="grid grid-cols-2 gap-5 md:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <SearchProductCard
                key={product._id}
                product={product}
                onClose={onClose}
              />
            ))}
          </div>
        </section>
      )}

      {(products.length > 0 || designers.length > 0) && (
        <div className="pt-2">
          <Link
            href={`/search?q=${encodeURIComponent(query.trim())}`}
            onClick={onClose}
            className="inline-flex  border border-black px-6 py-3 text-sm font-medium uppercase tracking-[0.18em] text-black transition hover:bg-black hover:text-white"
          >
            View all results
          </Link>
        </div>
      )}
    </div>
  );
}
