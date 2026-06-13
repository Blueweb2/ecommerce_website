"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types/product";
import { PLACEHOLDER_IMAGE, resolveImageSrc } from "@/lib/utils/image";

interface Props {
  product: Product;
  onClose: () => void;
}

export default function SearchProductCard({
  product,
  onClose,
}: Props) {
  const imageSrc = resolveImageSrc(
    product.images?.[0]?.url,
    PLACEHOLDER_IMAGE
  );

  return (
    <Link
      href={`/product/${product.slug}`}
      onClick={onClose}
      className="group block"
    >
      <div className="overflow-hidden rounded-[22px] bg-[#f6f4ef]">
        <Image
          src={imageSrc}
          alt={product.name}
          width={500}
          height={700}
          className="aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <h3 className="mt-4 text-xs font-semibold uppercase tracking-[0.24em] text-black/55">
        {product.brand || product.designer?.name || "Product"}
      </h3>

      <p className="mt-2 text-sm leading-6 text-black/75">
        {product.name}
      </p>

      <p className="mt-3 text-sm font-semibold text-black">
        Rs. {product.discountPrice ?? product.price}
      </p>
    </Link>
  );
}
