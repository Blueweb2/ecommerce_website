import Image from "next/image";
import Link from "next/link";
import type { Story } from "@/types/story";
import { resolveImageSrc } from "@/lib/utils/image";

export const getStoryImage = (story: Story) => story.heroImage?.url ?? story.sections?.find((section) => section.image)?.image?.url;
export const formatStoryDate = (value?: string) => value ? new Intl.DateTimeFormat("en", { day: "numeric", month: "long", year: "numeric" }).format(new Date(value)) : "";
export const storyCategoryLabel = (story: Story) => story.category || "Editorial";

export default function StoryCard({ story, priority = false, index }: { story: Story; priority?: boolean, index: Number }) {

  const image = getStoryImage(story);
  const stepMargin = index % 3;

  return (
    <article
      className="group animate-[fadeIn_600ms_ease-out_both]" style={{
        marginTop: `${stepMargin * 40}px`,
      }}>
      <Link href={`/editorial/${story.slug ?? story._id}`} className="block overflow-hidden bg-stone-100">
        <div className="relative aspect-[4/5]">
          <Image src={resolveImageSrc(image)} alt={story.heroImage?.alt || story.title} fill priority={priority} sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw" className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]" />
        </div>
      </Link>
      <div className="pt-5">
        <p className="font-brand-sans text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-500">{storyCategoryLabel(story)}</p>
        <Link href={`/editorial/${story.slug ?? story._id}`} className="mt-2 inline bg-[linear-gradient(currentColor,currentColor)] bg-[length:0_1px] bg-left-bottom bg-no-repeat font-brand-serif text-stone-900">{story.title}</Link>
        {formatStoryDate(story.publishDate || story.createdAt) && <p className="mt-3 font-brand-sans text-[10px] uppercase tracking-[0.14em] text-stone-500">{formatStoryDate(story.publishDate || story.createdAt)}</p>}
      </div>
    </article>
  );
}
