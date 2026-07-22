"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Story } from "@/types/story";
import type { StoryCategorySlug } from "@/lib/constants/storyCategories";
import {
  STORY_CATEGORIES,
  STORY_CATEGORY_MAP,
} from "@/lib/constants/storyCategories";
import {
  getStories,
  getStoriesByCategory,
  getFeaturedStoryByCategory,
} from "@/lib/api/story.api";
import EditorialHeader from "./EditorialHeader";
import EditorialCategoryNavigation from "./EditorialCategoryNavigation";
import FeaturedStory from "./FeaturedStory";
import StoryGrid from "./StoryGrid";
import CategorySection from "./CategorySection";
import ViewMoreButton from "./ViewMoreButton";
import EditorialSkeleton from "./EditorialSkeleton";
import { formatStoryDate } from "./StoryCard";
import { resolveImageSrc } from "@/lib/utils/image";
import StorySectionRenderer from "@/components/story/StorySectionRenderer";
import RelatedStories from "@/components/story/RelatedStories";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function calculateReadTime(story: Story): number {
  const words = [
    story.excerpt ?? "",
    ...(story.sections ?? []).map(
      (s) => `${s.heading ?? ""} ${s.content ?? ""}`
    ),
  ]
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

// ---------------------------------------------------------------------------
// Story Detail
// ---------------------------------------------------------------------------

function StoryDetail({ story }: { story: Story }) {
  const readTime = calculateReadTime(story);
  const categoryLabel =
    STORY_CATEGORY_MAP[story.category as StoryCategorySlug] ?? story.category;

  return (
    <>
      <EditorialHeader />
      <EditorialCategoryNavigation currentCategory={story.category ?? ""} />

      <main className="mx-auto max-w-4xl px-5 pb-24 pt-12 sm:pt-20">
        {/* Meta */}
        <p className="text-center font-brand-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-500">
          {categoryLabel}
        </p>

        {/* Title */}
        <h1 className="mx-auto mt-5 max-w-3xl text-center font-brand-display text-5xl leading-[0.94] text-stone-950 sm:text-7xl">
          {story.title}
        </h1>

        {/* Excerpt */}
        {story.excerpt && (
          <p className="mx-auto mt-7 max-w-2xl text-center font-brand-serif text-xl leading-relaxed text-stone-600">
            {story.excerpt.replace(/<[^>]+>/g, "")}
          </p>
        )}

        {/* By-line & read time */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 font-brand-sans text-[10px] uppercase tracking-[0.15em] text-stone-500">
          {story.author && <span>By {story.author}</span>}
          {(story.publishDate || story.createdAt) && (
            <span>{formatStoryDate(story.publishDate || story.createdAt)}</span>
          )}
          <span>{readTime} min read</span>
        </div>

        {/* Hero image */}
        <div className="relative mt-12 aspect-[4/5] w-full overflow-hidden bg-stone-100 sm:aspect-[16/10]">
          <Image
            src={resolveImageSrc(story.heroImage?.url)}
            alt={story.heroImage?.alt || story.title}
            fill
            priority
            sizes="(min-width: 640px) 896px, 100vw"
            className="object-cover"
          />
        </div>

        {/* Sections */}
        {story.sections && story.sections.length > 0 && (
          <div className="mt-14">
            <StorySectionRenderer sections={story.sections} />
          </div>
        )}

        {/* Share & back */}
        <div className="mt-16 border-t border-stone-200 pt-8 flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-4 font-brand-sans text-[10px] uppercase tracking-[0.15em] text-stone-500">
            <span>Share</span>
            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}&text=${encodeURIComponent(story.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on X / Twitter"
              className="hover:text-stone-900"
            >
              𝕏
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on Facebook"
              className="hover:text-stone-900"
            >
              f
            </a>
          </div>
          <Link
            href="/editorial"
            className="font-brand-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-500 hover:text-stone-900"
          >
            ← Back to editorial
          </Link>
        </div>

        {/* Related stories */}
        {story.slug && story.category && (
          <RelatedStories
            currentSlug={story.slug}
            category={story.category as StoryCategorySlug}
          />
        )}
      </main>
    </>
  );
}

// ---------------------------------------------------------------------------
// Category page
// ---------------------------------------------------------------------------

function CategoryPage({
  category,
  slug,
}: {
  category: { label: string; slug: StoryCategorySlug };
  slug: string;
}) {
  const [stories, setStories] = useState<Story[]>([]);
  const [featured, setFeatured] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(9);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getFeaturedStoryByCategory(slug as StoryCategorySlug),
      getStoriesByCategory(slug as StoryCategorySlug),
    ])
      .then(([featuredStory, allStories]) => {
        setFeatured(featuredStory);
        setStories(allStories);
      })
      .catch(() => {
        setFeatured(null);
        setStories([]);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  const gridStories = useMemo(() => {
    if (!featured) return stories.slice(0, visible);
    return stories
      .filter((s) => s._id !== featured._id)
      .slice(0, visible - 1);
  }, [stories, featured, visible]);

  const totalCount = useMemo(() => {
    return featured
      ? stories.filter((s) => s._id !== featured._id).length
      : stories.length;
  }, [stories, featured]);

  if (loading) {
    return (
      <>
        <EditorialHeader />
        <EditorialCategoryNavigation currentCategory={slug} />
        <main className="mx-auto max-w-7xl px-5 py-12 sm:py-16">
          <EditorialSkeleton category />
        </main>
      </>
    );
  }

  return (
    <>
      <EditorialHeader />
      <EditorialCategoryNavigation currentCategory={slug} />
      <main className="max-w-[2000px] mx-auto px-4 md:px-10 lg:px-32">
        <header className="text-center">
          <h3 className="mt-3 font-brand-display text-stone-950 sm:text-3xl uppercase">
            {category.label}
          </h3>
        </header>

        {featured || stories.length > 0 ? (
          <>
            {featured && <FeaturedStory story={featured} />}
            {gridStories.length > 0 && (
              <div className="mt-14">
                <StoryGrid stories={gridStories} />
              </div>
            )}
            {gridStories.length < totalCount && (
              <div className="mt-14 text-center">
                <ViewMoreButton onClick={() => setVisible((c) => c + 6)} />
              </div>
            )}
          </>
        ) : (
          <p className="py-16 text-center font-brand-serif text-xl text-stone-500">
            No stories available in this category yet.
          </p>
        )}
      </main>
    </>
  );
}

// ---------------------------------------------------------------------------
// Home (all categories)
// ---------------------------------------------------------------------------

function EditorialHome() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStories()
      .then(setStories)
      .catch(() => setStories([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <>
        <EditorialHeader />
        <EditorialCategoryNavigation currentCategory="" />
        <main className="mx-auto max-w-7xl px-5 py-12 sm:py-16">
          <EditorialSkeleton />
        </main>
      </>
    );
  }

  const featured = stories.find((s) => s.featured) ?? stories[0];

  return (
    <>
      <EditorialHeader />
      <EditorialCategoryNavigation currentCategory="" />
      <main className="mx-auto max-w-7xl px-5 py-12 sm:py-16">
        {featured ? (
          <FeaturedStory story={featured} />
        ) : (
          <p className="py-16 text-center font-brand-serif text-xl text-stone-500">
            No stories available.
          </p>
        )}
        <div className="mt-20 space-y-20 sm:mt-28">
          {STORY_CATEGORIES.map((item) => (
            <CategorySection
              key={item.slug}
              label={item.label}
              slug={item.slug}
              stories={stories.filter((s) => s.category === item.slug)}
            />
          ))}
        </div>
      </main>
    </>
  );
}

// ---------------------------------------------------------------------------
// Main orchestrator
// ---------------------------------------------------------------------------

export default function EditorialExperience({ segment }: { segment?: string }) {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  const category = STORY_CATEGORIES.find((item) => item.slug === segment);

  // We only need to load all stories when:
  // 1. No segment (home page)
  // 2. Segment is a story slug (not a category)
  const isStorySlug = segment && !category;

  useEffect(() => {
    if (!isStorySlug) {
      setLoading(false);
      return;
    }
    // Load stories to find the one matching the slug
    getStories()
      .then(setStories)
      .catch(() => setStories([]))
      .finally(() => setLoading(false));
  }, [isStorySlug]);

  // Home page — delegate to EditorialHome
  if (!segment) return <EditorialHome />;

  // Category page — delegate to CategoryPage
  if (category) return <CategoryPage category={category} slug={category.slug} />;

  // Loading story detail
  if (loading) {
    return (
      <>
        <EditorialHeader />
        <EditorialCategoryNavigation currentCategory="" />
        <main className="mx-auto max-w-7xl px-5 py-12 sm:py-16">
          <EditorialSkeleton />
        </main>
      </>
    );
  }

  const story = stories.find(
    (item) => item.slug === segment || item._id === segment
  );

  // Story detail
  if (story) return <StoryDetail story={story} />;

  // Not found
  return (
    <>
      <EditorialHeader />
      <EditorialCategoryNavigation currentCategory="" />
      <main className="mx-auto max-w-7xl px-5 py-24 text-center">
        <h1 className="font-brand-display text-5xl">Story not found</h1>
        <Link
          href="/editorial"
          className="mt-8 inline-block border-b border-stone-900 pb-1 font-brand-sans text-[10px] uppercase tracking-[0.2em]"
        >
          Return to editorial
        </Link>
      </main>
    </>
  );
}
