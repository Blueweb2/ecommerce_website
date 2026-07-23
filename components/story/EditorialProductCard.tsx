"use client";

import { useState } from "react";
import { Product } from "@/types/product";
import ProductCardView from "./ProductCardView";
import ProductQuickShop from "./ProductQuickShop";
import Image from "next/image";

export default function EditorialProductCard({
  product,
}: {
  product: Product;
}) {
  const [expanded, setExpanded] = useState(false);

  const imageUrl =
    product.images?.[0]?.url || "/placeholder.jpg";

  return (
    <div
      className={`w-full max-w-[180px] mx-auto flex flex-col transition-[border-color,box-shadow,padding,background-color] duration-500 ease-in-out ${
        expanded
          ? "border border-[#e5e5e5] bg-white p-6 shadow-[0_12px_30px_rgba(0,0,0,0.10)]"
          : "border border-transparent bg-transparent p-0 shadow-none"
      }`}
    >
      <div
        className={`relative mx-auto aspect-[3/4] overflow-hidden bg-[#f5f3ef] transition-all duration-500 ease-in-out ${
          expanded ? "w-[76px]" : "w-full"
        }`}
      >
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          sizes="180px"
          className="object-cover"
        />
      </div>

      <div className="grid">
        <div
          className={`col-start-1 row-start-1 overflow-hidden transition-[max-height,opacity,transform] duration-300 ease-out ${
            expanded
              ? "pointer-events-none max-h-0 -translate-y-2 opacity-0"
              : "max-h-[120px] translate-y-0 opacity-100"
          }`}
          aria-hidden={expanded}
          inert={expanded}
        >
          <ProductCardView
            product={product}
            onExpand={() => setExpanded(true)}
          />
        </div>

        <div
          className={`col-start-1 row-start-1 overflow-hidden transition-[max-height,opacity,transform] duration-300 ease-out ${
            expanded
              ? "max-h-[420px] translate-y-0 opacity-100"
              : "pointer-events-none max-h-0 translate-y-2 opacity-0"
          }`}
          aria-hidden={!expanded}
          inert={!expanded}
        >
          <ProductQuickShop
            product={product}
            imageUrl={imageUrl}
            onClose={() => setExpanded(false)}
          />
        </div>
      </div>
    </div>
  );
}
