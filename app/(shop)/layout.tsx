import { ReactNode } from "react";
import CartDrawer from "@/components/cart/CartDrawer";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

export default function ShopLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <section className="bg-[#f5f5f5]">
      
      {/* NAVBAR */}
      <Navbar />

      {/* CONTENT */}
      <main className="flex-1 max-w-[2000px] mx-auto pt-14 w-full">
        {children}
      </main>

      {/* FOOTER */}
      <Footer />

      {/* CART DRAWER */}
      <CartDrawer />
    </section>
  );
}