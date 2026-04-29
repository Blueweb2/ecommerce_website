"use client";

import { ChevronDown, SlidersHorizontal, X } from "lucide-react";

type ExploreControlsProps = {
  sortBy: string;
  onSortChange: (value: any) => void;
  onMobileFilterOpen: () => void;
  onHideAside: () => void;
  resultCount: number;
  activeChips: any[];
  onRemoveChip: (type: any, value?: string) => void;
};

export default function ExploreControls({
  sortBy,
  onSortChange,
  onMobileFilterOpen,
  onHideAside,
  resultCount,
  activeChips,
  onRemoveChip,
}: ExploreControlsProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMobileFilterOpen}
            className="inline-flex items-center gap-3 rounded-[4px] border border-black/15 bg-white px-4 py-3 text-[15px] text-black xl:hidden"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filter
          </button>

          <div className="inline-flex items-center gap-3 rounded-[4px] border border-black/15 bg-white px-4 py-3 text-[15px] text-black">
            <div 
              onClick={onHideAside}
              className="flex h-5 w-5 items-center justify-center rounded-full bg-black text-white"
            >
              <span className="text-[10px]">−</span>
            </div>
            <span>Filter</span>
            <span className="text-black/45">|</span>
            <span className="text-black/65">{resultCount} Results</span>
          </div>
        </div>

        <label className="relative inline-flex min-w-[190px] items-center">
          <select
            value={sortBy}
            onChange={(event) => onSortChange(event.target.value)}
            className="w-full appearance-none rounded-[4px] border border-black/15 bg-white px-4 py-3 pr-11 text-[15px] text-black outline-none transition focus:border-black"
          >
            <option value="recommended">Recommended</option>
            <option value="price-low">Price low to high</option>
            <option value="price-high">Price high to low</option>
            <option value="name">Name A-Z</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-4 h-4 w-4 text-black" />
        </label>
      </div>

      {activeChips.length ? (
        <div className="flex flex-wrap gap-2">
          {activeChips.map((chip) => (
            <button
              key={chip.key}
              type="button"
              onClick={() => onRemoveChip(chip.onRemove, chip.value)}
              className="inline-flex items-center gap-3 rounded-[4px] border border-black/15 bg-white px-4 py-3 text-[15px] text-black transition hover:border-black"
            >
              {chip.label}
              <X className="h-4 w-4" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
