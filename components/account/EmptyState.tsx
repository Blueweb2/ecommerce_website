"use client";

import Link from "next/link";
import { LucideIcon } from "lucide-react";

interface Props {
  icon: LucideIcon;
  title: string;
  description: string;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
}: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">

      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-black">
        <Icon className="h-7 w-7 text-black" />
      </div>

      <h2 className="text-[34px] leading-tight text-black">
        {title}
      </h2>

      <p className="mt-4 max-w-md text-[15px] leading-7 text-[#666]">
        {description}
      </p>

      <Link
        href="/"
        className="mt-8 border border-black px-8 py-3 text-sm text-black transition hover:bg-black hover:text-white"
      >
        Shop What's New
      </Link>
    </div>
  );
}