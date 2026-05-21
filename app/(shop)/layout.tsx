"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();
  const isCheckoutRoute = pathname.startsWith("/checkout");

  return (
    <section>
      {/* NAVBAR */}
      {!zooming && !isCheckoutRoute && <Navbar />}

      {/* CONTENT */}
      <main className="flex-1 w-full ">
        {children}
      </main>

      {/* FOOTER */}
      {!zooming && !isCheckoutRoute && <Footer />}

      {/* CART DRAWER */}
      {!isCheckoutRoute && <CartDrawer />}
    </section>
  );
}
