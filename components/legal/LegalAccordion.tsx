"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { LegalSection } from "../../lib/legal/types";

type Props = {
  sections: LegalSection[];
};

export default function LegalAccordion({
  sections,
}: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="mt-20 border-t border-[#d8d2cc]">
      {sections.map((section, index) => {
        const isOpen = openIndex === index;

        return (
          <div
            key={section.id}
            id={section.id}
            className="border-b border-[#d8d2cc]"
          >
            <button
              onClick={() =>
                setOpenIndex(isOpen ? null : index)
              }
              className="flex w-full items-start justify-between gap-10 py-10 text-left"
            >
              <h2 className="max-w-4xl font-serif text-[12px] leading-[24px] font-light md:text-[24px] md:leading-[32px]">
                {section.title}
              </h2>

              <ChevronDown
                className={`mt-4 h-5 w-5 shrink-0 transition-transform duration-300 ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            <div
              className={`grid transition-all duration-300 ${
                isOpen
                  ? "grid-rows-[1fr] pb-10"
                  : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <div className="max-w-4xl whitespace-pre-line text-[18px] leading-[38px] text-[#333]">
                  {section.content}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}