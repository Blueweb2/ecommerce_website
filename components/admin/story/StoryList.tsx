"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { Edit, Trash2, Search, X } from "lucide-react";
import { deleteStory } from "@/lib/api/admin/story.api";
import type { Story } from "@/types/story";
import {
  STORY_CATEGORIES,
  STORY_CATEGORY_MAP,
  type StoryCategorySlug,
} from "@/lib/constants/storyCategories";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type SortField = "publishDate" | "createdAt" | "category" | "featured" | "isActive";
type SortDir = "asc" | "desc";

interface Filters {
  search: string;
  category: StoryCategorySlug | "";
  featured: "" | "true" | "false";
  active: "" | "true" | "false";
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function categoryLabel(slug: string): string {
  return STORY_CATEGORY_MAP[slug as StoryCategorySlug] ?? slug;
}

function categoryColor(slug: string): string {
  const palette: Record<string, string> = {
    fashion: "bg-pink-100 text-pink-700",
    beauty: "bg-purple-100 text-purple-700",
    "jewelry-watches": "bg-amber-100 text-amber-700",
    reporter: "bg-sky-100 text-sky-700",
    "cover-stories": "bg-rose-100 text-rose-700",
    "incredible-women": "bg-emerald-100 text-emerald-700",
    lifestyle: "bg-teal-100 text-teal-700",
    video: "bg-slate-100 text-slate-700",
  };
  return palette[slug] ?? "bg-slate-100 text-slate-600";
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function StoryCard({
  story,
  onDelete,
}: {
  story: Story;
  onDelete: (story: Story) => void;
}) {
  const heroUrl = story.heroImage?.url;
  const heroAlt = story.heroImage?.alt ?? story.title;
  const sectionCount = story.sections?.length ?? 0;

  return (
    <div className="overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm">
      <div className="relative h-44 w-full overflow-hidden bg-slate-100">
        {heroUrl ? (
          <img src={heroUrl} alt={heroAlt} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-xs text-slate-400">
            No image
          </div>
        )}
        <div className="absolute left-3 top-3 flex gap-1.5">
          <span
            className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider backdrop-blur-sm ${
              story.isActive
                ? "bg-emerald-600/90 text-white"
                : "bg-white/90 text-slate-600"
            }`}
          >
            {story.isActive ? "Active" : "Hidden"}
          </span>
          {story.featured && (
            <span className="rounded-full bg-amber-400/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-sm">
              Featured
            </span>
          )}
        </div>
      </div>

      <div className="space-y-2 p-4">
        {/* Category badge */}
        <span
          className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${categoryColor(story.category)}`}
        >
          {categoryLabel(story.category)}
        </span>

        <div className="flex items-start justify-between gap-3">
          <h3 className="line-clamp-1 text-sm font-semibold leading-snug text-slate-900">
            {story.title}
          </h3>
          <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-500">
            {sectionCount} section{sectionCount !== 1 ? "s" : ""}
          </span>
        </div>

        {story.excerpt && (
          <p className="line-clamp-2 text-xs text-slate-500">{story.excerpt}</p>
        )}

        {story.author && (
          <p className="text-[10px] uppercase tracking-wider text-slate-400">
            By {story.author}
          </p>
        )}

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Link
            href={`/admin/stories/${story._id}/edit`}
            className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-200"
          >
            <Edit className="h-3.5 w-3.5" />
            Edit
          </Link>

          <button
            type="button"
            onClick={() => onDelete(story)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-rose-50 px-3 py-2 text-xs font-medium text-rose-700 transition hover:bg-rose-100"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Filter bar
// ---------------------------------------------------------------------------

function FilterBar({
  filters,
  onChange,
  onReset,
}: {
  filters: Filters;
  onChange: (patch: Partial<Filters>) => void;
  onReset: () => void;
}) {
  const isDirty =
    filters.search !== "" ||
    filters.category !== "" ||
    filters.featured !== "" ||
    filters.active !== "";

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Search */}
      <div className="relative min-w-[180px] flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          placeholder="Search stories..."
          value={filters.search}
          onChange={(e) => onChange({ search: e.target.value })}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm outline-none focus:border-[#12251a] focus:ring-1 focus:ring-[#12251a]"
        />
      </div>

      {/* Category */}
      <select
        value={filters.category}
        onChange={(e) =>
          onChange({ category: e.target.value as Filters["category"] })
        }
        className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-[#12251a] focus:ring-1 focus:ring-[#12251a]"
      >
        <option value="">All Categories</option>
        {STORY_CATEGORIES.map((cat) => (
          <option key={cat.slug} value={cat.slug}>
            {cat.label}
          </option>
        ))}
      </select>

      {/* Featured */}
      <select
        value={filters.featured}
        onChange={(e) =>
          onChange({ featured: e.target.value as Filters["featured"] })
        }
        className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-[#12251a] focus:ring-1 focus:ring-[#12251a]"
      >
        <option value="">Featured: All</option>
        <option value="true">Featured Only</option>
        <option value="false">Not Featured</option>
      </select>

      {/* Active */}
      <select
        value={filters.active}
        onChange={(e) =>
          onChange({ active: e.target.value as Filters["active"] })
        }
        className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-[#12251a] focus:ring-1 focus:ring-[#12251a]"
      >
        <option value="">Status: All</option>
        <option value="true">Active Only</option>
        <option value="false">Hidden Only</option>
      </select>

      {isDirty && (
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
        >
          <X className="h-3.5 w-3.5" />
          Reset
        </button>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sort controls
// ---------------------------------------------------------------------------

function SortBar({
  sort,
  dir,
  onChange,
}: {
  sort: SortField;
  dir: SortDir;
  onChange: (field: SortField) => void;
}) {
  const fields: { label: string; value: SortField }[] = [
    { label: "Publish Date", value: "publishDate" },
    { label: "Created", value: "createdAt" },
    { label: "Category", value: "category" },
    { label: "Featured", value: "featured" },
    { label: "Status", value: "isActive" },
  ];

  return (
    <div className="flex items-center gap-2 text-xs text-slate-500">
      <span className="font-medium">Sort:</span>
      {fields.map((f) => (
        <button
          key={f.value}
          type="button"
          onClick={() => onChange(f.value)}
          className={`rounded-lg px-2.5 py-1 font-medium transition ${
            sort === f.value
              ? "bg-[#12251a] text-white"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          {f.label}
          {sort === f.value && (
            <span className="ml-1">{dir === "asc" ? "↑" : "↓"}</span>
          )}
        </button>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

const DEFAULT_FILTERS: Filters = {
  search: "",
  category: "",
  featured: "",
  active: "",
};

export default function StoryList({
  stories,
  refresh,
}: {
  stories: Story[];
  refresh: () => Promise<void>;
}) {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [sortField, setSortField] = useState<SortField>("publishDate");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const handleFilterChange = (patch: Partial<Filters>) =>
    setFilters((prev) => ({ ...prev, ...patch }));

  const handleSortChange = (field: SortField) => {
    if (field === sortField) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  };

  const handleDelete = async (story: Story) => {
    if (!confirm(`Delete story "${story.title}"?`)) return;
    try {
      await deleteStory(story._id);
      toast.success("Story deleted");
      await refresh();
    } catch {
      toast.error("Failed to delete story");
    }
  };

  const filteredStories = useMemo(() => {
    let list = [...stories];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.excerpt?.toLowerCase().includes(q) ||
          s.author?.toLowerCase().includes(q)
      );
    }

    if (filters.category) {
      list = list.filter((s) => s.category === filters.category);
    }

    if (filters.featured !== "") {
      const want = filters.featured === "true";
      list = list.filter((s) => Boolean(s.featured) === want);
    }

    if (filters.active !== "") {
      const want = filters.active === "true";
      list = list.filter((s) => Boolean(s.isActive) === want);
    }

    list.sort((a, b) => {
      let av: string | number | boolean;
      let bv: string | number | boolean;

      switch (sortField) {
        case "publishDate":
          av = a.publishDate || a.createdAt || "";
          bv = b.publishDate || b.createdAt || "";
          break;
        case "createdAt":
          av = a.createdAt || "";
          bv = b.createdAt || "";
          break;
        case "category":
          av = a.category || "";
          bv = b.category || "";
          break;
        case "featured":
          av = Number(a.featured);
          bv = Number(b.featured);
          break;
        case "isActive":
          av = Number(a.isActive);
          bv = Number(b.isActive);
          break;
        default:
          return 0;
      }

      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

    return list;
  }, [stories, filters, sortField, sortDir]);

  if (stories.length === 0) {
    return (
      <div className="rounded-[24px] border border-slate-200 bg-white p-10 text-center text-slate-500 shadow-sm">
        No stories yet. Create your first story above.
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold tracking-tight">Stories</h2>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
          {filteredStories.length} / {stories.length}
        </span>
      </div>

      {/* Filters */}
      <FilterBar
        filters={filters}
        onChange={handleFilterChange}
        onReset={() => setFilters(DEFAULT_FILTERS)}
      />

      {/* Sort */}
      <SortBar sort={sortField} dir={sortDir} onChange={handleSortChange} />

      {filteredStories.length === 0 ? (
        <div className="rounded-[24px] border border-slate-200 bg-white p-8 text-center text-slate-500">
          No stories match the current filters.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredStories.map((story) => (
            <StoryCard key={story._id} story={story} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
