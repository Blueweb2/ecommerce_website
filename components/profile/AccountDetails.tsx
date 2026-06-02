"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth/useAuthStore";
import { inter } from "@/lib/fonts";
import { authApi } from "@/lib/api/auth.api";
import toast from "react-hot-toast";

export default function AccountDetails() {
  const {
    user,
    loading: authLoading,
    updateUser,
  } = useAuthStore();

  const [editingName, setEditingName] = useState(false);
  const [editingEmail, setEditingEmail] = useState(false);
  const [editingPassword, setEditingPassword] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [emailOtp, setEmailOtp] = useState("");
  const [emailOtpSent, setEmailOtpSent] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);
  // const handleUpdateProfile = async () => {
  //   try {
  //     setSaving(true);

  //     const res = await api.patch("/users/profile", {
  //       name,
  //       email,
  //     });

  //     updateUser(res.data.user);

  //     toast.success("Profile updated");

  //     setEditingName(false);
  //     setEditingEmail(false);
  //   } catch (error) {
  //     toast.error("Failed to update profile");
  //   } finally {
  //     setSaving(false);
  //   }
  // };





  const handleUpdateName = async () => {
    try {
      setSaving(true);

      const res = await authApi.updateProfile({
        name,
      });

      updateUser(res.data.user);

      setEditingName(false);

      toast.success("Name updated");
    } catch {
      toast.error("Failed to update name");
    } finally {
      setSaving(false);
    }
  };
  const handleRequestEmailChange = async () => {
    try {
      setSaving(true);

      await authApi.requestEmailChange(email);

      setEmailOtpSent(true);

      toast.success("OTP sent to new email");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
        "Failed to send OTP"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleVerifyEmail = async () => {
    try {
      setSaving(true);

      const res = await authApi.verifyEmailChange({
        newEmail: email,
        otp: emailOtp,
      });

      updateUser(res.data.user);

      setEditingEmail(false);
      setEmailOtp("");
      setEmailOtpSent(false);

      toast.success("Email updated");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
        "Invalid OTP"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    try {
      setSaving(true);

      await authApi.changePassword({
        oldPassword: currentPassword,
        newPassword,
      });

      setCurrentPassword("");
      setNewPassword("");
      setEditingPassword(false);

      toast.success("Password updated");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
        "Failed to update password"
      );
    } finally {
      setSaving(false);
    }
  };
  
  if (authLoading || !user) {
    return (
      <div className="flex h-[60vh] items-center justify-center text-gray-500">
        Loading account...
      </div>
    );
  };


return (
  <div className={`${inter.className} min-h-screen px-3 py-4 lg:px-6`}>
    {/* NAME */}
    <div className="border border-black/20 bg-transparent px-6 py-5 mb-4">
      <h2 className="text-[20px] font-normal text-black mb-3">
        Personal information
      </h2>

      {editingName ? (
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="h-[48px] w-full border border-black/20 px-4 text-[14px] outline-none focus:border-black"
        />
      ) : (
        <p className="text-[13px] text-black">{user.name}</p>
      )}

      <div className="border-t border-black/20 mt-4 pt-2">
        {editingName ? (
          <div className="flex gap-4">
            <button
              onClick={handleUpdateName}
              disabled={saving}
              className="text-[13px] text-black"
            >
              Save
            </button>

            <button
              onClick={() => {
                setName(user.name);
                setEditingName(false);
              }}
              className="text-[13px] text-gray-500"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setEditingName(true)}
            className="text-[13px] text-black"
          >
            Edit
          </button>
        )}
      </div>
    </div>

    {/* EMAIL */}
    <div className="border border-black/20 bg-transparent px-6 py-5 mb-4">
      <h2 className="text-[20px] font-normal text-black mb-3">
        Email address
      </h2>

      {editingEmail ? (
        <div className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-[48px] w-full border border-black/20 px-4 text-[14px] outline-none focus:border-black"
          />

          {emailOtpSent && (
            <input
              type="text"
              placeholder="Enter OTP"
              value={emailOtp}
              onChange={(e) => setEmailOtp(e.target.value)}
              className="h-[48px] w-full border border-black/20 px-4 text-[14px] outline-none focus:border-black"
            />
          )}
        </div>
      ) : (
        <p className="text-[13px] text-black">{user.email}</p>
      )}

      <div className="border-t border-black/20 mt-4 pt-2">
        {editingEmail ? (
          <div className="flex gap-4 flex-wrap">
            {!emailOtpSent ? (
              <button
                onClick={handleRequestEmailChange}
                disabled={saving}
                className="text-[13px] text-black"
              >
                Send OTP
              </button>
            ) : (
              <button
                onClick={handleVerifyEmail}
                disabled={saving}
                className="text-[13px] text-black"
              >
                Verify & Save
              </button>
            )}

            <button
              onClick={() => {
                setEditingEmail(false);
                setEmail(user.email);
                setEmailOtp("");
                setEmailOtpSent(false);
              }}
              className="text-[13px] text-gray-500"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setEditingEmail(true)}
            className="text-[13px] text-black"
          >
            Edit
          </button>
        )}
      </div>
    </div>

    {/* PASSWORD */}
    <div className="border border-black/20 bg-transparent px-6 py-5">
      <h2 className="text-[20px] font-normal text-black mb-3">
        Password
      </h2>

      {editingPassword ? (
        <div className="space-y-3">
          <input
            type="password"
            placeholder="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="h-[48px] w-full border border-black/20 px-4 text-[14px] outline-none focus:border-black"
          />

          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="h-[48px] w-full border border-black/20 px-4 text-[14px] outline-none focus:border-black"
          />
        </div>
      ) : (
        <p className="text-[20px] tracking-[3px] font-semibold">
          ••••••••••••
        </p>
      )}

      <div className="border-t border-black/20 mt-4 pt-2">
        {editingPassword ? (
          <div className="flex gap-4">
            <button
              onClick={handleChangePassword}
              disabled={saving}
              className="text-[13px] text-black"
            >
              Save
            </button>

            <button
              onClick={() => {
                setEditingPassword(false);
                setCurrentPassword("");
                setNewPassword("");
              }}
              className="text-[13px] text-gray-500"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setEditingPassword(true)}
            className="text-[13px] text-black"
          >
            Edit
          </button>
        )}
      </div>
    </div>
  </div>
);
};