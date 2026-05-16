"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { categoryAPI } from "@/lib/api/category.api";
import { optimizeCloudinaryUrl } from "@/lib/constants/admin-catalog";
import { bodoni } from "@/lib/fonts";

type Category = {
  _id: string;
  name: string;
  slug: string;
  image?: {
    url: string;
  };
};

export default function CategoriesSlider() {

  const scrollRef = useRef<HTMLDivElement>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoryAPI.getAll();
        setCategories(res.data?.data || []);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div>
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <h2 className={`${bodoni.className} text-[24px] font-normal tracking-tight`}>Shop by Categories</h2>
      </div>

      {/* SLIDER */}
      <div ref={scrollRef} className="flex gap-2 overflow-x-auto scrollbar-hide">
        {!loading && (
          categories.map((cat) => (
            <Link key={cat._id} href={`/category/${cat.slug}`}>
              <div className="relative w-[200px] h-[250px] lg:w-[290px] lg:h-[330px]">
                <Image
                  src={optimizeCloudinaryUrl(cat.image?.url) || "/placeholder.png"}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 768px) 200px, 290px"
                  className="object-cover"
                />
                <h3 className="absolute inset-0 flex items-center justify-center text-white bg-black/30">
                  {cat.name}
                </h3>
              </div>
            </Link>
          ))
        )}
      </div>

    </div>
  );
};
