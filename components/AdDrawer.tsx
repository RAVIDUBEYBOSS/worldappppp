"use client";
import { useState } from "react";
import BookAdForm from "./BookAdForm"; // Tumhara existing form component

export default function AdDrawer() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
<button onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-4 z-[9990] h-12 w-12 rounded-full bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.5)] flex items-center justify-center animate-bounce hover:animate-none active:scale-90 transition-transform"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      </button>
      
      <div className="fixed bottom-20 right-4 mb-14 text-[8px] font-bold text-blue-400 z-[9990] bg-black/80 px-2 rounded pointer-events-none">
        POST AD
      </div>

      <div 
        className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-[10000] transition-opacity duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* 3. BOTTOM SHEET (Sliding Form) */}
      <div 
        className={`fixed bottom-0 left-0 w-full bg-black border-t border-gray-800 rounded-t-3xl z-[10001] transition-transform duration-300 ease-out transform ${
          isOpen ? "translate-y-0" : "translate-y-full"
        }`}
      >
        {/* Drag Handle (Visual only) */}
        <div className="w-full flex justify-center pt-3 pb-1" onClick={() => setIsOpen(false)}>
          <div className="w-12 h-1.5 bg-gray-700 rounded-full cursor-pointer"></div>
        </div>

        {/* Header with Close Button */}
        <div className="flex justify-between items-center px-5 pb-2">
          <span className="text-xs font-bold text-gray-500">NEW CAMPAIGN</span>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-2 bg-gray-900 rounded-full text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* FORM CONTENT (Scrollable) */}
        <div className="max-h-[80vh] overflow-y-auto px-1 pb-10">
          <BookAdForm /> 
        </div>
        
      </div>
    </>
  );
}