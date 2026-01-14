"use client";

import { useEffect, useState } from "react";
import { usePublicClient } from "wagmi";
import { formatUnits } from "viem";
import {
  MiniKit,
  VerificationLevel,
  // Types hata diye taaki build fail na ho
} from "@worldcoin/minikit-js";

// --- CONTRACT CONFIG ---
const AIRDROP_CONTRACT = "0xe9EAdb26850e7E08Da443C679e37a99a85a45022" as `0x${string}`;
const TOKEN_ADDRESS = "0x17B236e31dab6B071a0b51787329f77fEF69c3E6" as `0x${string}`;

// --- ABIS ---
const AIRDROP_ABI = [
  { name: "claimReward", type: "function", stateMutability: "nonpayable", inputs: [{ name: "_token", type: "address" }, { name: "_signature", type: "bytes" }], outputs: [] },
  { name: "lastClaimTime", type: "function", stateMutability: "view", inputs: [{ name: "", type: "address" }, { name: "", type: "address" }], outputs: [{ type: "uint256" }] },
  { name: "tokenConfigs", type: "function", stateMutability: "view", inputs: [{ name: "", type: "address" }], outputs: [{ name: "isActive", type: "bool" }, { name: "claimAmount", type: "uint256" }, { name: "cooldown", type: "uint256" }] },
] as const;

const ERC20_ABI = [
  { name: "symbol", type: "function", stateMutability: "view", inputs: [], outputs: [{ type: "string" }] },
  { name: "decimals", type: "function", stateMutability: "view", inputs: [], outputs: [{ type: "uint8" }] },
] as const;

