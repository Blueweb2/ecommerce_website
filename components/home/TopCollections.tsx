"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { collectionAPI } from "@/lib/api/collection.api";
import { Collection } from "@/types/collection";

const FALLBACK_IMAGE = "/home/herosection/hero-right-top.png";

function getCollectionTitle(collection: Collection) {
  return collection.title || collection.name || "Collection";
}

function getCollectionDescription(collection: Collection) {
  return (
    collection.description ||
    collection.excerpt ||
    "Discover a curated edit from this collection."
  );
}

function getCollectionImage(collection: Collection) {
  const image = collection.bannerImage || collection.image;

  if (!image) return FALLBACK_IMAGE;
  if (typeof image === "string") return image || FALLBACK_IMAGE;

  return image.url || FALLBACK_IMAGE;
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
        setCollections(data.slice(0, 3));
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
    <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {collections.map((item) => (
        <article
          key={item._id || item.slug}
          className="group overflow-hidden rounded-[28px] bg-white shadow-[0_18px_50px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,23,42,0.12)]"
        >
          <Link href={`/collection/${item.slug}`} className="block">
            <div className="relative h-[240px] overflow-hidden bg-neutral-100">
              <Image
                src={getCollectionImage(item)}
                alt={getCollectionTitle(item)}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                className="object-cover transition duration-500 group-hover:scale-105"
              />
            </div>
          </Link>

          <div className="p-5">
            <h2 className="text-xl font-semibold tracking-tight text-[#12251a]">
              {getCollectionTitle(item)}
            </h2>
            <p className="mt-2 line-clamp-3 text-sm leading-6 text-neutral-600">
              {getCollectionDescription(item)}
            </p>

            <Link
              href={`/collection/${item.slug}`}
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#12251a] transition hover:text-[#8b6a3f]"
            >
              Explore Designs
              <span aria-hidden>+</span>
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}
