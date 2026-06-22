import { useState } from "react";
import { useAccount } from "wagmi";
import Sidebar from "./Sidebar.jsx";
import BottomNav from "./BottomNav.jsx";
import MoreSheet from "./MoreSheet.jsx";
import Icon from "./Icons.jsx";
import ConnectWalletButton from "./ConnectWalletButton.jsx";
import MascotBubble from "./MascotBubble.jsx";
import AuroraBackground from "./AuroraBackground.jsx";

/**
 * Shared app shell: fixed sidebar + glass top bar + content over an aurora bg.
 * props: title, subtitle, dialogue (mascot), children.
 */
export default function AppLayout({ title, subtitle, dialogue, children }) {
  const [open, setOpen] = useState(false);
  const { isConnected } = useAccount();

  return (
    <div className="relative min-h-screen grid-bg">
      <AuroraBackground />

      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 lg:block">
        <Sidebar />
      </aside>

      {/* Mobile menu — modern bottom sheet (replaces the old left drawer) */}
      <MoreSheet open={open} onClose={() => setOpen(false)} />

      <div className="relative lg:pl-64">
        {/* Glass top bar */}
        <header className="glass-nav sticky top-0 z-20 border-b border-white/30">
          <div className="flex h-16 items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <div className="min-w-0">
                <h1 className="truncate font-display text-base font-extrabold leading-tight text-ink-800 sm:text-lg">{title}</h1>
                {subtitle && <p className="truncate text-xs text-gray-500">{subtitle}</p>}
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <button className="relative rounded-full p-2.5 text-ink-700 ring-1 ring-white/60 transition hover:bg-white/60">
                <Icon.Bell />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-lotus" />
              </button>
              <div className={isConnected ? "" : "[&_button]:!bg-leaf [&_button]:!text-white"}>
                <ConnectWalletButton label="Connect Wallet" />
              </div>
            </div>
          </div>
        </header>

        <main className="px-4 py-6 pb-28 sm:px-6 lg:px-8 lg:pb-6">{children}</main>
      </div>

      {/* Mobile bottom tab bar — app-style nav from the sidebar */}
      <BottomNav onMore={() => setOpen(true)} />

      {dialogue && <MascotBubble dialogue={dialogue} position="bottom-right" />}
    </div>
  );
}
