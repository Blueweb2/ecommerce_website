import Link from "next/link";
import { Facebook, Instagram, Linkedin, X, Youtube } from "lucide-react";

export default function FooterSection() {
  return (
    <footer className="bg-[#e7e7e7] py-12 text-sm text-gray-700">
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-2 md:grid-cols-4 gap-10">

        {/* SHOP */}
        <div>
          <h3 className="font-semibold mb-4 text-black">Shop</h3>
          <ul className="space-y-2">
            <li><Link href="#">Rings</Link></li>
            <li><Link href="#">Necklaces</Link></li>
            <li><Link href="#">Earrings</Link></li>
            <li><Link href="#">Bracelets</Link></li>
            <li><Link href="#">New Arrivals</Link></li>
          </ul>
        </div>

        {/* SUPPORT */}
        <div>
          <h3 className="font-semibold mb-4 text-black">Support</h3>
          <ul className="space-y-2">
            <li><Link href="#">Shipping & Delivery</Link></li>
            <li><Link href="#">Returns & Exchanges</Link></li>
            <li><Link href="#">FAQs</Link></li>
            <li><Link href="#">Contact Us</Link></li>
            <li><Link href="#">Track Order</Link></li>
          </ul>
        </div>

        {/* COMPANY */}
        <div>
          <h3 className="font-semibold mb-4 text-black">Company</h3>
          <ul className="space-y-2">
            <li><Link href="#">About Us</Link></li>
            <li><Link href="#">Our Story</Link></li>
            <li><Link href="#">Blog</Link></li>
            <li><Link href="#">Careers</Link></li>
            <li><Link href="#">Privacy Policy</Link></li>
          </ul>
        </div>

        {/* SOCIAL + PAYMENTS */}
        <div>
          <h3 className="font-semibold mb-4 text-black">Follow us on</h3>

          {/* SOCIAL ICONS */}
          <div className="flex items-center gap-4 mb-6">
            <Facebook size={20} className="cursor-pointer hover:text-black h-7" />
            <Instagram size={20} className="cursor-pointer hover:text-black h-7" />
            <Linkedin size={20} className="cursor-pointer hover:text-black h-7" />
            <X size={20} className="cursor-pointer hover:text-black h-7" />
            <Youtube size={20} className="cursor-pointer hover:text-black h-7" />
          </div>

          {/* PAYMENTS */}
          <p className="text-xs text-gray-500 mb-2">We accepts</p>
          <div className="flex items-center gap-2">
            <img src="/home/footer/visa.png" alt="visa" className="h-3.5 md:h-4.5" />
            <img src="/home/footer/master.png" alt="mastercard" className="h-3.5 md:h-4.5" />
            <img src="/home/footer/apple-pay.png" alt="paypal" className="h-3.5 md:h-4.5" />
            <img src="/home/footer/discover.png" alt="amex" className="h-3.5 md:h-4.5" />
            <img src="/home/footer/maestro.png" alt="maestro" className="h-3.5 md:h-4.5" />
          </div>
        </div>

      </div>
    </footer>
  );
};