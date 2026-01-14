"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { MiniKit } from "@worldcoin/minikit-js";

// Context Type definition
interface MiniKitContextType {
  address: string | null;
  isLoading: boolean;
  connectWallet: () => Promise<void>;
  username: string | null;
}

const MiniKitContext = createContext<MiniKitContextType | undefined>(undefined);

// Hook to use the context anywhere
export const useMiniKit = () => {
  const context = useContext(MiniKitContext);
  if (!context) {
    throw new Error("useMiniKit must be used within a MiniKitProvider");
  }
  return context;
};

export default function MiniKitProvider({ children }: { children: ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // 1. Install MiniKit
    // Replace with YOUR APP ID
    MiniKit.install("app_2c1431f3763f1f4ac07163fd2001e377");

    // 2. Check Immediately on Load
    const checkConnection = () => {
        const addr = (MiniKit as any).walletAddress;
        const user = (MiniKit as any).user?.username;
        if (addr) {
            setAddress(addr);
            setUsername(user || null);
        }
    };
    
    checkConnection();
    // Backup check just in case injection is slow
    setTimeout(checkConnection, 1000);

  }, []);

  const connectWallet = async () => {
    if (!MiniKit.isInstalled()) return;
    
    setIsLoading(true);
    try {
      const res: any = await MiniKit.commandsAsync.walletAuth({
        nonce: crypto.randomUUID().replace(/-/g, ""),
        requestId: "0",
        expirationTime: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
        notBefore: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
      });

      if (res?.finalPayload?.status === "success") {
        // Force update state
        const addr = (MiniKit as any).walletAddress || res.finalPayload.address;
        const user = (MiniKit as any).user?.username;
        
        if (addr) {
            setAddress(addr);
            setUsername(user);
        } else {
            // Fallback Reload if address is missing
            window.location.reload();
        }
      }
    } catch (error) {
      console.error("Login Failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MiniKitContext.Provider value={{ address, isLoading, connectWallet, username }}>
      {children}
    </MiniKitContext.Provider>
  );
}