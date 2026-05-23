"use client";

import { bodoni } from "@/lib/fonts";

export default function CheckoutHeader() {
  return (
    <header className="border-b border-[#1d1d1d] bg-black text-white">
      <div className="flex h-[72px] items-center justify-between px-6 lg:px-10">

        <span className="text-[13px] uppercase tracking-[0.2em]">
          Secure
        </span>

        <h1
          className={`text-[38px] tracking-[0.25em] ${bodoni.className} cursor-pointer`}
          onClick={() => {
            window.location.href = '/'
          }}
        >
          ZENFAZ
        </h1>

        <div className="w-[60px]" />
      </div>
    </header>
  );
}