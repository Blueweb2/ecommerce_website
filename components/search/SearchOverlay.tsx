"use client";

import {
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";

import SearchInput from "./SearchInput";
import SearchResults from "./SearchResults";
import SearchSkeleton from "./SearchSkeleton";

import { productAPI } from "@/lib/api/product.api";
import { getDesigners } from "@/lib/api/designer.api";
import type { Designer } from "@/types/designer";
import type { Product } from "@/types/product";

interface Props {
  onClose: () => void;
}

export default function SearchOverlay({
  onClose,
}: Props) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [designers, setDesigners] = useState<Designer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handler);

    return () =>
      window.removeEventListener("keydown", handler);
  }, [onClose]);

  useEffect(() => {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      setProducts([]);
      setDesigners([]);
      setError("");
      setHasSearched(false);
      setLoading(false);
      return;
    }

    if (trimmedQuery.length < 2) {
      setProducts([]);
      setDesigners([]);
      setError("");
      setHasSearched(false);
      setLoading(false);
      return;
    }

    let isStale = false;

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        setError("");

        const [nextProducts, nextDesigners] = await Promise.all([
          productAPI.searchCatalog(trimmedQuery),
          getDesigners({
            search: trimmedQuery,
          }),
        ]);

        if (isStale) {
          return;
        }

        setProducts(nextProducts);
        setDesigners(nextDesigners || []);
        setHasSearched(true);
      } catch (searchError) {
        if (isStale) {
          return;
        }

        setProducts([]);
        setDesigners([]);
        setHasSearched(true);
        setError(
          searchError instanceof Error
            ? searchError.message
            : "We could not load search results right now."
        );
      } finally {
        if (!isStale) {
          setLoading(false);
        }
      }
    }, 250);

    return () => {
      isStale = true;
      clearTimeout(timer);
    };
  }, [query]);

  const handleSubmit = () => {
    const trimmedQuery = query.trim();

    if (trimmedQuery.length < 2) {
      return;
    }

    router.push(`/search?q=${encodeURIComponent(trimmedQuery)}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[99999] bg-[#fcfaf5] text-black">
      <SearchInput
        query={query}
        setQuery={setQuery}
        onClose={onClose}
        onSubmit={handleSubmit}
      />

      <div className="mx-auto max-w-6xl px-4 py-6 md:px-8 md:py-8 lg:px-12">
        {loading ? (
          <SearchSkeleton />
        ) : (
          <SearchResults
            products={products}
            designers={designers}
            query={query}
            loading={loading}
            error={error}
            hasSearched={hasSearched}
            onClose={onClose}
          />
        )}
      </div>
    </div>
  );
}
