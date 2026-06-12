"use client";

import Image from "next/image";
import Link from "next/link";

import { Product } from "@/types/product";
import { resolveImageSrc } from "@/lib/utils/image";
import { inter } from "@/lib/fonts";

type ProductCardProps = {
  product: Product;
  index?: number;
  isAnimating?: boolean;
  isEntering?: boolean;
  direction?: number;
  useBrandAsTitle?: boolean;
};

export default function ProductCard({
  product,
  index = 0,
  isAnimating = false,
  isEntering = false,
  direction = 0,
  useBrandAsTitle = false,
}: ProductCardProps) {

  const primaryImg =
    product.images?.find(
      (image) => "isPrimary" in image && image.isPrimary
    ) || product.images?.[0];

  const secondImg = product.images?.[1];

  const imageUrl = resolveImageSrc(primaryImg?.url);
  const hoverImageUrl = resolveImageSrc(secondImg?.url);

  console.log(product.designer);

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group relative flex flex-col gap-3"
      style={{
        transition: "transform 0.4s ease, opacity 0.4s ease",
        transitionDelay: `${index * 100}ms`,
        transform: isAnimating
          ? direction === 1
            ? "translateX(-50px)"
            : "translateX(50px)"
          : isEntering
          ? direction === 1
            ? "translateX(50px)"
            : "translateX(-50px)"
          : "translateX(0)",
        opacity: isAnimating ? 0 : isEntering ? 0 : 1,
      }}
    >

      {/* IMAGE */}
      <div className="relative aspect-[4/5] 2xl:aspect-[4/6] w-full overflow-hidden bg-neutral-100">

        {/* PRIMARY IMAGE  group-hover:scale-[1.03] */}
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 45vw, 22vw"
          className="
            object-cover
            transition-all duration-700
            group-hover:opacity-0
          "
        />

        {/* SECOND IMAGE  group-hover:scale-[1.03] */}
        {secondImg && (
          <Image
            src={hoverImageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 45vw, 22vw"
            className="
              object-cover
              opacity-0
              transition-all duration-700
              group-hover:opacity-100
            "
          />
        )}

        {/* BADGES */}
        <div className="absolute top-3 left-3 z-20 flex flex-col gap-2">

          {product.stock === 0 && (
            <span className="rounded-full border border-black/5 bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-red-500 shadow-sm backdrop-blur-sm">
              SOLD OUT
            </span>
          )}

          {product.sections?.includes("new-arrival") && (
            <span className="rounded-full border border-black/5 bg-white px-2.5 py-1 text-[10px] font-bold text-black shadow-lg">
              NEW
            </span>
          )}
        </div>

        {/* OVERLAY */}
        <div className="absolute inset-0 z-10 bg-transparent transition duration-500 group-hover:bg-white/10" />
      </div>

      {/* CONTENT */}
   {/* CONTENT */}
<div className="space-y-1 px-1 pt-1">
  {useBrandAsTitle ? (
    <p
      className={`${inter.className} text-[13px] text-center font-semibold uppercase tracking-[0.03em] text-neutral-700`}
    >
      {product.designer?.brandName ||
        product.brand ||
        product.designer?.name ||
        "DESIGNER"}
    </p>
  ) : (
    <>
      <p
        className={`${inter.className} text-[13px] font-semibold uppercase tracking-[0.03em] text-neutral-600`}
      >
        {product.designer?.brandName ||
          product.brand  || product.designer?.name || "DESIGNER"}
      </p>

      <Link
        href={`/product/${product.slug}`}
        className={`${inter.className} mt-2 line-clamp-2 block text-[13px] leading-6 text-[#5C5A58]`}
      >
        {product.name}
      </Link>

      <span className={inter.className}>
        ₹
        {Math.round(
          product.price * (1 + (product.gstPercentage || 0) / 100)
        )}
      </span>
    </>
  )}
</div>

    </Link>
  );
};