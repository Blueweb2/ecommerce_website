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
}: any) {
  return (
    <div className="space-y-4">

      {/* Search */}
      <input
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search"
      />

      {/* Sections */}
      <div className="flex gap-2">
        {sectionTabs.map((s: any) => (
          <button
            key={s.value}
            onClick={() => setActiveSection(s.value)}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Category + Sale */}
      <div className="flex gap-2">
        <select onChange={(e) => setActiveCategory(e.target.value)}>
          <option value="all">All</option>
          {categories.map((c: any) => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>

        <select onChange={(e) => setSaleFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="sale">Sale</option>
        </select>
      </div>
    </div>
  );
}