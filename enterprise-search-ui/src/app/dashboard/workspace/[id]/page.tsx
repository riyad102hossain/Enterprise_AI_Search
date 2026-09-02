'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import api from '@/services/api';
import { ArrowLeft, Upload, Send, FileText, Bot, User, CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface Document {
  id: string;
  name: string;
  fileSize: number;
  status: string;
  createdAt: string;
}

interface ChatMessage {
  id: string;
  role: string;
  content: string;
  createdAt: string;
}

export default function WorkspaceDetailPage() {
  const params = useParams();
  const workspaceId = params.id as string;
  const router = useRouter();

  const [documents, setDocuments] = useState<Document[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [question, setQuery] = useState('');
  const [uploading, setUploading] = useState(false);
  const [asking, setAsking] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (workspaceId) {
      fetchDocuments();
      fetchHistory();
    }
  }, [workspaceId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchDocuments = async () => {
    try {
      const res = await api.get(`/Documents/workspace/${workspaceId}`);
      setDocuments(res.data);
    } catch (err) {
      console.error('Failed to load documents:', err);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await api.get(`/Chat/history/${workspaceId}`);
      setMessages(res.data);
    } catch (err) {
      console.error('Failed to load chat history:', err);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    
    // UploadDocumentDto mapping
    formData.append('File', file);
    formData.append('file', file); // Fallback for case sensitivity
    formData.append('workspaceId', workspaceId); // DTO requires WorkspaceId in form-data

    try {
      const res = await api.post('/Documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const newDoc = res.data;
      setDocuments((prev) => [newDoc, ...prev]);

      // Automatically trigger processing
      await processDocument(newDoc.id);
    } catch (err: any) {
      console.error('Upload failed:', err);
      const errorMsg = err.response?.data?.message || 'Failed to upload document';
      alert(`Upload Failed: ${errorMsg}`);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const processDocument = async (docId: string) => {
    setProcessingId(docId);
    try {
      await api.post(`/DocumentProcessor/process/${docId}`);
      fetchDocuments();
    } catch (err) {
      console.error('Document processing failed:', err);
    } finally {
      setProcessingId(null);
    }
  };

  const handleSendQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || asking) return;

    const userText = question;
    setQuery('');
    setAsking(true);

    // Optimistic UI Update
    const tempUserMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: userText,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);

    try {
      const res = await api.post('/Chat/query', {
        workspaceId,
        question: userText,
      });

      const tempAiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: res.data.answer,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, tempAiMsg]);
    } catch (err) {
      console.error('Chat request failed:', err);
      alert('Failed to get answer from AI');
    } finally {
      setAsking(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-950 text-gray-100">
      {/* Sidebar: Documents & Actions */}
      <aside className="w-80 border-r border-gray-800 bg-gray-900 flex flex-col justify-between">
        <div className="p-4 border-b border-gray-800 flex items-center space-x-3">
          <button
            onClick={() => router.push('/dashboard')}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-800 hover:text-white transition"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h2 className="text-lg font-bold truncate">Workspace Documents</h2>
        </div>

        {/* Upload Button */}
        <div className="p-4 border-b border-gray-800">
          <label className="flex w-full cursor-pointer items-center justify-center space-x-2 rounded-xl bg-blue-600 px-4 py-3 font-medium hover:bg-blue-500 transition">
            <Upload className="h-5 w-5" />
            <span>{uploading ? 'Uploading...' : 'Upload Document'}</span>
            <input
              type="file"
              accept=".pdf,.txt"
              onChange={handleFileUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>
        </div>

        {/* Document List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {documents.length === 0 ? (
            <p className="text-center text-sm text-gray-500 mt-10">No documents uploaded yet.</p>
          ) : (
            documents.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between rounded-lg border border-gray-800 bg-gray-950 p-3"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <FileText className="h-5 w-5 flex-shrink-0 text-blue-400" />
                  <div className="truncate">
                    <p className="text-sm font-medium truncate">{doc.name}</p>
                    <p className="text-xs text-gray-500">{(doc.fileSize / 1024).toFixed(1)} KB</p>
                  </div>
                </div>

                {/* Status Badge */}
                <div>
                 {doc.status === 'Indexed' ? (
                    <span title="Indexed">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                       </span>
                      ) : processingId === doc.id ? (
                       <span title="Processing...">
                      <Clock className="h-4 w-4 animate-spin text-yellow-400" />
                       </span>
                       ) : (
                    <button
                      onClick={() => processDocument(doc.id)}
                      className="text-xs bg-gray-800 px-2 py-1 rounded hover:bg-gray-700 text-gray-300"
                    >
                      Index
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </aside>

      {/* Main Area: RAG Chat System */}
      <main className="flex-1 flex flex-col justify-between bg-gray-950">
        {/* Chat History Container */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center text-gray-500">
              <Bot className="h-16 w-16 mb-4 text-blue-500/50" />
              <h3 className="text-xl font-semibold text-gray-300">Enterprise AI Knowledge Assistant</h3>
              <p className="mt-2 text-sm max-w-md">
                Upload your business documents or ask any questions related to the workspace indexed files.
              </p>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex space-x-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
                    <Bot className="h-5 w-5" />
                  </div>
                )}

                <div
                  className={`max-w-2xl rounded-2xl px-5 py-3.5 shadow-md ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-gray-900 text-gray-200 border border-gray-800 rounded-bl-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap leading-relaxed text-sm">{msg.content}</p>
                </div>

                {msg.role === 'user' && (
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gray-800 text-gray-300 border border-gray-700">
                    <User className="h-5 w-5" />
                  </div>
                )}
              </div>
            ))
          )}
          {asking && (
            <div className="flex items-center space-x-3 text-gray-400 text-sm">
              <Bot className="h-5 w-5 animate-pulse text-blue-400" />
              <span>Analyzing context & searching answers...</span>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Form Box */}
        <div className="border-t border-gray-800 p-4 bg-gray-900">
          <form onSubmit={handleSendQuestion} className="mx-auto max-w-4xl flex space-x-3">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask anything about the documents in this workspace..."
              className="flex-1 rounded-xl border border-gray-800 bg-gray-950 px-4 py-3 text-gray-100 focus:border-blue-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={asking || !question.trim()}
              className="flex items-center space-x-2 rounded-xl bg-blue-600 px-6 py-3 font-medium hover:bg-blue-500 disabled:opacity-50 transition"
            >
              <Send className="h-5 w-5" />
              <span>Send</span>
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}