import CategoriesSlider from "./CategoriesSlider";
import TopCollections from "./TopCollections";

export default function Categories() {
  return (
    <section className="pt-10 pb-6 ">
      <div className="max-w-[2000px] mx-auto px-4 md:px-32">
        <CategoriesSlider />
        <TopCollections />
      </div>
    </section>
  );
}