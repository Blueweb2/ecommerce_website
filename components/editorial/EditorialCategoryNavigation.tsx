import Link from "next/link";
import { STORY_CATEGORIES } from "@/lib/constants/storyCategories";

type Props = {
  currentCategory: string;
};

const toCategorySlug = (category: string) =>
  category
    .trim()
    .toLowerCase()
    .replace(/&/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

export default function EditorialCategoryNavigation({ currentCategory }: Props) {
  const activeCategory = toCategorySlug(currentCategory);

  return (
    <nav aria-label="Editorial categories">
      <div className="scrollbar-hide mx-auto flex max-w-7xl snap-x items-center justify-start gap-6 overflow-x-auto px-5 py-4 sm:justify-center sm:gap-7 lg:gap-8">
        {STORY_CATEGORIES.map((category) => {
          const isActive = category.slug === activeCategory;

          return (
            <Link
              key={category.slug}
              href={`/editorial/${category.slug}`}
              aria-current={isActive ? "page" : undefined}
              className="shrink-0 snap-start border-b pb-1 font-brand-sans text-[11px] uppercase tracking-[0.10em] transition-colors duration-200 border-transparent font-bold text-stone-950 hover:text-stone-600"
            >
              {category.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
