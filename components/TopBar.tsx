"use client";
import { MiniKit } from "@worldcoin/minikit-js";
import { useEffect, useState } from "react";

export default function TopBar() {
  const [address, setAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  // Ye variable screen par error dikhayega
  const [debugLog, setDebugLog] = useState("Ready to connect...");

  useEffect(() => {
    // Page load hote hi check karo
    if (MiniKit.isInstalled() && (MiniKit as any).walletAddress) {
      setAddress((MiniKit as any).walletAddress);
      setDebugLog("Address found on load!");
    }
  }, []);

  const handleConnect = async () => {
    if (!MiniKit.isInstalled()) {
      setDebugLog("MiniKit not installed!");
      return;
    }

    setLoading(true);
    setDebugLog("Requesting Wallet Auth...");

    try {
      // 1. Command Bhejo
      const res = await MiniKit.commandsAsync.walletAuth({
        nonce: crypto.randomUUID().replace(/-/g, ""),
        requestId: "0",
        expirationTime: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
        notBefore: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
      });

      // 2. Response ko screen par print karo
      setDebugLog(`Status: ${res?.finalPayload?.status}`);

      if (res?.finalPayload?.status === "success") {
        
        // 3. Address Check Karo
        const wallet = (MiniKit as any).walletAddress;
        
        if (wallet) {
          setAddress(wallet);
          setDebugLog("Connected successfully!");
        } else {
          setDebugLog("Auth Success but Address is NULL. Retrying...");
          // Agar success hai par address null hai, to reload safe hai
          setTimeout(() => {
             window.location.reload();
          }, 1000);
        }

      } else {
        // Agar fail hua to reason dikhao
        setDebugLog(`Failed: ${JSON.stringify(res)}`);
      }

    } catch (error: any) {
      setDebugLog(`CRASH: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
  };

  return (
    <div className="flex flex-col bg-black border-b border-gray-800">
      
      {/* 🔴 DEBUG BOX: Error yahan dikhega */}
      <div className="bg-red-900/30 text-[10px] text-red-200 p-2 text-center font-mono break-all border-b border-red-900">
        LOG: {debugLog}
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