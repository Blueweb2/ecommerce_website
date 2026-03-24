import dynamic from "next/dynamic";

const Navbar = dynamic(() => import("@/components/shared/Navbar"));
const HeroSection = dynamic(() => import("@/components/home/HeroSection"));
const BrandSection = dynamic(() => import("@/components/home/BrandSection"));
const Categories = dynamic(() => import("@/components/home/Categories"));

const page = () => {
  return (
    <>
      <Navbar />
      <HeroSection />
      <BrandSection />
      <Categories />
    </>
  );
};

export default page;