"use client";

import { useEffect, useState, useCallback } from "react";
import { newsletterAPI } from "@/lib/api/newsletter.api";
import toast from "react-hot-toast";
import { 
  Users, 
  UserCheck, 
  UserPlus, 
  Mail, 
  Search, 
  Send,
  Loader2,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

type Stats = {
  total: number;
  active: number;
  newSubscribers: number;
};

type Subscriber = {
  _id: string;
  email: string;
  isActive: boolean;
  createdAt: string;
};

export default function AdminNewsletterPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Campaign State
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [campaignSubject, setCampaignSubject] = useState("");
  const [campaignContent, setCampaignContent] = useState("");
  const [sendingCampaign, setSendingCampaign] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [statsRes, listRes] = await Promise.all([
        newsletterAPI.getStats(),
        newsletterAPI.getSubscribers({ page, search, limit: 10 }),
      ]);

      setStats(statsRes.data.data);
      setSubscribers(listRes.data.data.subscribers);
      setTotalPages(listRes.data.data.pagination.pages);
    } catch (err) {
      toast.error("Failed to fetch newsletter data");
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const handleSendCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaignSubject || !campaignContent) {
      toast.error("Please fill in both subject and content");
      return;
    }

    try {
      setSendingCampaign(true);
      await newsletterAPI.sendOffer({
        subject: campaignSubject,
        content: campaignContent
      });
      toast.success("Campaign sent successfully!");
      setShowCampaignModal(false);
      setCampaignSubject("");
      setCampaignContent("");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to send campaign");
    } finally {
      setSendingCampaign(false);
    }
  };

  return (
    <div className="space-y-8 p-6 bg-[#f9fafb] min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Newsletter Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your subscribers and send marketing campaigns.</p>
        </div>
        <button
          onClick={() => setShowCampaignModal(true)}
          className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-lg font-medium transition shadow-sm"
        >
          <Send size={18} />
          New Campaign
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
              <Users size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Subscribers</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.total ?? 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-50 text-green-600 rounded-lg">
              <UserCheck size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Active Subscribers</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.active ?? 0}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
              <UserPlus size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">New (Last 7 Days)</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.newSubscribers ?? 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* SEARCH AND LIST */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by email..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-green-500 transition text-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-4">Subscriber</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Joined At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center">
                    <Loader2 className="animate-spin mx-auto text-green-600" size={32} />
                    <p className="text-sm text-gray-500 mt-2">Loading subscribers...</p>
                  </td>
                </tr>
              ) : subscribers.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center">
                    <Mail className="mx-auto text-gray-300" size={40} />
                    <p className="text-sm text-gray-500 mt-2">No subscribers found.</p>
                  </td>
                </tr>
              ) : (
                subscribers.map((sub) => (
                  <tr key={sub._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">{sub.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        sub.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                      }`}>
                        {sub.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(sub.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        {!loading && totalPages > 1 && (
          <div className="p-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-500">Page {page} of {totalPages}</p>
            <div className="flex gap-2">
              <button
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
                className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                disabled={page === totalPages}
                onClick={() => setPage(p => p + 1)}
                className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* CAMPAIGN MODAL */}
      {showCampaignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Send size={20} className="text-green-600" />
                Send Marketing Campaign
              </h2>
              <button 
                onClick={() => setShowCampaignModal(false)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <ChevronRight className="rotate-45" size={24} />
              </button>
            </div>

            <form onSubmit={handleSendCampaign} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Email Subject</label>
                <input
                  type="text"
                  placeholder="e.g., Exclusive Summer Sale - 50% Off!"
                  value={campaignSubject}
                  onChange={(e) => setCampaignSubject(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-green-500 transition"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">HTML Content</label>
                <textarea
                  rows={8}
                  placeholder="<h1>Hello Subscriber!</h1> <p>Checkout our new arrivals...</p>"
                  value={campaignContent}
                  onChange={(e) => setCampaignContent(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg outline-none focus:border-green-500 transition font-mono text-sm"
                  required
                />
                <p className="text-[11px] text-gray-400">You can use basic HTML tags for styling.</p>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCampaignModal(false)}
                  className="px-6 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sendingCampaign}
                  className="px-8 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition shadow-md flex items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {sendingCampaign ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      Send to all Active Subscribers
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
