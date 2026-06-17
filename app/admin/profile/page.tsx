"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth/useAuthStore";
import { authApi } from "@/lib/api/auth.api";
import toast from "react-hot-toast";
import {
  BadgeCheck,
  Mail,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  UserRound,
  Lock,
  Phone,
  ArrowRight,
  Loader2,
  CheckCircle2,
} from "lucide-react";

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function formatRole(role?: string) {
  if (!role) return "Admin";
  return role.charAt(0).toUpperCase() + role.slice(1);
}

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Profile Form
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  // Password Form
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Email Update Flow
  const [newEmail, setNewEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [emailStep, setEmailStep] = useState(1); // 1: request, 2: verify

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const res = await authApi.getMe();
      const userData = res.data?.user;
      if (userData) {
        updateUser(userData);
        setName(userData.name);
        setPhone(userData.phone || "");
      }
    } catch {
      toast.error("Failed to refresh profile");
    } finally {
      setLoading(false);
    }
  }, [updateUser]);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setPhone((user as any).phone || "");
      setLoading(false);
    } else {
      fetchProfile();
    }
  }, [user, fetchProfile]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const res = await authApi.updateProfile({ name, phone });
      updateUser(res.data.user);
      toast.success("Profile updated successfully");
      setEditMode(false);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update profile");
    } finally {
      setUpdating(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return toast.error("Passwords do not match");
    }
    setUpdating(true);
    try {
      await authApi.changePassword({ oldPassword, newPassword });
      toast.success("Password changed successfully");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to change password");
    } finally {
      setUpdating(false);
    }
  };

  const handleRequestEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    try {
      await authApi.requestEmailChange(newEmail);
      toast.success("OTP sent to your new email");
      setEmailStep(2);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to send OTP");
    } finally {
      setUpdating(false);
    }
  };

  const handleVerifyEmailChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const res = await authApi.verifyEmailChange({ newEmail, otp });
      updateUser(res.data.user);
      toast.success("Email updated successfully");
      setNewEmail("");
      setOtp("");
      setEmailStep(1);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Verification failed");
    } finally {
      setUpdating(false);
    }
  };

  if (loading && !user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="space-y-8 pb-12">
      {/* Premium Header */}
      <section className="relative overflow-hidden rounded-[32px] bg-[#12251a] text-white shadow-2xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 h-64 w-64 rounded-full bg-green-500/10 blur-3xl" />
        
        <div className="relative flex flex-col gap-8 p-8 md:p-12">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="relative group">
              <div className="h-24 w-24 flex items-center justify-center rounded-3xl bg-white text-3xl font-bold text-emerald-800 shadow-xl ring-4 ring-white/10 transition-transform group-hover:scale-105">
                {getInitials(user.name)}
              </div>
              <div className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-emerald-500 flex items-center justify-center border-4 border-[#12251a]">
                <CheckCircle2 className="h-4 w-4 text-white" />
              </div>
            </div>
            
            <div className="flex-1 space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-emerald-300 ring-1 ring-white/20">
                <ShieldCheck className="h-3 w-3" />
                {formatRole(user.role)} Verified
              </div>
              <h1 className="text-4xl font-bold tracking-tight">{user.name}</h1>
              <p className="text-emerald-50/60 font-medium flex items-center gap-2">
                <Mail className="h-4 w-4" />
                {user.email}
              </p>
            </div>

            <button
              onClick={fetchProfile}
              className="self-start md:self-center inline-flex items-center gap-2 rounded-2xl bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20 active:scale-95"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Profile Details & Edit */}
        <div className="lg:col-span-2 space-y-8">
          <article className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm transition-all hover:shadow-md">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Personal Information</h2>
                <p className="text-slate-500 mt-1">Manage your public profile details.</p>
              </div>
              <button
                onClick={() => setEditMode(!editMode)}
                className={`px-6 py-2.5 rounded-2xl font-bold transition-all ${
                  editMode 
                    ? "bg-slate-100 text-slate-600 hover:bg-slate-200" 
                    : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-200"
                }`}
              >
                {editMode ? "Cancel" : "Edit Profile"}
              </button>
            </div>

            {!editMode ? (
              <div className="grid gap-6 md:grid-cols-2">
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-white flex items-center justify-center text-slate-600 shadow-sm">
                    <UserRound className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Full Name</p>
                    <p className="text-lg font-bold text-slate-800">{user.name}</p>
                  </div>
                </div>
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-white flex items-center justify-center text-slate-600 shadow-sm">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Phone Number</p>
                    <p className="text-lg font-bold text-slate-800">{(user as any).phone || "Not set"}</p>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleUpdateProfile} className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-2xl border-slate-200 bg-slate-50 p-4 font-medium transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 outline-none"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 ml-1">Phone Number</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded-2xl border-slate-200 bg-slate-50 p-4 font-medium transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 outline-none"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={updating}
                  className="w-full md:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-8 py-4 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:opacity-50"
                >
                  {updating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                  Save Changes
                </button>
              </form>
            )}
          </article>

          {/* Email Settings */}
          <article className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm transition-all hover:shadow-md">
            <h2 className="text-2xl font-bold text-slate-900 mb-2 flex items-center gap-3">
              <Mail className="h-6 w-6 text-emerald-600" />
              Email Settings
            </h2>
            <p className="text-slate-500 mb-8">Change your primary login email address.</p>

            <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-100 mb-8 flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center text-emerald-600">
                <BadgeCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Current Email</p>
                <p className="text-emerald-950 font-bold">{user.email}</p>
              </div>
            </div>

            {emailStep === 1 ? (
              <form onSubmit={handleRequestEmailChange} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">New Email Address</label>
                  <div className="flex gap-3 flex-col md:flex-row">
                    <input
                      type="email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      className="flex-1 rounded-2xl border-slate-200 bg-slate-50 p-4 font-medium transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 outline-none"
                      placeholder="Enter new email..."
                      required
                    />
                    <button
                      type="submit"
                      disabled={updating || !newEmail}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-8 py-4 text-sm font-bold text-white transition hover:bg-black disabled:opacity-50"
                    >
                      {updating ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                      Send OTP
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <form onSubmit={handleVerifyEmailChange} className="space-y-6 animate-in zoom-in-95 duration-300">
                <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 text-blue-800 text-sm font-medium">
                  We&apos;ve sent an OTP to <span className="font-bold underline">{newEmail}</span>. Please enter it below.
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700 ml-1">Verification Code (OTP)</label>
                  <div className="flex gap-3 flex-col md:flex-row">
                    <input
                      type="text"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="flex-1 rounded-2xl border-slate-200 bg-slate-50 p-4 font-bold text-center text-2xl tracking-[0.5em] transition focus:border-emerald-500 focus:bg-white outline-none"
                      placeholder="000000"
                      required
                    />
                    <button
                      type="submit"
                      disabled={updating || otp.length < 6}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-8 py-4 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:opacity-50"
                    >
                      {updating ? <Loader2 className="h-4 w-4 animate-spin" /> : <BadgeCheck className="h-4 w-4" />}
                      Verify & Change
                    </button>
                  </div>
                </div>
                <button 
                  type="button" 
                  onClick={() => setEmailStep(1)}
                  className="text-sm font-bold text-slate-500 hover:text-slate-800 transition"
                >
                  Cancel Change
                </button>
              </form>
            )}
          </article>
        </div>

        {/* Security / Password */}
        <div className="space-y-8">
          <article className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm transition-all hover:shadow-md sticky top-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-2 flex items-center gap-3">
              <Lock className="h-6 w-6 text-rose-500" />
              Security
            </h2>
            <p className="text-slate-500 mb-8">Update your password to keep your account secure.</p>

            <form onSubmit={handleChangePassword} className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Current Password</label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full rounded-2xl border-slate-200 bg-slate-50 p-4 transition focus:border-rose-500 focus:bg-white outline-none"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full rounded-2xl border-slate-200 bg-slate-50 p-4 transition focus:border-emerald-500 focus:bg-white outline-none"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase ml-1">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-2xl border-slate-200 bg-slate-50 p-4 transition focus:border-emerald-500 focus:bg-white outline-none"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={updating || !newPassword || newPassword !== confirmPassword}
                className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 py-4 text-sm font-bold text-white transition hover:bg-black disabled:opacity-50 shadow-lg"
              >
                {updating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Update Password"}
              </button>
            </form>
          </article>

          {/* Quick Stats/Snapshot */}
          <article className="rounded-[32px] bg-gradient-to-br from-emerald-600 to-green-700 p-8 text-white shadow-xl overflow-hidden relative group">
            <Sparkles className="absolute top-4 right-4 h-12 w-12 text-white/10 transition-transform group-hover:scale-125" />
            <h3 className="text-xl font-bold mb-4">Account Snapshot</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-white/10">
                <span className="text-emerald-100/80 text-sm font-medium">Role</span>
                <span className="font-bold">{formatRole(user.role)}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-white/10">
                <span className="text-emerald-100/80 text-sm font-medium">Status</span>
                <span className="font-bold bg-emerald-400/20 px-2 py-0.5 rounded text-xs">Active</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-white/10">
                <span className="text-emerald-100/80 text-sm font-medium">Verified</span>
                <CheckCircle2 className="h-4 w-4 text-emerald-300" />
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}
