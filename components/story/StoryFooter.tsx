import { inter } from "@/lib/fonts";

export default function StoryFooter({ author }: { author?: string }) {
  return (
    <div className="w-full border-t border-[#ebe6de] mt-20 py-10 px-4 md:px-10 lg:px-20">
      <div className="mx-auto max-w-[1200px] flex flex-col md:flex-row justify-between items-center">
        <p className={`text-[12px] md:text-[13px] uppercase tracking-widest text-[#111] font-medium ${inter.className}`}>
          {author && `Words by ${author}`}
        </p>
        <p className={`text-[11px] uppercase tracking-[0.2em] text-neutral-400 mt-4 md:mt-0 ${inter.className}`}>
          Share this story
        </p>
      </div>
    </div>
  );
}
