"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { getFavoriteDesigners } from "@/lib/api/designer.api";
import { bodoni, inter } from "@/lib/fonts";
import type { Designer } from "@/types/designer";

const FALLBACK_BANNER = "/home/herosection/hero-right-top.png";
const FALLBACK_AVATAR = "/placeholder.png";

function getImageUrl(url?: string | null, fallback = FALLBACK_AVATAR) {
  return url || fallback;
}

function getDesignerHref(designer: Designer) {
  if (designer.slug) {
    return `/designers/${designer.slug}`;
  }

  return `/designers/${designer.name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")}`;
}

export default function FavoriteDesigners() {
  const [designers, setDesigners] = useState<Designer[]>([]);
  const [loading, setLoading] = useState(true);
  const visibleDesigners = designers.slice(0, 3);

  useEffect(() => {
    let ignore = false;

    const loadDesigners = async () => {
      try {
        const data = await getFavoriteDesigners();

        if (!ignore) {
          setDesigners(data.filter((designer) => designer.isActive !== false));
        }
      } catch (error) {
        console.error("Failed to load favorite designers", error);
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    void loadDesigners();

    return () => {
      ignore = true;
    };
  }, []);

  if (!loading && !designers.length) {
    return null;
  }

  return (
    <section className="bg-[#f5f5f5] py-10">
      <div className="mx-auto max-w-[2000px] px-4 md:px-32">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.26em] text-black/40">
              Favorite Designers
            </p>
            <h2
              className={`${bodoni.className} mt-2 text-[clamp(28px,3vw,40px)] font-normal tracking-tight text-neutral-700`}
            >
              The names shaping this season
            </h2>
          </div>
          <p
            className={`${inter.className} max-w-2xl text-sm leading-7 text-[#8D8B9D]`}
          >
            Meet the featured designers behind the brands we are spotlighting right now, from signature aesthetics to standout editorial identities.
          </p>
        </div>

        <div className="mb-6 flex justify-end">
          <Link
            href="/designers"
            className="text-sm font-medium text-[#8D8B9D] underline transition hover:text-black"
          >
            View all designers
          </Link>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="h-[430px] animate-pulse rounded-[28px] bg-white"
                />
              ))
            : visibleDesigners.map((designer) => (
                <Link
                  key={designer._id || designer.slug || designer.name}
                  href={getDesignerHref(designer)}
                  className="group block overflow-hidden rounded-[28px] border border-black/8 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.05)] transition hover:-translate-y-1 hover:shadow-[0_32px_90px_rgba(15,23,42,0.08)]"
                >
                  <div className="relative h-56 bg-[#ede7dd]">
                    <Image
                      src={getImageUrl(designer.bannerImage?.url, FALLBACK_BANNER)}
                      alt={`${designer.name} banner`}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                    <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-medium uppercase tracking-[0.18em] text-black">
                      <Heart className="h-3.5 w-3.5 fill-rose-500 text-rose-500" />
                      Favorite
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-[#f0ece4]">
                        <Image
                          src={getImageUrl(designer.avatar?.url)}
                          alt={designer.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1">
                        <h3
                          className={`${bodoni.className} text-[28px] leading-none text-neutral-700`}
                        >
                          {designer.name}
                        </h3>
                        <p
                          className={`${inter.className} mt-2 text-xs uppercase tracking-[0.2em] text-[#8D8B9D]`}
                        >
                          {designer.brandName}
                        </p>
                      </div>

                      <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-xl border border-black/8 bg-white">
                        <Image
                          src={getImageUrl(designer.brandImage?.url)}
                          alt={`${designer.brandName} logo`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>

                    <p
                      className={`${inter.className} mt-5 line-clamp-4 text-sm leading-7 text-[#8D8B9D]`}
                    >
                      {designer.description}
                    </p>

                    <span className="mt-4 inline-block text-sm font-medium text-black/65 transition group-hover:text-black">
                      Explore designer
                    </span>
                  </div>
                </Link>
              ))}
        </div>
      </div>
    </section>
  );
}
