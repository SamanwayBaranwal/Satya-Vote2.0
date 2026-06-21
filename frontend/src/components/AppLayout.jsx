import { useState } from "react";
import { useAccount } from "wagmi";
import Sidebar from "./Sidebar.jsx";
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

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-64">
            <Sidebar onNavigate={() => setOpen(false)} />
          </aside>
        </div>
      )}

      <div className="relative lg:pl-64">
        {/* Glass top bar */}
        <header className="glass-nav sticky top-0 z-20 border-b border-white/30">
          <div className="flex h-16 items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setOpen(true)}
                className="rounded-xl p-2 text-ink-700 hover:bg-white/60 lg:hidden"
                aria-label="menu"
              >
                ☰
              </button>
              <div>
                <h1 className="font-display text-lg font-extrabold leading-tight text-ink-800">{title}</h1>
                {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
              </div>
            </div>

            <div className="flex items-center gap-2">
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

        <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>

      {dialogue && <MascotBubble dialogue={dialogue} position="bottom-right" />}
    </div>
  );
}
