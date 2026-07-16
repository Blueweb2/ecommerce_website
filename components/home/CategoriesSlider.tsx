"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { categoryAPI } from "@/lib/api/category.api";
import { optimizeCloudinaryUrl } from "@/lib/constants/admin-catalog";
import { headingClassName } from "../ui/headingClassNames";

type Category = {
  _id: string;
  name: string;
  slug: string;
  image?: {
    url: string;
  };
};

export default function CategoriesSlider() {

  const scrollRef = useRef<HTMLDivElement>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPrev, setShowPrev] = useState(false);
  const [showNext, setShowNext] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoryAPI.getAll();
        setCategories(res.data?.data || []);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const container = scrollRef.current;

    if (!container) return;

    checkScrollPosition();

    container.addEventListener("scroll", checkScrollPosition);

    return () => {
      container.removeEventListener("scroll", checkScrollPosition);
    };
  }, [categories]);

  const checkScrollPosition = () => {
    if (!scrollRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;

    setShowPrev(scrollLeft > 0);

    setShowNext(
      scrollLeft < scrollWidth - clientWidth - 1
    );
  };

  const handleScroll = (position: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: position,
        behavior: "smooth"
      })
    }
  }

  return (
    <div>
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h2 className={headingClassName}>Shop by Categories</h2>
      </div>

      {/* SLIDER */}
      <div className="relative">

        {!loading && (
          <>
            {showPrev && (
              <button
                onClick={() => handleScroll(-300)}
                aria-label="Scroll left"
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-neutral-200 w-6 h-10 md:w-10 md:h-14 flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-full m-0.5 text-neutral-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}

            <div ref={scrollRef} className="flex gap-2 overflow-x-auto scrollbar-hide">
              {!loading && (
                categories.map((cat) => (
                  <Link key={cat._id} href={`/category/${cat.slug}`}>
                    <div className="relative w-[200px] h-[250px] lg:w-[290px] lg:h-[330px]">
                      <Image
                        src={optimizeCloudinaryUrl(cat.image?.url) || "/placeholder.png"}
                        alt={cat.name}
                        fill
                        sizes="(max-width: 768px) 200px, 290px"
                        className="object-cover"
                      />
                      <h3 className="absolute inset-0 capitalize flex items-center justify-center text-white bg-black/30">
                        {cat.name
                          ?.toLowerCase()
                          .replace(/\b\w/g, (char) => char.toUpperCase())}
                      </h3>
                    </div>
                  </Link>
                ))
              )}
            </div>

            {showNext && (
              <button
                onClick={() => handleScroll(300)}
                aria-label="Scroll right"
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-neutral-200 w-6 h-10 md:w-10 md:h-14 flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-full h-full m-0.5 text-neutral-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};
