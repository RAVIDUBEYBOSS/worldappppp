"use client";
import { MiniKit } from "@worldcoin/minikit-js";
import { useEffect, useState } from "react";

export default function TopBar() {
  const [address, setAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [debugId, setDebugId] = useState("");

  useEffect(() => {
    setDebugId(process.env.NEXT_PUBLIC_APP_ID || "Not Found");
    if (MiniKit.isInstalled() && MiniKit.walletAddress) {
      setAddress(MiniKit.walletAddress);
    }
  }, []);

  const handleConnect = async () => {
    if (!MiniKit.isInstalled()) {
      alert("Error: MiniKit not found.");
      return;
    }

    setLoading(true);

    try {
      // 🟢 CHANGE 1: 'commandsAsync' ka use karein (Ye wait karega)
      const res = await MiniKit.commandsAsync.walletAuth({
        nonce: crypto.randomUUID().replace(/-/g, ""),
        requestId: "0",
        expirationTime: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
        notBefore: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
      });

      // 🔍 CHANGE 2: Response structure 'finalPayload' check karein
      if (res?.finalPayload?.status === "success") {
        
        if (MiniKit.walletAddress) {
           setAddress(MiniKit.walletAddress);
        } else {
           window.location.reload(); 
        }

      } else {
        // Fail case
        alert("Connection Failed or Cancelled by User.");
        console.log("Full Error:", res);
      }

    } catch (error: any) {
      console.error(error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
  };

  return (
    <div className="flex flex-col bg-black border-b border-gray-800">
      
      {/* Debug Strip */}
      <div className="bg-gray-900 text-[8px] text-gray-500 text-center py-1 font-mono">
        ID: {debugId.slice(0, 10)}... 
      </div>

      <div className="flex justify-between items-center px-4 py-3">
        <button className="text-[10px] font-bold bg-gradient-to-r from-yellow-600 to-yellow-400 text-black px-3 py-1.5 rounded-full hover:brightness-110">
          📢 BOOK AD
        </button>

        <button 
          onClick={handleConnect}
          disabled={!!address || loading}
          className={`text-[10px] font-bold border px-3 py-1.5 rounded-full flex items-center gap-2 transition-all
            ${address 
              ? "border-green-500 text-green-400 bg-green-900/20" 
              : "border-blue-500 text-blue-400 hover:bg-blue-900/20 active:scale-95"
            }
          `}
        >
          {loading ? (
             <span className="animate-spin h-3 w-3 border-2 border-current border-t-transparent rounded-full"></span>
          ) : (
             <span>{address ? "🟢" : "⚡"}</span> 
          )}
          
          {address ? formatAddress(address) : (loading ? "CONNECTING..." : "CONNECT WALLET")}
        </button>
      </div>

    </div>
  );
}