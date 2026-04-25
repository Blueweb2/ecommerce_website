"use client";

export default function PrivacySettings() {
  return (
    <div className="space-y-8 p-4">

      <div>
        <h2 className="text-xl font-semibold">Account Terms and Conditions</h2>
        <p className="text-sm text-gray-500 mt-1">
          Read by you on 11 April 2026
        </p>
        <button className="underline text-gray-700 mt-2">
          Read the Terms and Conditions
        </button>
      </div>

      <div>
        <h2 className="text-xl font-semibold">Privacy Policy</h2>
        <p className="text-sm text-gray-500 mt-1">
          Read by you on 11 April 2026
        </p>
        <button className="underline text-gray-700 mt-2">
          Read our Privacy Policy
        </button>
      </div>

      <div>
        <h2 className="text-xl font-semibold">Customer Data Requests</h2>
        <p className="text-sm text-gray-500 mt-2 max-w-xl">
          Depending on where you are a resident, you may have rights in relation
          to the information that we hold about you.
        </p>

        <div className="flex gap-6 mt-4">
          <button className="underline">Access</button>
          <button className="underline">Change</button>
        </div>
      </div>

    </div>
  );
}