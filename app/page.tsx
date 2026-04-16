import dynamic from "next/dynamic";

const Navbar = dynamic(() => import("@/components/shared/Navbar"));
const HeroSection = dynamic(() => import("@/components/home/HeroSection"));
const NewItems = dynamic(() => import("@/components/home/NewItems"));
const Categories = dynamic(() => import("@/components/home/Categories"));
const ShopSection = dynamic(() => import("@/components/home/ShopSection"));
const TopStoriesSection = dynamic(() => import("@/components/home/TopStories"));
const ExclusiveAccess = dynamic(() => import("@/components/home/ExclusiveAccess"));
const Footer = dynamic(() => import("@/components/shared/Footer"));
const CartDrawer = dynamic(() => import("@/components/cart/CartDrawer"));

const page = () => {
  return (
    <>
      <Navbar />
      <HeroSection />
      <NewItems />
      <Categories />
      <ShopSection />
      <TopStoriesSection />
      <ExclusiveAccess />
      <Footer />
      <CartDrawer />
    </>
  );
};

export default page;