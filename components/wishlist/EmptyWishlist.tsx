"use client";

import Link from "next/link";
import { Heart } from "lucide-react";

export default function EmptyWishlist() {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-center">
      
      <Heart size={40} className="mb-6 text-black" />

      <h2 className="text-xl md:text-2xl font-serif mb-3">
        This Wish List is currently empty
      </h2>

      <p className="text-sm text-gray-600 mb-6">
        Add all your favorites to this Wish List
      </p>

      <Link
        href="/"
        className="text-sm border-b border-black hover:text-gray-500 transition"
      >
        Shop What's New
      </Link>
    </div>
  );
}