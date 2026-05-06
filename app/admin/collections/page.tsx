"use client";

import { useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { useCollectionStore } from "@/store/admin/useCollectionStore";
import { useCategoryStore } from "@/store/admin/useCategoryStore";
import { Collection } from "@/types/collection";

const FALLBACK_IMAGE = "/home/herosection/hero-right-top.png";

function resolveCollectionImage(image?: Collection["image"]) {
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

  // 🔥 category lookup
  const categoryLookup = useMemo(() => {
    return new Map(categories.map((cat) => [cat._id, cat.name]));
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
      {/* HEADER */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-900">
            Collections
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Manage collections and assign them to categories.
          </p>
        </div>

        <Link
          href="/admin/collections/create"
          className="rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          + Add Collection
        </Link>
      </div>

      {/* LOADING */}
      {loading && !collections.length ? (
        <div className="grid gap-5 xl:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-52 bg-slate-200 animate-pulse rounded-xl" />
          ))}
        </div>
      ) : collections.length ? (
        <div className="grid gap-5 xl:grid-cols-2">
          {collections.map((collection) => {
            const categoryId =
              typeof collection.category === "string"
                ? collection.category
                : collection.category?._id;

            const categoryName =
              typeof collection.category === "object"
                ? collection.category?.name
                : categoryLookup.get(categoryId || "");

            return (
              <article
                key={collection._id}
                className="rounded-2xl border bg-white shadow-sm overflow-hidden"
              >
                <div className="grid lg:grid-cols-[220px_1fr]">
                  {/* IMAGE */}
                  <div className="relative min-h-[220px] bg-gray-100">
                    <Image
                      src={resolveCollectionImage(collection.image)}
                      alt={collection.title || collection.name || "Collection"}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* CONTENT */}
                  <div className="p-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-xl font-semibold">
                          {collection.title}
                        </h2>
                      </div>

                      <span
                        className={`px-3 py-1 text-xs rounded-full ${
                          collection.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {collection.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 line-clamp-2">
                      {collection.description || "No description"}
                    </p>

                    {/* CATEGORY */}
                    <div className="text-sm">
                      <span className="text-gray-400">Category: </span>
                      <span className="font-medium">
                        {categoryName || "Unknown"}
                      </span>
                    </div>

                    {/* CTA + PRIORITY */}
                    <div className="text-sm text-gray-600">
                      <div>CTA: {collection.cta || "Shop now"}</div>
                      <div>Priority: {collection.priority || 0}</div>
                    </div>

                    {/* ACTIONS */}
                    <div className="flex gap-3">
                      <Link
                        href={`/admin/collections/${collection._id}/edit`}
                        className="px-4 py-2 text-sm bg-black text-white rounded-full"
                      >
                        Edit
                      </Link>

                      <button
                        onClick={() => handleDelete(collection._id)}
                        className="px-4 py-2 text-sm border border-red-300 text-red-600 rounded-full"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="text-center text-gray-500 py-10">
          No collections yet.
        </div>
      )}
    </div>
  );
}
