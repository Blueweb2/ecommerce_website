import { inter } from "@/lib/fonts";
import StoryShareButtons from "./StoryShareButtons";

export default function StoryFooter({
  author,
}: {
  author?: string;
}) {
  return (
    <div className="w-full border-t border-[#ebe6de] mt-20 py-10 px-4 md:px-10 lg:px-20">
      <div className="mx-auto max-w-[1200px] flex flex-col md:flex-row justify-between items-center">
        <p
          className={`text-[12px] uppercase tracking-widest font-medium ${inter.className}`}
        >
          {author && `Words by ${author}`}
        </p>

        <StoryShareButtons />
      </div>
    </div>
  );
}