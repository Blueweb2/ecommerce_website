// app/stories/[slug]/page.tsx

import Image from "next/image";
import { getStoryBySlug } from "@/lib/api/story.api";

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params; // ✅ FIX

  try {
    const story = await getStoryBySlug(slug);

    return {
      title: story.title,
      description: story.description,
      openGraph: {
        images: [story.image.url],
      },
    };
  } catch {
    return {
      title: "Story",
    };
  }
}


export default async function StoryDetailPage({ params }: Props) {
  const { slug } = await params; // ✅ FIX

  console.log("Slug from URL:", slug); // 👈 ADD HERE

  let story = null;

  try {
    story = await getStoryBySlug(slug);
  } catch (error) {
    console.log("API Error:", error); // 👈 optional debug
    story = null;
  }

  if (!story) {
    return (
      <div className="p-10 text-center text-gray-500">
        Story not found
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 mt-14">

      {/* CATEGORY */}
      <p className="text-xs uppercase text-gray-500 mb-2">
        {story.category}
      </p>

      {/* TITLE */}
      <h1 className="text-3xl font-semibold mb-6">
        {story.title}
      </h1>

      {/* IMAGE */}
      <div className="relative w-full h-[400px] mb-6 rounded-xl overflow-hidden">
        <Image
          src={story.image.url}
          alt={story.image.alt || story.title}
          fill
          sizes="(max-width: 1024px) 100vw, 960px"
          className="object-cover"
        />
      </div>

      {/* DESCRIPTION */}
      <div
        className="prose prose-lg prose-slate max-w-none"
        dangerouslySetInnerHTML={{ __html: story.description }}
      />
    </div>
  );
}