// "use client";

import Link from "next/link";
import { Facebook, Instagram, Linkedin, X, Youtube } from "lucide-react";
import { inter } from "@/lib/fonts";

export default function Footer() {

  return (
    <footer className="bg-[#f0f0f0]">
      <div className="py-12">
        <div className="max-w-[2000px] mx-auto px-4 md:px-32 grid grid-cols-2 md:grid-cols-4 gap-10">

          {/* SHOP */}
          <div>
            <h3 className={`${inter.className} mb-4 font-semibold text-neutral-600`}>ABOUT</h3>
            <ul className="font-brand-sans space-y-2 text-[11px]">
              <li>
                <Link href='' className={`${inter.className} text-[#5C5A58] hover:text-black transition-colors`}>
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href='' className={`${inter.className} text-[#5C5A58] hover:text-black transition-colors`}>
                  About Us
                </Link>
              </li>
              <li>
                <Link href='' className={`${inter.className} text-[#5C5A58] hover:text-black transition-colors`}>
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* SUPPORT */}
          <div>
            <h3 className={`${inter.className} mb-4 font-semibold text-neutral-600`}>HELP</h3>
            <ul className={`${inter.className} space-y-2 text-[11px] text-[#5C5A58]`}>
              <li><Link href="#" className="hover:text-black">Payment</Link></li>
              <li><Link href="#" className="hover:text-black">Shipping</Link></li>
              <li><Link href="#" className="hover:text-black">Cancellation & Returns</Link></li>
            </ul>
          </div>

          {/* COMPANY */}
          <div>
            <h3 className={`${inter.className} mb-4 font-semibold text-neutral-600`}>CONSUMER POLICY</h3>
            <ul className={`${inter.className} space-y-2 text-[11px] text-[#5C5A58]`}>
              <li><Link href="#" className="hover:text-black">Cancellation & Returns</Link></li>
              <li><Link href="#" className="hover:text-black">Terms Of Use</Link></li>
              <li><Link href="#" className="hover:text-black">Security</Link></li>
              <li><Link href="#" className="hover:text-black">Privacy</Link></li>
            </ul>
          </div>

          {/* SOCIAL ICONS */}
          <div>
            <h3 className={`${inter.className} mb-4 font-semibold text-neutral-600`}>ABOUT ZENFAZZ ADDRESS</h3>
            <p className={`${inter.className} text-[11px] text-[#5C5A58]`}>Blue Web2</p>
            <p className={`${inter.className} text-[11px] text-[#5C5A58]`}>Building: pookottumpadam road Karulai, Maplappuram, kerala, india</p>
            <div className="flex items-center gap-4 mt-4 mb-6 text-[#5C5A58]">
              <Facebook size={20} className="cursor-pointer hover:text-black h-4" />
              <Instagram size={20} className="cursor-pointer hover:text-black h-4" />
              <Linkedin size={20} className="cursor-pointer hover:text-black h-4" />
              <Youtube size={20} className="cursor-pointer hover:text-black h-4" />
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-1 text-neutral-600  flex flex-col md:flex-row justify-between max-w-[2000px] mx-auto px-4 md:px-32">
        <p className={`${inter.className} text-[11px]`}>© Zenfaz 2026. All rights reserved.</p>
        <img src="/home/footer/payment-method-69e7ec.svg" alt="" className="h-5"/>
      </div>
    </footer>
  );
};