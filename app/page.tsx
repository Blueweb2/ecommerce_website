import dynamic from "next/dynamic";

const Navbar = dynamic(() => import("@/components/shared/Navbar"));

const page = () => {
  return (
    <>
      <Navbar/>
    </>
  )
};

export default page;