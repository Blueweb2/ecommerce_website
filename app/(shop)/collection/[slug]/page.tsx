"use client";

import { use, useCallback, useEffect, useState } from "react";
import { collectionAPI } from "@/lib/api/collection.api";
import { Collection } from "@/types/collection";
import { Product } from "@/types/product";

import ExploreHeader from "@/components/explore/ExploreHeader";
import ExploreGrid from "@/components/explore/ExploreGrid";
import ExploreControls from "@/components/explore/ExploreControls";

const FALLBACK_BANNER = "/home/herosection/hero-center.png";
const FALLBACK_PRODUCT_IMAGE = "/home/categorysection/category-one.png";

type CollectionPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default function CollectionPage({ params }: CollectionPageProps) {
  
  const { slug } = use(params);
  const [collection, setCollection] = useState<Collection | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState("recommended");

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const res = await collectionAPI.getBySlug(slug);

      if (!res.success) {
        throw new Error("Failed to load collection.");
      }

      setCollection(res.collection);
      setProducts(res.products || []);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to load this collection right now.";

      setError(message);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  if (loading) {
    return (
      <div className="mx-auto max-w-[1880px] px-4 md:px-8 xl:px-12 py-20 mt-16 text-center">
        <p className="text-lg text-gray-500 animate-pulse font-medium">Loading Collection...</p>
      </div>
    );
  }

  if (error || !collection) {
    return (
      <div className="mx-auto max-w-[1880px] px-4 md:px-8 xl:px-12 py-20 mt-16 text-center">
        <div className="rounded-[40px] border border-red-200 bg-red-50 p-12 shadow-sm">
          <h2 className="text-2xl font-bold text-red-700 lora">Collection Not Found</h2>
          <p className="mt-3 text-red-600/80 max-w-md mx-auto">{error || "The collection you are looking for does not exist or has been moved."}</p>
          <button 
            onClick={() => window.location.href = '/'}
            className="mt-8 px-8 py-3 bg-[#BE5555] text-white rounded-full font-semibold hover:bg-[#A04444] transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const bannerImage = typeof collection.image === 'string' 
    ? collection.image 
    : (collection.image?.url || FALLBACK_BANNER);

  return (
    <section className="bg-[#f8f6f1] py-12 md:py-16 mt-16 min-h-screen">
      <div className="mx-auto max-w-[1880px] px-4 md:px-8 xl:px-12">
        <div className="space-y-12">
          {/* PREMIUM HEADER */}
          <ExploreHeader
            title={collection.title || collection.name || "Collection"}
            description={collection.description || "Discover our curated collection of premium designs."}
            bannerImage={bannerImage}
            productCount={products.length}
            typeLabel="Curated Collection"
          />

          {/* CONTROLS */}
          <ExploreControls
            sortBy={sortBy}
            onSortChange={(val) => setSortBy(val)}
            onMobileFilterOpen={() => {}}
            resultCount={products.length}
            activeChips={[]}
            onRemoveChip={() => {}}
          />

          {/* PRODUCT GRID */}
          <div className="bg-white/50 backdrop-blur-sm rounded-[40px] p-8 md:p-12 border border-black/5 shadow-sm">
            <ExploreGrid
              products={products}
              fallbackImage={FALLBACK_PRODUCT_IMAGE}
              categoryTitle={collection.title || collection.name || "Collection"}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
