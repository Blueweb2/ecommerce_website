"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const slides = [
  {
    image: "/home/herosection/hero-right-bottom.png",
    title: "Timeless Jewellery for Every Moment",
    desc: "Fine jewellery designed to be worn, loved, and remembered.",
  },
  {
    image: "/home/herosection/hero-center.png",
    title: "Elegant Designs for Every Style",
    desc: "Discover pieces that reflect your unique personality.",
  },
  {
    image: "/home/categorysection/category-one.png",
    title: "Crafted with Passion",
    desc: "Every piece tells a story of beauty and craftsmanship.",
  },
];

export default function HeroSection() {

  const [current, setCurrent] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  const startAutoSlide = () => {
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % 3);
    }, 4000);
  };

  useEffect(() => {
    startAutoSlide();

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);


  const handleClick = (e:React.MouseEvent<HTMLButtonElement>,index:number) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrent(index)
    // stop auto slide
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // restart auto slide
    startAutoSlide();
  }

  return (
    <section className="w-full bg-[#f5f5f5] py-8 mt-8 md:mt-14">
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT BIG CARD */}
        <Link
          href='/more-products'
          className="relative rounded-2xl overflow-hidden min-h-[420px] flex items-end p-6 text-white border"
        >
          {/* Background */}
          <div
            key={current}
            className="absolute inset-0 transition-opacity duration-700 opacity-100"
            style={{
              backgroundImage: `url(${slides[current].image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />

          {/* Content */}
          <div className="relative max-w-xs z-10">
            <h1
              key={slides[current].title}
              className="text-3xl md:text-4xl font-semibold leading-snug mb-4 font-serif text-black animate-fadeUp"
            >
              {slides[current].title}
            </h1>

            <p
              key={slides[current].desc}
              className="text-sm mb-5 text-black animate-fadeUp animate-delay-200"
            >
              {slides[current].desc}
            </p>

            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                router.push("/product/3");
              }}
              
              className="inline-block bg-black text-white text-sm px-5 py-2 rounded-[5px]
             transition-all duration-300
             hover:-translate-y-1 hover:shadow-lg hover:bg-gray-900
             active:translate-y-0 active:shadow-md
             animate-fadeUp animate-delay-300"
            >
              SHOP NOW
            </button>

            {/* buttons */}
            <div className="flex gap-3 items-center justify-center mt-6 h-6">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => handleClick(e,index)}
                  className={`rounded-full transform transition-all duration-300 ease-out ${
                    current === index
                      ? "w-4 h-4 bg-black scale-125"
                      : "w-2.5 h-2.5 bg-gray-400 scale-100 hover:bg-black"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* for better text visibility */}
          <div className="absolute inset-0 bg-white/30 z-0" />
        </Link>

        {/* CENTER CARD */}
        <Link
          href='/more-products'
          className="relative rounded-2xl overflow-hidden min-h-[420px] flex flex-col justify-between p-6 border border-white"
          style={{
            backgroundImage: "url('/home/herosection/hero-center.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="text-center mt-2">
            <h2 className="text-2xl font-semibold text-gray-800 animate-fadeUp font-serif">
              Elegant Rings
            </h2>
            <p className="text-sm text-gray-600 mt-2 animate-fadeUp animate-delay-200">
              From delicate bands to statement designs, find rings crafted to
              capture every moment beautifully.
            </p>

            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                router.push("/product/3");
              }}
              
              className="inline-block bg-black text-white text-sm px-5 py-2 rounded-[5px] mt-4
             transition-all duration-300
             hover:-translate-y-1 hover:shadow-lg hover:bg-gray-900
             active:translate-y-0 active:shadow-md
             animate-fadeUp animate-delay-300"
            >
              SHOP RINGS
            </button>
          </div>
        </Link>

        {/* RIGHT SIDE (2 CARDS) */}
        <div className="flex lg:flex-col gap-6">

          {/* TOP RIGHT */}
          <div
            className="relative rounded-2xl overflow-hidden min-h-[200px] flex items-end p-5 text-white w-full border"
            style={{
              backgroundImage: "url('/home/herosection/hero-right-top.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="h-full flex flex-col justify-between">
              <h3 className="text-lg animate-slide-right font-serif">
                Signature <br /> Necklaces
              </h3>

              <Link
                href="/product/3"
                className="group text-xs mt-2 inline-flex items-center text-white/70 gap-1 transition duration-300"
              >
                <span className="group-hover:text-white transition duration-300">
                  SHOP NECKLACES
                </span>
                <span className="group-hover:text-white transform transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>

            </div>
          </div>

          {/* BOTTOM RIGHT */}
          <div
            className="relative rounded-2xl overflow-hidden min-h-[200px] flex items-end p-5 w-full border border-white"
            style={{
              backgroundImage: "url('/home/herosection/hero-right-bottom.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="text-center w-full">
              <h3 className="text-lg font-semibold text-gray-800 animate-slide-right font-serif">
                Modern Earrings
              </h3>
              <Link
                href="/product/3"
                className="group text-xs mt-2 inline-flex items-center gap-1 text-gray-700 transition duration-300"
              >
                <span className="group-hover:text-black transition duration-300">
                  SHOP EARRINGS
                </span>
                <span className="transform transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};