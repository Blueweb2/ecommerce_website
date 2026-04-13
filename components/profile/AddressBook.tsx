"use client";

import Link from "next/link";

const AddressBook = () => {
  return (
    <div className="w-full flex items-center justify-center mt-6 md:mt-0">
      <div className="text-center max-w-md px-6">

        {/* ICON */}
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 flex items-center justify-center border border-black rounded-full text-xl">
            !
          </div>
        </div>

        {/* TITLE */}
        <h2 className="text-xl md:text-2xl font-medium mb-3">
         You don’t have any saved addresses
        </h2>

        {/* DESCRIPTION */}
        <p className="text-gray-600 text-sm md:text-base mb-6 leading-relaxed">
         Add an address to check out more quickly
        </p>

        {/* CTA */}
        <Link
          href="/"
          className="text-sm underline underline-offset-4 hover:text-gray-800 transition"
        >
          Add an address
        </Link>

      </div>
    </div>
  );
};

export default AddressBook;