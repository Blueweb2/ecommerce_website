"use client";

import { useMemo, useState } from "react";

type Category = {
  _id: string;
  name: string;
  slug?: string;
};

type CategoryAssignmentCardProps = {
  categories: Category[];
  selectedCategories: string[];
  setForm: React.Dispatch<React.SetStateAction<any>>;
};

export default function CategoryAssignmentCard({
  categories,
  selectedCategories,
  setForm,
}: CategoryAssignmentCardProps) {
  const [search, setSearch] = useState("");

  const filteredCategories = useMemo(() => {
    return categories.filter((category) =>
      category.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [categories, search]);

  const toggleCategory = (categoryId: string) => {
    const exists = selectedCategories.includes(categoryId);

    setForm((prev: any) => ({
      ...prev,
      categories: exists
        ? prev.categories.filter((id: string) => id !== categoryId)
        : [...prev.categories, categoryId],
    }));
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      {/* HEADER */}
      <div className="mb-6 border-b border-slate-100 pb-4">
        <h2 className="text-lg font-semibold text-slate-900">
          Category Assignment
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Assign categories that this designer / brand partner can manage and
          sell products under.
        </p>
      </div>

      {/* SEARCH */}
      <div className="mb-5">
        <input
          type="text"
          placeholder="Search categories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm outline-none transition-all focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
        />
      </div>

      {/* SELECTED CATEGORIES */}
      {selectedCategories.length > 0 && (
        <div className="mb-5">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-700">
              Selected Categories
            </h3>

            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
              {selectedCategories.length} Selected
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories
              .filter((cat) => selectedCategories.includes(cat._id))
              .map((category) => (
                <button
                  key={category._id}
                  type="button"
                  onClick={() => toggleCategory(category._id)}
                  className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 transition hover:bg-emerald-100"
                >
                  {category.name} ×
                </button>
              ))}
          </div>
        </div>
      )}

      {/* CATEGORY LIST */}
      <div>
        <h3 className="mb-3 text-sm font-medium text-slate-700">
          Available Categories
        </h3>

        <div className="max-h-[320px] overflow-y-auto rounded-xl border border-slate-200">
          {filteredCategories.length === 0 ? (
            <div className="p-6 text-center text-sm text-slate-500">
              No categories found
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredCategories.map((category) => {
                const selected = selectedCategories.includes(category._id);

                return (
                  <label
                    key={category._id}
                    className="flex cursor-pointer items-center justify-between px-4 py-3 hover:bg-slate-50"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-700">
                        {category.name}
                      </p>

                      {category.slug && (
                        <p className="text-xs text-slate-500">
                          /{category.slug}
                        </p>
                      )}
                    </div>

                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => toggleCategory(category._id)}
                      className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                    />
                  </label>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 p-3">
        <p className="text-xs text-blue-700">
          Products linked to this designer should belong to one of the selected
          categories.
        </p>
      </div>
    </div>
  );
}