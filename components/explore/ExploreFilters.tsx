"use client";

import { RotateCcw, Sparkles } from "lucide-react";
import { inter } from "@/lib/fonts";
import FilterSection from "./FilterSection";

type ExploreFiltersProps = {
  activeFilters: any;
  setActiveFilters: (filters: any) => void;
  openSections: any;
  setOpenSections: (sections: any) => void;
  allCategories?: any[];
  availableTypes: string[];
  availableTags: string[];
  availableBrands: string[];
  formatFilterLabel: (val?: string) => string;
  toggleBrand: (brand: string) => void;
  toggleTag: (tag: string) => void;
};

const PRICE_PRESETS = [
  { label: "Under 2,000", min: undefined, max: 2000 },
  { label: "2,000 - 5,000", min: 2000, max: 5000 },
  { label: "5,000 - 10,000", min: 5000, max: 10000 },
  { label: "10,000+", min: 10000, max: undefined },
];

function OptionRow({
  checked,
  label,
  onSelect,
  type = "radio",
}: {
  checked: boolean;
  label: string;
  onSelect: () => void;
  type?: "radio" | "checkbox";
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex w-full items-center gap-3 rounded-2xl border px-3 py-3 text-left text-sm transition ${
        checked
          ? "border-black bg-white text-black shadow-[0_10px_30px_rgba(0,0,0,0.05)]"
          : "border-black/8 bg-white/60 text-black/70 hover:border-black/20 hover:bg-white"
      }`}
    >
      <span
        className={`flex h-4 w-4 items-center justify-center rounded-full border transition ${
          checked ? "border-black bg-black" : "border-black/25 bg-transparent"
        }`}
      >
        {type === "checkbox" ? (
          <span
            className={`h-1.5 w-1.5 rounded-sm bg-white transition ${
              checked ? "opacity-100" : "opacity-0"
            }`}
          />
        ) : (
          <span
            className={`h-1.5 w-1.5 rounded-full bg-white transition ${
              checked ? "opacity-100" : "opacity-0"
            }`}
          />
        )}
      </span>
      <span className="flex-1">{label}</span>
    </button>
  );
}

function MiniChip({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-xs tracking-[0.02em] transition ${
        active
          ? "border-black bg-black text-white"
          : "border-black/12 bg-white text-black/70 hover:border-black/35"
      }`}
    >
      {label}
    </button>
  );
}

