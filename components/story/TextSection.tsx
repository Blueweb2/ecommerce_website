import { inter, bodoni } from "@/lib/fonts";

type TextSectionProps = {
  heading?: string;
  content?: string;
};

export default function TextSection({ heading, content }: TextSectionProps) {
  if (!heading && !content) return null;

  return (
    <div className="mx-auto max-w-[800px] px-4 md:px-10 my-16 lg:my-28 text-center">
      {heading && (
        <h2 className={`${bodoni.className} text-3xl md:text-4xl lg:text-5xl text-[#111] mb-8 tracking-[-0.02em]`}>
          {heading}
        </h2>
      )}
      {content && (
        <div
          className={`prose prose-neutral mx-auto prose-p:text-[15px] md:prose-p:text-[16px] prose-p:leading-[1.9] prose-p:text-[#444] ${inter.className}`}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      )}
    </div>
  );
}
