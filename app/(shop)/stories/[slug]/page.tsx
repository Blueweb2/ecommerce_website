import Image from "next/image";
import { getStoryBySlug } from "@/lib/api/story.api";
import { inter, bodoni } from "@/lib/fonts";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;

  try {
    const story = await getStoryBySlug(slug);

    return {
      title: story.title,
      description: story.description,
      openGraph: {
        title: story.title,
        description: story.description,
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
    <section className="bg-[#f8f5ef] pt-24 md:pt-32 lg:pt-46 pb-3 md:pb-7">
      <div className="mx-auto grid max-w-[1800px] grid-cols-1 gap-1 lg:gap-14 px-4 md:px-10 lg:grid-cols-[48%_52%] lg:px-20">

        {/* LEFT SIDE - STICKY IMAGE */}
        <div className="relative">
          <div className="sticky top-28">
            <div className="relative aspect-[4/5] overflow-hidden bg-[#ebe6de] shadow-[0_25px_80px_rgba(0,0,0,0.08)]">
              <Image
                src={story.image.url}
                alt={story.image.alt || story.title}
                fill
                priority
                sizes="(max-width:1024px) 100vw, 50vw"
                className="object-cover transition duration-700"
              />
            </div>
          </div>
        </div>

        {/* RIGHT SIDE - CONTENT */}
        <div className="flex flex-col justify-start pt-2 lg:pt-0">

          {/* CATEGORY */}
          <p className="mb-4 text-[11px] uppercase tracking-[0.35em] text-neutral-500">
            {story.category}
          </p>

          {/* TITLE */}
          <h1 className={`mb-5 lg:mb-10 max-w-4xl text-4xl ${bodoni.className} font-light leading-[1.05] tracking-[-0.04em] text-[#111] md:text-4xl`}>
            {story.title}
          </h1>

          {/* DESCRIPTION */}
          <div
            className={`prose prose-neutral max-w-none prose-headings:font-light prose-headings:text-[#111] prose-p:text-[13px] text-[13px] prose-p:leading-[2] prose-p:text-[#444] prose-a:text-black prose-a:no-underline prose-strong:font-semibold prose-blockquote:border-l-black prose-blockquote:text-neutral-700 prose-img:rounded-2xl ${inter.className}`}
            dangerouslySetInnerHTML={{
              __html: story.description,
            }}
          />
        </div>
      </div>
    </section>
  );
}