"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Lora, Poppins } from 'next/font/google';

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
    image: "/home/categorysection/category-one.png",
    alt: "Luxury leather handbag",
  },
  {
    id: 6,
    label: "SHOP EARRINGS one",
    image: "/home/categorysection/category-one.png",
    alt: "Luxury leather handbag",
  },
  {
    id: 7,
    label: "SHOP EARRINGS two",
    image: "/home/categorysection/category-one.png",
    alt: "Luxury leather handbag",
  },
  {
    id: 8,
    label: "SHOP EARRINGS",
    image: "/home/categorysection/category-one.png",
    alt: "Luxury leather handbag",
  },
  {
    id: 9,
    label: "SHOP EARRINGS",
    image: "/home/herosection/hero-right-top.png",
    alt: "Luxury leather handbag",
  },
  {
    id: 10,
    label: "SHOP EARRINGS one",
    image: "/home/herosection/hero-right-top.png",
    alt: "Luxury leather handbag",
  },
  {
    id: 11,
    label: "SHOP EARRINGS two",
    image: "/home/herosection/hero-right-top.png",
    alt: "Luxury leather handbag",
  },
  {
    id: 12,
    label: "SHOP EARRINGS",
    image: "/home/herosection/hero-right-top.png",
    alt: "Luxury leather handbag",
  },
  {
    id: 13,
    label: "SHOP EARRINGS",
    image: "/home/herosection/hero-right-top.png",
    alt: "Luxury leather handbag",
  }
];

const lora = Lora({
  subsets: ['latin'],
  weight: ['400', '700'],
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '700'],
});

export default function NewInSection() {

  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState(0);
  const itemsPerPage = 4;

  useEffect(() => {
    if (!isAnimating) return;

    const timer = setTimeout(() => {
      if (direction === 1) {
        setCurrentIndex((prev) => prev + itemsPerPage);
      } else {
        setCurrentIndex((prev) => prev - itemsPerPage);
      }
      setIsAnimating(false);
    }, 600);

    return () => clearTimeout(timer);
  }, [isAnimating, direction]);

  const handleNext = () => {
    if (isAnimating) return;
    if (currentIndex + itemsPerPage < products.length) {
      setDirection(1);
      setIsAnimating(true);
    }
  };

  const handlePrev = () => {
    if (isAnimating) return;
    if (currentIndex - itemsPerPage >= 0) {
      setDirection(-1);
      setIsAnimating(true);
    }
  };

  const visibleProducts = products.slice(
    currentIndex,
    currentIndex + itemsPerPage
  );

  return (
    <section className="w-full bg-[#f5f5f5] py-10 lg:px-8 font-sans">
      <div className="max-w-[2000px] mx-auto flex flex-col md:flex-row gap-6 md:gap-0 items-stretch ">
        
        {/* Left Info Panel */}
        <div className="md:w-96 flex-shrink-0 flex flex-col justify-center pr-3">
          <h2
            className={`${lora.className} tracking-tight text-neutral-900 mb-3 lora text-[40px] font-normal`}
          >
            New In
          </h2>
          <p className={`${poppins.className} text-[16px] font-normal text-sm leading-relaxed mb-6`}>
            New arrivals, now dropping five days a week — discover the latest
            launches onsite from Monday to Friday.
          </p>
          <Link
            href="/more-products"
            className="inline-block border bg-black border-neutral-900 text-white text-xs tracking-widest px-10 
            py-2.5 hover:bg-black hover:text-white transition-colors duration-200 w-fit"
          >
            Shop New In
          </Link>
        </div>

        {/* Carousel Wrapper for small divice */}
        <div className="relative flex-1 min-w-0 flex items-center lg:hidden">
          
          <div
            ref={scrollRef}
            className="flex gap-3 overflow-x-auto scroll-smooth w-full scrollbar-hide"
          >
            {products.map((product) => (
              <Link
                key={product.id}
                href="/product/3"
                className="flex-shrink-0 group flex flex-col items-center gap-2"
                style={{ width: "clamp(140px, 22vw, 200px)" }}
              >
                
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

                
                <span className="text-[10px] tracking-[0.15em] uppercase text-neutral-800 font-medium group-hover:text-neutral-500 transition-colors duration-150">
                  {product.label}
                </span>
              </Link>
            ))}
          </div>

        </div>


        {/* Carousel Wrapper for Large divice */}
        <div className="relative flex-1 min-w-0 items-center hidden lg:flex">

          {/* left button */}
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            aria-label="Scroll left"
            className={`absolute left-0 z-10 bg-white border border-neutral-200 w-10 h-14 flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-200 ${
              currentIndex === 0 ? "opacity-30 cursor-not-allowed" : "hover:scale-105"
            }`}
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
          
          <div className="overflow-hidden w-full">
            <div
              className={`grid grid-cols-4 gap-3 transition-transform duration-300 ${
                isAnimating
                  ? direction === 1
                    ? "-translate-x-full"
                    : "translate-x-full"
                  : "translate-x-0"
              }`}
            >
              {visibleProducts.map((product) => (
                <Link
                  key={product.id}
                  href="/product/3"
                  className="group flex flex-col items-center gap-2"
                >
                  <div className="w-full aspect-[3/4] bg-neutral-100 overflow-hidden relative">
                    <Image
                      src={product.image}
                      alt={product.alt}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <span className="text-[10px] tracking-[0.15em] uppercase text-neutral-800 font-medium">
                    {product.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>
          
          {/* right button */}
          <button
            onClick={handleNext}
            disabled={currentIndex + itemsPerPage >= products.length}
            aria-label="Scroll right"
            className={`absolute right-0 z-10 bg-white border border-neutral-200 w-10 h-14 flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-200 ${
              currentIndex + itemsPerPage >= products.length ? "opacity-30 cursor-not-allowed" : "hover:scale-105"
            }`}
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
        </div>

      </div>
    </section>
  );
};