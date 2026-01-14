"use client";
import { useState } from "react";

export default function SupportSection() {
  const [msg, setMsg] = useState("");

  const handleSend = () => {
    if (!msg) return;
    alert("Message Sent to Support Team!");
    setMsg("");
  };

  const handleReport = () => {
    const confirm = window.confirm("Are you sure you want to report an issue or spam?");
    if (confirm) alert("Report submitted successfully. We will investigate.");
  };

  const showLegal = (type: string) => {
    // Ye bas reviewer ko dikhane ke liye dummy content hai
    alert(`Showing ${type}...\n(Place your full legal text here via a Modal or Link)`);
  };

  return (
    <div className="p-4 flex flex-col gap-6 pb-32">
      
      {/* 🔴 1. HEADER & REPORT SPAM BUTTON */}
      <div className="flex justify-between items-center px-1">
        <div>
          <h2 className="text-lg font-black text-white tracking-tighter">SUPPORT</h2>
          <p className="text-[10px] text-gray-500 font-mono">WE ARE HERE TO HELP</p>
        </div>
        
        {/* REPORT SPAM BUTTON */}
        <button 
          onClick={handleReport}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 border border-red-500/30 rounded-full hover:bg-red-500/20 active:scale-95 transition-all"
        >
          <svg className="w-3 h-3 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          <span className="text-[9px] font-bold text-red-500 tracking-wide">REPORT SPAM</span>
        </button>
      </div>

      {/* 2. SOCIAL CONNECT */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-5">
        <h3 className="text-xs font-bold text-gray-400 mb-4 uppercase tracking-widest">Connect With Us</h3>
        <div className="grid grid-cols-3 gap-3">
          <a href="https://t.me/YourChannel" target="_blank" className="flex flex-col items-center gap-2 p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl hover:bg-blue-500/20 transition-colors">
            <span className="text-2xl">✈️</span>
            <span className="text-[9px] font-bold text-blue-400">TELEGRAM</span>
          </a>
          <a href="https://wa.me/YourNumber" target="_blank" className="flex flex-col items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-xl hover:bg-green-500/20 transition-colors">
            <span className="text-2xl">💬</span>
            <span className="text-[9px] font-bold text-green-400">WHATSAPP</span>
          </a>
          <a href="#" className="flex flex-col items-center gap-2 p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl hover:bg-purple-500/20 transition-colors">
            <span className="text-2xl">🌐</span>
            <span className="text-[9px] font-bold text-purple-400">SOCIAL</span>
          </a>
        </div>
      </div>

      {/* 3. CONTACT FORM */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-5">
        <h3 className="text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">Send Feedback</h3>
        <textarea 
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          placeholder="Describe your issue..."
          className="w-full h-24 bg-black border border-gray-700 rounded-xl p-3 text-sm text-white focus:border-blue-500 outline-none resize-none mb-3"
        />
        <button 
          onClick={handleSend}
          className="w-full py-3 bg-white text-black text-xs font-black rounded-xl hover:scale-[1.02] active:scale-95 transition-transform"
        >
          SEND MESSAGE
        </button>
      </div>

      {/* 📜 4. LEGAL SECTION (Properly Structured) */}
      <div className="mt-6 border-t border-gray-900 pt-6 text-center">
        <h4 className="text-[10px] font-bold text-gray-500 uppercase mb-3 tracking-widest">Legal Information</h4>
        
        {/* Buttons instead of empty links for interaction */}
        <div className="flex flex-col gap-2 items-center">
          <button onClick={() => showLegal('Privacy Policy')} className="text-[10px] text-gray-400 hover:text-white hover:underline transition-all">
            Privacy Policy
          </button>
          <button onClick={() => showLegal('Terms of Service')} className="text-[10px] text-gray-400 hover:text-white hover:underline transition-all">
            Terms of Service
          </button>
          <button onClick={() => showLegal('Disclaimer')} className="text-[10px] text-gray-400 hover:text-white hover:underline transition-all">
            Disclaimer
          </button>
        </div>

        <p className="text-[9px] text-gray-700 mt-6 font-mono">
          © 2024 DIGITECH APP • VERSION 1.0.2
        </p>
      </div>

    </div>
  );
}