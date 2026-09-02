'use client';

import { useRouter } from 'next/navigation';
import { ArrowRight, Search, Sparkles, ShieldCheck, Zap, LogIn, UserPlus } from 'lucide-react';

export default function Home() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-slate-950 font-sans text-slate-100 flex items-center justify-center">
      {/* Background Decorator Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none z-0">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-indigo-600/30 to-blue-500/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-cyan-500/10 blur-[100px] rounded-full"></div>
        
        {/* Modern Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
      </div>

      {/* Main Glassmorphic Card */}
      <div className="relative z-10 w-full max-w-2xl mx-4 p-8 sm:p-12 rounded-3xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl shadow-2xl shadow-indigo-950/50 text-center">
        
        {/* Top Tech Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-xs font-semibold text-indigo-300 mb-8 backdrop-blur-md">
          <Sparkles className="w-4 h-4 text-indigo-400 animate-pulse" />
          <span>Next-Gen Enterprise Knowledge Base</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
          Unlock Smart Data with{' '}
          <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400 bg-clip-text text-transparent">
            Enterprise AI Search
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-slate-400 text-base sm:text-lg mb-8 max-w-lg mx-auto font-normal">
          Instant context-aware search across all your organization’s documents, databases, and workflows.
        </p>

        {/* Login and Registration Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {/* Sign In Button */}
          <button 
            onClick={() => router.push('/login')}
            className="group relative inline-flex items-center justify-center w-full sm:w-auto px-8 py-3.5 text-sm font-semibold text-white transition-all duration-300 ease-in-out bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl hover:from-blue-500 hover:to-indigo-500 hover:shadow-lg hover:shadow-indigo-500/25 active:scale-95 cursor-pointer"
          >
            <LogIn className="w-4 h-4 mr-2" />
            <span>Sign In</span>
            <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-200 group-hover:translate-x-1" />
          </button>

          {/* Register Button */}
          <button 
            onClick={() => router.push('/register')}
            className="group relative inline-flex items-center justify-center w-full sm:w-auto px-8 py-3.5 text-sm font-semibold text-slate-200 transition-all duration-300 ease-in-out bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 rounded-xl hover:text-white hover:border-slate-600 active:scale-95 cursor-pointer"
          >
            <UserPlus className="w-4 h-4 mr-2 text-slate-400 group-hover:text-slate-200" />
            <span>Create Account</span>
          </button>
        </div>

        {/* Bottom Feature Badges */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 grid grid-cols-3 gap-4 text-slate-400 text-xs font-medium">
          <div className="flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            <span>SOC2 Compliant</span>
          </div>
          <div className="flex items-center justify-center gap-1.5">
            <Search className="w-4 h-4 text-blue-400" />
            <span>Semantic Vector Search</span>
          </div>
          <div className="flex items-center justify-center gap-1.5">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span>Sub-second Latency</span>
          </div>
        </div>

      </div>
    </div>
  );
}