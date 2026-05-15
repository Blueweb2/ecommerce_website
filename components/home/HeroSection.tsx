"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { getBanners } from "@/lib/api/banner.api";
import { optimizeCloudinaryUrl } from "@/lib/constants/admin-catalog";

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
  if (!banners) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
      </div>
    );
  };

  return (
    <section className="w-full py-8 mt-12 md:mt-20">
      
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:h-[calc(100vh-120px)]">

        {/* LEFT SLIDER */}
        <Link
          href={banners.hero[current]?.link || "/"}
          className="relative overflow-hidden flex justify-center items-end p-6 text-white h-[400px] sm:h-[500px] md:h-full"
        >
          {banners.hero.map((hero: any, index: number) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-700 ${
                current === index ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={optimizeCloudinaryUrl(hero.image?.url) || "/placeholder.png"}
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
            <div className="flex justify-center gap-2 mt-6">
              {banners.hero.map((_: any, index: number) => (
                <button
                  key={index}
                  onClick={(e) => handleClick(e, index)}
                  className={`transition-all duration-300 rounded-full ${
                    current === index
                      ? "w-10 h-2 bg-black"
                      : "w-2 h-2 bg-black hover:bg-white"
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
              className="relative overflow-hidden w-full h-[320px] md:h-full"
            >
              <Image
                src={optimizeCloudinaryUrl(banners.center.image?.url) || "/placeholder.png"}
                alt="Center Banner"
                fill
                sizes="(max-width: 1024px) 100vw, 30vw"
                priority
                className="object-cover"
              />
            </Link>
          )}

          {/* RIGHT */}
          <div className="flex lg:flex-col gap-3 lg:w-[60%] h-[150px] md:h-full">

            {/* TOP */}
            {banners.rightTop && (
              <Link
                href={banners.rightTop.link || "/"}
                className="relative h-full w-full"
              >
                <Image
                  src={optimizeCloudinaryUrl(banners.rightTop.image?.url) || "/placeholder.png"}
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
                  src={optimizeCloudinaryUrl(banners.rightBottom.image?.url) || "/placeholder.png"}
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