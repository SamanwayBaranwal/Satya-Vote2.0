import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { sepolia, hardhat } from "wagmi/chains";

// WalletConnect projectId — get one free at https://cloud.walletconnect.com
// MetaMask / injected wallets work even without it; only the WC QR option needs it.
const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || "satya_vote_dev_placeholder";

// hardhat is listed first so local dev connects to chainId 31337 by default.
export const config = getDefaultConfig({
  appName: "Satya Vote",
  projectId,
  chains: [hardhat, sepolia],
  ssr: false,
});
