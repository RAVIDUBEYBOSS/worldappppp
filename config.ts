import { http, createConfig } from 'wagmi'
import { defineChain } from 'viem'
import { injected } from 'wagmi/connectors'
import { type Chain } from 'viem'

export const worldChain = defineChain({
  id: 480,
  name: 'World Chain',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://worldchain-mainnet.g.alchemy.com/public'] },
  },
  blockExplorers: {
    default: { name: 'Worldscan', url: 'https://worldscan.org' },
  },
}) as Chain

export const config = createConfig({
  chains: [worldChain],
  connectors: [injected()],
  transports: {
    [worldChain.id]: http(),
  },
})