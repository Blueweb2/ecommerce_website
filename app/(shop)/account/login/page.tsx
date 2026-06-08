"use client";

import Link from "next/link";
import LoginForm from "@/components/auth/LoginForm";
import { bodoni, inter } from "@/lib/fonts";

export default function AccountLoginPage() {

  return (
    <div className={`min-h-screen  bg-[#f3f3f1] ${inter.className}`}>
    
      {/* LOGIN SECTION */}
      <main className="flex justify-center px-4 md:py-20">
        <div className="w-full max-w-[420px]">

          {/* TITLE */}
          <div className="mb-10 mt-24">
            <h2
              className={`text-[35px] md:text-[42px] font-light text-black ${bodoni.className}`}
            >
              Sign in
            </h2>

            <p className="mt-3 text-[13px] leading-6 text-[#666]">
              Please enter your credentials to access your account.
            </p>
          </div>

          {/* LOGIN FORM */}
          <div className="space-y-6">

            <LoginForm
            redirectPath="/account"
              buttonLabel="Sign In"
            />

            {/* FORGOT PASSWORD */}
            <div className="text-left">
              <Link
                href="/account/forgot-password"
                className="text-[13px] text-black hover:underline"
              >
                Forgot your password?
              </Link>
            </div>

            {/* DIVIDER */}
            <div className="border-t border-[#dddddd] pt-8">

              <div className="text-center">
                <h3
                  className={`text-[32px] font-light text-black ${bodoni.className}`}
                >
                  Don&apos;t have an account?
                </h3>

                <p className="mt-3 text-[13px] leading-6 text-[#666]">
                  Create an account to track orders, save wishlist items,
                  and enjoy faster checkout experiences.
                </p>
              </div>

              {/* CREATE ACCOUNT BUTTON */}
              <Link
                href="/register"
                className="mt-6 flex h-[50px] w-full items-center justify-center border border-black bg-transparent text-sm font-medium text-black transition hover:bg-black hover:text-white"
              >
                Create Account
              </Link>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};