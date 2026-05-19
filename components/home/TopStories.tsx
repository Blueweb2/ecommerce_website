"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { getStories } from "@/lib/api/story.api";
import { bodoni, inter } from "@/lib/fonts";
import { headingClassName } from "../ui/headingClassNames";

type Story = {
  _id: string;
  title: string;
  description: string;
  category: string;
  image: {
    url: string;
    public_id: string;
    alt?: string;
  };
  slug: string;
};

export default function TopStories() {

  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  const stripHtml = (html: string) => {
    return html.replace(/<[^>]+>/g, "");
  };

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const data = await getStories();
        setStories(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to load stories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStories();
  }, []);

  if (loading) {
    return (
      <section className="py-12">
        <div className="max-w-[2000px] mx-auto px-4 md:px-20">
          <h2 className={`${bodoni.className} text-[24px] font-normal border-t-2 py-5 border-gray-300`}>
            top stories on
          </h2>
          <div className="flex gap-6 pb-14 border-b-2 border-gray-300">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-[200px] flex-shrink-0 rounded-xl animate-pulse"
              >
                <div className="h-56 w-full bg-gray-200 rounded mb-4" />
                <div className="h-3 w-16 bg-gray-200 rounded mb-2" />
                <div className="h-3 w-full bg-gray-200 rounded" />
                <div className="h-3 w-3/4 bg-gray-200 rounded mt-1" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  };

  if (stories.length === 0) {
    return (
      <div className="text-center text-gray-500 py-10">
        No stories available
      </div>
    );
  };

  return (
    <section className="pt-12">
      <div className="max-w-[2000px] mx-auto px-4 md:px-32">

        {/* TITLE */}
        <h2 className={`${headingClassName} border-t-[2px] border-[#e5e5e5] py-5`}>
          top stories on
        </h2>

        {/* STORIES */}
        <div className="flex gap-6 lg:gap-3 overflow-x-auto scrollbar-hide scroll-smooth lg:grid lg:grid-cols-6 pb-14 text-[#5C5A58]">
          {stories.map((story) => (
            <div
              key={story._id}
              className="min-w-[200px] lg:w-full lg:min-w-0 flex flex-col justify-between"
            >
              {/* IMAGE */}
              <Link
                href={`/stories/${story.slug}`}
                className="flex justify-center h-60 2xl:h-70 mb-4 relative overflow-hidden"
              >
                <Image
                  src={story.image.url}
                  alt={story.image.alt || story.title}
                  fill
                  sizes="200px"
                  className="object-fill"
                />
              </Link>

              {/* CONTENT */}
              <div className="mr-8">
                <h3 className={`${bodoni.className} text-sm font-semibold mb-2 uppercase`}>
                  {story.category}
                </h3>
                <div className="text-xs space-y-2">
                  <p className={`${inter.className} mt-3 min-h-[3rem] line-clamp-3`}>
                    {stripHtml(story.description)}
                  </p>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
