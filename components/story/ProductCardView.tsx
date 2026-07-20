"use client";

import Link from "next/link";
import { Product } from "@/types/product";
import { inter } from "@/lib/fonts";

type Props = {
  product: Product;
  onExpand: () => void;
};

export default function ProductCardView({
  product,
  onExpand,
}: Props) {
  return (
    <>
      <Link href={`/designer/product/${product.slug}`}>
        <div className={`mt-4 text-center ${inter.className}`}>
          {product.designer?.name && (
            <p className="text-[10px] uppercase tracking-[0.22em] font-bold">
              {product.designer.name}
            </p>
          )}

          <h3 className="mt-2 text-[13px] text-[#444] leading-5 line-clamp-2">
            {product.name}
          </h3>
        </div>
      </Link>

      <div className="flex justify-center mt-8">
        <button
          onClick={onExpand}
          className="group flex flex-col items-center"
        >
          <span className="text-[38px] font-extralight">+</span>

          <span className="w-8 border-t border-black mt-1 transition-all group-hover:w-10" />
        </button>
      </div>
    </>
  );
}