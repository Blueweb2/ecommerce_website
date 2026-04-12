"use client";

import { useState } from "react";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import AccountDetails from "@/components/profile/AccountDetails";
import MyOrders from "@/components/profile/MyOrders";
import { useRouter } from "next/navigation";

type TabType = 'Account-Details' | 'My-Orders' | 'Address-Book';

export default function ProfilePage() {

  useRequireAuth();
  const [state, setState] = useState<TabType>('Account-Details');
  const router = useRouter();

  // const components: Record<TabType, JSX.Element> = {
  //   'Account-Details': <AccountDetails />,
  //   'My-Orders': <p>my orders</p>,
  //   'Address-Book': <p>address book</p>,
  // };

  const components: Record<TabType, JSX.Element> = {
    'Account-Details': {
      page: <AccountDetails />,
      heading: 'Account Details'
    },
    'My-Orders': {
      page: <MyOrders/>,
      heading: 'My Orders'
    },
    'Address-Book': {
      page: <p>address book</p>,
      heading: 'Address Book'
    }
  };

  return (
    <section className="bg-gray-50 px-4 md:px-20 mt-16">

      {/* HEADER */}
      <div className="flex flex-col items-center justify-center border-b py-5 border-gray-300">
        <h5 className="text-gray-400">MY ACCOUNT</h5>
        <h2 className="">{components[state].heading || null}</h2>
      </div>

      {/* USER DETAILS */}
      <div className="max-w-[2000] mx-auto flex flex-col md:flex-row my-5">

        <div className="md:w-[40%] w-full flex md:flex-col md:items-start md:justify-start gap-7 ">
          <h3 onClick={() => setState('Account-Details')}>Account Details</h3>
          <h3 onClick={() => setState('My-Orders')}>My Orders</h3>
          <h3 onClick={() => router.push('/wishlist')}>Wish List</h3>
          <h3 onClick={() => setState('Address-Book')}>Address Book</h3>
        </div>

        <div className="w-full">
          {components[state].page || null}
        </div>

      </div>

    </section>
  );
};