import dynamic from "next/dynamic";

// const Navbar = dynamic(() => import("@/components/shared/Navbar"));
// const HeroSection = dynamic(() => import("@/components/home/HeroSection"));
// const NewItems = dynamic(() => import("@/components/home/NewItems"));
// const Categories = dynamic(() => import("@/components/home/Categories"));
// const ShopSection = dynamic(() => import("@/components/home/ShopSection"));
// const TopStoriesSection = dynamic(() => import("@/components/home/TopStories"));
// const Footer = dynamic(() => import("@/components/shared/Footer"));
// const CartDrawer = dynamic(() => import("@/components/cart/CartDrawer"));

import Navbar from "@/components/shared/Navbar";
import HeroSection from "@/components/home/HeroSection";
import NewItems from "@/components/home/NewItems";
import Categories from "@/components/home/Categories";
import ShopSection from "@/components/home/ShopSection";
import TopStoriesSection from "@/components/home/TopStories";
import Footer from "@/components/shared/Footer";
import CartDrawer from "@/components/cart/CartDrawer";


const page = () => {
  return (
    <>
      <Navbar />
      <HeroSection />
      <NewItems />
      <Categories />
      <ShopSection />
      <TopStoriesSection />
      <Footer />
      <CartDrawer />
    </>
  );
};

export default page;
