import ImageLeftSection from "./ImageLeftSection";
import ImageRightSection from "./ImageRightSection";
import FullImageSection from "./FullImageSection";
import TextSection from "./TextSection";
import type { StorySection } from "@/types/story";
import type { Product } from "@/types/product";

export default function StorySectionRenderer({ sections }: { sections: StorySection[] }) {
  if (!sections || sections.length === 0) return null;

  return (
    <div className="flex flex-col w-full">
      {sections.map((section, index) => {
        const apiProducts: unknown[] = section.products ?? [];
        const products = apiProducts.filter(
          (product): product is Product => typeof product !== "string"
        );
        switch (section.layout) {
          case "image-left":
            return <ImageLeftSection key={section._id ?? index} {...section} products={products} />;
          case "image-right":
            return <ImageRightSection key={section._id ?? index} {...section} products={products} />;
          case "full-image":
            return <FullImageSection key={section._id ?? index} {...section} />;
          case "text":
            return <TextSection key={section._id ?? index} {...section} />;
          default:
            return null;
        }
      })}
    </div>
  );
}
