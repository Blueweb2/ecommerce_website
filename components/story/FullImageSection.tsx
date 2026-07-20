import Image from "next/image";

type FullImageSectionProps = {
  image?: { url: string; alt?: string };
  caption?: string;
};

export default function FullImageSection({ image, caption }: FullImageSectionProps) {
  if (!image?.url) return null;

  return (
    <div className="w-full my-16 lg:my-28">
      <div className="relative w-full h-[60vh] md:h-[80vh] lg:h-[90vh] bg-[#ebe6de]">
        <Image
          src={image.url}
          alt={image.alt || caption || "Story full image"}
          fill
          sizes="100vw"
          className="object-cover"
        />
      </div>
      {caption && (
        <div className="mx-auto max-w-[1200px] px-4 md:px-10 lg:px-20 mt-4">
          <p className="text-[11px] uppercase tracking-widest text-neutral-500 text-center md:text-left">
            {caption}
          </p>
        </div>
      )}
    </div>
  );
}
