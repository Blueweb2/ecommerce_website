"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { LegalSection } from "../../lib/legal/types";
import { inter } from "@/lib/fonts";

type Props = {
  sections: LegalSection[];
};

export default function LegalAccordion({
  sections,
}: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="mt-6 lg:mt-10 border-t border-[#d8d2cc]">
      {sections.map((section, index) => {
        const isOpen = openIndex === index;

        return (
          <div
            key={section.id}
            id={section.id}
            className={`border-b border-[#d8d2cc] ${inter.className}`}
          >
            <button
              onClick={() =>
                setOpenIndex(isOpen ? null : index)
              }
              className="flex w-full items-start justify-between py-3 md:py-6 text-left"
            >
              <h2 className="max-w-4xl text-[15px] md:text-[20px]">
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
                <div className="max-w-4xl whitespace-pre-line text-[13px] md:text-[17px] text-[#333]">
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