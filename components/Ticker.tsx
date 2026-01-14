export default function Ticker() {
  return (
    <div className="w-full bg-yellow-400 text-black h-8 flex items-center overflow-hidden whitespace-nowrap">
      <div className="animate-marquee text-xs font-bold px-4">
        WELCOME TO DIGITECH WORLD • CLAIM YOUR DAILY GRANTS • NEW TOKENS ADDED SOON • RENT AD SPACE NOW • 
        WELCOME TO DIGITECH WORLD • CLAIM YOUR DAILY GRANTS • NEW TOKENS ADDED SOON • RENT AD SPACE NOW •
      </div>
      
      {/* Add this to your globals.css for animation to work: 
          @keyframes marquee { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }
          .animate-marquee { animation: marquee 15s linear infinite; }
      */}
    </div>
  );
}