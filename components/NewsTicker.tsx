export default function NewsTicker() {
  return (
    <div className="bg-blue-900/30 border-b border-blue-900/50 overflow-hidden h-8 flex items-center">
      <div className="whitespace-nowrap animate-marquee flex gap-10 text-[10px] text-blue-200 font-mono tracking-wide">
        <span>🚀 WELCOME TO TOOLSJET WORLD</span>
        <span>💎 EARN WLD BY WATCHING ADS</span>
        <span>🔥 NEW TOOLS ADDED: QR GEN & LOVE CALC</span>
        <span>📢 RENT THIS BANNER FOR 10 WLD</span>
      </div>
      <style jsx>{`
        .animate-marquee {
          animation: marquee 15s linear infinite;
        }
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
}