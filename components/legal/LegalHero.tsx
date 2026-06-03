"use client";

import Image from "next/image";
import { bodoni, inter } from "@/lib/fonts";

type Props = {
  title: string;
  subtitle?: string;
  image: string;
};

export default function LegalHero({
  title,
  subtitle,
  image,
}: Props) {
  return (
    <section className="relative h-[420px] overflow-hidden">
      <Image
        src={image}
        alt={title}
        fill
        priority
        className="object-cover"
      />

      <div className="absolute inset-0 bg-black/25" />

      <div className="relative mx-auto flex h-full max-w-[1600px] items-end px-6 pb-20 md:px-20">
        <div>
          {subtitle && (
            <p className={`mb-4 ${inter.className} text-sm text-white/90`}>
              {subtitle}
            </p>
          )}

          <h1 className={`text-5xl ${bodoni.className} font-light tracking-tight text-white md:text-7xl`}>
            {title}
          </h1>
        </div>
      </div>
    </section>
  );
}