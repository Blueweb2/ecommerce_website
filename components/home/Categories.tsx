import CategoriesSlider from "./CategoriesSlider";
import TopCollections from "./TopCollections";

export default function Categories() {
  return (
    <section className="bg-[#f5f5f5] pt-10 pb-6 px-4 md:px-20">
      <div className="max-w-[2000px] mx-auto">
        <CategoriesSlider />
        <TopCollections />
      </div>
    </section>
  );
}