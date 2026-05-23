// components/legal/LegalSidebar.tsx

"use client";

import { LegalSection } from "@/lib/legal/types";

type Props = {
  sections: LegalSection[];
};

export default function LegalSidebar({
  sections,
}: Props) {
  return (
    <aside className="hidden lg:block">
      <div className="sticky top-32">
        <h3 className="font-serif text-[42px] font-light">
          Quick links
        </h3>

        <div className="mt-10 flex flex-col gap-8">
          {sections.map((section) => (
            <a
              key={section.id}
              href={`#${section.id}`}
              className="text-[18px] leading-[32px] underline underline-offset-4 transition hover:text-black"
            >
              {section.title.replace(/^\d+\.\s/, "")}
            </a>
          ))}
        </div>
      </div>
    </aside>
  );
}