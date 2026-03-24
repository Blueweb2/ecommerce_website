import dynamic from "next/dynamic";

const Navbar = dynamic(() => import("@/components/shared/Navbar"));
const HeroSection = dynamic(() => import("@/components/home/HeroSection"));
const BrandSection = dynamic(() => import("@/components/home/BrandSection"));
const Categories = dynamic(() => import("@/components/home/Categories"));
const ShopSection = dynamic(() => import("@/components/home/ShopSection"));
const Advertisement = dynamic(() => import("@/components/home/Advertisement"));
const TrendingBlog = dynamic(() => import("@/components/home/TrendingBlog"));
const ExclusiveAccess = dynamic(() => import("@/components/home/ExclusiveAccess"));
const TrustSection = dynamic(() => import("@/components/home/TrustSection"));

const page = () => {
  return (
    <>
      <Navbar />
      <HeroSection />
      <BrandSection />
      <Categories />
      <ShopSection />
      <Advertisement />
      <TrendingBlog />
      <ExclusiveAccess />
      <TrustSection />
    </>
  );
};

export default page;