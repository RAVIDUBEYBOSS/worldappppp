"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { WagmiProvider } from "wagmi";
import { config } from "@/config"; // Tumhara config file path check karlena
import { MiniKit } from "@worldcoin/minikit-js"; // ✅ MiniKit Import

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  // 🔥 MiniKit Install Logic
  useEffect(() => {
    try {
      MiniKit.install(); 
      console.log("MiniKit Installed Successfully!");
    } catch (e) {
      console.error("MiniKit Install Failed:", e);
    }
  }, []);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {/* Wagmi aur Query ke andar Children render honge */}
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}