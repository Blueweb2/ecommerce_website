"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

const CategoriesOfProducts = [
  { name: "Rings", logo: '/home/categorysection/category-one.png' },
  { name: "Rings", logo: '/home/categorysection/category-one.png' },
  { name: "Rings", logo: '/home/categorysection/category-one.png' },
  { name: "Rings", logo: '/home/categorysection/category-one.png' },
  { name: "Rings", logo: '/home/categorysection/category-one.png' },
  { name: "Rings", logo: '/home/categorysection/category-one.png' },
  { name: "Rings", logo: '/home/categorysection/category-one.png' },
  { name: "Rings", logo: '/home/categorysection/category-one.png' },
  { name: "Rings", logo: '/home/categorysection/category-one.png' },
  { name: "Rings", logo: '/home/categorysection/category-one.png' },
];

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

const Categories = () => {

  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 200;

      scrollRef.current.scrollBy({
        left: direction === "right" ? scrollAmount : -scrollAmount,
        behavior: "smooth",
      });
    };
  };

  return (
    <section className="bg-[#f5f5f5] pt-10 pb-6">
      <div className="max-w-7xl mx-auto px-4 md:px-8">

        {/* TOP HEADER */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight text-gray-700      font-serif">
            Shop by Categories
          </h2>

          {/* ARROWS */}
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

        {/* CATEGORIES SLIDER */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
        >
          {CategoriesOfProducts.map((categories, index) => (
            <div
              key={index}
              className="relative w-[200px] h-[130px] md:min-w-[230px] md:min-h-[250px] flex-shrink-0 bg-white 
               border border-gray-300 overflow-hidden"
            >
              <Image
                src={categories.logo}
                alt={categories.name}
                fill
                className="object-cover"
              />

              <h3 className="absolute inset-0 flex items-center justify-center text-white font-semibold text-lg bg-black/30">{categories.name}</h3>
            </div>
          ))}
        </div>

        {/* TOP THREE CATEGORIES */}
        <div className="grid grid-cols-3 gap-4 items-center mt-6">
          {topThreeCategories.map((categories) => (
            <div className="flex flex-col h-full" key={categories.id}>
              <div
                key={categories.id}
                className="flex items-center justify-center grayscale hover:grayscale-0 transition duration-300"
              >
                <Image
                  src={categories.image}
                  alt={categories.title}
                  width={120}
                  height={60}
                  className="object-contain w-full "
                />
              </div>

              <div className="mt-4 flex flex-col justify-between h-full text-black">

                {/* Top Content */}
                <div>
                  <h2 className="text-[13px] md:text-[14px] font-semibold tracking-[0.5px] leading-tight uppercase">
                    {categories.title}
                  </h2>

                  <p className="text-[11px] text-gray-500 mt-2 leading-relaxed line-clamp-3">
                    {categories.description}
                  </p>
                </div>

                {/* Bottom Link */}
                <Link
                  href={categories.link}
                  className="mt-4 text-[11px] font-medium uppercase tracking-wide border-b border-black w-fit hover:opacity-60 transition"
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