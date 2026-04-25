"use client";

import React, { useState } from "react";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import AccountDetails from "@/components/profile/AccountDetails";
import MyOrders from "@/components/profile/MyOrders";
import AddressBook from "@/components/profile/AddressBook";
import { useRouter } from "next/navigation";
import PrivacySettings from "@/components/profile/PrivacySettings";

type TabType =
  | "Account-Details"
  | "My-Orders"
  | "Address-Book"
  | "Privacy-Settings"

export default function ProfilePage() {

  useRequireAuth();
  const [state, setState] = useState<TabType>('Account-Details');
  const router = useRouter();

  const components: Record<TabType, { page: React.ReactNode; heading: string }> = {
    "Account-Details": {
      page: <AccountDetails />,
      heading: "My Account ",
    },
    "My-Orders": {
      page: <MyOrders />,
      heading: "My Orders",
    },
    "Address-Book": {
      page: <AddressBook />,
      heading: "Address Book",
    },
    "Privacy-Settings": {
      page: <PrivacySettings />,
      heading: "Privacy Settings",
    },

  };

return (
  <section className="px-4 md:px-20 mt-16">

    {/* HEADER */}
    <div className="flex flex-col items-center justify-center border-b py-5 border-gray-300">
      <h5 className="text-gray-400 tracking-widest text-xs">
        MY ACCOUNT
      </h5>
      <h2 className="font-medium text-2xl md:font-bold md:text-3xl">
        {components[state].heading}
      </h2>
    </div>

    {/* USER DETAILS */}
    <div className="max-w-[2000px] mx-auto flex flex-col md:flex-row my-5">

      {/* SIDEBAR */}
      <div className="md:w-[30%] w-full flex md:flex-col md:items-start md:justify-start gap-6">

        <h3
          className={`pl-2 border-b md:border-b-0 md:border-l-2 cursor-pointer hover:text-black
          ${state === "Account-Details"
              ? "border-black text-black"
              : "border-transparent text-gray-500"
            } hover:border-black`}
          onClick={() => setState("Account-Details")}
        >
          Account Details
        </h3>

        <h3
          className={`pl-2 border-b md:border-b-0 md:border-l-2 cursor-pointer hover:text-black
          ${state === "My-Orders"
              ? "border-black text-black"
              : "border-transparent text-gray-500"
            } hover:border-black`}
          onClick={() => setState("My-Orders")}
        >
          My Orders
        </h3>

        <h3
          className="pl-2 border-b md:border-b-0 md:border-l-2 border-transparent cursor-pointer text-gray-500 hover:text-black hover:border-black"
          onClick={() => router.push("/wishlist")}
        >
          Wish List
        </h3>

        <h3
          className={`pl-2 border-b md:border-b-0 md:border-l-2 cursor-pointer hover:text-black
          ${state === "Address-Book"
              ? "border-black text-black"
              : "border-transparent text-gray-500"
            } hover:border-black`}
          onClick={() => setState("Address-Book")}
        >
          Address Book
        </h3>

 

        <h3
          className={`pl-2 border-b md:border-b-0 md:border-l-2 cursor-pointer hover:text-black
          ${state === "Privacy-Settings"
              ? "border-black text-black"
              : "border-transparent text-gray-500"
            } hover:border-black`}
          onClick={() => setState("Privacy-Settings")}
        >
          Privacy Settings
        </h3>

      </div>

      {/* CONTENT */}
      <div className="w-full md:w-[70%]">
        {components[state].page}
      </div>

    </div>

  </section>
);
};