import ConnectWalletButton from "./ConnectWalletButton.jsx";
import { ASSETS } from "../lib/design.js";

export default function ConnectPrompt({
  mascot = ASSETS.mascot.adhyakshIdle,
  title = "Connect your wallet",
  message = "Connect a wallet to continue. Adhyaksh Ji is waiting to verify you.",
}) {
  return (
    <div className="card flex flex-col items-center px-6 py-12 text-center">
      <img
        src={mascot}
        alt=""
        className="h-32 w-32 animate-float drop-shadow-xl"
        style={{ imageRendering: "pixelated" }}
      />
      <h3 className="mt-4 font-display text-lg font-bold text-ink-800">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-gray-500">{message}</p>
      <div className="mt-5 [&_button]:!bg-leaf [&_button]:!text-white">
        <ConnectWalletButton size="lg" label="Connect Wallet" />
      </div>
    </div>
  );
}