export default function ExploreFilters({
  activeFilters,
  setActiveFilters,
  openSections,
  setOpenSections,
  allCategories = [],
  availableTypes,
  availableTags,
  availableBrands,
  formatFilterLabel,
  toggleBrand,
  toggleTag,
}: ExploreFiltersProps) {
  const hasPriceFilter =
    typeof activeFilters.minPrice === "number" ||
    typeof activeFilters.maxPrice === "number";

  const totalActiveFilters =
    (activeFilters.category ? 1 : 0) +
    (activeFilters.type ? 1 : 0) +
    (activeFilters.tags?.length || 0) +
    (activeFilters.brands?.length || 0) +
    (hasPriceFilter ? 1 : 0);

  const hasActiveFilters = totalActiveFilters > 0;

  const clearAll = () => {
    setActiveFilters((prev: any) => ({
      ...prev,
      category: undefined,
      type: undefined,
      tags: [],
      brands: [],
      minPrice: undefined,
      maxPrice: undefined,
    }));
  };

  const setPriceRange = (min?: number, max?: number) => {
    setActiveFilters((prev: any) => ({
      ...prev,
      minPrice: min,
      maxPrice: max,
    }));
  };

  return (
    <div className="overflow-hidden rounded-[28px] border border-black/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(247,243,236,0.96))] shadow-[0_24px_70px_rgba(15,23,42,0.06)]">
      <div className="border-b border-black/8 px-6 pb-5 pt-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.26em] text-black/45">
              Refine Results
            </p>
            <h2 className="mt-2 text-[26px] font-medium tracking-tight text-neutral-700">
              Filters
            </h2>
            <p className={`${inter.className} mt-2 text-sm leading-6 text-black/55`}>
              Narrow the collection by category, product type, style tags, designer, and budget.
            </p>
          </div>

          {hasActiveFilters ? (
            <button
              type="button"
              onClick={clearAll}
              className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-2 text-xs font-medium uppercase tracking-[0.16em] text-black/65 transition hover:border-black/25 hover:text-black"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </button>
          ) : null}
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-black px-3 py-1.5 text-xs uppercase tracking-[0.14em] text-white">
            <Sparkles className="h-3.5 w-3.5" />
            {hasActiveFilters ? `${totalActiveFilters} active` : "All products"}
          </div>

          {activeFilters.category ? (
            <span className="rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs text-black/65">
              {allCategories.find((category) => category._id === activeFilters.category)?.name ||
                "Selected category"}
            </span>
          ) : null}

          {activeFilters.type ? (
            <span className="rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs text-black/65">
              {formatFilterLabel(activeFilters.type)}
            </span>
          ) : null}

          {hasPriceFilter ? (
            <span className="rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs text-black/65">
              Rs. {activeFilters.minPrice ?? 0} to {activeFilters.maxPrice ?? "Any"}
            </span>
          ) : null}
        </div>
      </div>

      <div className="px-6 pb-4">
        {allCategories.length > 0 && (
          <FilterSection
            title="Category"
            summary={
              activeFilters.category
                ? allCategories.find((category) => category._id === activeFilters.category)?.name || "Selected"
                : "All categories"
            }
            meta={`${allCategories.length} options`}
            open={openSections.category}
            onToggle={() =>
              setOpenSections((prev: any) => ({
                ...prev,
                category: !prev.category,
              }))
            }
            onClear={
              activeFilters.category
                ? () =>
                    setActiveFilters((prev: any) => ({
                      ...prev,
                      category: undefined,
                    }))
                : undefined
            }
          >
            <div className={`${inter.className} max-h-64 space-y-2 overflow-y-auto pr-2 custom-scrollbar`}>
              <OptionRow
                checked={!activeFilters.category}
                label="All Categories"
                onSelect={() =>
                  setActiveFilters((prev: any) => ({
                    ...prev,
                    category: undefined,
                  }))
                }
              />

              {allCategories.map((category) => (
                <OptionRow
                  key={category._id}
                  checked={activeFilters.category === category._id}
                  label={category.name}
                  onSelect={() =>
                    setActiveFilters((prev: any) => ({
                      ...prev,
                      category: category._id,
                    }))
                  }
                />
              ))}
            </div>
          </FilterSection>
        )}

        <FilterSection
          title="Type"
          summary={formatFilterLabel(activeFilters.type)}
          meta={`${availableTypes.length || 0} options`}
          open={openSections.type}
          onToggle={() =>
            setOpenSections((prev: any) => ({ ...prev, type: !prev.type }))
          }
          onClear={
            activeFilters.type
              ? () =>
                  setActiveFilters((prev: any) => ({
                    ...prev,
                    type: undefined,
                  }))
              : undefined
          }
        >
          <div className="space-y-2">
            <OptionRow
              checked={!activeFilters.type}
              label="Any Type"
              onSelect={() =>
                setActiveFilters((prev: any) => ({
                  ...prev,
                  type: undefined,
                }))
              }
            />

            <div className="max-h-64 space-y-2 overflow-y-auto pr-2 custom-scrollbar">
              {availableTypes.map((type) => (
                <OptionRow
                  key={type}
                  checked={activeFilters.type === type}
                  label={formatFilterLabel(type)}
                  onSelect={() =>
                    setActiveFilters((prev: any) => ({
                      ...prev,
                      type,
                    }))
                  }
                />
              ))}
            </div>
          </div>
        </FilterSection>

        <FilterSection
          title="Trending"
          summary={
            activeFilters.tags.length
              ? `${activeFilters.tags.length} selected`
              : "Pick style tags"
          }
          meta={`${availableTags.length || 0} tags`}
          open={openSections.trending}
          onToggle={() =>
            setOpenSections((prev: any) => ({
              ...prev,
              trending: !prev.trending,
            }))
          }
          onClear={
            activeFilters.tags.length
              ? () =>
                  setActiveFilters((prev: any) => ({
                    ...prev,
                    tags: [],
                  }))
              : undefined
          }
        >
          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => (
              <MiniChip
                key={tag}
                active={activeFilters.tags.includes(tag)}
                label={formatFilterLabel(tag)}
                onClick={() => toggleTag(tag)}
              />
            ))}
          </div>
        </FilterSection>

        <FilterSection
          title="Designer"
          summary={
            activeFilters.brands.length
              ? `${activeFilters.brands.length} selected`
              : "All designers"
          }
          meta={`${availableBrands.length || 0} designers`}
          open={openSections.designer}
          onToggle={() =>
            setOpenSections((prev: any) => ({
              ...prev,
              designer: !prev.designer,
            }))
          }
          onClear={
            activeFilters.brands.length
              ? () =>
                  setActiveFilters((prev: any) => ({
                    ...prev,
                    brands: [],
                  }))
              : undefined
          }
        >
          {availableBrands.length ? (
            <div className="max-h-64 space-y-2 overflow-y-auto pr-2 custom-scrollbar">
              {availableBrands.map((brand) => (
                <OptionRow
                  key={brand}
                  checked={activeFilters.brands.includes(brand)}
                  label={brand}
                  type="checkbox"
                  onSelect={() => toggleBrand(brand)}
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-black/50">Designer names will appear here as products load.</p>
          )}
        </FilterSection>

        <FilterSection
          title="Price"
          summary={
            hasPriceFilter
              ? `Rs. ${activeFilters.minPrice ?? 0} to ${activeFilters.maxPrice ?? "Any"}`
              : "Choose your range"
          }
          open={openSections.price}
          onToggle={() =>
            setOpenSections((prev: any) => ({ ...prev, price: !prev.price }))
          }
          onClear={hasPriceFilter ? () => setPriceRange(undefined, undefined) : undefined}
        >
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {PRICE_PRESETS.map((preset) => {
                const isActive =
                  activeFilters.minPrice === preset.min &&
                  activeFilters.maxPrice === preset.max;

                return (
                  <MiniChip
                    key={preset.label}
                    active={isActive}
                    label={preset.label}
                    onClick={() => setPriceRange(preset.min, preset.max)}
                  />
                );
              })}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <label className="space-y-2">
                <span className="text-[11px] uppercase tracking-[0.18em] text-black/45">
                  Min Price
                </span>
                <input
                  type="number"
                  min="0"
                  value={activeFilters.minPrice ?? ""}
                  onChange={(event) =>
                    setActiveFilters((prev: any) => ({
                      ...prev,
                      minPrice:
                        event.target.value === ""
                          ? undefined
                          : Number(event.target.value),
                    }))
                  }
                  placeholder="0"
                  className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-black/35"
                />
              </label>

              <label className="space-y-2">
                <span className="text-[11px] uppercase tracking-[0.18em] text-black/45">
                  Max Price
                </span>
                <input
                  type="number"
                  min="0"
                  value={activeFilters.maxPrice ?? ""}
                  onChange={(event) =>
                    setActiveFilters((prev: any) => ({
                      ...prev,
                      maxPrice:
                        event.target.value === ""
                          ? undefined
                          : Number(event.target.value),
                    }))
                  }
                  placeholder="Any"
                  className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-black/35"
                />
              </label>
            </div>
          </div>
        </FilterSection>
      </div>
    </div>
  );
}
