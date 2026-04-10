"use client";

import { useState } from "react";

type CarouselProps = {
  images: any[]; // ✅ dynamic images
  setZooming: React.Dispatch<React.SetStateAction<boolean>>;
};

const Carousel = ({ images = [], setZooming }: CarouselProps) => {
  const [leftPos, setLeftPos] = useState({ x: 0, y: 0 });
  const [hideCursor, setHideCursor] = useState(false);
  const [indexx, setIndex] = useState(0);

  // ✅ fallback if no images
  const safeImages =
    images.length > 0
      ? images
      : [{ url: "/placeholder.png", altText: "no image" }];

  const nextSlide = () => {
    if (indexx < safeImages.length - 1) {
      setIndex(indexx + 1);
    }
  };

  const prevSlide = () => {
    if (indexx > 0) {
      setIndex(indexx - 1);
    }
  };

  return (
    <div
      className="flex items-center justify-center h-[100px] lg:min-h-screen mt-40 lg:mt-3"
      onClick={() => setZooming(false)}
    >
      <div
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          setLeftPos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
          });
        }}
        className="relative w-full max-w-7xl mx-auto overflow-hidden cursor-none group"
      >
        {/* ================= SLIDES ================= */}
        <div
          className="flex transition-transform duration-500"
          style={{
            transform: `translateX(-${indexx * 100}%)`,
          }}
        >
          {safeImages.map((img, i) => (
            <div key={i} className="min-w-full">
              <img
                src={img.url}
                alt={img.altText || "product"}
                className="w-full h-[300px] md:h-[600px] lg:h-[500px] object-cover"
              />
            </div>
          ))}
        </div>

        {/* ================= LEFT BUTTON ================= */}
        <button
          onMouseEnter={() => setHideCursor(true)}
          onMouseLeave={() => setHideCursor(false)}
          onClick={(e) => {
            e.stopPropagation();
            prevSlide();
          }}
          className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/60 text-white px-3 py-2 rounded"
        >
          ◀
        </button>

        {/* ================= RIGHT BUTTON ================= */}
        <button
          onMouseEnter={() => setHideCursor(true)}
          onMouseLeave={() => setHideCursor(false)}
          onClick={(e) => {
            e.stopPropagation();
            nextSlide();
          }}
          className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/60 text-white px-3 py-2 rounded"
        >
          ▶
        </button>

        {/* ================= CURSOR ================= */}
        <div
          className={`pointer-events-none absolute w-10 h-10 bg-black/60 rounded-full 
          ${
            hideCursor ? "opacity-0" : "opacity-0 group-hover:opacity-100"
          } 
          transition flex items-center justify-center text-white`}
          style={{
            left: leftPos.x - 20,
            top: leftPos.y - 20,
          }}
        >
          <span className="scale-150">&times;</span>
        </div>

        {/* ================= DOTS ================= */}
        <div
          onMouseEnter={() => setHideCursor(true)}
          onMouseLeave={() => setHideCursor(false)}
          onClick={(e) => e.stopPropagation()}
          className="flex gap-3 items-center justify-center h-6 lg:h-12 cursor-auto"
        >
          {safeImages.map((_, index) => (
            <button
              key={index}
              onClick={(e) => {
                e.stopPropagation();
                setIndex(index);
              }}
              className={`rounded-full transition-all duration-300 ${
                indexx === index
                  ? "w-4 h-4 bg-black scale-125"
                  : "w-2.5 h-2.5 bg-gray-400 hover:bg-black"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Carousel;