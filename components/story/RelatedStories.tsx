"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getRelatedStories } from "@/lib/api/story.api";
import { STORY_CATEGORY_MAP } from "@/lib/constants/storyCategories";
import type { Story } from "@/types/story";
import type { StoryCategorySlug } from "@/lib/constants/storyCategories";
import { resolveImageSrc } from "@/lib/utils/image";

type Props = {
  currentSlug: string;
  category: StoryCategorySlug;
};

function RelatedCard({ story }: { story: Story }) {
  const imageUrl = story.heroImage?.url;
  return (
    <article className="group">
      <Link
        href={`/editorial/${story.slug}`}
        className="block overflow-hidden bg-stone-100"
      >
        <div className="relative aspect-[4/5]">
          <Image
            src={resolveImageSrc(imageUrl)}
            alt={story.heroImage?.alt || story.title}
            fill
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
          />
        </div>
      </Link>
      <div className="pt-4">
        <p className="font-brand-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-500">
          {STORY_CATEGORY_MAP[story.category] ?? story.category}
        </p>
        <Link
          href={`/editorial/${story.slug}`}
          className="mt-2 block font-brand-serif text-xl leading-tight text-stone-900 transition-opacity group-hover:opacity-70"
        >
          {story.title}
        </Link>
      </div>
    </article>
  );
}

function RelatedSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="aspect-[4/5] bg-stone-100" />
      <div className="h-3 w-1/4 bg-stone-100" />
      <div className="h-6 w-3/4 bg-stone-100" />
    </div>
  );
}

export default function RelatedStories({ currentSlug, category }: Props) {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getRelatedStories(currentSlug, category, 3)
      .then(setStories)
      .catch(() => setStories([]))
      .finally(() => setLoading(false));
  }, [currentSlug, category]);

  const categoryLabel = STORY_CATEGORY_MAP[category] ?? category;

  if (!loading && stories.length === 0) return null;

  return (
    <section
      aria-label={`More from ${categoryLabel}`}
      className="mt-20 border-t border-stone-200 pt-12"
    >
      <div className="mb-10 flex items-baseline justify-between gap-5">
        <h2 className="font-brand-display text-3xl text-stone-950 sm:text-4xl">
          More from {categoryLabel}
        </h2>
        <Link
          href={`/editorial/${category}`}
          className="shrink-0 border-b border-stone-900 pb-1 font-brand-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-900 transition-opacity hover:opacity-60"
        >
          View all
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {loading
          ? [1, 2, 3].map((i) => <RelatedSkeleton key={i} />)
          : stories.map((story) => (
              <RelatedCard key={story._id} story={story} />
            ))}
      </div>
    </section>
  );
}
