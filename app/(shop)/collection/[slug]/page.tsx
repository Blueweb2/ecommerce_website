"use client";

import { use, useCallback, useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import { collectionAPI } from "@/lib/api/collection.api";
import { categoryAPI } from "@/lib/api/category.api";
import { Collection } from "@/types/collection";
import { Product } from "@/types/product";

import ExploreHeader from "@/components/explore/ExploreHeader";
import ExploreFilters from "@/components/explore/ExploreFilters";
import ExploreGrid from "@/components/explore/ExploreGrid";
import ExploreControls from "@/components/explore/ExploreControls";

const FALLBACK_BANNER = "/home/herosection/hero-center.png";
const FALLBACK_PRODUCT_IMAGE = "/home/categorysection/category-one.png";

type CollectionPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

type SortOption = "recommended" | "price-low" | "price-high" | "name";

type ActiveFilters = {
  category?: string;
  type?: string;
  tags: string[];
  brands: string[];
  minPrice?: number;
  maxPrice?: number;
};

function formatFilterLabel(value?: string) {
  if (!value) return "All";
  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function resolveImageUrl(img: any) {
  if (!img) return FALLBACK_BANNER;
  if (typeof img === "string") return img;
  return img.url || FALLBACK_BANNER;
}

function getActiveFilterChips(filters: ActiveFilters, allCategories: any[] = []) {
  const chips: {
    key: string;
    label: string;
    onRemove: keyof ActiveFilters | "tag" | "brand";
    value?: string;
  }[] = [];

  if (filters.category) {
    const catName = allCategories.find(c => c._id === filters.category)?.name || formatFilterLabel(filters.category);
    chips.push({
      key: "category",
      label: catName,
      onRemove: "category",
    });
  }

  if (filters.type) {
    chips.push({
      key: "type",
      label: formatFilterLabel(filters.type),
      onRemove: "type",
    });
  }

  filters.tags.forEach((tag: string) => {
    chips.push({
      key: `tag-${tag}`,
      label: formatFilterLabel(tag),
      onRemove: "tag",
      value: tag,
    });
  });

  filters.brands.forEach((brand: string) => {
    chips.push({
      key: `brand-${brand}`,
      label: brand,
      onRemove: "brand",
      value: brand,
    });
  });

  if (
    typeof filters.minPrice === "number" ||
    typeof filters.maxPrice === "number"
  ) {
    chips.push({
      key: "price",
      label: `${filters.minPrice ?? 0} - ${filters.maxPrice ?? "Any"}`,
      onRemove: "minPrice",
    });
  }

  return chips;
}

export default function CollectionPage({ params }: CollectionPageProps) {
  const { slug } = use(params);

  const [collection, setCollection] = useState<Collection | null>(null);
  const [allCategories, setAllCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("recommended");
  const [activeFilters, setActiveFilters] = useState<any>({
    category: undefined,
    type: undefined,
    tags: [],
    brands: [],
  });
  const [openSections, setOpenSections] = useState({
    category: true,
    type: true,
    trending: true,
    designer: true,
    price: true,
  });

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const [collRes, catRes] = await Promise.all([
        collectionAPI.getBySlug(slug),
        categoryAPI.getAll(),
      ]);

      if (!collRes.success) {
        throw new Error("Failed to load collection.");
      }

      setCollection(collRes.collection);
      setProducts(Array.isArray(collRes.products) ? collRes.products : []);
      setAllCategories(catRes.data.data || []);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to load this collection right now.";

      setCollection(null);
      setProducts([]);
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  useEffect(() => {
    if (!collection) return;

    setActiveFilters({
      category: collection.filters?.category,
      type: collection.filters?.type,
      tags: collection.filters?.tags || [],
      brands: [],
      minPrice: collection.filters?.priceRange?.min,
      maxPrice: collection.filters?.priceRange?.max,
    });
  }, [collection]);

  const collectionTitle = useMemo(() => {
    if (!collection) return "Collection";
    return collection.title || collection.name || "Collection";
  }, [collection]);

  const collectionDescription = collection?.description?.trim()
    ? collection.description
    : "Discover a curated edit of products from this collection.";

  const bannerImage = resolveImageUrl(
    collection?.bannerImage || collection?.image
  );

  const availableBrands = useMemo(() => {
    return Array.from(
      new Set(products.map((product: Product) => product.brand).filter(Boolean))
    ) as string[];
  }, [products]);

  const availableTypes = useMemo(() => {
    return Array.from(
      new Set(products.flatMap((p: any) => p.sections || []).filter(Boolean))
    ) as string[];
  }, [products]);

  const availableTags = useMemo(() => {
    return availableTypes;
  }, [availableTypes]);

  const filteredProducts = useMemo(() => {
    const filtered = products.filter((product: any) => {
      const effectivePrice = product.discountPrice ?? product.price;

      const matchesBrand =
        !activeFilters.brands.length ||
        (!!product.brand && activeFilters.brands.includes(product.brand));

      const matchesMin =
        typeof activeFilters.minPrice !== "number" ||
        effectivePrice >= activeFilters.minPrice;

      const matchesMax =
        typeof activeFilters.maxPrice !== "number" ||
        effectivePrice <= activeFilters.maxPrice;

      const productCategoryId =
        product.category?._id?.toString() || product.category?.toString();

      const matchesCategory =
        !activeFilters.category || productCategoryId === activeFilters.category;

      const matchesType =
        !activeFilters.type ||
        (product.sections || []).includes(activeFilters.type);

      const matchesTags =
        !activeFilters.tags.length ||
        activeFilters.tags.every((tag: string) =>
          (product.sections || []).includes(tag)
        );

      return (
        matchesBrand &&
        matchesMin &&
        matchesMax &&
        matchesCategory &&
        matchesType &&
        matchesTags
      );
    });

    switch (sortBy) {
      case "price-low":
        return [...filtered].sort(
          (first, second) =>
            (first.discountPrice ?? first.price) -
            (second.discountPrice ?? second.price)
        );
      case "price-high":
        return [...filtered].sort(
          (first, second) =>
            (second.discountPrice ?? second.price) -
            (first.discountPrice ?? first.price)
        );
      case "name":
        return [...filtered].sort((first, second) =>
          first.name.localeCompare(second.name)
        );
      case "recommended":
      default:
        return filtered;
    }
  }, [activeFilters, products, sortBy]);

  const activeChips = useMemo(
    () => getActiveFilterChips(activeFilters, allCategories),
    [activeFilters, allCategories]
  );

  const removeChip = (
    type: keyof ActiveFilters | "tag" | "brand",
    value?: string
  ) => {
    setActiveFilters((prev: any) => {
      if (type === "category") return { ...prev, category: undefined };
      if (type === "type") return { ...prev, type: undefined };
      if (type === "tag" && value) {
        return { ...prev, tags: (prev.tags as string[]).filter((tag: string) => tag !== value) };
      }
      if (type === "brand" && value) {
        return { ...prev, brands: (prev.brands as string[]).filter((b: string) => b !== value) };
      }
      if (type === "minPrice") {
        return { ...prev, minPrice: undefined, maxPrice: undefined };
      }
      return prev;
    });
  };

  const toggleBrand = (brand: string) => {
    setActiveFilters((prev: any) => ({
      ...prev,
      brands: prev.brands.includes(brand)
        ? prev.brands.filter((item: string) => item !== brand)
        : [...prev.brands, brand],
    }));
  };

  const toggleTag = (tag: string) => {
    setActiveFilters((prev: any) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((item: string) => item !== tag)
        : [...prev.tags, tag],
    }));
  };

  return (
    <section className="bg-[#f8f6f1] py-8 md:py-10 mt-16">
      <div className="mx-auto max-w-[1880px] px-4 md:px-8 xl:px-12">
        <div className="grid gap-8 xl:grid-cols-[270px_minmax(0,1fr)]">
          <aside className="hidden xl:block xl:self-start xl:sticky xl:top-24">
            <ExploreFilters
              activeFilters={activeFilters}
              setActiveFilters={setActiveFilters}
              openSections={openSections}
              setOpenSections={setOpenSections}
              allCategories={allCategories}
              availableTypes={availableTypes}
              availableTags={availableTags}
              availableBrands={availableBrands}
              formatFilterLabel={formatFilterLabel}
              toggleBrand={toggleBrand}
              toggleTag={toggleTag}
            />
          </aside>

          <div className="space-y-6">
            <ExploreHeader
              title={collectionTitle}
              description={collectionDescription}
              bannerImage={bannerImage}
              productCount={products.length}
              typeLabel="Curated collection"
              activeChips={activeChips}
            />

            <ExploreControls
              sortBy={sortBy}
              onSortChange={(val) => setSortBy(val)}
              onMobileFilterOpen={() => setMobileFiltersOpen(true)}
              resultCount={filteredProducts.length}
              activeChips={activeChips}
              onRemoveChip={removeChip}
            />

            {error ? (
              <div className="rounded-[28px] border border-red-200 bg-red-50 p-6 text-red-700 text-center">
                <p className="text-base font-semibold">
                  We could not load this collection.
                </p>
                <p className="mt-2 text-sm">{error}</p>
                <button
                  type="button"
                  onClick={() => void loadData()}
                  className="mt-4 rounded-full bg-red-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-red-700"
                >
                  Try again
                </button>
              </div>
            ) : (
              <ExploreGrid
                products={filteredProducts}
                fallbackImage={FALLBACK_PRODUCT_IMAGE}
                categoryTitle={collectionTitle}
              />
            )}
          </div>
        </div>
      </div>

      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 bg-black/35 xl:hidden">
          <div className="ml-auto h-full w-full max-w-sm overflow-y-auto bg-[#f8f6f1] p-4 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-black">Filters</h2>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="rounded-full border border-black/15 p-2 text-black"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <ExploreFilters
              activeFilters={activeFilters}
              setActiveFilters={setActiveFilters}
              openSections={openSections}
              setOpenSections={setOpenSections}
              allCategories={allCategories}
              availableTypes={availableTypes}
              availableTags={availableTags}
              availableBrands={availableBrands}
              formatFilterLabel={formatFilterLabel}
              toggleBrand={toggleBrand}
              toggleTag={toggleTag}
            />
          </div>
        </div>
      )}
    </section>
  );
}
