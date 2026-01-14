export default function HeroBanner() {
  return (
    <div className="p-3">
      <div className="relative w-full h-40 rounded-xl overflow-hidden border border-gray-700 group">
        {/* Background Image Placeholder */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900 to-blue-900 animate-pulse"></div>
        
        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
          <h2 className="text-xl font-black text-white italic drop-shadow-lg">YOUR BRAND HERE</h2>
          <p className="text-[10px] text-gray-300 mb-3">Reach 10k+ Verified Users</p>
          <button className="bg-white text-black text-[10px] font-bold px-4 py-2 rounded shadow-lg hover:scale-105 transition">
            RENT NOW (50 WLD)
          </button>
        </div>

        {/* Shine Effect */}
        <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
      </div>
    </div>
  );
}