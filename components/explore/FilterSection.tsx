"use client";

import { ChevronDown } from "lucide-react";
import { bodoni } from "@/lib/fonts";

type FilterSectionProps = {
  title: string;
  summary: string;
  open: boolean;
  onToggle: () => void;
  meta?: string;
  onClear?: () => void;
  children: React.ReactNode;
};

export default function FilterSection({
  title,
  summary,
  open,
  onToggle,
  meta,
  onClear,
  children,
}: FilterSectionProps) {
  return (
    <div className="border-b border-black/8 py-5 last:border-b-0">
      <div className="flex items-start justify-between gap-4">
        <button
          type="button"
          onClick={onToggle}
          className="flex flex-1 items-start justify-between gap-4 text-left"
        >
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className={`${bodoni.className} text-[15px] font-semibold uppercase tracking-[0.02em] text-neutral-600`}>
                {title}
              </p>
              {meta ? (
                <span className="rounded-full bg-black/5 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-black/45">
                  {meta}
                </span>
              ) : null}
            </div>
            <p className="mt-2 text-[15px] text-black/55">{summary}</p>
          </div>
          <ChevronDown
            className={`mt-1 h-5 w-5 text-black transition ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>

        {onClear ? (
          <button
            type="button"
            onClick={onClear}
            className="rounded-full border border-black/8 bg-white px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.16em] text-black/55 transition hover:border-black/20 hover:text-black"
          >
            Clear
          </button>
        ) : null}
      </div>

      {open ? <div className="mt-4 space-y-3">{children}</div> : null}
    </div>
  );
}
