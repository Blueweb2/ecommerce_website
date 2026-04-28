"use client";

import Image from "next/image";

type ExploreHeaderProps = {
  title: string;
  description: string;
  bannerImage: string;
  productCount: number;
  typeLabel?: string;
  activeChips?: { key: string; label: string }[];
};

export default function ExploreHeader({
  title,
  description,
  bannerImage,
  productCount,
  typeLabel = "Explore",
  activeChips = [],
}: ExploreHeaderProps) {
  return (
    <div className="grid gap-5 rounded-[32px] border border-black/10 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.05)] md:grid-cols-[1.15fr_0.85fr] md:p-8">
      <div className="flex flex-col justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-black/45">
            {typeLabel}
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-black md:text-5xl capitalize">
            {title}
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-black/60 md:text-base">
            {description}
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <span className="rounded-full border border-black/10 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.12em] text-black/70">
            {productCount} Products
          </span>
          {activeChips.slice(0, 3).map((chip) => (
            <span
              key={chip.key}
              className="rounded-full border border-black/10 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.12em] text-black/70"
            >
              {chip.label}
            </span>
          ))}
        </div>
      </div>

      <div className="relative min-h-[220px] overflow-hidden rounded-[28px] bg-[#eeece4]">
        <Image
          src={bannerImage}
          alt={title}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 35vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.18)_0%,rgba(255,255,255,0.02)_55%,rgba(0,0,0,0.08)_100%)]" />
      </div>
    </div>
  );
}
