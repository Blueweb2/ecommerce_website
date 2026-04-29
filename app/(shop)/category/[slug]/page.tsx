"use client";

import { useSearchParams } from "next/navigation";
import { use, useCallback, useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import { categoryAPI } from "@/lib/api/category.api";
import { productAPI } from "@/lib/api/product.api";
import { Category } from "@/types/category";
import { Product } from "@/types/product";

import ExploreHeader from "@/components/explore/ExploreHeader";
import ExploreFilters from "@/components/explore/ExploreFilters";
import ExploreGrid from "@/components/explore/ExploreGrid";
import ExploreControls from "@/components/explore/ExploreControls";

const FALLBACK_BANNER = "/home/herosection/hero-center.png";
const FALLBACK_PRODUCT_IMAGE = "/home/categorysection/category-one.png";

type CategoryPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

type SortOption = "recommended" | "price-low" | "price-high" | "name";

type ActiveFilters = {
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

export default function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = use(params);

  const [category, setCategory] = useState<Category | null>(null);
  const [allCategories, setAllCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const searchParams = useSearchParams();
  const filterCategory = searchParams?.get("filterCategory");
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

      const [catRes, prodRes, allCatsRes] = await Promise.all([
        categoryAPI.getBySlug(slug),
        productAPI.getAll({ category: slug, limit: 50 }),
        categoryAPI.getAll(),
      ]);

      setCategory(catRes.data.data);
      setProducts(prodRes.data.data.products || []);
      setAllCategories(allCatsRes.data.data || []);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to load this category right now.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  useEffect(() => {
    if (filterCategory) {
      setActiveFilters((prev: any) => ({
        ...prev,
        category: filterCategory,
      }));
    }
  }, [filterCategory]);

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

  const availableTags = useMemo(() => availableTypes, [availableTypes]);

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

      const productCategoryId = product.category?._id?.toString() || product.category?.toString();

      const matchesCategory =
        !activeFilters.category ||
        productCategoryId === activeFilters.category;

      const matchesType =
        !(activeFilters as any).type ||
        (product.sections || []).includes((activeFilters as any).type);

      const matchesTags =
        !((activeFilters as any).tags || []).length ||
        ((activeFilters as any).tags || []).every((tag: string) =>
          (product.sections || []).includes(tag)
        );

      return (
        matchesBrand &&
        matchesMin &&
        matchesMax &&
        matchesType &&
        matchesTags &&
        matchesCategory
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
      tags: (prev.tags || []).includes(tag)
        ? prev.tags.filter((item: string) => item !== tag)
        : [...(prev.tags || []), tag],
    }));
  };

  const removeChip = (type: string, value?: string) => {
    setActiveFilters((prev: any) => {
      if (type === "brand" && value) {
        return {
          ...prev,
          brands: (prev.brands as string[]).filter((brand: string) => brand !== value),
        };
      }
      if (type === "type") return { ...prev, type: undefined };
      if (type === "tag" && value) {
        return {
          ...prev,
          tags: (prev.tags as string[]).filter((tag: string) => tag !== value),
        };
      }
      if (type === "price") {
        return { ...prev, minPrice: undefined, maxPrice: undefined };
      }
      return prev;
    });
  };

  const activeChips = useMemo(() => {
    const chips: {
      key: string;
      label: string;
      onRemove: string;
      value?: string;
    }[] = [];

    if ((activeFilters as any).category) {
      const catName = allCategories.find(c => c._id === (activeFilters as any).category)?.name || formatFilterLabel((activeFilters as any).category);
      chips.push({
        key: "category",
        label: catName,
        onRemove: "category",
      });
    }

    activeFilters.brands.forEach((brand: string) => {
      chips.push({
        key: `brand-${brand}`,
        label: brand,
        onRemove: "brand",
        value: brand,
      });
    });

    if ((activeFilters as any).type) {
      chips.push({
        key: `type-${(activeFilters as any).type}`,
        label: formatFilterLabel((activeFilters as any).type),
        onRemove: "type",
      });
    }

    ((activeFilters as any).tags || []).forEach((tag: string) => {
      chips.push({
        key: `tag-${tag}`,
        label: formatFilterLabel(tag),
        onRemove: "tag",
        value: tag,
      });
    });

    if (
      typeof activeFilters.minPrice === "number" ||
      typeof activeFilters.maxPrice === "number"
    ) {
      chips.push({
        key: "price-range",
        label: `${activeFilters.minPrice ?? 0} - ${
          activeFilters.maxPrice ?? "Any"
        }`,
        onRemove: "price",
      });
    }

    return chips;
  }, [activeFilters, allCategories]);

  const categoryTitle = category?.name || formatFilterLabel(slug);
  const categoryDescription =
    category?.description ||
    `Explore our curated selection of products in ${categoryTitle}.`;
  const bannerImage = category?.image?.url || FALLBACK_BANNER;

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
            {/* <ExploreHeader
              title={categoryTitle}
              description={categoryDescription}
              bannerImage={bannerImage}
              productCount={products.length}
              typeLabel="Category Explore"
              activeChips={activeChips}
            /> */}

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
                  We could not load this category.
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
                categoryTitle={categoryTitle}
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