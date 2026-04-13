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
    <div className="min-h-screen flex flex-col bg-white">
      
      {/* 🔹 NAVBAR */}
      <Navbar />

      {/* 🔹 CONTENT */}
      <main className="flex-1 max-w-7xl mx-auto px-4 py-14 w-full">
        {children}
      </main>

      {/* 🔹 FOOTER */}
      <Footer />

      {/* 🔹 CART DRAWER */}
      <CartDrawer />
    </div>
  );
}