'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/services/api';
import SidebarLayout from '@/components/Sidebar';
import { Plus, Folder } from 'lucide-react';

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
    <SidebarLayout>
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        {/* Main Header Container */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Your Workspaces</h1>
            <p className="mt-1 text-xs text-slate-400">
              Select a workspace to manage documents and ask AI questions.
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center space-x-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-medium text-white hover:bg-indigo-500 transition shadow-lg shadow-indigo-600/20"
          >
            <Plus className="h-4 w-4" />
            <span>New Workspace</span>
          </button>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-36 animate-pulse rounded-2xl bg-slate-900/50 border border-slate-800"></div>
            ))}
          </div>
        ) : workspaces.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 py-16 text-center">
            <Folder className="h-12 w-12 text-slate-600 mb-3" />
            <h3 className="text-sm font-semibold text-slate-300">No workspaces found</h3>
            <p className="mt-1 text-xs text-slate-500">Create your first workspace to start uploading documents.</p>
          </div>
        ) : (
          /* Workspaces Grid */
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {workspaces.map((ws) => (
              <div
                key={ws.id}
                onClick={() => router.push(`/dashboard/workspace/${ws.id}`)}
                className="group cursor-pointer rounded-2xl border border-slate-800/80 bg-slate-900/60 p-5 transition hover:border-indigo-500/50 hover:bg-slate-900 shadow-xl"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 group-hover:bg-indigo-600 group-hover:text-white transition">
                    <Folder className="h-5 w-5" />
                  </div>
                  <span className="text-[11px] text-slate-500">{new Date(ws.createdAt).toLocaleDateString()}</span>
                </div>
                <h2 className="mt-4 text-sm font-bold text-slate-200 group-hover:text-white transition">{ws.name}</h2>
                <p className="mt-1 text-xs text-slate-400 line-clamp-2">{ws.description || 'No description provided.'}</p>
              </div>
            ))}
          </div>
        )}

        {/* Create Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-4">
              <h2 className="text-base font-bold text-white">Create New Workspace</h2>
              <form onSubmit={handleCreateWorkspace} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Workspace Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
                    placeholder="e.g. HR Documents or Financial Reports"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 p-2.5 text-xs text-white focus:border-indigo-500 focus:outline-none"
                    rows={3}
                    placeholder="Optional description..."
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="rounded-xl px-4 py-2 text-xs text-slate-400 hover:text-white transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creating}
                    className="rounded-xl bg-indigo-600 px-4 py-2 text-xs text-white font-medium hover:bg-indigo-500 disabled:opacity-50 transition shadow-lg shadow-indigo-600/20"
                  >
                    {creating ? 'Creating...' : 'Create Workspace'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </SidebarLayout>
  );
}