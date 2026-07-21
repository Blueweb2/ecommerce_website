import Image from "next/image";
import Link from "next/link";
import type { Story } from "@/types/story";
import { resolveImageSrc } from "@/lib/utils/image";
import { formatStoryDate, getStoryImage, storyCategoryLabel } from "./StoryCard";

export default function FeaturedStory({ story }: { story: Story }) {
  return <article className="grid items-center gap-8 lg:grid-cols-[1.55fr_0.85fr] lg:gap-14">
    <Link href={`/editorial/${story.slug ?? story._id}`} className="group relative block aspect-[5/4] overflow-hidden bg-stone-100">
      <Image src={resolveImageSrc(getStoryImage(story))} alt={story.heroImage?.alt || story.image?.alt || story.title} fill priority sizes="(min-width: 1024px) 62vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.025]" />
    </Link>
    <div className="max-w-md py-2 lg:py-8">
      <p className="font-brand-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-500">{storyCategoryLabel(story)}</p>
      <h1 className="mt-4 font-brand-display text-4xl leading-[0.96] text-stone-950 sm:text-5xl lg:text-6xl">{story.title}</h1>
      {story.excerpt && <p className="mt-6 font-brand-serif text-lg leading-relaxed text-stone-600">{story.excerpt.replace(/<[^>]+>/g, "")}</p>}
      {formatStoryDate(story.publishDate || story.createdAt) && <p className="mt-5 font-brand-sans text-[10px] uppercase tracking-[0.15em] text-stone-500">{formatStoryDate(story.publishDate || story.createdAt)}</p>}
      <Link href={`/editorial/${story.slug ?? story._id}`} className="mt-8 inline-block border-b border-stone-900 pb-1 font-brand-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-900">Read story</Link>
    </div>
  </article>;
}
