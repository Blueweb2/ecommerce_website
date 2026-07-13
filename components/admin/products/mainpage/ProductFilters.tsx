import {
  Filter,
  RotateCcw,
  Search,
} from "lucide-react";

interface ProductFiltersProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  activeSection: string;
  setActiveSection: (value: string) => void;
  activeCategory: string;
  setActiveCategory: (value: string) => void;
  saleFilter: string;
  setSaleFilter: (value: string) => void;
  categories: Array<{ _id: string; name: string }>;
  sectionTabs: Array<{ value: string; label: string }>;
}

export default function ProductFilters({
  searchQuery,
  setSearchQuery,
  activeSection,
  setActiveSection,
  activeCategory,
  setActiveCategory,
  saleFilter,
  setSaleFilter,
  categories,
  sectionTabs,
}: ProductFiltersProps) {
  const hasActiveFilters =
    !!searchQuery ||
    activeSection !== "all" ||
    activeCategory !== "all" ||
    saleFilter !== "all";

  return (
    <div className="rounded-[28px] border border-black/10 bg-white p-6 shadow-sm">
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-[#f6f1ea] p-3 text-[#171717]">
            <Filter className="h-5 w-5" />
          </div>

          <div>
            <h2 className="font-brand-display text-2xl text-[#171717]">
              Refine the product edit
            </h2>
            <p className="text-sm text-[#5c5a58]">
              Search by style, section, category, and sale status.
            </p>
          </div>
        </div>

        {hasActiveFilters && (
          <button
            onClick={() => {
              setSearchQuery("");
              setActiveSection("all");
              setActiveCategory("all");
              setSaleFilter("all");
            }}
            className="inline-flex items-center gap-2 self-start rounded-full border border-black/10 px-4 py-2 text-sm font-medium text-[#5c5a58] transition hover:border-black hover:text-black"
          >
            <RotateCcw className="h-4 w-4" />
            Reset Filters
          </button>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.6fr)_repeat(2,minmax(0,1fr))]">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#8f8a83]" />

          <input
            type="text"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search by product name, SKU, or description"
            className="w-full rounded-[22px] border border-black/10 bg-[#faf7f2] py-3 pl-12 pr-4 text-sm text-[#171717] outline-none transition focus:border-black"
          />
        </div>

        <div>
          <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.28em] text-[#8a7356]">
            Category
          </label>

          <select
            value={activeCategory}
            onChange={(event) => setActiveCategory(event.target.value)}
            className="w-full rounded-[22px] border border-black/10 bg-[#faf7f2] px-4 py-3 text-sm text-[#171717] outline-none transition focus:border-black"
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.28em] text-[#8a7356]">
            Sale Status
          </label>

          <select
            value={saleFilter}
            onChange={(event) => setSaleFilter(event.target.value)}
            className="w-full rounded-[22px] border border-black/10 bg-[#faf7f2] px-4 py-3 text-sm text-[#171717] outline-none transition focus:border-black"
          >
            <option value="all">All Products</option>
            <option value="sale">On Sale Only</option>
          </select>
        </div>
      </div>

      <div className="mt-6">
        <label className="mb-3 block text-[11px] font-semibold uppercase tracking-[0.28em] text-[#8a7356]">
          Storefront Sections
        </label>

        <div className="flex flex-wrap gap-3">
          {sectionTabs.map((section) => (
            <button
              key={section.value}
              onClick={() => setActiveSection(section.value)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                activeSection === section.value
                  ? "bg-black text-white"
                  : "bg-[#f6f1ea] text-[#5c5a58] hover:bg-[#eee3d4] hover:text-black"
              }`}
            >
              {section.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
