"use client";

import { StorySection } from "@/types/story";
import SectionCard from "./SectionCard";

type SectionListProps = {
  sections: StorySection[];
  onChange: (sections: StorySection[]) => void;
};

export default function SectionList({ sections, onChange }: SectionListProps) {
  const update = (index: number, updated: StorySection) => {
    onChange(sections.map((s, i) => (i === index ? updated : s)));
  };

  const remove = (index: number) => {
    onChange(sections.filter((_, i) => i !== index));
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    const next = [...sections];
    [next[index - 1], next[index]] = [next[index], next[index - 1]];
    onChange(next.map((s, i) => ({ ...s, order: i })));
  };

  const moveDown = (index: number) => {
    if (index === sections.length - 1) return;
    const next = [...sections];
    [next[index], next[index + 1]] = [next[index + 1], next[index]];
    onChange(next.map((s, i) => ({ ...s, order: i })));
  };

  if (sections.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 py-10 text-center text-sm text-slate-400">
        No sections yet. Click &quot;+ Add Section&quot; to begin building your story.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {sections.map((section, index) => (
        <SectionCard
          key={section._id ?? index}
          section={section}
          index={index}
          total={sections.length}
          onChange={(updated) => update(index, updated)}
          onRemove={() => remove(index)}
          onMoveUp={() => moveUp(index)}
          onMoveDown={() => moveDown(index)}
        />
      ))}
    </div>
  );
}
