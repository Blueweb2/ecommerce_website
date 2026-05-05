"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { collectionAPI } from "@/lib/api/collection.api";
import { Collection } from "@/types/collection";
import { optimizeCloudinaryUrl } from "@/lib/constants/admin-catalog";

const FALLBACK_IMAGE = "/home/herosection/hero-right-top.png";

function getCollectionTitle(collection: Collection) {
  return collection.title || collection.name || "Collection";
}

function getCollectionDescription(collection: Collection) {
  return (
    collection.description ||
    "Discover a curated edit from this collection."
  );
}

function getCollectionImage(collection: Collection) {
  const image = collection.image;

  if (!image) return FALLBACK_IMAGE;
  if (typeof image === "string") {
    return optimizeCloudinaryUrl(image) || FALLBACK_IMAGE;
  }

  return optimizeCloudinaryUrl(image.url) || FALLBACK_IMAGE;
}

export default function TopCollections() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCollections = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await collectionAPI.getAll();
        const sorted = [...data].sort(
          (a, b) => (b.priority || 0) - (a.priority || 0)
        );

        setCollections(sorted.slice(0, 3));
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Unable to load collections right now.";

        setCollections([]);
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    void loadCollections();
  }, []);

  if (loading) {
    return (
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-2xl bg-white shadow-sm"
          >
            <div className="h-[220px] animate-pulse bg-neutral-200" />
            <div className="space-y-3 p-4">
              <div className="h-5 w-2/3 animate-pulse rounded-full bg-neutral-200" />
              <div className="h-4 w-full animate-pulse rounded-full bg-neutral-200" />
              <div className="h-4 w-1/2 animate-pulse rounded-full bg-neutral-200" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-5 text-sm text-red-700">
        {error}
      </div>
    );
  }

  if (!collections.length) {
    return (
      <div className="mt-6 rounded-2xl border border-dashed border-neutral-300 bg-white px-4 py-10 text-center text-sm text-neutral-500">
        No collections available right now.
      </div>
    );
  }

  return (
    <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
      {collections.map((item, index) => {
        const category =
          item.category && typeof item.category !== "string"
            ? item.category
            : null;

        const href = item.slug ? `/collection/${item.slug}` : "#";
        const key = item._id || item.slug || `collection-${index}`;

        return (
          <article key={key} className="overflow-hidden">
            <Link href={href} className="block">
              <div className="relative h-[300px] overflow-hidden lg:h-screen">
                <Image
                  src={getCollectionImage(item)}
                  alt={getCollectionTitle(item)}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  className="object-cover transition duration-500"
                />
              </div>
            </Link>

            <div className="pt-5">
              <h2 className="font-brand-display lora text-xl font-semibold tracking-tight text-neutral-600">
                {getCollectionTitle(item)}
              </h2>

              <p className="font-brand-sans mt-2 line-clamp-3 text-sm leading-6 text-[#8D8B9D]">
                {getCollectionDescription(item)}
              </p>

              <Link
                href={href}
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#8D8B9D] underline transition hover:text-[#3f478b]"
              >
                {item.cta || "Explore Designs"}
              </Link>
            </div>
          </article>
        );
      })}
    </div>
  );
}
