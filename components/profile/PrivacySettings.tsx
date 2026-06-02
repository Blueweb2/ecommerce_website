"use client";
import { inter } from "@/lib/fonts";
import { useState } from "react";

export default function PrivacySettings() {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [password, setPassword] = useState("");
  return (
    <div className={`min-h-screen ${inter.className} px-4`}>

      <div className="max-w-[760px]">

        {/* TERMS */}
        <section className="mb-12">
          <h2 className="text-[24px] leading-tight font-normal text-black mb-2">
            Account Terms and Conditions
          </h2>

          <p className="text-[13px] text-black/65 mb-2">
            Read by you on 11 April 2026
          </p>

          <button className="text-[13px] border-b border-black/50 text-black/70 hover:text-black transition">
            Read the Terms and Conditions
          </button>
        </section>

        {/* PRIVACY POLICY */}
        <section className="mb-14">
          <h2 className="text-[24px] leading-tight font-normal text-black mb-2">
            Privacy Policy
          </h2>

          <p className="text-[13px] text-black/65 mb-2">
            Read by you on 11 April 2026
          </p>

          <button className="text-[13px] border-b border-black/50 text-black/70 hover:text-black transition">
            Read our Privacy Policy
          </button>
        </section>

        {/* CUSTOMER DATA REQUESTS */}
        <section className="mb-16">
          <h2 className="text-[24px] leading-tight font-normal text-black mb-2">
            Customer Data Requests
          </h2>

          <p className="text-[13px] text-black/70 mb-2">
            Depending on where you are a resident, you may have rights in
            relation to the information that we hold about you.
          </p>

          <p className="text-[13px] text-black/70 mb-5">
            Find out more in our Privacy Policy. If these apply to you, you
            can use the following links to contact us.
          </p>

          <div className="flex items-center gap-5 text-[13px]">
            <button className="border-b border-black/50 text-black/70 hover:text-black transition">
              Access
            </button>

            <span className="text-black/30">|</span>

            <button className="border-b border-black/50 text-black/70 hover:text-black transition">
              Change
            </button>
          </div>
        </section>

        {/* CLOSE ACCOUNT */}
        <section>
          <h2 className="text-[24px] leading-tight font-normal text-black mb-2">
            Close Account
          </h2>

          <p className="text-[13px] text-black/70 mb-8">
            We inform you that by proceeding with the account deletion request,
            we will delete your account and all related personal data as soon
            as possible and no later than 30 days from the date your request
            is received.
          </p>

          <p className="text-[13px] text-black/70 mb-8">
            Please make sure you have used all your store credits and remember
            that the deletion may request more time to be processed in case
            you have an active order or return. Please consider that you may
            still use your account and receive notifications before your
            account deletion request is fulfilled.
          </p>

          <p className="text-[13px] leading-8 text-black/70 mb-10">
            For further details on how we process your personal data, take a
            look at our Privacy Policy.
          </p>

          <button
            onClick={() => setShowDeleteModal(true)}
            className="text-[13px] border-b border-black/50 text-black/70 hover:text-black"
          >
            Close Account
          </button>
        </section>
      </div>
    </div>
  );
};