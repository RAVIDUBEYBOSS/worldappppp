export default function AdBannerTop() {
  return (
<div className="w-full h-[200px] relative overflow-hidden bg-black border-b border-gray-800 group cursor-pointer">
<div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] bg-purple-600/30 rounded-full blur-[80px] group-hover:bg-blue-600/40 transition-colors duration-500 animate-pulse"></div>
<div className="relative z-10 flex flex-col items-center justify-center h-full">
<div className="absolute top-4 right-4 flex items-center gap-1">
<span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
<span className="text-[9px] text-green-500 font-bold font-mono">AVAILABLE</span>
        </div>

<h2 className="text-5xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-gray-200 via-white to-gray-200 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] group-hover:scale-110 transition-transform duration-300">
          RENT ME
</h2>
        
        <div className="mt-3 px-4 py-1 border border-gray-600 rounded-full bg-black/50 backdrop-blur-sm group-hover:border-blue-500 transition-colors">
          <span className="text-[10px] text-gray-400 font-mono tracking-widest group-hover:text-blue-400">
            CONTACT ADMIN FOR SPACE
          </span>
        </div>

      </div>
      <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12"></div>
    </div>
  );
}