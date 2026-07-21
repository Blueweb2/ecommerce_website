import Link from "next/link";
import type { Story } from "@/types/story";
import FeaturedStory from "./FeaturedStory";
import StoryGrid from "./StoryGrid";

export default function CategorySection({ label, slug, stories }: { label: string; slug: string; stories: Story[] }) {
  if (!stories.length) return null;
  return <section className="border-t border-stone-200 pt-10 sm:pt-14"><div className="mb-8 flex items-baseline justify-between gap-5"><h2 className="font-brand-display text-4xl text-stone-950 sm:text-5xl">{label}</h2><Link href={`/editorial/${slug}`} className="shrink-0 border-b border-stone-900 pb-1 font-brand-sans text-[10px] font-semibold uppercase tracking-[0.18em]">View more</Link></div><FeaturedStory story={stories[0]} />{stories.length > 1 && <div className="mt-12"><StoryGrid stories={stories.slice(1, 4)} /></div>}</section>;
}
