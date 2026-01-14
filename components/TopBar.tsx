"use client";
import { MiniKit } from "@worldcoin/minikit-js";
import { useEffect, useState } from "react";

export default function TopBar() {
  const [address, setAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [debugLog, setDebugLog] = useState("Waiting for wallet...");

  useEffect(() => {
    // 🟢 NEW LOGIC: Polling (Baar-baar check karna)
    // Kabhi kabhi MiniKit inject hone me 1-2 second lagata hai
    const interval = setInterval(() => {
      if (MiniKit.isInstalled()) {
        const addr = (MiniKit as any).walletAddress;
        if (addr) {
          setAddress(addr);
          setDebugLog("✅ Wallet Found!");
          clearInterval(interval); // Mil gya, ab ruk jao
        }
      }
    }, 500); // Har aadhe second me check karo

    // 5 second baad band kar dena taaki infinite na chale
    setTimeout(() => clearInterval(interval), 5000);
    
    return () => clearInterval(interval);
  }, []);

  const handleConnect = async () => {
    if (!MiniKit.isInstalled()) {
      setDebugLog("MiniKit not installed!");
      return;
    }

    setLoading(true);
    setDebugLog("Requesting Sign In...");

    try {
      const res = await MiniKit.commandsAsync.walletAuth({
        nonce: crypto.randomUUID().replace(/-/g, ""),
        requestId: "0",
        expirationTime: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
        notBefore: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
      });

      if (res?.finalPayload?.status === "success") {
        setDebugLog("Auth Success! Fetching Address...");
        
        // Thoda wait karke check karo
        setTimeout(() => {
          const wallet = (MiniKit as any).walletAddress;
          if (wallet) {
            setAddress(wallet);
            setDebugLog("Connected!");
          } else {
            // Agar abhi bhi null hai, to Reload karo
            setDebugLog("Success but address pending. Reloading...");
            window.location.reload();
          }
        }, 1000);

      } else {
        setDebugLog(`Failed: ${res?.finalPayload?.status}`);
      }

    } catch (error: any) {
      setDebugLog(`Error: ${error.message}`);
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
      <div className="bg-gray-900 text-[10px] text-gray-500 p-1 text-center font-mono">
        STATUS: {debugLog}
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