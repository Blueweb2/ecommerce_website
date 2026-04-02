"use client";

import { useState, useEffect, useRef } from "react";
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
    <section className="w-full bg-[#f5f5f5] py-8 mt-8 ">
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-3">

        {/* LEFT BIG CARD */}
        <Link
          href='/more-products'
          className="relative overflow-hidden min-h-[570px] flex justify-center items-end p-6 text-white border"
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

        {/* RIGHT CARD */}
        <div className="flex flex-col md:flex-row gap-3">
          
          {/* LEFT SIDE */}
          <Link
            href='/more-products'
            className="relative overflow-hidden w-[60%] flex flex-col justify-between p-6 border border-white"
            style={{
              backgroundImage: "url('/home/herosection/hero-center.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />

          {/* RIGHT SIDE (2 CARDS) */}
          <div className="flex lg:flex-col justify-between gap-3 w-[40%] h-full">

            {/* TOP RIGHT */}
            <div
              className="relative overflow-hidden h-full flex items-end p-5 text-white w-full border"
              style={{
                backgroundImage: "url('/home/herosection/hero-right-top.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />

            {/* BOTTOM RIGHT */}
            <div
              className="relative overflow-hidden  h-full flex items-end p-5 w-full border border-white"
              style={{
                backgroundImage: "url('/home/herosection/hero-right-bottom.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />

          </div>
        </div>

      </div>
    </section>
  );
};