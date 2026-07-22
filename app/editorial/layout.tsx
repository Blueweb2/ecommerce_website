import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { ReactNode } from "react";

export default function ShopLayout({
  children,
}: {
  children: ReactNode;
}) {

  return (
    <section>
      <Navbar />

      {/* CONTENT */}
      <main className="mt-14 md:mt-20 lg:mt-[139px]">
        {children}
      </main>

      {/* FOOTER */}
      <Footer />
    </section>
  );
}
