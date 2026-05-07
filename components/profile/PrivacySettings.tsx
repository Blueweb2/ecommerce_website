"use client";
import { bodoni, inter } from "@/lib/fonts";

export default function PrivacySettings() {
  return (
    <div className="space-y-8 p-4">

      <div>
        <h2 className={`${bodoni.className} text-neutral-600 text-xl font-semibold`}>Account Terms and Conditions</h2>
        <p className={`${inter.className} text-sm text-gray-500 mt-1`}>
          Read by you on 11 April 2026
        </p>
        <button className={`${inter.className} underline text-gray-700 text-sm mt-2`}>
          Read the Terms and Conditions
        </button>
      </div>

      <div>
        <h2 className={`${bodoni.className} text-neutral-600 text-xl font-semibold`}>Privacy Policy</h2>
        <p className={`${inter.className} text-sm text-gray-500 mt-1`}>
          Read by you on 11 April 2026
        </p>
        <button className={`${inter.className} underline text-gray-700 text-sm mt-2`}>
          Read our Privacy Policy
        </button>
      </div>

      <div>
        <h2 className={`${bodoni.className} text-neutral-600 text-xl font-semibold`}>Customer Data Requests</h2>
        <p className={`${inter.className} text-sm text-gray-500 mt-1`}>
          Depending on where you are a resident, you may have rights in relation
          to the information that we hold about you.
        </p>

        <div className="flex gap-6 mt-2">
          <button className={`${inter.className} underline text-gray-700 text-sm`}>Access</button>
          <button className={`${inter.className} underline text-gray-700 text-sm`}>Change</button>
        </div>
      </div>

    </div>
  );
}