'use client';

import React, { useEffect, useState } from 'react';
import api from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  Folder, 
  FileText, 
  Trash2
} from 'lucide-react';
import SidebarLayout from '@/components/Sidebar';

interface UserItem {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

interface AdminStats {
  totalUsers: number;
  totalWorkspaces: number;
  totalDocuments: number;
}

export default function AdminPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [stats, setStats] = useState<AdminStats>({ totalUsers: 0, totalWorkspaces: 0, totalDocuments: 0 });
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.role !== 'Admin') {
      router.push('/dashboard');
      return;
    }
    fetchAdminData();
  }, [user]);

  const fetchAdminData = async () => {
    try {
      const [statsRes, usersRes] = await Promise.all([
        api.get('/Admin/dashboard'),
        api.get('/Admin/users'),
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      console.error('Failed to fetch admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await api.put(`/Admin/users/${userId}/role`, { role: newRole });
      fetchAdminData();
    } catch (err) {
      alert('Failed to update role');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.delete(`/Admin/users/${userId}`);
      fetchAdminData();
    } catch (err) {
      alert('Failed to delete user');
    }
  };

  return (
    <SidebarLayout>
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-xs text-slate-400 mt-1">
            Platform metrics, registered users, and system resource management.
          </p>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-medium">Total Users</p>
              <p className="text-3xl font-bold mt-2 text-white">{stats.totalUsers}</p>
            </div>
            <Users className="h-8 w-8 text-blue-500/40" />
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-medium">Total Workspaces</p>
              <p className="text-3xl font-bold mt-2 text-white">{stats.totalWorkspaces}</p>
            </div>
            <Folder className="h-8 w-8 text-purple-500/40" />
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-medium">Total Documents</p>
              <p className="text-3xl font-bold mt-2 text-white">{stats.totalDocuments}</p>
            </div>
            <FileText className="h-8 w-8 text-emerald-500/40" />
          </div>
        </div>

        {/* Registered Users Table */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-5 border-b border-slate-800">
            <h2 className="text-sm font-bold text-slate-200">Registered Users Management</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950 text-[11px] uppercase text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-6 py-3.5">User</th>
                  <th className="px-6 py-3.5">Email</th>
                  <th className="px-6 py-3.5">Role</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-800/30 transition">
                    <td className="px-6 py-4 font-medium text-white">{u.name}</td>
                    <td className="px-6 py-4 text-slate-400">{u.email}</td>
                    <td className="px-6 py-4">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                      >
                        <option value="User">User</option>
                        <option value="Admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDeleteUser(u.id)}
                        className="p-1.5 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition"
                        title="Delete User"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}