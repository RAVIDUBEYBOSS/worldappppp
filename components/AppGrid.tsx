"use client";

// Mock Data: Infinite Scroll ke liye
const ADS = Array.from({ length: 15 }).map((_, i) => ({
  id: i + 1,
  type: i === 0 ? "APP" : "AD",
  price: i === 0 ? "LIVE" : "$10/Mo",
}));

export default function AppGrid() {
  return (
    <div className="relative w-full h-[650px] bg-[#050505] overflow-hidden border-t border-gray-800 perspective-container">
      <div className="absolute top-0 left-0 w-full z-20 flex justify-center pt-6 pointer-events-none">
        <span className="text-[10px] font-black text-blue-400 tracking-[0.3em] drop-shadow-[0_0_15px_rgba(59,130,246,0.6)] animate-pulse bg-black/20 px-4 py-1 rounded-full backdrop-blur-sm">
          ⚡ 3D ADVERTISING ZONE
        </span>
      </div>

      <div className="absolute top-0 w-full h-24 bg-gradient-to-b from-[#050505] via-[#050505]/80 to-transparent z-10 pointer-events-none"></div>
      <div className="absolute bottom-0 w-full h-24 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent z-10 pointer-events-none"></div>

      <div className="grid grid-cols-3 gap-4 px-4 h-full transform-style-3d rotate-x-12">
        
        <div className="flex flex-col gap-4 animate-marquee-down opacity-80 hover:opacity-100 transition-opacity">
          {[...ADS, ...ADS].map((item, i) => (
            <Ad3DCard key={`col1-${i}`} item={item} index={i} color="cyan" />
          ))}
        </div>

        <div className="flex flex-col gap-4 animate-marquee-up z-10 scale-105">
          {[...ADS, ...ADS].map((item, i) => (
            <Ad3DCard key={`col2-${i}`} item={item} index={i + 5} color="purple" isCenter={true} />
          ))}
        </div>

        <div className="flex flex-col gap-4 animate-marquee-down opacity-80 hover:opacity-100 transition-opacity" style={{ animationDelay: "-3s" }}>
          {[...ADS, ...ADS].map((item, i) => (
            <Ad3DCard key={`col3-${i}`} item={item} index={i + 10} color="cyan" />
          ))}
        </div>

      </div>

      <style jsx>{`
        /* 3D Perspective Scene */
        .perspective-container {
          perspective: 1000px;
        }

        /* Scroll Animations */
        @keyframes scrollUp {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        @keyframes scrollDown {
          0% { transform: translateY(-50%); }
          100% { transform: translateY(0); }
        }
        .animate-marquee-up {
          animation: scrollUp 120s linear infinite;
        }
        .animate-marquee-down {
          animation: scrollDown 120s linear infinite;
        }
      `}</style>
    </div>
  );
}

// --- 3D CARD COMPONENT ---
function Ad3DCard({ item, index, color, isCenter }: any) {
  const isApp = item.type === "APP";
  const borderColor = color === "purple" ? "border-purple-500/40" : "border-cyan-500/30";
  const shadowColor = color === "purple" ? "shadow-purple-900/40" : "shadow-cyan-900/30";
  
  // 3D Tilt Effect Classes
  const cardBase = `
    h-32 flex-shrink-0 relative flex flex-col items-center justify-center 
    rounded-xl border-t border-l ${borderColor} border-b-4 border-r-4 
    bg-gray-900/40 backdrop-blur-md shadow-2xl ${shadowColor}
    group cursor-pointer transition-all duration-300 hover:scale-95 hover:border-b-2 hover:border-r-2 hover:translate-y-1
  `;

  if (isApp) {
    return (
      <div className={`${cardBase} border-green-500/50 bg-green-900/10 shadow-green-900/40`}>
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent rounded-xl"></div>
        <div className="text-3xl mb-1 filter drop-shadow-lg">💰</div>
        <span className="text-[10px] font-black text-green-400 tracking-wider">CLAIM APP</span>
        <div className="absolute top-2 right-2 w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
      </div>
    );
  }

  return (
    <div className={cardBase}>
      {/* Glossy Reflection (Glass Effect) */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent rounded-xl pointer-events-none"></div>
      
      {/* Grid Texture */}
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>

      {/* Content */}
      <span className={`text-[9px] font-bold tracking-widest ${color === "purple" ? "text-purple-300" : "text-cyan-300"}`}>
        AD SLOT
      </span>
      
      {/* Glowing Button */}
      <div className={`my-2 w-8 h-8 rounded-full border border-white/10 bg-black/50 flex items-center justify-center group-hover:bg-${color}-500 group-hover:border-white transition-all shadow-lg`}>
        <span className="text-gray-400 text-sm group-hover:text-white group-hover:rotate-90 transition-transform">+</span>
      </div>

      <span className="text-[8px] text-gray-500 font-mono bg-black/50 px-2 py-0.5 rounded">
        {item.price}
      </span>
    </div>
  );
}