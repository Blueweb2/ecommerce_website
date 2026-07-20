"use client";

import { SectionLayout } from "@/types/story";

const LAYOUTS: { value: SectionLayout; label: string; description: string; icon: string }[] = [
  {
    value: "image-left",
    label: "Image Left",
    description: "Image on left, text on right",
    icon: "▐ ≡",
  },
  {
    value: "image-right",
    label: "Image Right",
    description: "Text on left, image on right",
    icon: "≡ ▌",
  },
  {
    value: "full-image",
    label: "Full Image",
    description: "Edge-to-edge image with caption",
    icon: "⬛",
  },
  {
    value: "text",
    label: "Text",
    description: "Heading and body copy only",
    icon: "≡ ≡",
  },
];

type LayoutSelectorProps = {
  value: SectionLayout;
  onChange: (layout: SectionLayout) => void;
};

export default function LayoutSelector({ value, onChange }: LayoutSelectorProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
      {LAYOUTS.map((layout) => (
        <button
          key={layout.value}
          type="button"
          onClick={() => onChange(layout.value)}
          className={`flex flex-col items-center gap-1.5 rounded-xl border p-3 text-center transition-all ${
            value === layout.value
              ? "border-[#12251a] bg-[#12251a]/5 ring-1 ring-[#12251a]"
              : "border-slate-200 bg-slate-50 hover:border-slate-300 hover:bg-white"
          }`}
        >
          <span className="font-mono text-lg text-slate-600">{layout.icon}</span>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-700">
            {layout.label}
          </span>
          <span className="text-[10px] text-slate-400 leading-snug">{layout.description}</span>
        </button>
      ))}
    </div>
  );
}
