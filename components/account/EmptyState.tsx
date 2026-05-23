"use client";
import { inter } from "@/lib/fonts";

export default function EmptyState() {
  return (
    <div className={`${inter.className} flex ml-8 2xl:ml-14 px-4`}>
      
      <div className="w-full max-w-[520px] flex flex-col items-center text-center">
        
        {/* ICON */}
        <div className="w-[58px] h-[58px] rounded-full border-2 border-black flex items-center justify-center mb-8">
          <span className="text-[34px] leading-none font-light">!</span>
        </div>

        {/* TITLE */}
        <h2 className="text-[20px] leading-tight font-semibold text-black mb-5">
          You don’t have any saved cards
        </h2>

        {/* DESCRIPTION */}
        <p className="text-[16px] text-black mb-10">
          Add a card to check out more quickly
        </p>

        {/* BUTTON */}
        <button className="px-36 bg-black text-white py-2 text-[15px] font-medium hover:opacity-90 transition">
          Add a card
        </button>
      </div>
    </div>
  );
};