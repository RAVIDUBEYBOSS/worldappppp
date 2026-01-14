"use client";
import { MiniKit } from "@worldcoin/minikit-js";
import { useEffect, useState } from "react";

export default function TopBar() {
  const [address, setAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  useEffect(() => {
    // 1. Page Load Check
    if (MiniKit.isInstalled()) {
      const addr = (MiniKit as any).walletAddress;
      if (addr) {
        setAddress(addr);
      }
    }
  }, []);

  const handleConnect = async () => {
    if (!MiniKit.isInstalled()) {
      setStatusMsg("MiniKit Missing!");
      return;
    }

    setLoading(true);
    setStatusMsg("Approving...");

    try {
      // 2. Command Bhejo
      const res: any = await MiniKit.commandsAsync.walletAuth({
        nonce: crypto.randomUUID().replace(/-/g, ""),
        requestId: "0",
        expirationTime: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
        notBefore: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
      });

      // 3. Response ka Operation (Deep Analysis Logic)
      if (res?.finalPayload?.status === "success") {
        setStatusMsg("Success! Locking wallet...");
        
        // METHOD A: Kya MiniKit update ho gaya?
        if ((MiniKit as any).walletAddress) {
           setAddress((MiniKit as any).walletAddress);
           setLoading(false);
           return;
        }

        // METHOD B: Kya address response ke andar hai? (Check common paths)
        // Kuch versions me address 'finalPayload' ke andar hota hai
        const payloadAddr = res.finalPayload.address || res.finalPayload.account;
        if (payloadAddr) {
           setAddress(payloadAddr);
           setLoading(false);
           return;
        }

        // METHOD C: Brahmastra (Instant Reload) ⚡
        // Agar success hai par address nahi dikh raha, matlab sync issue hai.
        // Reload karne se MiniKit fresh start lega aur address utha lega.
        setStatusMsg("Syncing... (Reloading)");
        window.location.reload();

      } else {
        // Agar fail hua
        setStatusMsg(`Auth Failed: ${res?.finalPayload?.status}`);
        setLoading(false);
      }

    } catch (error: any) {
      // Crash report
      setStatusMsg(`Error: ${error.message}`);
      // Agar crash response object hai to usse print karo
      if (error.finalPayload) {
         setStatusMsg(`ErrStatus: ${error.finalPayload.status}`);
      }
      setLoading(false);
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
  };

  return (
    <div className="flex flex-col bg-black border-b border-gray-800">
      
      {/* 🟢 STATUS BAR (Sirf tab dikhega jab process chal raha ho) */}
      {statusMsg && (
        <div className="bg-gray-900 text-[9px] text-yellow-500 text-center py-1 font-mono animate-pulse">
           LOG: {statusMsg}
        </div>
      )}

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