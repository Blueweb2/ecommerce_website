"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ChevronDown,
  Heart,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { use, useCallback, useEffect, useMemo, useState } from "react";
import { collectionAPI } from "@/lib/api/collection.api";
import { Collection } from "@/types/collection";
import { Product } from "@/types/product";

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

type FilterSectionProps = {
  title: string;
  summary: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
};

function resolveImageUrl(
  image: Collection["bannerImage"] | Collection["image"]
) {
  if (!image) return FALLBACK_BANNER;
  if (typeof image === "string") return image || FALLBACK_BANNER;
  return image.url || FALLBACK_BANNER;
}

function formatFilterLabel(value?: string) {
  if (!value) return "All";

  if (/^[a-f0-9]{24}$/i.test(value)) {
    return "Selected";
  }

  return value
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getProductImage(product: Product) {
  return product.images?.[0]?.url || FALLBACK_PRODUCT_IMAGE;
}

function getActiveFilterChips(filters: ActiveFilters) {
  const chips: { key: string; label: string; onRemove: keyof ActiveFilters | "tag" | "brand"; value?: string }[] = [];

  if (filters.category) {
    chips.push({
      key: `category-${filters.category}`,
      label: formatFilterLabel(filters.category),
      onRemove: "category",
    });
  }

  if (filters.type) {
    chips.push({
      key: `type-${filters.type}`,
      label: formatFilterLabel(filters.type),
      onRemove: "type",
    });
  }

  filters.tags.forEach((tag) => {
    chips.push({
      key: `tag-${tag}`,
      label: formatFilterLabel(tag),
      onRemove: "tag",
      value: tag,
    });
  });

  filters.brands.forEach((brand) => {
    chips.push({
      key: `brand-${brand}`,
      label: brand,
      onRemove: "brand",
      value: brand,
    });
  });

  return chips;
}

function FilterSection({
  title,
  summary,
  open,
  onToggle,
  children,
}: FilterSectionProps) {
  return (
    <div className="border-b border-black/12 py-6">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-start justify-between gap-4 text-left"
      >
        <div>
          <p className="text-[15px] font-semibold uppercase tracking-[0.02em] text-black">
            {title}
          </p>
          <p className="mt-1 text-[15px] text-black/55">{summary}</p>
        </div>
        <ChevronDown
          className={`mt-1 h-5 w-5 text-black transition ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open ? <div className="mt-4 space-y-3">{children}</div> : null}
    </div>
  );
}

function CollectionPageSkeleton() {
  return (
    <section className="bg-[#f8f6f1] py-8 md:py-10">
      <div className="mx-auto max-w-[1880px] px-4 md:px-8 xl:px-12">
        <div className="grid gap-8 xl:grid-cols-[270px_minmax(0,1fr)]">
          <aside className="hidden xl:block">
            <div className="rounded-[32px] border border-black/8 bg-white px-6 py-5">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="border-b border-black/10 py-5 last:border-b-0"
                >
                  <div className="h-4 w-28 animate-pulse rounded-full bg-neutral-200" />
                  <div className="mt-3 h-4 w-20 animate-pulse rounded-full bg-neutral-200" />
                </div>
              ))}
            </div>
          </aside>

          <div className="space-y-6">
            <div className="grid gap-4 rounded-[32px] border border-black/8 bg-white p-6 md:grid-cols-[1.2fr_0.8fr] md:p-8">
              <div className="space-y-4">
                <div className="h-3 w-24 animate-pulse rounded-full bg-neutral-200" />
                <div className="h-10 w-2/3 animate-pulse rounded-full bg-neutral-200" />
                <div className="h-4 w-full animate-pulse rounded-full bg-neutral-200" />
                <div className="h-4 w-3/4 animate-pulse rounded-full bg-neutral-200" />
              </div>
              <div className="h-52 animate-pulse rounded-[28px] bg-neutral-200" />
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="h-12 w-44 animate-pulse rounded-full bg-neutral-200" />
              <div className="h-12 w-40 animate-pulse rounded-full bg-neutral-200" />
            </div>

            <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 2xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="space-y-3">
                  <div className="aspect-[0.92] animate-pulse rounded-[12px] bg-neutral-200" />
                  <div className="h-4 w-1/3 animate-pulse rounded-full bg-neutral-200" />
                  <div className="h-4 w-5/6 animate-pulse rounded-full bg-neutral-200" />
                  <div className="h-4 w-1/2 animate-pulse rounded-full bg-neutral-200" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function CollectionPage({ params }: CollectionPageProps) {
  const { slug } = use(params);

  const [collection, setCollection] = useState<Collection | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("recommended");
  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
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

  const loadCollection = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await collectionAPI.getBySlug(slug);

      if (!data.success) {
        throw new Error("Failed to load collection.");
      }

      setCollection(data.collection);
      setProducts(Array.isArray(data.products) ? data.products : []);
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
    void loadCollection();
  }, [loadCollection]);

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
      new Set(products.map((product) => product.brand).filter(Boolean))
    ) as string[];
  }, [products]);

  const filteredProducts = useMemo(() => {
    const filtered = products.filter((product) => {
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

      return matchesBrand && matchesMin && matchesMax;
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
  }, [activeFilters.brands, activeFilters.maxPrice, activeFilters.minPrice, products, sortBy]);

  const activeChips = useMemo(
    () => getActiveFilterChips(activeFilters),
    [activeFilters]
  );

  const removeChip = (type: keyof ActiveFilters | "tag" | "brand", value?: string) => {
    setActiveFilters((prev) => {
      if (type === "category") {
        return { ...prev, category: undefined };
      }

      if (type === "type") {
        return { ...prev, type: undefined };
      }

      if (type === "tag" && value) {
        return {
          ...prev,
          tags: prev.tags.filter((tag) => tag !== value),
        };
      }

      if (type === "brand" && value) {
        return {
          ...prev,
          brands: prev.brands.filter((brand) => brand !== value),
        };
      }

      return prev;
    });
  };

  const toggleBrand = (brand: string) => {
    setActiveFilters((prev) => ({
      ...prev,
      brands: prev.brands.includes(brand)
        ? prev.brands.filter((item) => item !== brand)
        : [...prev.brands, brand],
    }));
  };

  const filterRail = (
    <div className="rounded-[32px] border border-black/10 bg-white px-6 py-4">
      <FilterSection
        title="Category"
        summary={formatFilterLabel(activeFilters.category)}
        open={openSections.category}
        onToggle={() =>
          setOpenSections((prev) => ({ ...prev, category: !prev.category }))
        }
      >
        {activeFilters.category ? (
          <button
            type="button"
            onClick={() => removeChip("category")}
            className="inline-flex items-center gap-2 rounded-full border border-black/12 px-4 py-2 text-sm text-black/80 transition hover:border-black"
          >
            {formatFilterLabel(activeFilters.category)}
            <X className="h-4 w-4" />
          </button>
        ) : (
          <p className="text-sm text-black/55">All categories</p>
        )}
      </FilterSection>

      <FilterSection
        title="Type"
        summary={formatFilterLabel(activeFilters.type)}
        open={openSections.type}
        onToggle={() =>
          setOpenSections((prev) => ({ ...prev, type: !prev.type }))
        }
      >
        {activeFilters.type ? (
          <button
            type="button"
            onClick={() => removeChip("type")}
            className="inline-flex items-center gap-2 rounded-full border border-black/12 px-4 py-2 text-sm text-black/80 transition hover:border-black"
          >
            {formatFilterLabel(activeFilters.type)}
            <X className="h-4 w-4" />
          </button>
        ) : (
          <p className="text-sm text-black/55">Any type</p>
        )}
      </FilterSection>

      <FilterSection
        title="Trending"
        summary={
          activeFilters.tags.length
            ? formatFilterLabel(activeFilters.tags[0])
            : "All"
        }
        open={openSections.trending}
        onToggle={() =>
          setOpenSections((prev) => ({ ...prev, trending: !prev.trending }))
        }
      >
        {activeFilters.tags.length ? (
          <div className="flex flex-wrap gap-2">
            {activeFilters.tags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => removeChip("tag", tag)}
                className="inline-flex items-center gap-2 rounded-full border border-black/12 px-4 py-2 text-sm text-black/80 transition hover:border-black"
              >
                {formatFilterLabel(tag)}
                <X className="h-4 w-4" />
              </button>
            ))}
          </div>
        ) : (
          <p className="text-sm text-black/55">All</p>
        )}
      </FilterSection>

      <FilterSection
        title="Designer"
        summary={activeFilters.brands[0] || "All"}
        open={openSections.designer}
        onToggle={() =>
          setOpenSections((prev) => ({ ...prev, designer: !prev.designer }))
        }
      >
        {availableBrands.length ? (
          <div className="space-y-2">
            {availableBrands.map((brand) => {
              const checked = activeFilters.brands.includes(brand);

              return (
                <label
                  key={brand}
                  className="flex items-center gap-3 text-sm text-black/80"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleBrand(brand)}
                    className="h-4 w-4 accent-black"
                  />
                  {brand}
                </label>
              );
            })}
          </div>
        ) : (
          <p className="text-sm text-black/55">All</p>
        )}
      </FilterSection>

      <FilterSection
        title="Price"
        summary={
          typeof activeFilters.minPrice === "number" ||
          typeof activeFilters.maxPrice === "number"
            ? `${activeFilters.minPrice ?? 0} - ${activeFilters.maxPrice ?? "Any"}`
            : "All"
        }
        open={openSections.price}
        onToggle={() =>
          setOpenSections((prev) => ({ ...prev, price: !prev.price }))
        }
      >
        <div className="grid grid-cols-2 gap-3">
          <input
            type="number"
            min="0"
            value={activeFilters.minPrice ?? ""}
            onChange={(event) =>
              setActiveFilters((prev) => ({
                ...prev,
                minPrice:
                  event.target.value === ""
                    ? undefined
                    : Number(event.target.value),
              }))
            }
            placeholder="Min"
            className="rounded-[10px] border border-black/12 px-3 py-2 text-sm outline-none transition focus:border-black"
          />
          <input
            type="number"
            min="0"
            value={activeFilters.maxPrice ?? ""}
            onChange={(event) =>
              setActiveFilters((prev) => ({
                ...prev,
                maxPrice:
                  event.target.value === ""
                    ? undefined
                    : Number(event.target.value),
              }))
            }
            placeholder="Max"
            className="rounded-[10px] border border-black/12 px-3 py-2 text-sm outline-none transition focus:border-black"
          />
        </div>
      </FilterSection>
    </div>
  );

  if (loading && !collection && !products.length) {
    return <CollectionPageSkeleton />;
  }

  return (
    <section className="bg-[#f8f6f1] py-8 md:py-10">
      <div className="mx-auto max-w-[1880px] px-4 md:px-8 xl:px-12">
        <div className="grid gap-8 xl:grid-cols-[270px_minmax(0,1fr)]">
          <aside className="hidden xl:block xl:self-start xl:sticky xl:top-8">
            {filterRail}
          </aside>

          <div className="space-y-6">
            <div className="grid gap-5 rounded-[32px] border border-black/10 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.05)] md:grid-cols-[1.15fr_0.85fr] md:p-8">
              <div className="flex flex-col justify-between">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-black/45">
                    Curated collection
                  </p>
                  <h1 className="mt-3 text-3xl font-semibold tracking-tight text-black md:text-5xl">
                    {collectionTitle}
                  </h1>
                  <p className="mt-4 max-w-2xl text-sm leading-7 text-black/60 md:text-base">
                    {collectionDescription}
                  </p>
                </div>

                <div className="mt-6 flex flex-wrap gap-2">
                  {activeChips.slice(0, 4).map((chip) => (
                    <span
                      key={chip.key}
                      className="rounded-full border border-black/10 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.12em] text-black/70"
                    >
                      {chip.label}
                    </span>
                  ))}
                </div>
              </div>

              <div className="relative min-h-[220px] overflow-hidden rounded-[28px] bg-[#eeece4]">
                <Image
                  src={bannerImage}
                  alt={collectionTitle}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 35vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.18)_0%,rgba(255,255,255,0.02)_55%,rgba(0,0,0,0.08)_100%)]" />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setMobileFiltersOpen(true)}
                    className="inline-flex items-center gap-3 rounded-[4px] border border-black/15 bg-white px-4 py-3 text-[15px] text-black xl:hidden"
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                    Filter
                  </button>

                  <div className="inline-flex items-center gap-3 rounded-[4px] border border-black/15 bg-white px-4 py-3 text-[15px] text-black">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-black text-white">
                      <span className="text-[10px]">−</span>
                    </div>
                    <span>Filter</span>
                    <span className="text-black/45">|</span>
                    <span className="text-black/65">{filteredProducts.length} Results</span>
                  </div>
                </div>

                <label className="relative inline-flex min-w-[190px] items-center">
                  <select
                    value={sortBy}
                    onChange={(event) =>
                      setSortBy(event.target.value as SortOption)
                    }
                    className="w-full appearance-none rounded-[4px] border border-black/15 bg-white px-4 py-3 pr-11 text-[15px] text-black outline-none transition focus:border-black"
                  >
                    <option value="recommended">Recommended</option>
                    <option value="price-low">Price low to high</option>
                    <option value="price-high">Price high to low</option>
                    <option value="name">Name A-Z</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 h-4 w-4 text-black" />
                </label>
              </div>

              {activeChips.length ? (
                <div className="flex flex-wrap gap-2">
                  {activeChips.map((chip) => (
                    <button
                      key={chip.key}
                      type="button"
                      onClick={() => removeChip(chip.onRemove, chip.value)}
                      className="inline-flex items-center gap-3 rounded-[4px] border border-black/15 bg-white px-4 py-3 text-[15px] text-black transition hover:border-black"
                    >
                      {chip.label}
                      <X className="h-4 w-4" />
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            {error ? (
              <div className="rounded-[28px] border border-red-200 bg-red-50 p-6 text-red-700">
                <p className="text-base font-semibold">
                  We could not load this collection.
                </p>
                <p className="mt-2 text-sm">{error}</p>
                <button
                  type="button"
                  onClick={() => void loadCollection()}
                  className="mt-4 rounded-full bg-red-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-red-700"
                >
                  Try again
                </button>
              </div>
            ) : filteredProducts.length ? (
              <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-3 2xl:grid-cols-4">
                {filteredProducts.map((product) => (
                  <article key={product._id} className="group">
                    <Link href={`/product/${product.slug}`} className="block">
                      <div className="relative aspect-[0.92] overflow-hidden bg-[#f1eee8]">
                        <Image
                          src={getProductImage(product)}
                          alt={product.name}
                          fill
                          sizes="(max-width: 768px) 48vw, (max-width: 1536px) 30vw, 22vw"
                          className="object-cover transition duration-500 group-hover:scale-[1.03]"
                        />
                        <button
                          type="button"
                          aria-label={`Save ${product.name}`}
                          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-black shadow-sm backdrop-blur-sm transition hover:scale-105"
                        >
                          <Heart className="h-4 w-4" />
                        </button>
                      </div>
                    </Link>

                    <div className="pt-4">
                      <p className="text-[13px] font-semibold uppercase tracking-[0.03em] text-black">
                        {product.brand || collectionTitle}
                      </p>
                      <Link
                        href={`/product/${product.slug}`}
                        className="mt-2 line-clamp-2 block text-[15px] leading-6 text-black/72 underline-offset-4 transition hover:text-black hover:underline"
                      >
                        {product.name}
                      </Link>
                      <div className="mt-3 flex items-center gap-2 text-[15px]">
                        {product.discountPrice &&
                        product.discountPrice < product.price ? (
                          <>
                            <span className="font-semibold text-black">
                              Rs. {product.discountPrice}
                            </span>
                            <span className="text-black/40 line-through">
                              Rs. {product.price}
                            </span>
                          </>
                        ) : (
                          <span className="font-semibold text-black">
                            Rs. {product.price}
                          </span>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="rounded-[28px] border border-dashed border-black/15 bg-white px-6 py-16 text-center">
                <h2 className="text-xl font-semibold text-black">
                  No products found
                </h2>
                <p className="mt-2 text-sm text-black/55">
                  Try changing or clearing the selected filters.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {mobileFiltersOpen ? (
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
            {filterRail}
          </div>
        </div>
      ) : null}
    </section>
  );
}
