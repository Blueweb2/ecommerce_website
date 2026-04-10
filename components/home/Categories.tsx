"use client";

import { useRef, useEffect, useState } from "react";
import { Lora } from 'next/font/google';
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { categoryAPI } from "@/lib/api/category.api";

type Category = {
  _id: string;
  name: string;
  slug: string;
  image?: {
    url: string;
  };
};

const topThreeCategories = [
  {
    id: 1,
    title: "How to wear the polo shirt",
    description:
      "Every piece is thoughtfully created to bring out timeless elegance and lasting beauty.",
    image: "/home/herosection/hero-right-top.png",
    link: "/shop/polo-shirt",
  },
  {
    id: 2,
    title: "Minimal leather heels collection",
    description:
      "Designed for comfort and sophistication, perfect for every modern outfit.",
    image: "/home/herosection/hero-right-top.png",
    link: "/shop/heels",
  },
  {
    id: 3,
    title: "Luxury gold jewelry essentials",
    description:
      "Crafted with precision to highlight brilliance and premium craftsmanship.",
    image: "/home/herosection/hero-right-top.png",
    link: "/shop/jewelry",
  },
];

const lora = Lora({
  subsets: ['latin'],
  weight: ['400', '700'],
});

const Categories = () => {

  const scrollRef = useRef<HTMLDivElement>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // FETCH FROM BACKEND
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoryAPI.getAll();
        console.log("Categories:", res.data);

        setCategories(res.data.data); // adjust if needed
      } catch (error) {
        console.error("Failed to fetch categories", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "right" ? 200 : -200,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="bg-[#f5f5f5] pt-10 pb-6">
      <div className="max-w-[2000px] mx-auto px-4 md:px-8">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <h2 className={`${lora.className} font-normal text-[40px] tracking-tight text-neutral-900`}>
            Shop by Categories
          </h2>

          <div className="flex gap-2">
            <button
              onClick={() => scroll("left")}
              className="w-8 h-8 rounded-full border border-gray-400 flex items-center justify-center hover:bg-gray-200 transition"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => scroll("right")}
              className="w-8 h-8 rounded-full border border-gray-400 flex items-center justify-center hover:bg-gray-200 transition"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* CATEGORY SLIDER */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
        >
          {loading ? (
            <p className="text-gray-500">Loading categories...</p>
          ) : categories.length === 0 ? (
            <p className="text-gray-500">No categories found</p>
          ) : (
            categories.map((cat) => (
              <Link
                key={cat._id}
                href='/product/3'
              >
                <div className="relative w-[200px] h-[130px] md:min-w-[230px] md:min-h-[250px] flex-shrink-0 bg-white overflow-hidden hover:scale-105 transition duration-300">

                  <Image
                    src={cat.image?.url || "/home/categorysection/category-one.png"}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 768px) 200px, 230px"
                    className="object-cover"
                  />

                  <h3 className="absolute inset-0 flex items-center justify-center text-white font-semibold text-lg bg-black/30">
                    {cat.name}
                  </h3>

                </div>
              </Link>
            ))
          )}
        </div>

        {/* TOP THREE CATEGORIES */}
        <div className="grid grid-cols-3 gap-4 items-center mt-6">
          {topThreeCategories.map((item) => (
            <div className="flex flex-col h-full" key={item.id}>
              <div className="flex items-center justify-center grayscale hover:grayscale-0 transition duration-300">
                <Link
                  href='/product/3'
                  className="w-full"
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={120}
                    height={60}
                    className="object-contain w-full"
                  />
                </Link>
              </div>

              <div className="mt-4 flex flex-col justify-between h-full text-black">
                <div>
                  <h2 className="text-[13px] md:text-[14px] font-semibold uppercase">
                    {item.title}
                  </h2>

                  <p className="text-[11px] text-gray-500 mt-2 line-clamp-3">
                    {item.description}
                  </p>
                </div>

                <Link
                  href='/product/3'
                  className="mt-4 text-[11px] font-medium uppercase border-b border-black w-fit hover:opacity-60 transition"
                >
                  Explore Designs
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Categories;