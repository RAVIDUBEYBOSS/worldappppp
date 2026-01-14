"use client";

import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { config } from '@/config'; // Step 2 wali file import kar rahe hain
import { useState, ReactNode } from 'react';

export default function Web3Provider({ children }: { children: ReactNode }) {
  // Query Client setup (Required for Wagmi)
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}