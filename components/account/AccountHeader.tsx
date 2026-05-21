"use client";

import { bodoni } from "@/lib/fonts";

interface Props {
  title: string;
}

export default function AccountHeader({
  title,
}: Props) {
  return (
    <div className="mb-16 text-center border-b border-gray-200 pb-6">
      <p className="text-[12px] uppercase text-[#888]">
        My Account
      </p>

      <h1
        className={`text-[25px] text-black ${bodoni.className}`}
      >
        {title}
      </h1>
    </div>
  );
}