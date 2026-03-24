"use client";

import { useState } from "react";

export default function ExclusiveAccess() {

  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEmail('')
    console.log(email);
  };

  return (
    <section className="bg-[#f5f5f5] py-3 lg:py-16">
      <div className="max-w-2xl mx-auto px-4 text-center">

        {/* TITLE */}
        <h2 className="text-2xl font-semibold mb-3 font-serif">
          Exclusive Access
        </h2>

        {/* DESCRIPTION */}
        <p className="text-sm text-gray-600 mb-6">
          Get updates on new designs, trends, and special offers straight to your inbox.
        </p>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="flex items-stretch border border-gray-300 rounded-md overflow-hidden bg-white"
        >
          <input
            type="email"
            placeholder="example@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1 px-2 py-2 lg:px-4 lg:py-3 text-sm outline-none font-mono"
          />

          <button
            type="submit"
            className="px-2 sm:px-5 text-sm font-medium text-black transition hover:bg-gray-100 border-l border-gray-300"
          >
            SUBSCRIBE
          </button>
        </form>

      </div>
    </section>
  );
};