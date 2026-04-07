import Link from "next/link";
import { ShoppingCart } from "lucide-react";

export default function CheckoutNavbar() {
  return (
    <nav className="w-full">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-5 flex items-center justify-between">
        
        {/* Empty space */}
        <div />

        {/* Logo / Title */}
        <h1 className="text-4xl">
          FAZZMI
        </h1>

        {/* Cart Icon */}
        <Link href="/cart" className="text-black hover:opacity-70 transition">
          <ShoppingCart  className="text-4xl" />
        </Link>

      </div>
    </nav>
  );
};