"use client";

import { ChevronDown } from "lucide-react";
import { bodoni, inter } from "@/lib/fonts";

type FilterSectionProps = {
  title: string;
  summary: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
};

export default function FilterSection({
  title,
  summary,
  open,
  onToggle,
  children,
}: FilterSectionProps) {
  return (
    <div className="border-b border-black/12 py-6 last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-start justify-between gap-4 text-left"
      >
        <div>
          <p className={`${bodoni.className} text-[15px] font-semibold uppercase tracking-[0.02em] text-neutral-600`}>
            {title}
          </p>
          <p className="mt-1 text-[15px] text-black/55">{summary}</p>
        </div>
        <ChevronDown
          className={`mt-1 h-5 w-5 text-black transition ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open ? <div className="mt-4 space-y-3">{children}</div> : null}
    </div>
  );
}
