"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { getStories } from "@/lib/api/story.api";

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
      <section className="bg-[#f5f5f5] py-12">
        <div className="max-w-[2000px] mx-auto px-4 md:px-20">
          <h2 className="text-2xl font-semibold border-t-2 py-5 border-gray-300">
            TOP STORIES ON
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
  }

if (stories.length === 0) {
  return (
    <div className="text-center text-gray-500 py-10">
      No stories available
    </div>
  );
}
  return (
    <section className="bg-[#f5f5f5] py-12">
      <div className="max-w-[2000px] mx-auto px-4 md:px-20">

        {/* TITLE */}
        <h2 className="text-2xl font-semibold border-t-2 py-5 border-gray-300">
          TOP STORIES ON
        </h2>

        {/* STORIES */}
        <div className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-14 border-b-2 border-gray-300">
          {stories.map((story) => (
            <div
              key={story._id}
              className="w-[200px] flex flex-col justify-between flex-shrink-0 rounded-xl"
            >
              {/* IMAGE */}
              <Link
                href={`/stories/${story.slug}`}
                className="flex justify-center h-56 mb-4 relative overflow-hidden"
              >
                <Image
                  src={story.image.url}
                  alt={story.image.alt || story.title}
                  fill
                  sizes="200px"
                  className="object-cover"
                />
              </Link>

              {/* CONTENT */}
              <div>
                <h3 className="text-sm font-semibold mb-2 text-gray-500 uppercase">
                  {story.category}
                </h3>
                <p className="text-xs line-clamp-3">
                  {story.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}