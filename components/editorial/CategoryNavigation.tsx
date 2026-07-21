import EditorialCategoryNavigation from "./EditorialCategoryNavigation";

export default function CategoryNavigation({ activeCategory }: { activeCategory?: string }) {
  return <EditorialCategoryNavigation currentCategory={activeCategory ?? ""} />;
}
