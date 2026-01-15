"use client";

import { useEffect, useState } from "react";
import { usePublicClient } from "wagmi";
import { MiniKit, VerificationLevel, ResponseEvent } from "@worldcoin/minikit-js";
import { useMiniKit } from "@/components/MiniKitProvider"; 

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
    if (!MiniKit.isInstalled()) return;

    // Listen for transaction response
    MiniKit.subscribe((payload: ResponseEvent) => {
      if (payload.command === 'sendTransaction') {
        setIsPending(false);
        if (payload.status === 'success') {
          setLogs("🎉 Reward Claimed!");
          setIsVerified(false);
        } else {
          setLogs("Transaction Error/Cancelled");
        }
      }
    });
    return () => MiniKit.unsubscribe();
  }, []);

  const handleClaim = async () => {
    // 🚩 Validation as per Docs
    if (!MiniKit.commands || !address) {
      setLogs("SDK not ready");
      return;
    }

    setIsPending(true);
    setLogs("Step 1: Signing...");

    try {
      // 1. Get Nonce (Contract Check)
      const nonce = await publicClient?.readContract({
        address: AIRDROP_CONTRACT as `0x${string}`,
        abi: [{"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"userNonce","outputs":[{"name":"","type":"uint256"}],"stateMutability":"view","type":"function"}],
        functionName: "userNonce",
        args: [address as `0x${string}`, TOKEN_ADDRESS as `0x${string}`]
      });

      // 2. Fetch Signature from your Backend
      const res = await fetch("/api/getSignature", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userAddress: address, tokenAddress: TOKEN_ADDRESS, nonce: Number(nonce) }),
      });
      const data = await res.json();
      if (!data.signature) throw new Error("Sign Failed");

      setLogs("Step 2: Sending to World App...");

      // 🚩 THE DOCS COMPLIANT PAYLOAD
      // JSON structure exactly matching World Docs example
      const txPayload = {
        transactions: [
          {
            address: AIRDROP_CONTRACT,
            abi: [
              {
                "name": "claimReward",
                "type": "function",
                "stateMutability": "nonpayable",
                "inputs": [
                  { "name": "_token", "type": "address" },
                  { "name": "_signature", "type": "bytes" }
                ],
                "outputs": []
              }
            ],
            functionName: "claimReward",
            args: [TOKEN_ADDRESS, data.signature]
          }
        ]
      };

      // 🔥 CLEANING & SENDING
      // .map() error bypass: Ensure it's a clean POJO (Plain Old JS Object)
      const finalCommand = JSON.parse(JSON.stringify(txPayload));
      
      console.log("Docs Compliant Payload:", finalCommand);
      
      // FIRE!
      MiniKit.commands.sendTransaction(finalCommand);

    } catch (e: any) {
      console.error("SDK Error Trace:", e);
      setLogs("Error: SDK Logic Error");
      setIsPending(false);
    }
  };

  if (!isMounted) return null;

  return (
    <div className="p-4 space-y-4">
      <div className="bg-gray-900 border border-white/5 p-6 rounded-3xl text-center shadow-2xl">
         <p className="text-[10px] font-mono text-yellow-500 uppercase">{logs}</p>
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
          className="w-full py-4 bg-white text-black font-bold rounded-2xl shadow-lg active:scale-95"
        >
          VERIFY WORLD ID
        </button>
      ) : (
        <button 
          onClick={handleClaim}
          disabled={isPending}
          className="w-full py-5 bg-gradient-to-r from-yellow-500 to-yellow-400 text-black font-black rounded-2xl shadow-xl active:scale-95 transition-all"
        >
          {isPending ? "SENDING..." : "💰 CLAIM REWARD"}
        </button>
      )}
    </div>
  );
}