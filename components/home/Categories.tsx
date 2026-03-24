"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

const brands = [
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
    <section className="bg-[#f5f5f5] py-10">
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
          className="flex gap-4 overflow-x-auto scrollbar-hide"
        >
          {brands.map((brand, index) => (
            <div
              key={index}
              className="relative w-[200px] h-[130px] md:min-w-[230px] md:min-h-[250px] flex-shrink-0 bg-white 
              rounded-[20px] border border-gray-300 overflow-hidden"
            >
              <Image
                src={brand.logo}
                alt={brand.name}
                fill
                className="object-cover"
              />

              <h3 className="absolute inset-0 flex items-center justify-center text-white font-semibold text-lg bg-black/30">{brand.name}</h3>
            </div>
          ))}
        </div>

        <div
          className="relative h-[300px] sm:h-[350px] md:h-[400px] mt-6 rounded-2xl overflow-hidden flex items-center justify-end p-4 sm:p-6 md:p-10"
          style={{
            backgroundImage: "url('/home/herosection/hero-right-top.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* BACKGROUND GRADIENT */}
          <div className="absolute inset-0 bg-gradient-to-l from-black/70 via-black/40 to-transparent"/>

          <div className="max-w-[280px] sm:max-w-[320px] md:max-w-[400px] p-4 sm:p-6 rounded-xl text-white z-10">
            
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-2">
              Designed with Precision
            </h2>

            <p className="text-sm sm:text-base mb-4">
              Every piece is thoughtfully crafted to bring out timeless elegance and lasting beauty.
            </p>

            <Link
              href="/"
              className="inline-block text-sm sm:text-base font-semibold bg-[#B89F69] hover:bg-[#9f8755] transition duration-300 rounded-[60px] py-2 px-5 uppercase"
            >
              Explore Designs
            </Link>

          </div>
        </div>

      </div>
    </section>
  );
};

export default Categories;