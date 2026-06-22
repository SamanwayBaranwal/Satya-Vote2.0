import { ConnectButton } from "@rainbow-me/rainbowkit";

/**
 * Custom-styled wallet button matching the Satya Vote design.
 * size: "lg" (hero) | "sm" (nav chip)
 */
export default function ConnectWalletButton({ size = "sm", label = "Connect Wallet" }) {
  return (
    <ConnectButton.Custom>
      {({ account, chain, openAccountModal, openChainModal, openConnectModal, mounted }) => {
        const ready = mounted;
        const connected = ready && account && chain;

        if (!connected) {
          return (
            <button
              onClick={openConnectModal}
              className={size === "lg" ? "btn-primary px-7 py-3.5 text-base" : "btn-primary px-4 py-2"}
            >
              {label}
              {size === "lg" && <span aria-hidden>→</span>}
            </button>
          );
        }

        if (chain.unsupported) {
          return (
            <button onClick={openChainModal} className="btn bg-red-500 px-4 py-2 text-white hover:bg-red-600">
              Wrong network
            </button>
          );
        }

        return (
          <button
            onClick={openAccountModal}
            className="flex items-center gap-2 rounded-none bg-ink-800 px-3 py-2 text-sm font-semibold text-white ring-1 ring-white/10 transition hover:bg-ink-700"
          >
            <span className="h-6 w-6 overflow-hidden rounded-full bg-gradient-to-br from-saffron to-leaf" />
            <span className="font-mono">{account.displayName}</span>
            <span className="text-white/50">▾</span>
          </button>
        );
      }}
    </ConnectButton.Custom>
  );
}