"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface Product {
  id: number;
  label: string;
  image: string;
  alt: string;
}

const products: Product[] = [
  {
    id: 1,
    label: "SHOP EARRINGS",
    image: "/home/herosection/hero-right-bottom.png",
    alt: "Black ribbed short sleeve top",
  },
  {
    id: 2,
    label: "SHOP EARRINGS",
    image: "/home/herosection/hero-right-bottom.png",
    alt: "Black strappy heeled sandals",
  },
  {
    id: 3,
    label: "SHOP EARRINGS",
    image: "/home/herosection/hero-right-bottom.png",
    alt: "Gold emerald and diamond ring",
  },
  {
    id: 4,
    label: "SHOP EARRINGS",
    image: "/home/herosection/hero-right-bottom.png",
    alt: "Green floral sun hat",
  },
  {
    id: 5,
    label: "SHOP EARRINGS",
    image: "/home/herosection/hero-right-bottom.png",
    alt: "Luxury leather handbag",
  },
  {
    id: 6,
    label: "SHOP EARRINGS",
    image: "/home/herosection/hero-right-bottom.png",
    alt: "Luxury leather handbag",
  },
  {
    id: 7,
    label: "SHOP EARRINGS",
    image: "/home/herosection/hero-right-bottom.png",
    alt: "Luxury leather handbag",
  },
  {
    id: 8,
    label: "SHOP EARRINGS",
    image: "/home/herosection/hero-right-bottom.png",
    alt: "Luxury leather handbag",
  },
];

export default function NewInSection() {

  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.75;
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
    setTimeout(updateScrollState, 350);
  };

  return (
    <section className="w-full bg-[#f5f5f5] py-10 px-4 md:px-8 font-sans">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6 md:gap-0 items-stretch px-4 md:px-8">
        
        {/* Left Info Panel */}
        <div className="md:w-56 flex-shrink-0 flex flex-col justify-center pr-6">
          <h2
            className="text-2xl md:text-3xl font-semibold tracking-tight text-neutral-900 mb-3"
            style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
          >
            New In
          </h2>
          <p className="text-sm text-neutral-500 leading-relaxed mb-6">
            New arrivals, now dropping five days a week — discover the latest
            launches onsite from Monday to Friday.
          </p>
          <Link
            href="/more-products"
            className="inline-block border bg-black border-neutral-900 text-white text-xs tracking-widest uppercase px-5 py-2.5 hover:bg-black hover:text-white transition-colors duration-200 w-fit"
          >
            Shop New In
          </Link>
        </div>

        {/* Carousel Wrapper */}
        <div className="relative flex-1 min-w-0 flex items-center">
          
          {/* Left Arrow */}
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            aria-label="Scroll left"
            className={`absolute left-0 z-10 -translate-x-1/2 bg-white border border-neutral-200 rounded-full w-8 h-8 flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-200 ${
              !canScrollLeft ? "opacity-30 cursor-not-allowed" : "hover:scale-105"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-3.5 h-3.5 text-neutral-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Scrollable Product List */}
          <div
            ref={scrollRef}
            onScroll={updateScrollState}
            className="flex gap-3 overflow-x-auto scroll-smooth w-full scrollbar-hide"
          >
            {products.map((product) => (
              <Link
                key={product.id}
                href="/product/3"
                className="flex-shrink-0 group flex flex-col items-center gap-2"
                style={{ width: "clamp(140px, 22vw, 200px)" }}
              >
                {/* Image Box */}
                <div className="w-full aspect-[3/4] bg-neutral-100 overflow-hidden relative">
                  
                  <div className="w-full h-full bg-neutral-200 group-hover:scale-105 transition-transform duration-500 ease-out" />
                  
                  <Image
                    src={product.image}
                    alt={product.alt}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    sizes="(max-width: 768px) 45vw, 22vw"
                  />
                 
                </div>

                {/* Label */}
                <span className="text-[10px] tracking-[0.15em] uppercase text-neutral-800 font-medium group-hover:text-neutral-500 transition-colors duration-150">
                  {product.label}
                </span>
              </Link>
            ))}
          </div>

          {/* Right Arrow */}
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            aria-label="Scroll right"
            className={`absolute right-0 z-10 translate-x-1/2 bg-white border border-neutral-200 rounded-full w-8 h-8 flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-200 ${
              !canScrollRight ? "opacity-30 cursor-not-allowed" : "hover:scale-105"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-3.5 h-3.5 text-neutral-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}