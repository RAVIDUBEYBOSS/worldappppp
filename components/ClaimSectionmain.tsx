"use client";

import { useEffect, useState } from "react";
import { usePublicClient } from "wagmi";
import { MiniKit, VerificationLevel, ResponseEvent } from "@worldcoin/minikit-js";
import { useMiniKit } from "@/components/MiniKitProvider"; 

// --- Constants ---
const AIRDROP_CONTRACT = "0xe9EAdb26850e7E08Da443C679e37a99a85a45022";
const TOKEN_ADDRESS = "0x17B236e31dab6B071a0b51787329f77fEF69c3E6";

export default function ClaimSection() {
  const publicClient = usePublicClient();
  const { address } = useMiniKit();
  
  const [isMounted, setIsMounted] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [logs, setLogs] = useState("Ready");
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== "undefined" && MiniKit.isInstalled()) {
      MiniKit.subscribe((payload: ResponseEvent) => {
        if (payload.command === 'sendTransaction') {
          setIsPending(false);
          if (payload.status === 'success') {
            setLogs("🎉 Reward Claimed!");
            setIsVerified(false);
          } else {
            setLogs("Transaction failed or rejected");
          }
        }
      });
    }
    return () => MiniKit.unsubscribe();
  }, []);

  const handleClaim = async () => {
    if (!address || !publicClient) return;

    // Critical Check: MiniKit ready?
    if (!MiniKit.commands) {
      setLogs("SDK Error: MiniKit not initialized");
      return;
    }

    setIsPending(true);
    setLogs("Hashing data...");

    try {
      // 1. Get Nonce directly from your contract
      const nonce = await publicClient.readContract({
        address: AIRDROP_CONTRACT as `0x${string}`,
        abi: [
          {
            "inputs": [{"name": "","type":"address"},{"name": "","type":"address"}],
            "name": "userNonce",
            "outputs": [{"name": "","type":"uint256"}],
            "stateMutability": "view",
            "type": "function"
          }
        ],
        functionName: "userNonce",
        args: [address as `0x${string}`, TOKEN_ADDRESS as `0x${string}`]
      });

      setLogs("Fetching signature...");

      // 2. Call your route.ts API
      const res = await fetch("/api/getSignature", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            userAddress: address, 
            tokenAddress: TOKEN_ADDRESS, 
            nonce: Number(nonce) 
        }),
      });

      const data = await res.json();
      if (!data.signature) throw new Error(data.error || "Sign Failed");

      // 🚩 THE "MAP" FIX: Payload must be exactly this structure
      const txPayload = {
        transactions: [ // <--- This MUST be an array
          {
            address: AIRDROP_CONTRACT,
            abi: [
              {
                "inputs": [
                  { "name": "_token", "type": "address" },
                  { "name": "_signature", "type": "bytes" }
                ],
                "name": "claimReward",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
              }
            ],
            functionName: "claimReward",
            args: [TOKEN_ADDRESS, data.signature]
          }
        ]
      };

      console.log("DEBUG: Final Payload Check", txPayload);
      setLogs("Please confirm in Wallet...");
      
      // FIRE!
      MiniKit.commands.sendTransaction(txPayload);

    } catch (e: any) {
      console.error("Deep Analysis Error:", e);
      setLogs("Error: " + (e.message?.slice(0, 20) || "Failed"));
      setIsPending(false);
    }
  };

  if (!isMounted) return null;

  return (
    <div className="p-4 flex flex-col items-center">
      <div className="w-full bg-gray-950 p-6 rounded-3xl border border-white/5 text-center mb-6">
         <p className="text-gray-400 text-[10px] uppercase tracking-widest mb-2">Claim Hub</p>
         <h2 className="text-2xl font-black text-white">Daily Rewards</h2>
         <p className="mt-2 text-xs font-mono text-blue-500">{logs}</p>
      </div>

      {!isVerified ? (
        <button 
          onClick={async () => {
             const res = await MiniKit.commandsAsync.verify({
               action: "consult-orb",
               signal: address || "",
               verification_level: VerificationLevel.Orb
             });
             if (res.finalPayload.status === "success") setIsVerified(true);
          }}
          disabled={isPending || !address}
          className="w-full py-4 bg-white text-black font-bold rounded-2xl"
        >
          {isPending ? "LOADING..." : "VERIFY TO UNLOCK"}
        </button>
      ) : (
        <button 
          onClick={handleClaim}
          disabled={isPending}
          className="w-full py-4 bg-yellow-500 text-black font-black rounded-2xl active:scale-95 transition-all"
        >
          {isPending ? "PROCESSING..." : "💰 CLAIM NOW"}
        </button>
      )}
    </div>
  );
}