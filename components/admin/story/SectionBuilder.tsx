"use client";

import { StorySection } from "@/types/story";
import SectionList from "./SectionList";

type SectionBuilderProps = {
  sections: StorySection[];
  onChange: (sections: StorySection[]) => void;
};

export default function SectionBuilder({ sections, onChange }: SectionBuilderProps) {
  const addSection = () => {
    const newSection: StorySection = {
      layout: "image-left",
      heading: "",
      content: "",
      caption: "",
      products: [],
      order: sections.length,
    };
    onChange([...sections, newSection]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-800">Story Sections</h3>
          <p className="text-xs text-slate-500">
            Build your story by adding and reordering sections.
          </p>
        </div>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
          {sections.length} section{sections.length !== 1 ? "s" : ""}
        </span>
      </div>

      <SectionList sections={sections} onChange={onChange} />

      <button
        type="button"
        onClick={addSection}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-[#12251a]/30 py-3 text-sm font-semibold text-[#12251a] transition hover:border-[#12251a] hover:bg-[#12251a]/5"
      >
        <span className="text-lg leading-none">+</span>
        Add Section
      </button>
    </div>
  );
}
