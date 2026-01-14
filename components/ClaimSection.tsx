"use client";

import { useEffect, useState } from "react";
import { usePublicClient } from "wagmi";
import { formatUnits } from "viem";
import { MiniKit, VerificationLevel } from "@worldcoin/minikit-js";
import { useMiniKit } from "@/components/MiniKitProvider"; 

const AIRDROP_CONTRACT = "0xe9EAdb26850e7E08Da443C679e37a99a85a45022";
const TOKEN_ADDRESS = "0x17B236e31dab6B071a0b51787329f77fEF69c3E6";

// NOTE: Humne CLAIM_ABI hata diya hai. Ab seedha function me use karenge.

const READ_ABI = [
  {"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"userNonce","outputs":[{"name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"lastClaimTime","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"tokenConfigs","outputs":[{"internalType":"bool","name":"isActive","type":"bool"},{"internalType":"uint256","name":"claimAmount","type":"uint256"},{"internalType":"uint256","name":"cooldown","type":"uint256"}],"stateMutability":"view","type":"function"}
] as const;

const ERC20_ABI = [
  { name: "symbol", type: "function", stateMutability: "view", inputs: [], outputs: [{ type: "string" }] },
  { name: "decimals", type: "function", stateMutability: "view", inputs: [], outputs: [{ type: "uint8" }] },
] as const;

export default function ClaimSection() {
  const publicClient = usePublicClient();
  const { address } = useMiniKit();

  const [timeLeft, setTimeLeft] = useState(0);
  const [isPending, setIsPending] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [logs, setLogs] = useState("Ready");
  
  const [tokenInfo, setTokenInfo] = useState({ symbol: "...", amount: "...", decimals: 18, cooldown: 0, isActive: true });

  // 1. Data Load
  useEffect(() => {
    if (!publicClient) return;
    const load = async () => {
      try {
        const [config, symbol, decimals] = await Promise.all([
          publicClient.readContract({ address: AIRDROP_CONTRACT as `0x${string}`, abi: READ_ABI, functionName: "tokenConfigs", args: [TOKEN_ADDRESS as `0x${string}`] }),
          publicClient.readContract({ address: TOKEN_ADDRESS as `0x${string}`, abi: ERC20_ABI, functionName: "symbol" }),
          publicClient.readContract({ address: TOKEN_ADDRESS as `0x${string}`, abi: ERC20_ABI, functionName: "decimals" }),
        ]);

        if (config[0]) {
           setTokenInfo({
            symbol: symbol as string,
            amount: parseFloat(formatUnits(config[1], Number(decimals))).toFixed(0), 
            decimals: Number(decimals),
            cooldown: Number(config[2]),
            isActive: true
           });
        }
      } catch (e) {}
    };
    load();
  }, [publicClient]);

  // 2. Timer
  useEffect(() => {
    if (!address || !publicClient || !tokenInfo.isActive) return;
    const checkTimer = async () => {
      try {
        const lastClaim = await publicClient.readContract({ 
          address: AIRDROP_CONTRACT as `0x${string}`, abi: READ_ABI, functionName: "lastClaimTime", args: [address, TOKEN_ADDRESS as `0x${string}`] 
        });
        const remaining = Number(lastClaim) + tokenInfo.cooldown - Math.floor(Date.now() / 1000);
        setTimeLeft(remaining > 0 ? remaining : 0);
        
        if (remaining > 0) {
            setLogs(`Wait ${Math.floor(remaining/60)}m`);
        } else {
            setLogs(isVerified ? "Ready to Claim" : "Identify Yourself");
        }
      } catch (e) {}
    };
    checkTimer();
  }, [address, tokenInfo, publicClient, isVerified]);

  // 🔥 STEP 1: VERIFY
  const handleVerify = async () => {
    if (!address) return;
    setIsPending(true);
    setLogs("Verifying...");

    try {
        const verifyRes = await MiniKit.commandsAsync.verify({
            action: "consult-orb",
            signal: address,
            verification_level: VerificationLevel.Orb,
        });

        if (verifyRes.finalPayload.status === "success") {
            setIsVerified(true);
            setLogs("Verified! Claim Now.");
        } else {
            setLogs("Verify Cancelled");
        }
    } catch (e) {
        setLogs("Verify Error");
    } finally {
        setIsPending(false);
    }
  };

  // 🔥 STEP 2: CLAIM (INLINE ABI FIX)
  const handleClaim = async () => {
    if (!address || !publicClient) return;
    setIsPending(true);
    
    try {
      // A. Nonce
      setLogs("Authorizing...");
      const nonce = Number(await publicClient.readContract({
        address: AIRDROP_CONTRACT as `0x${string}`, abi: READ_ABI, functionName: "userNonce", args: [address, TOKEN_ADDRESS as `0x${string}`]
      }));

      // B. Signature
      const res = await fetch("/api/getSignature", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userAddress: address, tokenAddress: TOKEN_ADDRESS, nonce }),
      });
      const data = await res.json();
      if (!data.signature) throw new Error("Sign Failed");

      // C. Transaction
      setLogs("Open Wallet...");
      
      // 👇 MAGIC FIX: ABI ko seedha yahi likh diya array banakar.
      // Ab 'undefined map' ka sawal hi paida nahi hota.
      const txPayload = {
        transactions: [
          {
            address: AIRDROP_CONTRACT,
            abi: [
              {
                "inputs": [
                  { "internalType": "address", "name": "_token", "type": "address" },
                  { "internalType": "bytes", "name": "_signature", "type": "bytes" }
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

      const tx = await MiniKit.commandsAsync.sendTransaction(txPayload);

      if (tx.finalPayload.status === "success") {
        setLogs("🎉 Success!");
        setIsVerified(false);
        setTimeLeft(tokenInfo.cooldown);
        setTimeout(() => window.location.reload(), 2000);
      } else {
        setLogs("User Rejected");
      }

    } catch (e: any) {
      console.error(e);
      setLogs("Error: " + (e.message?.slice(0, 15) || "Failed"));
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="p-4">
       <div className="w-full bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6 text-center shadow-2xl relative overflow-hidden">
        <h2 className="text-gray-500 text-[10px] font-bold tracking-[0.2em] uppercase mb-1">Daily Reward</h2>
        <div className="flex items-center justify-center gap-2">
            <span className="text-4xl font-black text-white">{tokenInfo.amount}</span>
            <span className="text-xl font-bold text-yellow-500 mb-1">{tokenInfo.symbol}</span>
        </div>
        <p className="text-[10px] mt-2 font-mono text-gray-500">{logs}</p>
      </div>

      {!address && <div className="w-full py-4 rounded-xl bg-gray-800/50 text-gray-400 font-bold text-center border border-dashed border-gray-700 animate-pulse">👆 Connect Wallet Above</div>}
      
      {address && timeLeft > 0 && <button disabled className="w-full py-4 rounded-xl bg-gray-800 text-gray-500 font-bold border border-gray-700">⏳ {Math.floor(timeLeft / 60)}m {timeLeft % 60}s</button>}

      {address && timeLeft === 0 && !isVerified && tokenInfo.isActive && (
        <button onClick={handleVerify} disabled={isPending} className="w-full py-4 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-500 transition active:scale-95 shadow-[0_0_20px_rgba(37,99,235,0.3)]">
          {isPending ? "Verifying..." : "👁️ VERIFY ID"}
        </button>
      )}

      {address && timeLeft === 0 && isVerified && tokenInfo.isActive && (
        <button onClick={handleClaim} disabled={isPending} className="w-full py-4 rounded-xl bg-gradient-to-r from-yellow-600 to-yellow-400 text-black font-black hover:brightness-110 active:scale-95 shadow-[0_0_20px_rgba(234,179,8,0.4)]">
          {isPending ? "Processing..." : "💰 CLAIM NOW"}
        </button>
      )}
    </div>
  );
}