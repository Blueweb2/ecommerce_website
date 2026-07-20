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
      className="
        w-full
        max-w-[250px]
        mx-auto
        flex
        flex-col
      "
    >
      {/* IMAGE (Never Changes) */}
      <div className="relative aspect-[3/4] overflow-hidden bg-[#f5f3ef]">
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          sizes="250px"
          className="object-cover"
        />
      </div>

      {/* CONTENT AREA */}
      <div
        className="
          min-h-[250px]
          transition-all
          duration-300
        "
      >
        {!expanded ? (
          <ProductCardView
            product={product}
            onExpand={() => setExpanded(true)}
          />
        ) : (
          <ProductQuickShop
            product={product}
            imageUrl={imageUrl}
            onClose={() => setExpanded(false)}
          />
        )}
      </div>
    </div>
  );
}