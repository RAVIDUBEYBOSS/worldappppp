"use client";
import { useState, useEffect } from "react";

export default function AdWallSplit() {
  // 8 Ads Data (2 New Added for extra row)
  const adsData = [
    { id: 1, name: "NIKE", color: "cyan", img: "👟" },
    { id: 2, name: "APPLE", color: "gray", img: "🍎" },
    { id: 3, name: "TESLA", color: "red", img: "🚗" },
    { id: 4, name: "X-BOX", color: "green", img: "🎮" },
    { id: 5, name: "PEPSI", color: "blue", img: "🥤" },
    { id: 6, name: "PUMA", color: "pink", img: "🐆" },
    { id: 7, name: "GOOGLE", color: "yellow", img: "🔍" }, // New
    { id: 8, name: "AMAZON", color: "orange", img: "📦" }, // New
  ];

  // Positions Logic Updated for 8 Slots (0 to 7)
  const [positions, setPositions] = useState([0, 1, 2, 3, 4, 5, 6, 7]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPositions((prev) => {
        return prev.map((pos) => {
          const nextPos = pos + 1;
          // Loop 0 to 7 now
          return nextPos > 7 ? 0 : nextPos;
        });
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Updated Coordinate System for 4 Rows (25% height each)
  const getStyleForPosition = (posIndex: number) => {
    // 0  1 (Row 1)
    // 7  2 (Row 2)
    // 6  3 (Row 3)
    // 5  4 (Row 4)
    switch (posIndex) {
      case 0: return { top: "0%", left: "0%" };      // Top-Left
      case 1: return { top: "0%", left: "50%" };     // Top-Right
      case 2: return { top: "25%", left: "50%" };    // Row 2 Right
      case 3: return { top: "50%", left: "50%" };    // Row 3 Right
      case 4: return { top: "75%", left: "50%" };    // Bottom Right
      case 5: return { top: "75%", left: "0%" };     // Bottom Left
      case 6: return { top: "50%", left: "0%" };     // Row 3 Left
      case 7: return { top: "25%", left: "0%" };     // Row 2 Left
      default: return { top: "0%", left: "0%" };
    }
  };

  return (
    <div className="w-full px-3 pb-2 bg-black">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-2 border-b border-gray-800 pb-1">
        <span className="text-[9px] font-black text-white tracking-widest uppercase flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></span>
          AD WALL
        </span>
        <span className="text-[8px] text-gray-600 font-mono">2x4 LIVE</span>
      </div>

      {/* HEIGHT INCREASED: h-[280px] -> h-[450px] (Taaki har box bada dikhe) */}
      <div className="relative w-full h-[450px] bg-gray-900/20 rounded-lg border border-gray-800 overflow-hidden">
        
        {/* Background Grid */}
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] bg-[size:15px_15px]"></div>

        {adsData.map((ad, i) => {
          const currentPos = positions[i];
          const style = getStyleForPosition(currentPos);
          const isLeader = currentPos === 0;

          return (
            <div
              key={ad.id}
              style={{ 
                ...style, 
                width: "50%", 
                height: "25%", // 4 Rows hain isliye 25% height
                transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)" 
              }}
              className="absolute p-0.5"
            >
              <div className={`
                w-full h-full rounded border flex flex-col items-center justify-center relative overflow-hidden
                ${isLeader ? `border-${ad.color}-500 bg-${ad.color}-900/20` : 'border-gray-700 bg-gray-800/80'}
              `}>
                
                {/* Content */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
                <span className="text-2xl mb-1 filter drop-shadow-md">{ad.img}</span>
                <span className={`text-[9px] font-black tracking-wider ${isLeader ? 'text-white' : 'text-gray-500'}`}>
                  {ad.name}
                </span>
                
                {/* Slot ID */}
                <span className="absolute top-1 right-2 text-[7px] font-mono text-gray-700">
                  #{ad.id}
                </span>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}