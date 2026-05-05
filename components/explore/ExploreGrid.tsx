"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { Bodoni_Moda, Inter } from 'next/font/google';
import { Product } from "@/types/product";

type ExploreGridProps = {
  products: Product[];
  fallbackImage: string;
  categoryTitle: string;
};

const inter = Inter({
  subsets: ['latin'],
});

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function ExploreGrid({
  products,
  fallbackImage,
  categoryTitle,
}: ExploreGridProps) {

  if (products.length === 0) {
    return (
      <div className="rounded-[28px] border border-dashed border-black/15 bg-white px-6 py-16 text-center">
        <h2 className="text-xl font-semibold text-black">No products found</h2>
        <p className="mt-2 text-sm text-black/55">
          Try changing or clearing the selected filters.
        </p>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-3 2xl:grid-cols-4">
      {products.map((product) => {
        const productImage = product.images?.[0]?.url || fallbackImage;

        return (
          <article key={product._id} className="group">
            <Link href={`/product/${product.slug}`} className="block">
              <div className="relative aspect-[0.92] overflow-hidden bg-[#f1eee8]">
                <Image
                  src={productImage}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 48vw, (max-width: 1536px) 30vw, 22vw"
                  className="object-cover transition duration-500 group-hover:scale-[1.03]"
                />
                <button
                  type="button"
                  aria-label={`Save ${product.name}`}
                  className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-black shadow-sm backdrop-blur-sm transition hover:scale-105"
                >
                  <Heart className="h-4 w-4" />
                </button>
              </div>
            </Link>

            <div className="pt-4">
              <p className={`${bodoni.className} text-[13px] font-semibold uppercase tracking-[0.03em] text-neutral-600`}>
                {product.brand || categoryTitle}
              </p>
              <Link
                href={`/product/${product.slug}`}
                className={`${inter.className} mt-2 line-clamp-2 block text-[15px] leading-6 text-[#8D8B9D] underline-offset-4 transition hover:text-black hover:underline`}
              >
                {product.name}
              </Link>
              <div className="mt-3 flex items-center gap-2 text-[15px]">
                {product.discountPrice &&
                product.discountPrice < product.price ? (
                  <>
                    <span className={`${inter.className} font-semibold text-[#8D8B9D]`}>
                      Rs. {product.discountPrice}
                    </span>
                    <span className={`${inter.className} text-[#d82d2d] line-through`}>
                      Rs. {product.price}
                    </span>
                  </>
                ) : (
                  <span className={`${inter.className} font-semibold text-[#8D8B9D]`}>
                    Rs. {product.price}
                  </span>
                )}
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
};