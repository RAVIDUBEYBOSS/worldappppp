"use client";
import Link from "next/link";
import { useAccount, useConnect } from "wagmi";
import { injected } from "wagmi/connectors";

export default function Navbar() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();

  return (
    <nav className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] h-14 bg-black/90 backdrop-blur-md border-b border-gray-800 flex items-center justify-between px-4 z-50">
      
      {/* LEFT: Book Ad Button (New Page Link) */}
      <Link href="/book-ad">
        <button className="bg-gray-800 hover:bg-gray-700 border border-gray-600 text-white text-[10px] px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 transition-all active:scale-95">
          <span className="text-yellow-400">★</span> BOOK AD
        </button>
      </Link>

      {/* RIGHT: Connect Wallet */}
      <div>
        {!isConnected ? (
          <button 
            onClick={() => connect({ connector: injected() })} 
            className="bg-blue-600 hover:bg-blue-500 text-white text-[10px] px-4 py-1.5 rounded-full font-bold transition-all shadow-[0_0_10px_rgba(37,99,235,0.4)] active:scale-95"
          >
            CONNECT WALLET
          </button>
        ) : (
          <div className="flex items-center gap-2 bg-gray-900 border border-gray-700 rounded-full px-3 py-1">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_5px_rgba(34,197,94,0.8)]"></div>
            <span className="text-gray-300 text-[10px] font-mono font-bold">
              {address ? `${address.slice(0, 4)}...${address.slice(-4)}` : "USER"}
            </span>
          </div>
        )}
      </div>
    </nav>
  );
}