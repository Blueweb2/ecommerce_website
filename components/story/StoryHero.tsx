import Image from "next/image";
import { bodoni } from "@/lib/fonts";
import { headingClassName } from "@/components/ui/headingClassNames";

type StoryHeroProps = {
  title: string;
  excerpt?: string;
  heroImage: {
    url: string;
    alt?: string;
  };
  author?: string;
  publishDate?: string;
};

export default function StoryHero({
  title,
  excerpt,
  heroImage,
  author,
  publishDate,
}: StoryHeroProps) {
  return (
    <div className="relative w-full mb-16 lg:mb-24">
      {/* Hero Image */}
      <div className="relative w-full h-[60vh] md:h-[75vh] lg:h-[85vh] overflow-hidden bg-[#ebe6de]">
        <Image
          src={heroImage.url}
          alt={heroImage.alt || title}
          fill
          priority
          sizes="100vw"
          className="object-cover transition duration-700 hover:scale-105"
        />
      </div>

      {/* Hero Content */}
      <div className="mx-auto max-w-[1200px] px-4 md:px-10 lg:px-20 mt-10 text-center flex flex-col items-center">
        {publishDate && (
          <p className="mb-4 text-[11px] uppercase tracking-[0.25em] text-neutral-500">
            {new Date(publishDate).toLocaleDateString("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
})}
          </p>
        )}
        <h1
          className={`mb-6 max-w-4xl ${headingClassName} ${bodoni.className} font-light leading-[1.1] tracking-[-0.04em] text-[#111] text-4xl md:text-5xl lg:text-6xl`}
        >
          {title}
        </h1>
        {excerpt && (
          <p className="max-w-2xl text-[14px] md:text-[16px] leading-[1.8] text-[#444] mb-8 font-light">
            {excerpt}
          </p>
        )}
        {author && (
          <p className="text-[12px] md:text-[13px] uppercase tracking-widest text-[#111] font-medium">
            Words by {author}
          </p>
        )}
      </div>
    </div>
  );
}
