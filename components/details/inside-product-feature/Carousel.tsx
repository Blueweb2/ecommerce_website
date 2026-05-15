"use client";

import React, { useState, useEffect } from "react";
import { optimizeCloudinaryUrl } from "@/lib/constants/admin-catalog";
import { useProductStore } from "@/store/user/product/useProductStore";

type CarouselProps = {
  images: any[];
  
  firstImage?: number;
};

const Carousel = ({ images = [], firstImage }: CarouselProps) => {

  const [index, setIndex] = useState(firstImage ?? 0);
  const [leftPos, setLeftPos] = useState({ x: 0, y: 0 });
  const [hideCursor, setHideCursor] = useState(false);
  const { setZooming } = useProductStore();

  useEffect(() => {
    setIndex(firstImage ?? 0);
  }, [firstImage]);

  const safeImages =
    images.length > 0
      ? images
      : [{ url: "/placeholder.png", altText: "no image" }];

  const next = (e:React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIndex((prev) => (prev + 1) % safeImages.length);
  };

  const prev = (e:React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIndex((prev) =>
      prev === 0 ? safeImages.length - 1 : prev - 1
    );
  };

  return (
    <div className="w-full lg:max-w-full lg:my-auto mx-auto mt-[30px] lg:mt-[-56px] lg:mb-3 lg:flex lg:flex-col lg:items-center lg:justify-center text-center">

      {/* MAIN IMAGE */}
      <div
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          setLeftPos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
          });
        }}
        className="relative overflow-hidden cursor-none group w-full"
        onClick={() => setZooming(false)}
      >
        <img
          src={optimizeCloudinaryUrl(safeImages[index].url)}
          alt={safeImages[index].altText}
          className="w-full h-[500px] md:h-[calc(100vh+100vh+600px)] object-cover"
        />

        {/* LEFT */}
        <button
          onMouseEnter={() => setHideCursor(true)}
          onMouseLeave={() => setHideCursor(false)}
          onClick={prev}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 text-white px-3 py-2 rounded"
        >
          ◀
        </button>

        {/* RIGHT */}
        <button
          onMouseEnter={() => setHideCursor(true)}
          onMouseLeave={() => setHideCursor(false)}
          onClick={next}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 text-white px-3 py-2 rounded"
        >
          ▶
        </button>

        {/* Custom Cursor */}
        <div
          className={`pointer-events-none absolute w-10 h-10 bg-black/60 rounded-full 
          ${hideCursor ? "opacity-0" : "opacity-0 group-hover:opacity-100"} 
          transition flex items-center justify-center leading-none text-white`}
          style={{
            left: leftPos.x - 20,
            top: leftPos.y - 20,
          }}
        >
          <span className="scale-190">&times;</span>
        </div>

      </div>

      {/* THUMBNAILS */}
      <div className="flex gap-2 mt-3 justify-center">
        {safeImages.map((img, i) => (
          <img
            key={i}
            src={optimizeCloudinaryUrl(img.url)}
            onClick={() => setIndex(i)}
            className={`w-16 h-16 object-cover cursor-pointer border ${
              index === i ? "border-black" : "border-gray-300"
            }`}
          />
        ))}
      </div>

    </div>
  );
};

export default Carousel;