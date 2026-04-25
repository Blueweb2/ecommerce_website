import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const discountPercentage = product.discountPrice && product.discountPrice < product.price
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const imageUrl = product.images?.[0]?.url || '/home/categorysection/category-one.png'; // Fallback image

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group flex flex-col items-center gap-2"
    >
      <div className="w-full aspect-[3/4] bg-neutral-100 overflow-hidden relative">
        {discountPercentage > 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded z-10">
            -{discountPercentage}%
          </div>
        )}
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 45vw, 22vw"
        />
      </div>

      <div className="text-center">
        <h3 className="text-sm font-medium text-neutral-900 group-hover:text-neutral-600 transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center justify-center gap-2 mt-1">
          {product.discountPrice && product.discountPrice < product.price ? (
            <>
              <span className="text-lg font-bold text-red-600">
                ₹{product.discountPrice}
              </span>
              <span className="text-sm text-neutral-500 line-through">
                ₹{product.price}
              </span>
            </>
          ) : (
            <span className="text-lg font-bold text-neutral-900">
              ₹{product.price}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
