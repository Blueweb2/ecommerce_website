"use client";

import { X } from "lucide-react";
import { bodoni } from "@/lib/fonts";

interface PersonalMessageModalProps {
  open: boolean;
  onClose: () => void;
  message: string;
  setMessage: (value: string) => void;
  onConfirm: () => void;
}

export default function PersonalMessageModal({
  open,
  onClose,
  message,
  setMessage,
  onConfirm,
}: PersonalMessageModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/55 px-4">
      <div className="w-full max-w-[620px] overflow-hidden bg-white shadow-2xl">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-[#d9d9d9] px-6 py-5">
          <h2 className="text-[14px] font-semibold uppercase tracking-[0.12em] text-black">
            Your Personal Message
          </h2>

          <button
            onClick={onClose}
            className="transition hover:opacity-70"
          >
            <X size={22} strokeWidth={1.5} />
          </button>
        </div>

        {/* CONTENT */}
        <div className="bg-[#0d1420] px-8 py-8">
          <div className="mx-auto flex min-h-[320px] max-w-[430px] flex-col bg-white px-10 py-8">
            <h3
              className={`text-center text-[22px] tracking-[0.2em] text-black ${bodoni.className}`}
            >
              ZENFAZ
            </h3>

            <textarea
              value={message}
              onChange={(e) => {
                if (e.target.value.length <= 180) {
                  setMessage(e.target.value);
                }
              }}
              placeholder="E.g. Happy Birthday"
              className={`mt-12 h-[140px] resize-none border-none text-center text-[34px] italic text-[#8d8d8d] outline-none placeholder:text-[#9b9b9b] ${bodoni.className}`}
            />

            <div className="mt-auto text-right text-[13px] text-[#666]">
              {180 - message.length} characters remaining
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="bg-white px-4 py-5">
          <button
            onClick={onConfirm}
            disabled={!message.trim()}
            className={`flex h-[52px] w-full items-center justify-center text-[13px] font-medium uppercase tracking-[0.14em] transition ${
              message.trim()
                ? "bg-black text-white hover:bg-[#222]"
                : "cursor-not-allowed bg-[#d9d9d9] text-white"
            }`}
          >
            Confirm message
          </button>
        </div>
      </div>
    </div>
  );
}