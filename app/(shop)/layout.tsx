"use client";

import { ReactNode } from "react";
import CartDrawer from "@/components/cart/CartDrawer";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { useProductStore } from "@/store/user/product/useProductStore";

export default function ShopLayout({
  children,
}: {
  children: ReactNode;
}) {

  const { zooming } = useProductStore();

  return (
    <section>
      {/* NAVBAR */}
      {!zooming && <Navbar />}

      {/* CONTENT  max-w-[2000px] mx-auto */}
      <main className="flex-1 pt-14 w-full">
        {children}
      </main>

      {/* FOOTER */}
      {!zooming && <Footer />}

      {/* CART DRAWER */}
      <CartDrawer />
    </section>
  );
}