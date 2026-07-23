import Image from "next/image";
import { inter, bodoni } from "@/lib/fonts";
import StoryProducts from "./StoryProducts";
import { Product } from "@/types/product";

type ImageRightSectionProps = {
  heading?: string;
  content?: string;
  image?: { url: string; alt?: string };
  caption?: string;
  products?: Product[];
};

export default function ImageRightSection({
  heading,
  content,
  image,
  caption,
  products,
}: ImageRightSectionProps) {
  return (
    <div className="mx-auto max-w-[1400px] px-4 md:px-10 lg:px-20 my-16 lg:my-28">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-10 lg:gap-20 items-center">
        {/* Left Side: Text & Products */}
        <div className="flex flex-col justify-center order-2 lg:order-1">
          {heading && (
            <h2 className={`${bodoni.className} text-3xl md:text-4xl lg:text-5xl text-[#111] mb-6 tracking-[-0.02em]`}>
              {heading}
            </h2>
          )}
          {content && (
            <div
              className={`prose prose-neutral max-w-none prose-p:text-[14px] md:prose-p:text-[15px] prose-p:leading-[1.8] prose-p:text-[#444] ${inter.className}`}
              dangerouslySetInnerHTML={{ __html: content }}
            />
          )}

          <StoryProducts products={products || []} />
        </div>

        {/* Right Side: Image */}
        <div className="relative w-full order-1 lg:order-2 lg:sticky lg:top-24 lg:self-start">
          {image?.url && (
            <div className="relative aspect-[4/5] bg-[#ebe6de]">
              <Image
                src={image.url}
                alt={image.alt || caption || "Story image"}
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover"
              />
            </div>
          )}
          {caption && (
            <p className="mt-3 text-[11px] uppercase tracking-widest text-neutral-500 text-center">
              {caption}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
