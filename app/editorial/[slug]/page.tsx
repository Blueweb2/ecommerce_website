import type { Metadata } from "next";
import EditorialExperience from "@/components/editorial/EditorialExperience";
import { STORY_CATEGORIES } from "@/lib/constants/storyCategories";
import { getStory } from "@/lib/api/story.api";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = STORY_CATEGORIES.find((item) => item.slug === slug);
  if (category) return { title: `${category.label} | The Zenfaz Edit`, description: `Explore ${category.label.toLowerCase()} stories from The Zenfaz Edit.`, alternates: { canonical: `/editorial/${slug}` }, openGraph: { title: `${category.label} | The Zenfaz Edit`, type: "website", url: `/editorial/${slug}` } };
  try {
    const story = await getStory(slug);
    if (story) return { title: `${story.title} | The Zenfaz Edit`, description: story.excerpt || story.title, alternates: { canonical: `/editorial/${slug}` }, openGraph: { title: story.title, description: story.excerpt || story.title, type: "article", url: `/editorial/${slug}`, images: story.heroImage?.url ? [story.heroImage.url] : [] } };
  } catch { /* Page handles unavailable API content on the client. */ }
  return { title: "Story | The Zenfaz Edit", alternates: { canonical: `/editorial/${slug}` } };
}

export default async function EditorialSegmentPage({ params }: Props) { const { slug } = await params; return <EditorialExperience segment={slug} />; }
