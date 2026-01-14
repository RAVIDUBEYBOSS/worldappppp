"use client";
import { MiniKit, ResponseEvent, VerificationLevel, ISuccessResult } from "@worldcoin/minikit-js";
import { useEffect, useState } from "react";
import AdBannerTop from "@/components/AdBannerTop";
import Navbar from "@/components/Navbar";
import AdWallSplit from "@/components/AdWallSplit";
import Ticker from "@/components/Ticker";
export default function Home() {
  const [status, setStatus] = useState("Ready to Verify");
  const [isVerified, setIsVerified] = useState(false);
  const [userId, setUserId] = useState("");

  // 1. LISTENER (Kaan lagakar sunne wala code)
  useEffect(() => {
    // Debugging ke liye log
    console.log("👀 Listener Active: Waiting for World App response...");

    // NOTE: Maine yahan se 'if (!MiniKit.isInstalled())' hata diya hai 
    // taaki race condition na ho. Ab ye hamesha sunega.

    MiniKit.subscribe(ResponseEvent.MiniAppVerifyAction, async (response) => {
      console.log("🔥 RESPONSE RECEIVED FROM WORLD APP:", response);

      if (response.status === "error") {
        console.log("❌ Error:", response);
        setStatus("❌ Verification Failed / Cancelled");
        return;
      }

      if (response.status === "success") {
        console.log("✅ Success! Payload:", response);
        const payload = response as ISuccessResult;
        
        // Data save kar rahe hain
        setUserId(payload.nullifier_hash);
        setIsVerified(true); // Screen change trigger
        setStatus("✅ Verification Successful!");
      }
    });

    return () => {
      MiniKit.unsubscribe(ResponseEvent.MiniAppVerifyAction);
    };
  }, []);

  // 2. ACTION (Button dabane par kya hoga)
  const handleVerify = async () => {
    // Yahan check karna theek hai kyunki user button tabhi dabayega jab app load ho chuki hogi
    if (!MiniKit.isInstalled()) {
      setStatus("Error: MiniKit not installed (Are you in World App?)");
      return;
    }

    setStatus("Waiting for approval in World App...");
    
    // Command Bhejo
    MiniKit.commands.verify({
      action: "consult-orb", // ⚠️ IMPORTANT: Developer Portal par action name 'consult-orb' hi hona chahiye
      verification_level: VerificationLevel.Orb,
    });
  };

  // 3. DASHBOARD UI (Login ke baad)
  if (isVerified) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-green-900 text-white p-5">
        <h1 className="text-4xl font-bold mb-4">🎉 Approved!</h1>
        <Ticker />
        <AdBannerTop />
        <AdWallSplit/>

        <p className="text-lg mb-8 text-center">Welcome to the Secret Dashboard</p>
        
        <div className="bg-black p-6 rounded-xl border border-green-500 w-full break-all max-w-sm">
          <p className="text-sm text-gray-400 mb-2">Your World ID Hash:</p>
          <code className="text-green-400 font-mono text-xs">{userId}</code>
        </div>

        <button 
          onClick={() => window.location.reload()}
          className="mt-10 bg-white text-green-900 px-6 py-3 rounded-full font-bold hover:bg-gray-200"
        >
          Logout
        </button>
      </div>
    );
  }

  // 4. LOGIN UI (Pehle ye dikhega)
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-5">
      <h1 className="text-3xl font-bold mb-10 text-blue-500">World Mini App</h1>
      
      <div className="bg-gray-900 p-8 rounded-2xl border border-gray-700 text-center w-full max-w-sm shadow-2xl">
        <div className="mb-6 h-12 flex items-center justify-center">
             <p className="text-yellow-400 font-mono text-sm">{status}</p>
        </div>
        
        <button
          onClick={handleVerify}
          className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-gray-200 transition transform active:scale-95"
        >
          Verify with World ID
        </button>
      </div>
    </div>
  );
}