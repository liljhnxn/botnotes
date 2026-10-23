import { defineChain } from "viem";
import { http, createConfig } from "wagmi";
import { injected } from "wagmi/connectors";

/**
 * Custom chain configuration for Botchain Mainnet (Chain ID 677)
 * RPC: https://rpc.botchain.ai
 * Explorer: https://scan.botchain.ai
 * Currency: BOT
 */
export const botchainMainnet = defineChain({
  id: 677,
  name: "Botchain Mainnet",
  nativeCurrency: {
    decimals: 18,
    name: "BOT",
    symbol: "BOT",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.botchain.ai"],
    },
    public: {
      http: ["https://rpc.botchain.ai"],
    },
  },
  blockExplorers: {
    default: {
      name: "BotchainScan",
      url: "https://scan.botchain.ai",
    },
  },
  testnet: false,
});

// Primary chain export
export const botchain = botchainMainnet;
export const DEFAULT_CHAIN = botchainMainnet;
export const DEFAULT_CHAIN_ID = 677;
export const EXPLORER_URL = "https://scan.botchain.ai";
export const RPC_URL = "https://rpc.botchain.ai";

export const getExplorerTxUrl = (txHash: string) => `https://scan.botchain.ai/tx/${txHash}`;
export const getExplorerAddressUrl = (address: string) => `https://scan.botchain.ai/address/${address}`;

export const wagmiConfig = createConfig({
  chains: [botchainMainnet],
  connectors: [
    injected(),
  ],
  transports: {
    [botchainMainnet.id]: http("https://rpc.botchain.ai"),
  },
  ssr: true,
});
