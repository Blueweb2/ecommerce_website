"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Inter, Bodoni_Moda } from 'next/font/google';
import { collectionAPI } from "@/lib/api/collection.api";
import { Collection } from "@/types/collection";

const inter = Inter({
  subsets: ['latin'],
});

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

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
    <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
      {collections.map((item) => {
        const categoryFilter = item.filters?.category;
        const categorySlug = typeof categoryFilter === "object" ? categoryFilter?.slug : item.slug;
        const categoryId = typeof categoryFilter === "object" ? categoryFilter?._id : categoryFilter;

        return (
          <article
            key={item._id || item.slug}
            className="group overflow-hidden"
          >
            <Link
              href={`/category/${categorySlug}?filterCategory=${categoryId || ""}`}
              className="block"
            >
              <div className="relative h-[300px] lg:h-screen overflow-hidden">
                <Image
                  src={getCollectionImage(item)}
                  alt={getCollectionTitle(item)}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
            </Link>

            <div className="pt-5">
              <h2 className={`${bodoni.className} lora text-xl font-semibold tracking-tight text-neutral-600`}>
                {getCollectionTitle(item)}
              </h2>
              <p className={`${inter.className} mt-2 line-clamp-3 text-sm leading-6 text-[#8D8B9D]`}>
                {getCollectionDescription(item)}
              </p>

              <Link
                href={`/category/${categorySlug}?filterCategory=${categoryId || ""}`}
                className="mt-4 inline-flex items-center underline gap-2 text-sm font-semibold text-[#8D8B9D] transition group-hover:text-[#3f478b]"
              >
                Explore Designs
              </Link>
            </div>
          </article>
        );
      })}
    </div>
  );
};