import Navbar from "@/components/shared/Navbar"
import Footer from "@/components/shared/Footer"

const ProductLayout = ({
  children
}:{
  children: React.ReactNode;
}) => {
  return (
    <>
      {/* <Navbar/> */}
      {children}
      {/* <Footer/> */}
    </>
  )
}

export default ProductLayout;