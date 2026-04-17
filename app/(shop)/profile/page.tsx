"use client";

import React, { useState } from "react";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import AccountDetails from "@/components/profile/AccountDetails";
import MyOrders from "@/components/profile/MyOrders";
import AddressBook from "@/components/profile/AddressBook";
import { useRouter } from "next/navigation";

type TabType = 'Account-Details' | 'My-Orders' | 'Address-Book';

export default function ProfilePage() {

  useRequireAuth();
  const [state, setState] = useState<TabType>('Account-Details');
  const router = useRouter();

  const components: Record<TabType, { page:React.ReactNode, heading:string }> = {
    'Account-Details': {
      page: <AccountDetails />,
      heading: 'Account Details'
    },
    'My-Orders': {
      page: <MyOrders/>,
      heading: 'My Orders'
    },
    'Address-Book': {
      page: <AddressBook/>,
      heading: 'Address Book'
    }
  };

  return (
    <section className="px-4 md:px-20 mt-16">

      {/* HEADER */}
      <div className="flex flex-col items-center justify-center border-b py-5 border-gray-300">
        <h5 className="text-gray-400">MY ACCOUNT</h5>
        <h2 className="font-medium text-2xl md:font-bold md:text-3xl">{components[state].heading || null}</h2>
      </div>

      {/* USER DETAILS */}
      <div className="max-w-[2000] mx-auto flex flex-col md:flex-row my-5">

        <div className="md:w-[40%] w-full flex md:flex-col md:items-start md:justify-start gap-7">
          <h3
            className={`pl-2 border-b md:border-b-0 md:border-l-2 hover:border-black cursor-pointer hover:text-black ${state === 'Account-Details' ? "border-black" : "border-transparent text-gray-500"}`} 
            onClick={() => setState('Account-Details')}
          >Account Details</h3>
          <h3 
            className={`pl-2 border-b md:border-b-0 md:border-l-2 hover:border-black cursor-pointer hover:text-black  ${state === 'My-Orders' ? "border-black" : "border-transparent text-gray-500"}`} 
            onClick={() => setState('My-Orders')}
          >My Orders</h3>
          <h3
            className="pl-2 border-b md:border-b-0 md:border-l-2 border-transparent cursor-pointer hover:border-black text-gray-500 hover:text-black " 
            onClick={() => router.push('/wishlist')}
          >Wish List</h3>
          <h3
            className={`pl-2 border-b md:border-b-0 md:border-l-2 cursor-pointer hover:text-black  
              ${state === 'Address-Book' ? "border-black text-black" : "border-transparent text-gray-500"} hover:border-black`} 
            onClick={() => setState('Address-Book')}
          >Address Book</h3>
        </div>

        <div className="w-full">
          {components[state].page || null}
        </div>

      </div>

    </section>
  );
};