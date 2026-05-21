"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/user/cart/useCartStore";
import LoginForm from "@/components/auth/LoginForm";
import { Lock, ShoppingBag, ShieldCheck, HelpCircle } from "lucide-react";
import { bodoni, inter } from "@/lib/fonts";

export default function CheckoutLoginPage() {
  const router = useRouter();
  const { items, totalPrice, totalGstAmount, appliedPromo } = useCartStore();

  const discountAmount = appliedPromo?.discountAmount || 0;
  const grandTotal = totalPrice + totalGstAmount - discountAmount;

  return (
    <div className={`min-h-screen bg-slate-50 flex flex-col ${inter.className}`}>
      
      {/* MINIMAL HEADER */}
      <header className="bg-white border-b border-slate-200 py-4 px-6 md:px-12 flex items-center justify-between z-10 shadow-sm">
        <Link href="/">
          <span className={`text-2xl font-semibold tracking-widest text-[#1a1f1a] uppercase cursor-pointer ${bodoni.className}`}>
            Goldland
          </span>
        </Link>
        <div className="flex items-center gap-2 text-slate-600 text-xs font-semibold uppercase tracking-wider">
          <Lock className="h-4 w-4 text-[#d4af37]" />
          <span>Secure Checkout</span>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="flex-1 flex flex-col lg:flex-row max-w-7xl mx-auto w-full px-4 py-8 md:py-12 gap-8">
        
        {/* LEFT COLUMN: AUTH OPTIONS */}
        <section className="flex-1 space-y-8 bg-white p-6 md:p-10 rounded-2xl border border-slate-100 shadow-sm h-fit">
          
          {/* SECURE CHECKOUT BRANDING */}
          <div className="border-b border-slate-100 pb-6">
            <h1 className={`text-2xl font-normal text-slate-900 ${bodoni.className}`}>
              Signing in to your account
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Sign in to use your saved addresses, track rewards, and check out faster.
            </p>
          </div>

          {/* LOGIN FORM */}
          <div className="max-w-md">
            <LoginForm redirectPath="/checkout" buttonLabel="Sign In and Continue" />
          </div>

          <div className="border-t border-slate-100 pt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* GUEST CHECKOUT */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Guest Checkout
              </h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                No account? No problem. You can check out as a guest and create an account later.
              </p>
              <button
                onClick={() => router.push("/checkout")}
                className="w-full text-center border border-slate-300 text-slate-800 py-2.5 rounded-xl hover:bg-slate-50 transition font-medium text-xs uppercase tracking-wider cursor-pointer"
              >
                Continue as Guest
              </button>
            </div>

            {/* REGISTER SECTION */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                New Customer
              </h3>
              <p className="text-slate-500 text-xs leading-relaxed">
                Join us to receive updates on collections, designer news, and exclusive offers.
              </p>
              <Link href="/register" className="block w-full text-center bg-slate-100 text-slate-800 py-2.5 rounded-xl hover:bg-slate-200 transition font-medium text-xs uppercase tracking-wider">
                Register An Account
              </Link>
            </div>

          </div>

        </section>

        {/* RIGHT COLUMN: ORDER SUMMARY SIDEBAR */}
        <aside className="w-full lg:w-[380px] space-y-6">
          
          {/* ORDER SUMMARY CARD */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
              <ShoppingBag className="h-5 w-5 text-slate-600" />
              <h2 className="text-base font-bold text-slate-800 uppercase tracking-wider">
                Order Summary
              </h2>
              <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-bold ml-auto">
                {items.reduce((sum, item) => sum + item.quantity, 0)} Items
              </span>
            </div>

            {/* PRODUCT LIST */}
            <div className="max-h-[300px] overflow-y-auto space-y-4 pr-1 scrollbar-hide">
              {items.length === 0 ? (
                <p className="text-slate-400 text-sm text-center py-6">Your shopping bag is empty.</p>
              ) : (
                items.map((item, idx) => (
                  <div key={idx} className="flex gap-4 items-center">
                    <img
                      src={item.image || "/placeholder.jpg"}
                      alt={item.name}
                      className="w-14 h-16 object-cover bg-slate-50 rounded-lg border border-slate-100"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-semibold text-slate-800 truncate">{item.name}</h4>
                      <p className="text-slate-500 text-[10px] mt-0.5">
                        Qty: {item.quantity} {item.isFabric ? `(${item.unit || "meters"})` : ""}
                      </p>
                      {item.selectedOptions && item.selectedOptions.length > 0 && (
                        <p className="text-slate-400 text-[9px] truncate">
                          {item.selectedOptions.map(opt => `${opt.fieldName}: ${opt.value}`).join(", ")}
                        </p>
                      )}
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span className="text-xs font-bold text-slate-800">
                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* BREAKDOWN */}
            <div className="border-t border-slate-100 pt-4 space-y-2 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-800">₹{totalPrice.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between">
                <span>Estimated Tax / GST</span>
                <span className="font-semibold text-slate-800">₹{totalGstAmount.toLocaleString("en-IN")}</span>
              </div>
              {appliedPromo && (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount ({appliedPromo.code})</span>
                  <span className="font-semibold">-₹{discountAmount.toLocaleString("en-IN")}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery</span>
                <span className="text-emerald-600 font-semibold">FREE</span>
              </div>
              <div className="border-t border-slate-100 pt-4 flex justify-between text-sm font-bold text-slate-900">
                <span>Total to Pay</span>
                <span>₹{grandTotal.toLocaleString("en-IN")}</span>
              </div>
            </div>

          </div>

          {/* SECURE ASSURANCE */}
          <div className="bg-[#12251a]/5 rounded-2xl border border-emerald-100 p-5 flex gap-4 items-start">
            <ShieldCheck className="h-5 w-5 text-emerald-700 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
                Security Assurance
              </h4>
              <p className="text-[11px] text-emerald-900/70 leading-relaxed">
                Your personal and payment details are fully encrypted and safe. We never store credit card numbers.
              </p>
            </div>
          </div>

        </aside>

      </main>

      {/* MINIMAL FOOTER */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-400 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Goldland E-Commerce. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/terms" className="hover:underline hover:text-slate-600">Terms of Use</Link>
            <Link href="/privacy" className="hover:underline hover:text-slate-600">Privacy Policy</Link>
            <Link href="/support" className="hover:underline hover:text-slate-600 flex items-center gap-1">
              <HelpCircle className="h-3.5 w-3.5" /> Customer Care
            </Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
