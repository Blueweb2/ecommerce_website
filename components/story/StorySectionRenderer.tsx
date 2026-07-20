import ImageLeftSection from "./ImageLeftSection";
import ImageRightSection from "./ImageRightSection";
import FullImageSection from "./FullImageSection";
import TextSection from "./TextSection";

type StorySection = {
  _id: string;
  layout: "image-left" | "image-right" | "full-image" | "text";
  heading?: string;
  content?: string;
  image?: { url: string; alt?: string };
  caption?: string;
  products?: any[];
};

export default function StorySectionRenderer({ sections }: { sections: StorySection[] }) {
  if (!sections || sections.length === 0) return null;

  return (
    <div className="flex flex-col w-full">
      {sections.map((section) => {
        switch (section.layout) {
          case "image-left":
            return <ImageLeftSection key={section._id} {...section} />;
          case "image-right":
            return <ImageRightSection key={section._id} {...section} />;
          case "full-image":
            return <FullImageSection key={section._id} {...section} />;
          case "text":
            return <TextSection key={section._id} {...section} />;
          default:
            return null;
        }
      })}
    </div>
  );
}
