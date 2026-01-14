"use client";
import { useState } from "react";

export default function BookAdForm() {
  const [adType, setAdType] = useState<"hero" | "grid">("hero");

  return (
    <div className="flex flex-col w-full bg-black min-h-[60vh] pb-20 relative">
      
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6 border-b border-gray-800 pb-4">
        <div>
          <h2 className="text-lg font-black text-white tracking-wide">CREATE AD</h2>
          <p className="text-[10px] text-gray-500 font-mono">BOOST YOUR PROJECT 🚀</p>
        </div>
        <div className="px-3 py-1 bg-yellow-500/10 border border-yellow-500/30 rounded text-[9px] text-yellow-500 font-bold">
          PRO
        </div>
      </div>

      {/* 1. AD TYPE SELECTOR (Segmented Control) */}
      <div className="bg-gray-900/80 p-1 rounded-xl flex gap-1 mb-6 border border-gray-800">
        <button 
          onClick={() => setAdType("hero")}
          className={`flex-1 py-3 rounded-lg text-xs font-black tracking-wider transition-all ${
            adType === "hero" 
              ? "bg-blue-600 text-white shadow-lg" 
              : "text-gray-500 hover:text-gray-300"
          }`}
        >
          HERO BANNER
        </button>
        <button 
          onClick={() => setAdType("grid")}
          className={`flex-1 py-3 rounded-lg text-xs font-black tracking-wider transition-all ${
            adType === "grid" 
              ? "bg-blue-600 text-white shadow-lg" 
              : "text-gray-500 hover:text-gray-300"
          }`}
        >
          GRID SLOT
        </button>
      </div>

      {/* 2. INPUT FIELDS */}
      <div className="space-y-5">
        
        {/* Title Input */}
        <div className="relative group">
          <label className="absolute -top-2 left-3 bg-black px-1 text-[9px] font-bold text-blue-500 uppercase tracking-widest group-focus-within:text-blue-400">
            Ad Title
          </label>
          <input 
            type="text" 
            placeholder="e.g. MOON TOKEN 🚀" 
            className="w-full bg-transparent border-2 border-gray-800 rounded-xl p-4 text-white text-sm font-bold placeholder-gray-700 focus:border-blue-500 outline-none transition-colors"
          />
        </div>

        {/* Link Input */}
        <div className="relative group">
          <label className="absolute -top-2 left-3 bg-black px-1 text-[9px] font-bold text-gray-500 uppercase tracking-widest group-focus-within:text-blue-500">
            Target Link
          </label>
          <input 
            type="url" 
            placeholder="https://your-site.com" 
            className="w-full bg-transparent border-2 border-gray-800 rounded-xl p-4 text-white text-sm font-bold placeholder-gray-700 focus:border-blue-500 outline-none transition-colors"
          />
        </div>

        {/* Amount Display (Dynamic) */}
        <div className="flex justify-between items-center px-2 pt-2">
          <span className="text-xs text-gray-500 font-bold">ESTIMATED COST</span>
          <span className="text-xl font-black text-white">
            {adType === "hero" ? "500" : "150"} <span className="text-blue-500 text-sm">COINS</span>
          </span>
        </div>

      </div>

      {/* 3. STICKY ACTION BUTTON (Bottom Fixed) */}
      <div className="mt-8">
        <button className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-black tracking-widest shadow-[0_0_20px_rgba(37,99,235,0.4)] active:scale-95 transition-transform flex items-center justify-center gap-2">
          <span>PAY & PUBLISH</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
        </button>
        <p className="text-center text-[9px] text-gray-600 mt-3 font-mono">
          SECURE PAYMENT VIA SMART CONTRACT
        </p>
      </div>

    </div>
  );
}