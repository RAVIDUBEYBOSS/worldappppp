import { http, createConfig } from 'wagmi'
import { worldchain, optimism } from 'wagmi/chains'
import { injected } from 'wagmi/connectors' // 👈 Ye Import Zaruri hai

export const config = createConfig({
  chains: [worldchain, optimism],
  // 🟢 Ye line batati hai ki Pop-up wala connector use karo
  connectors: [
    injected(), 
  ],
  transports: {
    [worldchain.id]: http(),
    [optimism.id]: http(),
  },
})