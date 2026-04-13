import dynamic from "next/dynamic";

const Navbar = dynamic(() => import("@/components/shared/Navbar"));
const Footer = dynamic(() => import("@/components/shared/Footer"));

const MoreProductsLayout = ({
  children,
}:{
  children:React.ReactNode;
}) => {
  return (
    <>
      {/* <Navbar /> */}
      <main>
        {children}
      </main>
      {/* <Footer /> */}
    </>
  );
};

export default MoreProductsLayout;