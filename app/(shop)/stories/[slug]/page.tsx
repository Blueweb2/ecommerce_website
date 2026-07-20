import { getStoryBySlug } from "@/lib/api/story.api";
import StoryHero from "@/components/story/StoryHero";
import StorySectionRenderer from "@/components/story/StorySectionRenderer";
import StoryFooter from "@/components/story/StoryFooter";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;

  try {
    const story = await getStoryBySlug(slug);

    return {
      title: story.title,
      description: story.excerpt || story.title,
      openGraph: {
        title: story.title,
        description: story.excerpt || story.title,
        images: [story.heroImage?.url || ""],
      },
    };
  } catch {
    return {
      title: "Story",
    };
  }
}

export default async function StoryDetailPage({ params }: Props) {
  const { slug } = await params;

  let story = null;

  try {
    story = await getStoryBySlug(slug);
  } catch (error) {
    console.log("API Error:", error);
    story = null;
  }

  if (!story) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8f5ef] px-32 text-center text-gray-500">
        Story not found
      </div>
    );
  }

  return (
    <section className="bg-[#fcfbf9] min-h-screen pt-24 pb-10">
      <StoryHero
        title={story.title}
        excerpt={story.excerpt}
        heroImage={story.heroImage}
        author={story.author}
        publishDate={story.publishDate}
      />
      <StorySectionRenderer sections={story.sections || []} />
      <StoryFooter author={story.author} />
    </section>
  );
}