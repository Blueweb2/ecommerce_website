"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Bodoni_Moda, Inter } from 'next/font/google';
import { useProductStore } from "@/store/user/product/useProductStore";
import { Product } from "@/types/product";
import ProductCard from "@/components/product/ProductCard";
import ProductCardSkeleton from "@/components/ui/ProductCardSkeleton";

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ['latin'],
});

export default function NewInSection() {

  const { products, loading, error, fetchNewProducts } = useProductStore();
  const newProducts = products as Product[];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState(0);
  const itemsPerPage = 4;

  useEffect(() => {
    fetchNewProducts();
  }, [fetchNewProducts]);

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
    if (currentIndex + itemsPerPage < newProducts.length) {
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

  const visibleProducts = newProducts.slice(
    currentIndex,
    currentIndex + itemsPerPage
  );

  return (
    <section className="w-full bg-[#f5f5f5] py-10 font-sans">
      <div className="max-w-[2000px] mx-auto flex flex-col md:flex-row gap-6 md:gap-0 items-stretch px-4 md:px-32">

        {/* Left Info Panel    */}
        <div className="md:w-[25%] flex-shrink-0 flex flex-col justify-center pr-3">
          <h2
            className={`${bodoni.className} mb-3 text-[45px] font-normal tracking-tight text-neutral-600`}
          >
            New In
          </h2>
          <p className={`${inter.className} mb-6 text-[14px] text-sm font-normal leading-relaxed text-[#8D8B9D]`}>
            Discover the latest and greatest arrivals, new designers to know, exclusive capsules and more style inspiration.
          </p>
          <div className="flex gap-4">
            <Link
              href="/new-in"
              className="inline-block border bg-black border-neutral-900 text-white text-xs tracking-widest px-10 
              py-2.5 hover:bg-black hover:text-white transition-colors duration-200"
            >
              Shop New In
            </Link>
          </div>
        </div>

        {/* Carousel Wrapper for small device */}
        <div className="relative flex-1 min-w-0 flex items-center lg:hidden">
          
          <div
            className="flex gap-3 overflow-x-auto scroll-smooth w-full scrollbar-hide"
          >
            {loading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <ProductCardSkeleton key={index} />
              ))
            ) : products.length === 0 ? (
              <div className="w-full text-center py-8">
                <p className="text-neutral-500">No new products available</p>
              </div>
            ) : (
              newProducts.slice(0, 8).map((product) => (
                <div
                  key={product._id}
                  className="flex-shrink-0"
                  style={{ width: "clamp(140px, 22vw, 200px)" }}
                >
                  <ProductCard product={product} />
                </div>
              ))
            )}
          </div>

        </div>


        {/* Carousel Wrapper for Large divice */}
        <div className="relative flex-1 min-w-0 items-center hidden lg:flex">

          {/* left button */}
          {currentIndex !== 0 && (
            <button
              onClick={handlePrev}
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
          )}
          
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
              {loading ? (
                Array.from({ length: 4 }).map((_, index) => (
                  <ProductCardSkeleton key={index} />
                ))
              ) : visibleProducts.length === 0 ? (
                <div className="col-span-4 text-center py-8">
                  <p className="text-neutral-500">No new products available</p>
                </div>
              ) : (
                visibleProducts.map((product, index) => (
                  <ProductCard key={product._id} product={product} />
                ))
              )}
            </div>
          </div>
          
          {/* right button */}
          {currentIndex + itemsPerPage < products.length && (
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
          )}

        </div>

      </div>
    </section>
  );
};
