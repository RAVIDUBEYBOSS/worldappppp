export default function AdWall3D() {
  // Mock Data (12 Slots)
  const slots = Array.from({ length: 12 }).map((_, i) => ({
    id: i + 1,
    status: i % 4 === 0 ? "OCCUPIED" : "VACANT", // Har 4th slot occupied dikhate hain demo ke liye
    brand: i % 4 === 0 ? "CryptoKing" : null,
    color: i % 4 === 0 ? "bg-blue-600" : "bg-gray-900"
  }));

  return (
    <div className="min-h-screen bg-black pt-20 pb-32 px-4 overflow-hidden">
      
      {/* Page Title */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black italic text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 animate-pulse">
          GLOBAL AD WALL
        </h2>
        <p className="text-xs text-gray-500 font-mono mt-2 tracking-widest">
          YOUR BRAND • ROTATING 24/7
        </p>
      </div>

      {/* 3D Grid Container */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-10 perspective-1000">
        {slots.map((slot) => (
          <div key={slot.id} className="w-full aspect-square flex justify-center items-center group perspective-container">
            
            {/* THE ROTATING CUBE */}
            <div className={`relative w-32 h-32 preserve-3d animate-spin-3d ${slot.status === 'OCCUPIED' ? 'duration-[8s]' : 'duration-[12s]'}`}>
              
              {/* --- FRONT FACE (Ad Content) --- */}
              <div className={`absolute inset-0 ${slot.color} border-2 border-blue-500/50 flex flex-col items-center justify-center backface-hidden shadow-[0_0_20px_rgba(59,130,246,0.5)]`}>
                {slot.status === "OCCUPIED" ? (
                  <>
                    <span className="text-4xl">💎</span>
                    <span className="text-[10px] font-bold text-white mt-2">{slot.brand}</span>
                  </>
                ) : (
                  <>
                    <span className="text-2xl text-gray-500">?</span>
                    <span className="text-[10px] font-bold text-gray-400 mt-1">EMPTY</span>
                  </>
                )}
              </div>

              {/* --- BACK FACE (Rent Me Info) --- */}
              <div className="absolute inset-0 bg-gray-800 border-2 border-dashed border-purple-500 flex flex-col items-center justify-center backface-hidden rotate-y-180 shadow-[0_0_20px_rgba(168,85,247,0.5)]">
                <span className="text-xs font-black text-purple-400">RENT</span>
                <span className="text-[10px] text-white">THIS CUBE</span>
                <span className="text-[8px] text-gray-400 mt-1">$50/Mo</span>
              </div>

              {/* --- LEFT FACE (Decoration) --- */}
              <div className="absolute inset-0 bg-gray-900/90 border border-gray-700 backface-hidden -rotate-y-90 translate-x-[-50%] origin-left"></div>
              
              {/* --- RIGHT FACE (Decoration) --- */}
              <div className="absolute inset-0 bg-gray-900/90 border border-gray-700 backface-hidden rotate-y-90 translate-x-[50%] origin-right"></div>

            </div>
            
            {/* Floor Shadow Effect */}
            <div className="absolute -bottom-8 w-20 h-4 bg-black/50 blur-xl rounded-full"></div>

          </div>
        ))}
      </div>

      {/* Floating Action Button for Contact */}
      <button className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-full font-bold shadow-2xl shadow-purple-900/50 z-40 active:scale-95 transition-transform">
        RENT A CUBE
      </button>

    </div>
  );
}