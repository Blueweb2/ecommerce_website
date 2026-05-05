"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { getBanners } from "@/lib/api/banner.api";

export default function HeroSection() {

  const [current, setCurrent] = useState(0);
  const [banners, setBanners] = useState<any>(null);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch banners
  useEffect(() => {
    const fetchData = async () => {
      const data = await getBanners();
      setBanners(data);
    };
    fetchData();
  }, []);

  // Auto slide
  const startAutoSlide = () => {
    intervalRef.current = setInterval(() => {
      setCurrent((prev) =>
        (prev + 1) % (banners?.hero?.length || 1)
      );
    }, 4000);
  };

  useEffect(() => {
    if (!banners) return;

    startAutoSlide();

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [banners]);

  const handleClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    index: number
  ) => {
    e.preventDefault();
    e.stopPropagation();

    setCurrent(index);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    startAutoSlide();
  };

  // Loading fallback
  if (!banners) return <div>Loading...</div>;

  return (
    <section className="w-full bg-[#f5f5f5] py-8 mt-12 md:mt-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 h-[calc(100vh-120px)]">

        {/* LEFT SLIDER */}
        <Link
          href={banners.hero[current]?.link || "/"}
          className="relative overflow-hidden flex justify-center items-end p-6 text-white"
        >
          {banners.hero.map((hero: any, index: number) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-700 ${
                current === index ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={hero.image?.url || "/placeholder.png"}
                alt="Hero Banner"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority={index === 0}
                className="object-cover"
              />
            </div>
          ))}

          {/* DOTS */}
          <div className="relative z-10">
            <div className="flex gap-3 justify-center mt-6 h-6">
              {banners.hero.map((_: any, index: number) => (
                <button
                  key={index}
                  onClick={(e) => handleClick(e, index)}
                  className={`rounded-full transition ${
                    current === index
                      ? "w-4 h-4 bg-black"
                      : "w-2.5 h-2.5 bg-gray-400"
                  }`}
                />
              ))}
            </div>
          </div>

        </Link>

        {/* RIGHT SIDE */}
        <div className="flex flex-col lg:flex-row gap-3">

          {/* CENTER */}
          {banners.center && (
            <Link
              href={banners.center.link || "/"}
              className="relative overflow-hidden h-full w-full"
            >
              <Image
                src={banners.center.image?.url || "/placeholder.png"}
                alt="Center Banner"
                fill
                sizes="(max-width: 1024px) 100vw, 30vw"
                priority
                className="object-cover"
              />
            </Link>
          )}

          {/* RIGHT */}
          <div className="flex lg:flex-col gap-3 lg:w-[60%] h-full">

            {/* TOP */}
            {banners.rightTop && (
              <Link
                href={banners.rightTop.link || "/"}
                className="relative h-full w-full"
              >
                <Image
                  src={banners.rightTop.image?.url || "/placeholder.png"}
                  alt="Right Top Banner"
                  fill
                  sizes="(max-width: 1024px) 100vw, 20vw"
                  priority
                  className="object-cover"
                />
              </Link>
            )}

            {/* BOTTOM */}
            {banners.rightBottom && (
              <Link
                href={banners.rightBottom.link || "/"}
                className="relative h-full w-full"
              >
                <Image
                  src={banners.rightBottom.image?.url || "/placeholder.png"}
                  alt="Right Bottom Banner"
                  fill
                  sizes="(max-width: 1024px) 100vw, 20vw"
                  priority
                  className="object-cover"
                />
              </Link>
            )}

          </div>
        </div>

      </div>
    </section>
  );
}