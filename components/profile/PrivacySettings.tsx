"use client";
import { inter } from "@/lib/fonts";
import { useState } from "react";
import { authApi } from "@/lib/api/auth.api";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function PrivacySettings() {
  const router = useRouter();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDeleteAccount = async () => {
    if (confirmText !== "DELETE MY ACCOUNT") {
      toast.error("Please type DELETE MY ACCOUNT");
      return;
    }

    try {
      setLoading(true);

      await authApi.deleteAccount(password);

      toast.success("Account deleted successfully");

      localStorage.removeItem("accessToken");

      router.push("/");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
        "Failed to delete account"
      );
    } finally {
      setLoading(false);
    }
  };

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
          <Link href="/terms-of-use">
            <button className="text-[13px] border-b border-black/50 text-black/70 hover:text-black transition">
              Read the Terms and Conditions
            </button>
          </Link>
        </section>

        {/* PRIVACY POLICY */}
        <section className="mb-14">
          <h2 className="text-[24px] leading-tight font-normal text-black mb-2">
            Privacy Policy
          </h2>

          <p className="text-[13px] text-black/65 mb-2">
            Read by you on 11 April 2026
          </p>
          <Link href="/privacy-policy">
            <button className="text-[13px] border-b border-black/50 text-black/70 hover:text-black transition">
              Read our Privacy Policy
            </button>
          </Link>
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

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md bg-white p-6 shadow-xl">
            <h3 className="text-[22px] mb-3">
              Delete Account
            </h3>

            <p className="text-[13px] text-black/70 mb-5">
              This action cannot be undone.
              Your account will be permanently deactivated.
            </p>

            <div className="space-y-4">
              <div>
                <p className="text-[12px] uppercase tracking-[1px] text-black/60 mb-2">
                  Type
                  <span className="font-medium text-black ml-1">
                    DELETE MY ACCOUNT
                  </span>
                  {" "}to confirm
                </p>

                <input
                  type="text"
                  value={confirmText}
                  placeholder="Type DELETE MY ACCOUNT to here"
                  onChange={(e) => setConfirmText(e.target.value)}
                  className="
        h-[48px]
        w-full
        border
        border-black/20
        px-4
        text-[14px]
        outline-none
        focus:border-black
      "
                />
              </div>

              <div>
                <p className="text-[12px] uppercase tracking-[1px] text-black/60 mb-2">
                  Password
                </p>

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="
        h-[48px]
        w-full
        border
        border-black/20
        px-4
        text-[14px]
        outline-none
        focus:border-black
      "
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setConfirmText("");
                  setPassword("");
                }}
                className="text-[13px]"
              >
                Cancel
              </button>

              <button
                onClick={handleDeleteAccount}
                disabled={loading}
                className="bg-black text-white px-5 py-2 text-[13px]"
              >
                {loading ? "Deleting..." : "Delete Account"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};