export default function ClaimSection() {
  const publicClient = usePublicClient();

  const [address, setAddress] = useState<`0x${string}` | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isPending, setIsPending] = useState(false);
  const [logs, setLogs] = useState("Loading Reward Info...");
  
  // Type 'any' kar diya taaki TS roye nahi
  const [proofData, setProofData] = useState<any | null>(null);

  const [tokenInfo, setTokenInfo] = useState({
    symbol: "Loading...",
    amount: "0",
    decimals: 18,
    cooldown: 0,
    isActive: false
  });

  // 1. Fetch Global Token Info (Wallet ki zarurat nahi)
  const fetchGlobalData = async () => {
    if (!publicClient) return;
    try {
      const [config, symbol, decimals] = await Promise.all([
        publicClient.readContract({ address: AIRDROP_CONTRACT, abi: AIRDROP_ABI, functionName: "tokenConfigs", args: [TOKEN_ADDRESS] }),
        publicClient.readContract({ address: TOKEN_ADDRESS, abi: ERC20_ABI, functionName: "symbol" }),
        publicClient.readContract({ address: TOKEN_ADDRESS, abi: ERC20_ABI, functionName: "decimals" }),
      ]);

      if (!config[0]) {
        setLogs("Airdrop Inactive");
        setTokenInfo(prev => ({ ...prev, symbol: symbol as string, isActive: false }));
        return;
      }

      const amount = formatUnits(config[1], Number(decimals));
      
      setTokenInfo({
        symbol: symbol as string,
        amount: parseFloat(amount).toFixed(0), // No decimals in UI for clean look
        decimals: Number(decimals),
        cooldown: Number(config[2]),
        isActive: true
      });
      setLogs("Ready to Claim");

    } catch (err) {
      console.error("Global Fetch Error:", err);
      setLogs("Network Error");
    }
  };

  // 2. Fetch User Specific Data (Wait Time)
  const fetchUserData = async () => {
    if (!address || !publicClient || !tokenInfo.isActive) return;
    
    try {
      const lastClaim = await publicClient.readContract({ 
        address: AIRDROP_CONTRACT, 
        abi: AIRDROP_ABI, 
        functionName: "lastClaimTime", 
        args: [address, TOKEN_ADDRESS] 
      });

      const now = Math.floor(Date.now() / 1000);
      const remaining = Number(lastClaim) + tokenInfo.cooldown - now;
      setTimeLeft(remaining > 0 ? remaining : 0);
      
    } catch (err) {
      console.error("User Data Error:", err);
    }
  };

  // Initial Load
  useEffect(() => {
    fetchGlobalData();
  }, [publicClient]);

  // Wallet Check
  useEffect(() => {
    const checkWallet = () => {
      if (MiniKit.isInstalled() && (MiniKit as any).walletAddress) {
        setAddress((MiniKit as any).walletAddress as `0x${string}`);
      }
    };
    checkWallet();
    const i = setInterval(checkWallet, 1000);
    return () => clearInterval(i);
  }, []);

  // Update TimeLeft when address or tokenInfo changes
  useEffect(() => {
    if (address && tokenInfo.isActive) {
      fetchUserData();
    }
  }, [address, tokenInfo.isActive]);


  const handleVerify = async () => {
    if(!address) return;
    setIsPending(true);
    setLogs("Verifying ID...");

    try {
      const res: any = await MiniKit.commandsAsync.verify({
        action: "consult-orb", 
        signal: address,
        verification_level: VerificationLevel.Orb,
      });

      if (res?.finalPayload?.status === "success") {
        setLogs("✅ Verified! Click Claim.");
        setProofData(res.finalPayload);
      } else {
        setLogs("Verification Failed");
      }
    } catch (error) {
      console.error(error);
      setLogs("Verify Error");
    } finally {
      setIsPending(false);
    }
  };

  const handleExecuteClaim = async () => {
    if (!address || !proofData) return;
    setIsPending(true);
    setLogs("Claiming...");

    try {
      const res = await fetch("/api/getSignature", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userAddress: address,
          tokenAddress: TOKEN_ADDRESS,
          proof: proofData,
        }),
      });

      const data = await res.json();
      if (!data.signature) throw new Error(data.error || "Sign Failed");

      const txPayload: any = {
        transaction: {
          to: AIRDROP_CONTRACT,
          abi: AIRDROP_ABI,
          functionName: "claimReward",
          args: [TOKEN_ADDRESS, data.signature],
        },
      };

      const tx: any = await MiniKit.commandsAsync.sendTransaction(txPayload);
      
      if (tx?.finalPayload?.status === "success") {
        setLogs("🎉 Claimed Successfully!");
        fetchUserData(); // Reset timer
        setProofData(null);
      } else {
        setLogs("Transaction Failed");
      }
    } catch (err: any) {
      setLogs(err.message || "Claim Error");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="p-4">
       {/* REWARD CARD - ALWAYS VISIBLE */}
       <div className="w-full bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6 shadow-2xl relative overflow-hidden text-center">
        <div className="absolute top-0 right-0 p-2 opacity-10 text-6xl">🎁</div>
        <h2 className="text-gray-400 text-xs font-bold tracking-widest uppercase mb-2">Daily Reward</h2>
        
        <div className="flex items-center justify-center gap-2">
            <span className="text-4xl font-black text-white">
              {tokenInfo.amount}
            </span>
            <span className="text-xl font-bold text-yellow-500 mb-1">
              {tokenInfo.symbol}
            </span>
        </div>
        
        <p className={`text-[10px] mt-2 font-mono ${logs.includes("Success") ? "text-green-400" : "text-gray-500"}`}>
          STATUS: {logs}
        </p>
      </div>

      {/* BUTTONS - ADDRESS DEPENDENT */}
      {!address && (
         <div className="w-full py-4 rounded-xl bg-gray-800 text-gray-500 font-bold text-center border border-gray-700">
           🔒 Connect Wallet to Claim
         </div>
      )}

      {address && timeLeft > 0 && (
        <button disabled className="w-full py-4 rounded-xl bg-gray-800 text-gray-400 font-bold border border-gray-700 cursor-not-allowed">
           ⏳ COME BACK IN {Math.floor(timeLeft / 60)}m {timeLeft % 60}s
        </button>
      )}

      {/* VERIFY BUTTON */}
      {address && timeLeft === 0 && !proofData && tokenInfo.isActive && (
        <button 
          onClick={handleVerify}
          disabled={isPending}
          className="w-full py-4 rounded-xl bg-blue-600 text-white font-bold shadow-lg hover:bg-blue-500 transition active:scale-95"
        >
          {isPending ? "Verifying..." : "👁️ VERIFY ID"}
        </button>
      )}

      {/* CLAIM BUTTON */}
      {address && timeLeft === 0 && proofData && tokenInfo.isActive && (
        <button 
          onClick={handleExecuteClaim}
          disabled={isPending}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-yellow-600 to-yellow-400 text-black font-black shadow-[0_0_20px_rgba(250,204,21,0.4)] animate-pulse active:scale-95"
        >
          {isPending ? "Processing..." : "💰 CLAIM REWARD"}
        </button>
      )}

    </div>
  );
}