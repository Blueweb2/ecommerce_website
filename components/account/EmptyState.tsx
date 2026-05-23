"use client";

import { inter } from "@/lib/fonts";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  buttonText?: string;
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  buttonText,
}: EmptyStateProps) {
  return (
    <div className={`${inter.className} ml-8 flex px-4 2xl:ml-14`}>
      <div className="flex w-full max-w-[520px] flex-col items-center text-center">

        {/* ICON */}
        <div className="mb-8 flex h-[58px] w-[58px] items-center justify-center rounded-full border-2 border-black">
          {Icon ? (
            <Icon className="h-7 w-7 text-black" />
          ) : (
            <span className="text-[34px] font-light leading-none">!</span>
          )}
        </div>

        {/* TITLE */}
        <h2 className="mb-5 text-[20px] font-semibold leading-tight text-black">
          {title}
        </h2>

        {/* DESCRIPTION */}
        <p className="mb-10 text-[16px] text-black">
          {description}
        </p>

        {/* BUTTON */}
        {buttonText && (
          <button className="bg-black px-36 py-2 text-[15px] font-medium text-white transition hover:opacity-90">
            {buttonText}
          </button>
        )}
      </div>
    </div>
  );
}