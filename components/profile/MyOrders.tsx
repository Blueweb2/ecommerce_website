"use client";

import Link from "next/link";

const MyOrders = () => {
  return (
    <div className="w-full flex items-center justify-center py-20 bg-white">
      <div className="text-center max-w-md px-6">

        {/* ICON */}
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 flex items-center justify-center border border-black rounded-full text-xl">
            !
          </div>
        </div>

        {/* TITLE */}
        <h2 className="text-xl md:text-2xl font-medium mb-3">
          You don’t currently have any orders
        </h2>

        {/* DESCRIPTION */}
        <p className="text-gray-600 text-sm md:text-base mb-6 leading-relaxed">
          Once you have checked out, you can view and track your order here
        </p>

        {/* CTA */}
        <Link
          href="/shop"
          className="text-sm underline underline-offset-4 hover:text-gray-800 transition"
        >
          Shop What’s New
        </Link>

      </div>
    </div>
  );
};

export default MyOrders;