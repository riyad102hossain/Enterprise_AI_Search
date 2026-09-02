'use client';

import React, { useEffect, useState } from 'react';
import api from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Plus, Folder, LogOut, Shield } from 'lucide-react';

interface Workspace {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

export default function DashboardPage() {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [creating, setCreating] = useState(false);

  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  const fetchWorkspaces = async () => {
    try {
      const response = await api.get('/Workspaces');
      setWorkspaces(response.data);
    } catch (err) {
      console.error('Failed to load workspaces:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWorkspace = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setCreating(true);
    try {
      await api.post('/Workspaces', { name, description });
      setName('');
      setDescription('');
      setShowModal(false);
      fetchWorkspaces();
    } catch (err) {
      console.error('Failed to create workspace:', err);
      alert('Failed to create workspace');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Top Navbar */}
      <nav className="flex items-center justify-between border-b border-gray-800 bg-gray-950 px-6 py-4">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 font-bold text-white">
            AI
          </div>
          <span className="text-xl font-bold tracking-wide">Enterprise RAG</span>
        </div>

        <div className="flex items-center space-x-4">
          {user?.role === 'Admin' && (
            <button
              onClick={() => router.push('/admin')}
              className="flex items-center space-x-1 rounded-md bg-purple-600/20 px-3 py-1.5 text-sm text-purple-400 hover:bg-purple-600/30 border border-purple-500/30"
            >
              <Shield className="h-4 w-4" />
              <span>Admin Panel</span>
            </button>
          )}

          <div className="text-right">
            <p className="text-sm font-medium">{user?.name}</p>
            <p className="text-xs text-gray-400">{user?.email}</p>
          </div>

          <button
            onClick={logout}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-800 hover:text-red-400 transition"
            title="Logout"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </nav>

      {/* Main Container */}
      <main className="mx-auto max-w-7xl p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Your Workspaces</h1>
            <p className="mt-1 text-sm text-gray-400">Select a workspace to manage documents and ask AI questions.</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center space-x-2 rounded-lg bg-blue-600 px-4 py-2 font-medium hover:bg-blue-500 transition"
          >
            <Plus className="h-5 w-5" />
            <span>New Workspace</span>
          </button>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-36 animate-pulse rounded-xl bg-gray-800/50 border border-gray-800"></div>
            ))}
          </div>
        ) : workspaces.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-800 py-16 text-center">
            <Folder className="h-12 w-12 text-gray-600 mb-3" />
            <h3 className="text-lg font-medium text-gray-300">No workspaces found</h3>
            <p className="mt-1 text-sm text-gray-500">Create your first workspace to start uploading documents.</p>
          </div>
        ) : (
          /* Workspaces Grid */
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {workspaces.map((ws) => (
              <div
                key={ws.id}
                onClick={() => router.push(`/dashboard/workspace/${ws.id}`)}
                className="group cursor-pointer rounded-xl border border-gray-800 bg-gray-950 p-6 transition hover:border-blue-500/50 hover:bg-gray-900/80 shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600/10 text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition">
                    <Folder className="h-5 w-5" />
                  </div>
                  <span className="text-xs text-gray-500">{new Date(ws.createdAt).toLocaleDateString()}</span>
                </div>
                <h2 className="mt-4 text-lg font-semibold text-gray-100 group-hover:text-blue-400 transition">{ws.name}</h2>
                <p className="mt-1 text-sm text-gray-400 line-clamp-2">{ws.description || 'No description provided.'}</p>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md rounded-xl border border-gray-800 bg-gray-950 p-6 shadow-2xl">
            <h2 className="text-xl font-bold">Create New Workspace</h2>
            <form onSubmit={handleCreateWorkspace} className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300">Workspace Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-800 bg-gray-900 p-2.5 text-gray-100 focus:border-blue-500 focus:outline-none"
                  placeholder="e.g. HR Documents or Financial Reports"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-gray-800 bg-gray-900 p-2.5 text-gray-100 focus:border-blue-500 focus:outline-none"
                  rows={3}
                  placeholder="Optional description..."
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-lg bg-gray-800 px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-500 disabled:opacity-50"
                >
                  {creating ? 'Creating...' : 'Create Workspace'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}