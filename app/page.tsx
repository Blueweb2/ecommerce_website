import dynamic from "next/dynamic";

const Navbar = dynamic(() => import("@/components/shared/Navbar"));
const HeroSection = dynamic(() => import("@/components/home/HeroSection"));

const page = () => {
  return (
    <>
      <Navbar/>
      <HeroSection/>
    </>
  )
};

export default page;