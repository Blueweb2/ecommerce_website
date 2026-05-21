"use client";

import { bodoni } from "@/lib/fonts";

interface Props {
  title: string;
}

export default function AccountHeader({
  title,
}: Props) {
  return (
    <div className="mb-16 text-center">
      <p className="mb-3 text-[12px] uppercase tracking-[0.2em] text-[#888]">
        My Account
      </p>

      <h1
        className={`text-[48px] text-black ${bodoni.className}`}
      >
        {title}
      </h1>
    </div>
  );
}