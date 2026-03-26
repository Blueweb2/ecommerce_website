import Link from "next/link";
import { Facebook, Instagram, Twitter } from "lucide-react";

export default function FooterSection() {
  return (
    <footer className="bg-black text-white">
      <div 
        className="relative max-w-7xl mx-auto px-4 md:px-8 py-12 grid grid-cols-2 lg:grid-cols-4 gap-10"
        style={{
          backgroundImage: "url('/home/footer/footer.png')",
          backgroundSize: "cover",
          backgroundPosition: "right center",
        }}
      >

        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent"></div>

        {/* LEFT - BRAND INFO */}
        <div className="z-10">
          <h2 className="text-xl font-semibold mb-4">GOLDLAND</h2>

          <p className="text-sm text-gray-300 mb-2">
            Phone: +91 98765 43210
          </p>
          <p className="text-sm text-gray-300 mb-2">
            Email: support@yourbrand.com
          </p>
          <p className="text-sm text-gray-300 mb-4">
            Address: Your City, India
          </p>

          {/* PAYMENT ICONS */}
          <div className="flex gap-2 mb-4">
            <img src="/home/footer/visa.png" alt="visa" className="h-5" />
            <img src="/home/footer/master.png" alt="mastercard" className="h-5" />
            <img src="/home/footer/apple-pay.png" alt="paypal" className="h-5" />
            <img src="/home/footer/discover.png" alt="amex" className="h-5" />
            <img src="/home/footer/master.png" alt="maestro" className="h-5" />
          </div>

          {/* SOCIAL */}
          <div className="flex gap-3">
            <div className="w-8 h-8 border rounded-full flex items-center justify-center hover:bg-white hover:text-black transition">
              <Facebook size={16} />
            </div>
            <div className="w-8 h-8 border rounded-full flex items-center justify-center hover:bg-white hover:text-black transition">
              <Instagram size={16} />
            </div>
            <div className="w-8 h-8 border rounded-full flex items-center justify-center hover:bg-white hover:text-black transition">
              <Twitter size={16} />
            </div>
          </div>
        </div>

        {/* SHOP */}
        <div className="z-10">
          <h3 className="font-semibold mb-4">Shop</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li><Link href="#">Rings</Link></li>
            <li><Link href="#">Necklaces</Link></li>
            <li><Link href="#">Earrings</Link></li>
            <li><Link href="#">Bracelets</Link></li>
            <li><Link href="#">New Arrivals</Link></li>
          </ul>
        </div>

        {/* SUPPORT */}
        <div className="z-10">
          <h3 className="font-semibold mb-4">Support</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li><Link href="#">Shipping & Delivery</Link></li>
            <li><Link href="#">Returns & Exchanges</Link></li>
            <li><Link href="#">FAQs</Link></li>
            <li><Link href="#">Contact Us</Link></li>
            <li><Link href="#">Track Order</Link></li>
          </ul>
        </div>

        {/* COMPANY */}
        <div className="z-10">
          <h3 className="font-semibold mb-4">Company</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li><Link href="#">About Us</Link></li>
            <li><Link href="#">Our Story</Link></li>
            <li><Link href="#">Blog</Link></li>
            <li><Link href="#">Careers</Link></li>
            <li><Link href="#">Privacy Policy</Link></li>
          </ul>
        </div>

        {/* COPYRIGHT */}
        <div className="z-10">
          © 2026 Your Brand Name. All rights reserved.
        </div>

      </div>
    </footer>
  );
};