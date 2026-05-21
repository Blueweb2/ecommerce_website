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
  const isCheckoutLogin = pathname === "/checkout/login";

  return (
    <section>
      {/* NAVBAR */}
      {!zooming && !isCheckoutLogin && <Navbar />}

      {/* CONTENT */}
      <main className="flex-1 w-full mt-16 lg:mt-24">
        {children}
      </main>

      {/* FOOTER */}
      {!zooming && !isCheckoutLogin && <Footer />}

      {/* CART DRAWER */}
      {!isCheckoutLogin && <CartDrawer />}
    </section>
  );
}