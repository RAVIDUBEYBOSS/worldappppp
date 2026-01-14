"use client";

interface ClaimUIProps {
  address: string | null;
  tokenInfo: { symbol: string; amount: string; cooldownStr: string };
  timeLeft: number;
  checking: boolean;
  isPending: boolean;
  logs: string;
  onConnect: () => void;
  onClaim: () => void;
}

export default function ClaimUI({
  address,
  tokenInfo,
  timeLeft,
  checking,
  isPending,
  logs,
  onClaim,
}: ClaimUIProps) {
  
  // Format Time Logic
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  return (
    <div className="p-6 flex flex-col items-center justify-center min-h-[50vh]">
      
      {/* 1. Status Card */}
      <div className="w-full bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-2 opacity-10 text-6xl">🎁</div>
        
        <h2 className="text-gray-400 text-xs font-bold tracking-widest uppercase mb-2">Daily Airdrop</h2>
        
        {checking ? (
          <div className="animate-pulse h-10 w-32 bg-gray-800 rounded"></div>
        ) : (
          <div className="flex items-end gap-2">
            <span className="text-4xl font-black text-white">{tokenInfo.amount}</span>
            <span className="text-xl font-bold text-yellow-500 mb-1">{tokenInfo.symbol}</span>
          </div>
        )}

        <div className="mt-4 flex gap-4 text-[10px] text-gray-500 font-mono">
           <div className="bg-black/50 px-2 py-1 rounded border border-gray-800">
             COOLDOWN: <span className="text-gray-300">{tokenInfo.cooldownStr}</span>
           </div>
           {address && (
             <div className="bg-black/50 px-2 py-1 rounded border border-gray-800 truncate max-w-[100px]">
               {address}
             </div>
           )}
        </div>
      </div>

      {/* 2. Logs / Status Message */}
      <div className="mb-6 h-6">
        {logs && (
            <span className="text-xs text-blue-400 animate-pulse bg-blue-900/20 px-3 py-1 rounded-full border border-blue-500/30">
                ℹ️ {logs}
            </span>
        )}
      </div>

      {/* 3. BIG CLAIM BUTTON */}
      <button
        onClick={onClaim}
        disabled={checking || isPending || timeLeft > 0 || !address}
        className={`
          relative w-full py-5 rounded-xl font-black text-lg tracking-wider transition-all
          ${timeLeft > 0 
            ? "bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700" 
            : "bg-gradient-to-r from-yellow-600 to-yellow-400 text-black shadow-[0_0_20px_rgba(250,204,21,0.4)] hover:scale-[1.02] active:scale-95"
          }
        `}
      >
        {isPending ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            PROCESSING...
          </span>
        ) : timeLeft > 0 ? (
          `WAIT ${formatTime(timeLeft)}`
        ) : (
          "CLAIM REWARD 🚀"
        )}
      </button>

      {!address && (
          <p className="mt-4 text-[10px] text-gray-500">Wait for Wallet Auto-Connect...</p>
      )}

    </div>
  );
}