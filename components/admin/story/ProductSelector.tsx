"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { Product } from "@/types/product";
import api from "@/lib/api/axios";
import { formatCurrency } from "@/lib/utils/formatCurrency";

type ProductSelectorProps = {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
};

export default function ProductSelector({ selectedIds, onChange }: ProductSelectorProps) {
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const fetchProducts = useCallback(async (search: string, pageNum: number) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(pageNum), limit: "12" });
      if (search.trim()) params.set("search", search.trim());

      const res = await api.get(`/products?${params.toString()}`);
      const data = res.data?.data ?? res.data;
      const items: Product[] = Array.isArray(data) ? data : data?.products ?? [];
      const total = res.data?.total ?? items.length;

      if (pageNum === 1) {
        setProducts(items);
      } else {
        setProducts((prev) => [...prev, ...items]);
      }

      setHasMore(page * 12 < total);
    } catch {
      // silently fail — products grid shows empty
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setPage(1);
      void fetchProducts(query, 1);
    }, 400);
    return () => clearTimeout(timeout);
  }, [query]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggle = (id: string) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((s) => s !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    void fetchProducts(query, nextPage);
  };

  return (
    <div className="space-y-3">
      <input
        type="text"
        placeholder="Search products..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-[#12251a] focus:ring-1 focus:ring-[#12251a]"
      />

      {selectedIds.length > 0 && (
        <p className="text-xs text-emerald-700 font-medium">
          {selectedIds.length} product{selectedIds.length !== 1 ? "s" : ""} selected
        </p>
      )}

      {loading && products.length === 0 ? (
        <div className="py-6 text-center text-sm text-slate-400">Loading products…</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-80 overflow-y-auto pr-1">
          {products.map((product) => {
            const isSelected = selectedIds.includes(product._id);
            const imageUrl = product.images?.[0]?.url;

            return (
              <button
                key={product._id}
                type="button"
                onClick={() => toggle(product._id)}
                className={`flex items-center gap-2 rounded-xl border p-2 text-left transition-all ${
                  isSelected
                    ? "border-[#12251a] bg-[#12251a]/5 ring-1 ring-[#12251a]"
                    : "border-slate-200 hover:border-slate-300"
                }`}
              >
                {imageUrl && (
                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                    <Image src={imageUrl} alt={product.name} fill className="object-cover" sizes="40px" />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold truncate text-slate-800">{product.name}</p>
                  <p className="text-[10px] text-slate-500">
                    {formatCurrency(product.discountPrice ?? product.price)}
                  </p>
                </div>
                <span className={`ml-auto shrink-0 text-xs font-bold ${isSelected ? "text-[#12251a]" : "text-slate-300"}`}>
                  {isSelected ? "✓" : "+"}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {hasMore && (
        <button
          type="button"
          onClick={loadMore}
          disabled={loading}
          className="w-full rounded-xl border border-slate-200 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50"
        >
          {loading ? "Loading…" : "Load more"}
        </button>
      )}
    </div>
  );
}
