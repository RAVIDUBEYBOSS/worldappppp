"use client";

import { useEffect, useState } from "react";
import { usePublicClient } from "wagmi";
import { formatUnits } from "viem";
import {
  MiniKit,
  VerificationLevel,
  // 🟢 FIX 1: 'ISendTransactionPayload' ka naam badal kar 'SendTransactionPayload' kar diya
  SendTransactionPayload, 
  ISuccessResult, 
} from "@worldcoin/minikit-js";

import ClaimUI from "./ClaimUI";

const AIRDROP_CONTRACT = "0xe9EAdb26850e7E08Da443C679e37a99a85a45022" as `0x${string}`;
const TOKEN_ADDRESS = "0x17B236e31dab6B071a0b51787329f77fEF69c3E6" as `0x${string}`;

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
  const [checking, setChecking] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [logs, setLogs] = useState("");
  const [proofData, setProofData] = useState<ISuccessResult | null>(null);

  const [tokenInfo, setTokenInfo] = useState({
    symbol: "---",
    amount: "---",
    cooldownStr: "---",
  });

  useEffect(() => {
    if (MiniKit.isInstalled() && MiniKit.walletAddress) {
      setAddress(MiniKit.walletAddress as `0x${string}`);
      return;
    }
    const i = setInterval(() => {
      if (MiniKit.isInstalled() && MiniKit.walletAddress) {
        setAddress(MiniKit.walletAddress as `0x${string}`);
        clearInterval(i);
      }
    }, 1000);
    return () => clearInterval(i);
  }, []);

  const fetchTokenData = async () => {
    if (!address || !publicClient) return;
    setChecking(true);
    try {
      const [lastClaim, config, symbol, decimals] = await Promise.all([
        publicClient.readContract({ address: AIRDROP_CONTRACT, abi: AIRDROP_ABI, functionName: "lastClaimTime", args: [address, TOKEN_ADDRESS] }),
        publicClient.readContract({ address: AIRDROP_CONTRACT, abi: AIRDROP_ABI, functionName: "tokenConfigs", args: [TOKEN_ADDRESS] }),
        publicClient.readContract({ address: TOKEN_ADDRESS, abi: ERC20_ABI, functionName: "symbol" }),
        publicClient.readContract({ address: TOKEN_ADDRESS, abi: ERC20_ABI, functionName: "decimals" }),
      ]);

      if (!config[0]) { setLogs("Token inactive"); return; }

      const amount = formatUnits(config[1], Number(decimals));
      const cooldown = Number(config[2]);

      setTokenInfo({ symbol, amount, cooldownStr: `${Math.floor(cooldown / 60)} min` });

      const now = Math.floor(Date.now() / 1000);
      const remaining = Number(lastClaim) + cooldown - now;
      setTimeLeft(remaining > 0 ? remaining : 0);
    } catch (err) { console.error(err); } finally { setChecking(false); }
  };

  useEffect(() => { if (address) fetchTokenData(); }, [address]);

  const handleVerify = async () => {
    if(!address) return;
    setIsPending(true);
    setLogs("Waiting for Verification...");

    try {
      const { finality } = await MiniKit.commands.verify({
        action: "consult-orb", 
        signal: address,
        verification_level: VerificationLevel.Orb,
      });

      if (finality.status === "success") {
        setLogs("✅ Verified! Click Claim now.");
        setProofData(finality);
      } else {
        setLogs("Verification Failed/Cancelled");
      }
    } catch (error) {
      console.error(error);
      setLogs("Error during verification");
    } finally {
      setIsPending(false);
    }
  };

  const handleExecuteClaim = async () => {
    if (!address || !proofData) return;
    setIsPending(true);

    try {
      setLogs("Authorizing Signature...");
      
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
      if (!data.signature) throw new Error("Signature failed");

      setLogs("Opening Wallet...");
      
      // 🟢 FIX 2: Type yahan bhi update kiya
      const txPayload: SendTransactionPayload = {
        transaction: {
          to: AIRDROP_CONTRACT,
          abi: AIRDROP_ABI,
          functionName: "claimReward",
          args: [TOKEN_ADDRESS, data.signature],
        },
      };

      const tx = await MiniKit.commands.sendTransaction(txPayload);
      if (tx.finality.status === "success") {
        setLogs("🎉 Claim Successful!");
        fetchTokenData();
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
       <div className="w-full bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6 shadow-2xl relative overflow-hidden text-center">
        <div className="absolute top-0 right-0 p-2 opacity-10 text-6xl">🎁</div>
        <h2 className="text-gray-400 text-xs font-bold tracking-widest uppercase mb-2">Daily Airdrop</h2>
        <div className="flex items-center justify-center gap-2">
            <span className="text-4xl font-black text-white">{tokenInfo.amount}</span>
            <span className="text-xl font-bold text-yellow-500 mb-1">{tokenInfo.symbol}</span>
        </div>
        <p className="text-[10px] text-gray-500 mt-2 font-mono">Status: {logs || "Ready"}</p>
      </div>

      {!address && (
         <button disabled className="w-full py-4 rounded-xl bg-gray-800 text-gray-500 font-bold">
           Connecting Wallet...
         </button>
      )}

      {address && timeLeft > 0 && (
        <button disabled className="w-full py-4 rounded-xl bg-gray-800 text-gray-500 font-bold border border-gray-700">
           WAIT {Math.floor(timeLeft / 60)}m {timeLeft % 60}s
        </button>
      )}

      {address && timeLeft === 0 && !proofData && (
        <button 
          onClick={handleVerify}
          disabled={isPending}
          className="w-full py-4 rounded-xl bg-blue-600 text-white font-bold shadow-lg hover:bg-blue-500 transition"
        >
          {isPending ? "Verifying..." : "👁️ VERIFY ID TO UNLOCK"}
        </button>
      )}

      {address && timeLeft === 0 && proofData && (
        <button 
          onClick={handleExecuteClaim}
          disabled={isPending}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-yellow-600 to-yellow-400 text-black font-black shadow-[0_0_20px_rgba(250,204,21,0.4)] animate-pulse"
        >
          {isPending ? "Processing..." : "💰 CLAIM REWARD NOW"}
        </button>
      )}

    </div>
  );
}