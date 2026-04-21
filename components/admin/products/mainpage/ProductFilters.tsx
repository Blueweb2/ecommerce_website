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
    <div className="bg-white rounded-lg shadow-sm border p-6 space-y-6">

      {/* Search Bar */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search products by name, SKU, or description..."
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Section Tabs */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-3">Sections</h3>
        <div className="flex flex-wrap gap-2">
          {sectionTabs.map((s: any) => (
            <button
              key={s.value}
              onClick={() => setActiveSection(s.value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeSection === s.value
                  ? 'bg-blue-100 text-blue-800 border-2 border-blue-200'
                  : 'bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filters Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <select
            value={activeCategory}
            onChange={(e) => setActiveCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            {categories.map((c: any) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Sale Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Sale Status</label>
          <select
            value={saleFilter}
            onChange={(e) => setSaleFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Products</option>
            <option value="sale">On Sale Only</option>
          </select>
        </div>

      </div>

      {/* Clear Filters */}
      {(searchQuery || activeSection !== 'all' || activeCategory !== 'all' || saleFilter !== 'all') && (
        <div className="pt-4 border-t">
          <button
            onClick={() => {
              setSearchQuery('');
              setActiveSection('all');
              setActiveCategory('all');
              setSaleFilter('all');
            }}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Clear all filters
          </button>
        </div>
      )}

    </div>
  );
}