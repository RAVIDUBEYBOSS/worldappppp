"use client";
import { useState } from "react";
import TopBar from "./TopBar";
import NewsTicker from "./NewsTicker";
import AdBannerTop from "./AdBannerTop";
import AdWallSplit from "./AdWallSplit";
import Leaderboard from "./LeaderBoard";
import SupportSection from "./SupportSection";
import BottomNav from "./BottomNav";
import ClaimSection from "./ClaimSection";
import AppGrid from "./AppGrid";

export type View = "home" | "claim" | "adgrid" | "leaderboard" | "support";

export default function ToolsDashboard() {
  const [activeView, setActiveView] = useState<View>("home");

  return (
    <div className="min-h-screen bg-black text-white relative overflow-x-hidden font-sans">
<div className="sticky top-0 z-40 bg-black/95 backdrop-blur-md border-b border-gray-800 shadow-lg">
        <TopBar />
        <NewsTicker />
      </div>

      <div className="pb-28 pt-2"> {/* Bottom padding taaki Nav ke piche content na chhipe */}
        
        {activeView === "home" && (
          <div className="space-y-4 animate-fade-in">
            <AdBannerTop />
            <AdWallSplit />

            <div className="px-4 mt-6">
               <div className="flex items-center justify-between mb-4">
                  <h3 className="text-blue-400 font-bold text-sm tracking-wider uppercase">🚀 Popular Tools</h3>
                  <span className="text-[10px] text-gray-500">More coming soon</span>
               </div>
               
               <div className="grid grid-cols-2 gap-3">
                 <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800 hover:border-blue-500/50 transition cursor-pointer group">
                    <div className="text-3xl mb-2 group-hover:scale-110 transition">📷</div>
                    <h4 className="font-bold text-sm text-gray-200">QR Generator</h4>
                    <p className="text-[10px] text-gray-500">Create custom QRs</p>
                 </div>

                 <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800 hover:border-red-500/50 transition cursor-pointer group">
                    <div className="text-3xl mb-2 group-hover:scale-110 transition">❤️</div>
                    <h4 className="font-bold text-sm text-gray-200">Love Calc</h4>
                    <p className="text-[10px] text-gray-500">Check compatibility</p>
                 </div>

                 <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800 hover:border-green-500/50 transition cursor-pointer group">
                    <div className="text-3xl mb-2 group-hover:scale-110 transition">🔐</div>
                    <h4 className="font-bold text-sm text-gray-200">Pass Gen</h4>
                    <p className="text-[10px] text-gray-500">Strong passwords</p>
                 </div>

                 <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800 hover:border-yellow-500/50 transition cursor-pointer group">
                    <div className="text-3xl mb-2 group-hover:scale-110 transition">📍</div>
                    <h4 className="font-bold text-sm text-gray-200">IP Finder</h4>
                    <p className="text-[10px] text-gray-500">Locate details</p>
                 </div>
               </div>
            </div>
          </div>
        )}

{activeView === "claim" && (
<div className="animate-fade-in min-h-[70vh] flex flex-col">
<div className="p-6 text-center border-b border-gray-800 bg-gray-900/30">
<h1 className="text-2xl font-black text-yellow-500 tracking-tighter">REWARD CENTER</h1>
<p className="text-xs text-gray-400 mt-1">Verify Identity & Claim Tokens Daily</p>
</div>
             
             <ClaimSection />
          </div>
        )}

        {activeView === "adgrid" && (
           <div className="animate-fade-in pt-4">
              <div className="px-4 mb-4 text-center">
                <h2 className="text-lg font-bold text-white">Partner Wall</h2>
                <p className="text-xs text-gray-500">Support us by viewing ads</p>
              </div>
              <AppGrid />
           </div>
        )}

        {activeView === "leaderboard" && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-500 animate-fade-in">
<Leaderboard />
          </div>
        )}

        {activeView === "support" && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-500 animate-fade-in">
           <SupportSection />
          </div>
        )}

      </div>
      <BottomNav activeView={activeView} setView={setActiveView} />

    </div>
  );
}