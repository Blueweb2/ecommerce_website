"use client";

import { useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { useCollectionStore } from "@/store/admin/useCollectionStore";
import { useCategoryStore } from "@/store/admin/useCategoryStore";

const FALLBACK_IMAGE = "/home/herosection/hero-right-top.png";

function resolveCollectionImage(
  image?: string | { url?: string } | null
) {
  if (!image) return FALLBACK_IMAGE;
  if (typeof image === "string") return image || FALLBACK_IMAGE;
  return image.url || FALLBACK_IMAGE;
}

export default function CollectionsPage() {
  const {
    collections,
    loading,
    fetchCollections,
    deleteCollection,
  } = useCollectionStore();
  const { categories, fetchCategories } = useCategoryStore();

  useEffect(() => {
    void fetchCollections();
    void fetchCategories();
  }, [fetchCollections, fetchCategories]);

  const categoryLookup = useMemo(() => {
    return new Map(categories.map((category) => [category._id, category.name]));
  }, [categories]);

  const handleDelete = async (id?: string) => {
    if (!id) return;

    const confirmed = confirm("Delete this collection?");
    if (!confirmed) return;

    try {
      await deleteCollection(id);
      toast.success("Collection deleted");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete collection");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            Collections
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Create themed product collections and store the filters the backend
            should use when building each page.
          </p>
        </div>

        <Link
          href="/admin/collections/create"
          className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
        >
          + Add Collection
        </Link>
      </div>

      {loading && !collections.length ? (
        <div className="grid gap-5 xl:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-[28px] border border-slate-200 bg-white"
            >
              <div className="h-52 animate-pulse bg-slate-200" />
              <div className="space-y-4 p-6">
                <div className="h-6 w-1/3 animate-pulse rounded-full bg-slate-200" />
                <div className="h-4 w-full animate-pulse rounded-full bg-slate-200" />
                <div className="h-4 w-3/4 animate-pulse rounded-full bg-slate-200" />
              </div>
            </div>
          ))}
        </div>
      ) : collections.length ? (
        <div className="grid gap-5 xl:grid-cols-2">
          {collections.map((collection) => (
            <article
              key={collection._id || collection.slug}
              className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm"
            >
              <div className="grid lg:grid-cols-[220px_minmax(0,1fr)]">
                <div className="relative min-h-[220px] bg-slate-100">
                  <Image
                    src={resolveCollectionImage(
                      collection.bannerImage || collection.image
                    )}
                    alt={collection.title || collection.name || "Collection"}
                    fill
                    sizes="(max-width: 1024px) 100vw, 220px"
                    className="object-cover"
                  />
                </div>

                <div className="space-y-5 p-6">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
                        {collection.title || collection.name || "Untitled collection"}
                      </h2>
                      <p className="mt-2 text-sm text-slate-500">
                        /collection/{collection.slug}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] ${
                        collection.isActive === false
                          ? "bg-slate-100 text-slate-500"
                          : "bg-emerald-100 text-emerald-700"
                      }`}
                    >
                      {collection.isActive === false ? "Inactive" : "Active"}
                    </span>
                  </div>

                  <p className="line-clamp-3 text-sm leading-6 text-slate-600">
                    {collection.description || "No description added yet."}
                  </p>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                        Category
                      </p>
                      <p className="mt-2 text-sm font-medium text-slate-900">
                        {categoryLookup.get(
                          typeof collection.filters?.category === "object"
                            ? collection.filters.category._id
                            : (collection.filters?.category || "")
                        ) || "All categories"}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                        Type
                      </p>
                      <p className="mt-2 text-sm font-medium text-slate-900">
                        {collection.filters?.type || "Any type"}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:col-span-2">
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                        Tags
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {collection.filters?.tags?.length ? (
                          collection.filters.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full bg-slate-900 px-3 py-1 text-xs font-medium text-white"
                            >
                              {tag}
                            </span>
                          ))
                        ) : (
                          <span className="text-sm text-slate-500">No tags selected</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {collection._id ? (
                      <Link
                        href={`/admin/collections/${collection._id}/edit`}
                        className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
                      >
                        Edit
                      </Link>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => handleDelete(collection._id)}
                      className="rounded-full border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-[28px] border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
          <h2 className="text-xl font-semibold text-slate-900">
            No collections yet
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Start by creating a collection and defining the filters your backend
            should apply.
          </p>
        </div>
      )}
    </div>
  );
}
