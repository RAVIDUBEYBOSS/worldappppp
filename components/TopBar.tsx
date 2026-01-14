"use client";
import { useMiniKit } from "@/components/MiniKitProvider"; // Import from our new Brain

export default function TopBar() {
  const { address, connectWallet, isLoading } = useMiniKit();

  const formatAddress = (addr: string) => `${addr.slice(0, 4)}...${addr.slice(-4)}`;

  return (
    <div className="flex flex-col bg-black border-b border-gray-800">
      <div className="flex justify-between items-center px-4 py-3">
        <button className="text-[10px] font-bold bg-yellow-500 text-black px-3 py-1.5 rounded-full">
            📢 BOOK AD
        </button>

        <button 
          onClick={connectWallet}
          disabled={!!address || isLoading}
          className={`text-[10px] font-bold border px-3 py-1.5 rounded-full flex items-center gap-2 transition-all
            ${address 
              ? "border-green-500 text-green-400 bg-green-900/20" 
              : "border-blue-500 text-blue-400 hover:bg-blue-900/20"
            }
          `}
        >
          {isLoading ? (
             <span className="animate-spin h-3 w-3 border-2 border-current border-t-transparent rounded-full"></span>
          ) : (
             <span>{address ? "🟢" : "⚡"}</span> 
          )}
          
          {address ? formatAddress(address) : (isLoading ? "..." : "CONNECT WALLET")}
        </button>
      </div>
    </div>
  );
}