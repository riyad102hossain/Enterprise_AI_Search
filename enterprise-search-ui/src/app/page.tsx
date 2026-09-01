"use client";
import { useState } from "react";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [sources, setSources] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      alert("Please select a PDF file first!");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:5000/api/documents/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        alert("File uploaded & vectorized successfully!");
      } else {
        const err = await res.text();
        alert(`Upload failed: ${err}`);
      }
    } catch (error) {
      console.error(error);
      alert("Error connecting to backend API!");
    } finally {
      setUploading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setResponse("");
    try {
      const res = await fetch("http://localhost:5000/api/documents/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });

      if (res.ok) {
        const data = await res.json();
        setResponse(data.answer);
        setSources(data.sources || []);
      } else {
        alert("Failed to fetch response from server.");
      }
    } catch (error) {
      console.error(error);
      alert("Error executing search!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-8 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-center">Enterprise AI Knowledge Search</h1>

      {/* Upload Form */}
      <form onSubmit={handleUpload} className="border p-4 rounded bg-gray-50 flex gap-2 items-center">
        <input 
          type="file" 
          accept=".pdf" 
          onChange={(e) => setFile(e.target.files?.[0] || null)} 
          className="flex-1"
        />
        <button 
          type="submit" 
          disabled={uploading} 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:bg-gray-400"
        >
          {uploading ? "Uploading..." : "Upload PDF"}
        </button>
      </form>

      {/* Search Form */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <input 
          type="text" 
          value={query} 
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask a question about your documents..."
          className="border p-2 flex-1 rounded"
        />
        <button 
          type="submit" 
          disabled={loading} 
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded disabled:bg-gray-400"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      {/* Output Display */}
      {response && (
        <div className="p-4 border rounded bg-white shadow space-y-2">
          <h2 className="font-semibold text-lg text-gray-800">AI Answer:</h2>
          <p className="text-gray-700 leading-relaxed">{response}</p>
          {sources.length > 0 && (
            <div className="mt-4 pt-2 border-t text-sm text-gray-500">
              <strong>Sources:</strong> {sources.join(", ")}
            </div>
          )}
        </div>
      )}
    </main>
  );
}