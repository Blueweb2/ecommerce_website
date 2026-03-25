import dynamic from "next/dynamic";

const Navbar = dynamic(() => import("@/components/shared/Navbar"));
const HeroSection = dynamic(() => import("@/components/home/HeroSection"));
const BrandSection = dynamic(() => import("@/components/home/BrandSection"));

const page = () => {
  return (
    <>
      <Navbar />
      <HeroSection />
      <BrandSection />
    </>
  );
};

export default page;