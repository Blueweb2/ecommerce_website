"use client";

import { Package2, Save, Loader2 } from "lucide-react";

type Props = {
  isPublished: boolean;
  isOnSale?: boolean;
  setForm: (updater: any) => void;
  loading?: boolean;
  isEdit?: boolean;
  currentStep: number;
  totalSteps: number;
  stepTitle: string;
};

export default function ProductHeader({
  isPublished,
  isOnSale = false,
  setForm,
  loading = false,
  isEdit = false,
  currentStep,
  totalSteps,
  stepTitle
}: Props) {
  return (
    <section className="overflow-hidden rounded-[32px] bg-[#12251a] text-white shadow-xl sticky top-4 z-40">
      <div className="flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between md:p-8">

        {/* Left: Step Info & Toggles */}
        <div className="flex flex-wrap items-center gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.24em] text-emerald-100">
                <Package2 className="h-3.5 w-3.5" />
                Step {currentStep} of {totalSteps}
              </div>
              <h2 className="text-xl font-bold text-white/90">{stepTitle}</h2>
            </div>

            <div className="flex items-center gap-4">
              {/* Published Toggle */}
              <label className="group relative flex items-center gap-3 cursor-pointer select-none rounded-2xl border border-white/10 bg-white/5 py-2 pl-3 pr-2 transition-all hover:bg-white/10 active:scale-95">
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-white/40 leading-none mb-1">Status</span>
                  <span className="text-xs font-semibold text-white/90 group-hover:text-white">Published</span>
                </div>
                <div className="relative h-5 w-9 rounded-full bg-white/10 transition-colors">
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
                  <div className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white/40 transition-all peer-checked:left-4.5 peer-checked:bg-white shadow-lg"></div>
                  <div className="absolute inset-0 rounded-full ring-2 ring-transparent transition-all peer-checked:bg-emerald-500/80 peer-focus:ring-white/20"></div>
                </div>
              </label>

              {/* On Sale Toggle */}
              <label className="group relative flex items-center gap-3 cursor-pointer select-none rounded-2xl border border-white/10 bg-white/5 py-2 pl-3 pr-2 transition-all hover:bg-white/10 active:scale-95">
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-white/40 leading-none mb-1">Pricing</span>
                  <span className="text-xs font-semibold text-white/90 group-hover:text-white">On Sale</span>
                </div>
                <div className="relative h-5 w-9 rounded-full bg-white/10 transition-colors">
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
                  <div className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white/40 transition-all peer-checked:left-4.5 peer-checked:bg-white shadow-lg"></div>
                  <div className="absolute inset-0 rounded-full ring-2 ring-transparent transition-all peer-checked:bg-amber-500/80 peer-focus:ring-white/20"></div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right: Save Button (Only in Step 6 or if Edit) */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-2xl bg-emerald-500 text-white font-bold hover:bg-emerald-400 transition-all active:scale-95 disabled:opacity-50 disabled:active:scale-100 shadow-lg shadow-emerald-500/20"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                {isEdit ? "Saving..." : "Creating..."}
              </>
            ) : (
              <>
                <Save className="h-5 w-5" />
                {isEdit ? "Save Changes" : "Finish & Publish"}
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}