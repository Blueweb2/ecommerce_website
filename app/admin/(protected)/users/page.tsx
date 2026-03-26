"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api/axios";
import toast from "react-hot-toast";
import { log } from "console";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/auth/customers");
        setUsers(res.data.data);
        console.log(res.data.data,"res.data.data in users");
        
      } catch {
        toast.error("Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 bg-white rounded-2xl shadow">
      <h2 className="text-xl font-semibold mb-4">Customers</h2>

      <table className="w-full text-left">
        <thead>
          <tr className="border-b">
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u: any) => (
            <tr key={u._id} className="border-b">
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.isActive ? "Active" : "Blocked"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}