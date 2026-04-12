"use client";

import { useState } from "react";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import AddressSection from "@/components/profile/AddressSection";

export default function ProfilePage() {

  useRequireAuth();
  const [state, setState] = useState('My Orders');

  return (
    <section className="bg-gray-50 px-4 md:px-20 mt-16">

      {/* HEADER */}
      <div className="flex flex-col items-center justify-center border-b py-5 border-gray-300">
        <h5>My Account</h5>
        <h2>Account Details</h2>
      </div>

      {/* USER DETAILS */}
      <div className="max-w-[2000] mx-auto flex my-5">

        <div className="flex flex-col gap-7 w-[40%]">
          <h3 onClick={() => setState('Account Details')}>Account Details</h3>
          <h3 onClick={() => setState('My Orders')}>My Orders</h3>
          <h3 onClick={() => setState('Wish List')}>Wish List</h3>
          <h3 onClick={() => setState('Address Book')}>Address Book</h3>
        </div>

        <div className="w-full">
          {state === 'Account Details' && <AddressSection />}
        </div>

      </div>

    </section>
  );
};