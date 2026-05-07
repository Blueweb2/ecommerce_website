"use client";

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
  return (
    <div className="border border-black/10 bg-gray-50 px-6 py-4">
      {allCategories.length > 0 && (
        <FilterSection
          title="Category"
          summary={
            activeFilters.category
              ? allCategories.find((c) => c._id === activeFilters.category)
                  ?.name || "Selected"
              : "All"
          }
          open={openSections.category}
          onToggle={() =>
            setOpenSections((prev: any) => ({
              ...prev,
              category: !prev.category,
            }))
          }
        >
          <div className={`${inter.className} text-[#8D8B9D] space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar`}>
            <label className="flex items-center gap-3 text-sm cursor-pointer">
              <input
                type="radio"
                name="category"
                checked={!activeFilters.category}
                onChange={() =>
                  setActiveFilters((prev: any) => ({
                    ...prev,
                    category: undefined,
                  }))
                }
                className="h-4 w-4 accent-black"
              />
              All Categories
            </label>
            {allCategories.map((cat) => (
              <label
                key={cat._id}
                className="flex items-center gap-3 text-sm cursor-pointer"
              >
                <input
                  type="radio"
                  name="category"
                  checked={activeFilters.category === cat._id}
                  onChange={() =>
                    setActiveFilters((prev: any) => ({
                      ...prev,
                      category: cat._id,
                    }))
                  }
                  className="h-4 w-4 accent-black"
                />
                {cat.name}
              </label>
            ))}
          </div>
        </FilterSection>
      )}

      <FilterSection
        title="Type"
        summary={formatFilterLabel(activeFilters.type)}
        open={openSections.type}
        onToggle={() =>
          setOpenSections((prev: any) => ({ ...prev, type: !prev.type }))
        }
      >
        <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
          <label className="flex items-center gap-3 text-sm text-black/80 cursor-pointer">
            <input
              type="radio"
              name="type"
              checked={!activeFilters.type}
              onChange={() =>
                setActiveFilters((prev: any) => ({ ...prev, type: undefined }))
              }
              className="h-4 w-4 accent-black"
            />
            Any Type
          </label>
          {availableTypes.map((type) => (
            <label
              key={type}
              className="flex items-center gap-3 text-sm text-black/80 cursor-pointer"
            >
              <input
                type="radio"
                name="type"
                checked={activeFilters.type === type}
                onChange={() => setActiveFilters((prev: any) => ({ ...prev, type }))}
                className="h-4 w-4 accent-black"
              />
              {formatFilterLabel(type)}
            </label>
          ))}
        </div>
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
          setOpenSections((prev: any) => ({
            ...prev,
            trending: !prev.trending,
          }))
        }
      >
        <div className="flex flex-wrap gap-2">
          {availableTags.map((tag) => {
            const checked = activeFilters.tags.includes(tag);
            return (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1.5 rounded-full border text-xs transition ${
                  checked
                    ? "bg-black text-white border-black"
                    : "border-black/12 text-black/70 hover:border-black"
                }`}
              >
                {formatFilterLabel(tag)}
              </button>
            );
          })}
        </div>
      </FilterSection>

      <FilterSection
        title="Designer"
        summary={activeFilters.brands[0] || "All"}
        open={openSections.designer}
        onToggle={() =>
          setOpenSections((prev: any) => ({
            ...prev,
            designer: !prev.designer,
          }))
        }
      >
        {availableBrands.length ? (
          <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
            {availableBrands.map((brand) => {
              const checked = activeFilters.brands.includes(brand);

              return (
                <label
                  key={brand}
                  className="flex items-center gap-3 text-sm text-black/80 cursor-pointer"
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
            ? `${activeFilters.minPrice ?? 0} - ${
                activeFilters.maxPrice ?? "Any"
              }`
            : "All"
        }
        open={openSections.price}
        onToggle={() =>
          setOpenSections((prev: any) => ({ ...prev, price: !prev.price }))
        }
      >
        <div className="grid grid-cols-2 gap-3">
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
            placeholder="Min"
            className="border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-gray-500"
          />
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
            placeholder="Max"
            className="border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-gray-500"
          />
        </div>
      </FilterSection>
    </div>
  );
}
