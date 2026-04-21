// (top published toggle)
"use client";

import { Package2 } from "lucide-react";

type Props = {
  isPublished: boolean;
  isOnSale?: boolean;
  setForm: (updater: any) => void;
};

export default function ProductHeader({ isPublished, isOnSale = false, setForm }: Props) {
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

        {/* Right: Published & Sale Toggles */}
        <div className="flex flex-wrap items-center gap-4">
          
          {/* Published Toggle */}
          <label className="group relative flex items-center gap-3 cursor-pointer select-none rounded-2xl border border-white/10 bg-white/5 py-2.5 pl-4 pr-3 transition-all hover:bg-white/10 active:scale-95">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/40">Status</span>
              <span className="text-sm font-semibold text-white/90 group-hover:text-white">Published</span>
            </div>
            <div className="relative h-6 w-11 rounded-full bg-white/10 transition-colors">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) =>
                  setForm((prev: any) => ({
                    ...prev,
                    isPublished: e.target.checked,
                  }))
                }
                className="peer sr-only"
              />
              <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white/40 transition-all peer-checked:left-6 peer-checked:bg-white shadow-lg"></div>
              <div className="absolute inset-0 rounded-full ring-2 ring-transparent transition-all peer-checked:bg-emerald-500/80 peer-focus:ring-white/20"></div>
            </div>
          </label>

          {/* On Sale Toggle */}
          <label className="group relative flex items-center gap-3 cursor-pointer select-none rounded-2xl border border-white/10 bg-white/5 py-2.5 pl-4 pr-3 transition-all hover:bg-white/10 active:scale-95">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/40">Pricing</span>
              <span className="text-sm font-semibold text-white/90 group-hover:text-white">On Sale</span>
            </div>
            <div className="relative h-6 w-11 rounded-full bg-white/10 transition-colors">
              <input
                type="checkbox"
                checked={isOnSale}
                onChange={(e) =>
                  setForm((prev: any) => ({
                    ...prev,
                    isOnSale: e.target.checked,
                  }))
                }
                className="peer sr-only"
              />
              <div className="absolute left-1 top-1 h-4 w-4 rounded-full bg-white/40 transition-all peer-checked:left-6 peer-checked:bg-white shadow-lg"></div>
              <div className="absolute inset-0 rounded-full ring-2 ring-transparent transition-all peer-checked:bg-amber-500/80 peer-focus:ring-white/20"></div>
            </div>
          </label>

        </div>
      </div>
    </section>
  );
}