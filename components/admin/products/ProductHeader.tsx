// (top published toggle)
"use client";

import { Package2 } from "lucide-react";

type Props = {
  isPublished: boolean;
  setForm: (updater: any) => void;
};

export default function ProductHeader({ isPublished, setForm }: Props) {
  return (
    <section className="overflow-hidden rounded-[32px] bg-[#12251a] text-white shadow-xl">
      <div className="flex flex-col gap-4 p-6 md:flex-row md:items-end md:justify-between md:p-8 pb-6">
        
        {/* Left */}
        <div className="max-w-2xl pb-2">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.24em] text-emerald-100">
            <Package2 className="h-3.5 w-3.5" />
            Product setup
          </div>
        </div>

        {/* Right */}
        <label className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-medium">
          <input
            type="checkbox"
            checked={isPublished}
            onChange={(e) =>
              setForm((prev: any) => ({
                ...prev,
                isPublished: e.target.checked,
              }))
            }
            className="h-4 w-4 accent-white"
          />
          Published
        </label>
      </div>
    </section>
  );
}