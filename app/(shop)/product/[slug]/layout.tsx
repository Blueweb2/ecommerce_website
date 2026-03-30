import dynamic from "next/dynamic";

const Navbar = dynamic(() => import("@/components/shared/Navbar"));
const Footer = dynamic(() => import("@/components/shared/Footer"));

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <>
      <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
      <Footer />
    </>
  );
};