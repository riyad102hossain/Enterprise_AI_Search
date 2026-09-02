'use client';

import React, { useEffect, useState } from 'react';
import api from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { 
  Shield, 
  Users, 
  Folder, 
  FileText, 
  Trash2, 
  LayoutDashboard, 
  LogOut, 
  Bot,
  Database
} from 'lucide-react';

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
  const { user, logout } = useAuth();
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

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Left Sidebar for Admin */}
      <aside className="w-64 border-r border-slate-800/80 bg-slate-900/50 flex flex-col justify-between backdrop-blur-xl shrink-0">
        <div>
          {/* Header */}
          <div className="p-6 border-b border-slate-800/80 flex items-center space-x-3">
            <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-500/30">
              <Bot className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-base font-bold text-white tracking-tight">Enterprise Search</h1>
              <p className="text-[10px] text-slate-400 font-medium">Admin Control Center</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            <div className="flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium bg-indigo-600 text-white shadow-md shadow-indigo-600/20">
              <Shield className="h-4 w-4" />
              <span>Admin Console</span>
            </div>
            <button 
              onClick={() => router.push('/dashboard')}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:bg-slate-800/60 hover:text-slate-200 transition"
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>User Dashboard</span>
            </button>
          </nav>
        </div>

        {/* User Profile & Logout (Bottom Left) */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-900/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 min-w-0">
              <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <div className="truncate">
                <p className="text-xs font-semibold text-white truncate">{user?.name || 'Admin'}</p>
                <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-8 bg-slate-950">
        <div className="max-w-7xl mx-auto space-y-8">
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
      </main>
    </div>
  );
}