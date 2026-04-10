"use client";

import { useState } from "react";

type CarouselProps = {
  images: any[];
  setZooming: React.Dispatch<React.SetStateAction<boolean>>;
};

const Carousel = ({ images = [], setZooming }: CarouselProps) => {
  const [index, setIndex] = useState(0);

  const safeImages =
    images.length > 0
      ? images
      : [{ url: "/placeholder.png", altText: "no image" }];

  const next = () => {
    setIndex((prev) => (prev + 1) % safeImages.length);
  };

  const prev = () => {
    setIndex((prev) =>
      prev === 0 ? safeImages.length - 1 : prev - 1
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto">

      {/* MAIN IMAGE */}
      <div className="relative">
        <img
          src={safeImages[index].url}
          alt={safeImages[index].altText}
          className="w-full h-[400px] md:h-[600px] object-cover rounded"
        />

        {/* LEFT */}
        <button
          onClick={prev}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/60 text-white px-3 py-2 rounded"
        >
          ◀
        </button>

        {/* RIGHT */}
        <button
          onClick={next}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 text-white px-3 py-2 rounded"
        >
          ▶
        </button>
      </div>

      {/* THUMBNAILS */}
      <div className="flex gap-2 mt-3 justify-center">
        {safeImages.map((img, i) => (
          <img
            key={i}
            src={img.url}
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