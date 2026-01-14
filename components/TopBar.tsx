"use client";
import { MiniKit } from "@worldcoin/minikit-js";
import { useEffect, useState } from "react";

export default function TopBar() {
  const [address, setAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Page load hote hi check karo
    checkWallet();
  }, []);

  const checkWallet = () => {
    if (MiniKit.isInstalled() && (MiniKit as any).walletAddress) {
      setAddress((MiniKit as any).walletAddress);
      return true;
    }
    return false;
  };

  const handleConnect = async () => {
    if (!MiniKit.isInstalled()) {
      alert("MiniKit not installed!");
      return;
    }

    setLoading(true);

    try {
      // 1. Command bhejo
      // Async use kar rahe hain taaki user ke wapas aane ka wait kare
      const res = await MiniKit.commandsAsync.walletAuth({
        nonce: crypto.randomUUID().replace(/-/g, ""),
        requestId: "0",
        expirationTime: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
        notBefore: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
      });

      // 2. Response aate hi Debug Alert dikhao (Isse pata chalega kya aaya)
      // alert(`Response: ${JSON.stringify(res)}`); 

      // 3. AGGRESSIVE CHECKING (Polling)
      // Hum wait nahi karenge ki response sahi hai ya nahi, hum seedha address check karenge
      let attempts = 0;
      const interval = setInterval(() => {
        attempts++;
        const found = checkWallet();
        
        if (found) {
          clearInterval(interval); // Mil gaya! Ruko mat.
          setLoading(false);
        } else if (attempts > 5) {
          // 5 baar check kiya, nahi mila -> Reload kar do
          clearInterval(interval);
          window.location.reload(); 
        }
      }, 1000); // Har 1 second me check karo

    } catch (error: any) {
      console.error(error);
      alert(`Error: ${error.message}`);
      setLoading(false);
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
  };

  return (
    <div className="flex flex-col bg-black border-b border-gray-800">
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