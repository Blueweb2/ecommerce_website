"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { bodoni, inter } from "@/lib/fonts";

export default function EmptyWishlist() {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-center">
      
      <Heart size={40} className="mb-6 text-neutral-600" />

      <h2 className={`${bodoni.className} text-xl md:text-2xl text-neutral-600 mb-3`}>
        This Wish List is currently empty
      </h2>

      <p className={`${inter.className} text-sm text-gray-600 mb-6`}>
        Add all your favorites to this Wish List
      </p>

      <Link
        href="/"
        className={`${inter.className} text-sm border-b border-gray-400 text-gray-600 hover:text-gray-500 transition`}
      >
        Shop What's New
      </Link>
    </div>
  );
}