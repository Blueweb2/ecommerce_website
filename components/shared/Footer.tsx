"use client";
import Link from "next/link";
import { Facebook, Instagram, Linkedin, X, Youtube } from "lucide-react";
import { useEffect, useState } from "react";
import { categoryAPI } from "@/lib/api/category.api";

interface Category {
  _id: string;
  name: string;
  slug: string;
  parent?: string | null;
  isActive: boolean;
}

export default function Footer() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoryAPI.getAll();
        // Filter only top-level active categories
        const topLevel = (res.data.data || []).filter(
          (cat: Category) => !cat.parent && cat.isActive
        );
        setCategories(topLevel);
      } catch (error) {
        console.error("Failed to fetch footer categories:", error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <footer>
      <div className="bg-[#e7e7e7] py-12 text-sm text-gray-700">
        <div className="max-w-[2000px] mx-auto px-4 md:px-32 grid grid-cols-2 md:grid-cols-4 gap-10">

          {/* SHOP */}
          <div>
            <h3 className="font-semibold mb-4 text-black">Shop</h3>
            <ul className="space-y-2">
              {categories.length > 0 ? (
                categories.map((cat) => (
                  <li key={cat._id}>
                    <Link href={`/category/${cat.slug}`} className="hover:text-black transition-colors">
                      {cat.name}
                    </Link>
                  </li>
                ))
              ) : (
                <>
                  <li><Link href="/category/rings">Rings</Link></li>
                  <li><Link href="/category/necklaces">Necklaces</Link></li>
                  <li><Link href="/category/earrings">Earrings</Link></li>
                  <li><Link href="/category/bracelets">Bracelets</Link></li>
                </>
              )}
              <li><Link href="/collection/new-in" className="hover:text-black transition-colors">New Arrivals</Link></li>
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
            <p className="text-xs text-[#8D8B9D] mb-2">We accepts</p>
            <div className="flex items-center gap-2">
              <img src="/home/footer/visa.png" alt="visa" className="h-3.5 md:h-4.5" />
              <img src="/home/footer/master.png" alt="mastercard" className="h-3.5 md:h-4.5" />
              <img src="/home/footer/apple-pay.png" alt="paypal" className="h-3.5 md:h-4.5" />
              <img src="/home/footer/discover.png" alt="amex" className="h-3.5 md:h-4.5" />
              <img src="/home/footer/maestro.png" alt="maestro" className="h-3.5 md:h-4.5" />
            </div>
          </div>

        </div>
      </div>

      <div className="bg-[#f5f5f5] py-5 text-[#8D8B9D]">
        <p className="max-w-7xl mx-auto pl-4">@ 2026 Your Brand Name All right recived</p>
      </div>
    </footer>
  );
};