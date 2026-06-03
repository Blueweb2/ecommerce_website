"use client";

import { useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { useDashboardStore } from "@/store/admin/useDashboardStore";

export default function AdminDashboard() {
  const { stats, fetchStats, loading } = useDashboardStore();

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading || !stats) {
    return <div className="p-6">Loading dashboard...</div>;
  }

  return (
    <div className="p-6 space-y-8">

      {/* 🔹 HEADER */}
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>

      {/* 🔹 STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">

        <div className="p-5 bg-white rounded-2xl shadow">
          <p className="text-gray-500 text-sm">Total Orders</p>
          <h2 className="text-2xl font-bold">{stats.totalOrders}</h2>
        </div>

        <div className="p-5 bg-white rounded-2xl shadow">
          <p className="text-gray-500 text-sm">Total Revenue</p>
          <h2 className="text-2xl font-bold">₹{stats.totalRevenue}</h2>
        </div>

        <div className="p-5 bg-white rounded-2xl shadow">
          <p className="text-gray-500 text-sm">Total Users</p>
          <h2 className="text-2xl font-bold">{stats.totalUsers}</h2>
        </div>

      </div>

      {/* 🔹 REVENUE CHART */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="font-semibold mb-4">Revenue Trend</h2>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={stats.monthlyRevenue}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="revenue" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 🔹 ORDERS CHART */}
      <div className="bg-white p-6 rounded-2xl shadow">
        <h2 className="font-semibold mb-4">Orders per Month</h2>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stats.monthlyOrders}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="orders" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}