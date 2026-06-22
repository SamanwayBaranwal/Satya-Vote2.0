import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";
import Logo from "./Logo.jsx";
import ConnectWalletButton from "./ConnectWalletButton.jsx";
import Icon from "./Icons.jsx";

// type: "anchor" scrolls on the landing page; "route" navigates.
const LINKS = [
  { label: "Features", to: "/#features", type: "anchor" },
  { label: "How It Works", to: "/#how-it-works", type: "anchor" },
  { label: "Elections", to: "/elections", type: "route" },
  { label: "Results", to: "/results", type: "route" },
  { label: "Docs", to: "/help", type: "route" },
  { label: "About", to: "/about", type: "route" },
];

export default function PublicNavbar() {
  const { isConnected } = useAccount();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const close = () => setMobileOpen(false);

  return (
    <header className="sticky top-0 z-30 px-3 pt-3 sm:px-4">
      <div className="mx-auto max-w-7xl">
        {/* Floating glass pill */}
        <div className="flex h-14 items-center justify-between gap-3 rounded-2xl border border-black/[0.06] bg-white/80 px-3 shadow-[0_10px_30px_-14px_rgba(12,26,43,0.3)] backdrop-blur-xl sm:h-16 sm:px-5">
          <Logo />

          {/* Desktop nav */}
          <nav className="hidden items-center gap-7 md:flex">
            {LINKS.map((l) =>
              l.type === "anchor" ? (
                <a key={l.label} href={l.to} className="text-sm font-medium text-gray-600 transition-colors hover:text-ink-800">
                  {l.label}
                </a>
              ) : (
                <Link key={l.label} to={l.to} className="text-sm font-medium text-gray-600 transition-colors hover:text-ink-800">
                  {l.label}
                </Link>
              )
            )}
          </nav>

          <div className="flex items-center gap-2">
            {isConnected && (
              <button
                onClick={() => navigate("/dashboard")}
                className="btn-primary hidden !rounded-xl px-4 py-2 text-sm sm:inline-flex"
              >
                Dashboard →
              </button>
            )}
            <div className={`[&_button]:!rounded-xl ${isConnected ? "" : "[&_button]:!bg-leaf [&_button]:!text-white"}`}>
              <ConnectWalletButton label="Connect" />
            </div>
            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="ripple flex h-9 w-9 items-center justify-center rounded-xl text-ink-700 ring-1 ring-black/10 transition hover:bg-black/5 md:hidden"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              {mobileOpen ? <Icon.X /> : <Icon.Menu />}
            </button>
          </div>
        </div>

        {/* Mobile nav — floating dropdown card */}
        <div className={`overflow-hidden transition-all duration-300 ease-in-out md:hidden ${mobileOpen ? "mt-2 max-h-[560px]" : "max-h-0"}`}>
          <nav className="flex flex-col gap-1 rounded-2xl border border-black/[0.06] bg-white/95 p-3 shadow-[0_12px_30px_-14px_rgba(12,26,43,0.3)] backdrop-blur-xl">
            {LINKS.map((l) => {
              const cls =
                "group flex items-center justify-between rounded-xl px-4 py-3 text-[15px] font-semibold text-ink-800 transition hover:bg-leaf-50 hover:text-leaf";
              const arrow = <span className="text-gray-300 transition group-hover:translate-x-0.5 group-hover:text-leaf">→</span>;
              return l.type === "anchor" ? (
                <a key={l.label} href={l.to} onClick={close} className={cls}>
                  {l.label}
                  {arrow}
                </a>
              ) : (
                <Link key={l.label} to={l.to} onClick={close} className={cls}>
                  {l.label}
                  {arrow}
                </Link>
              );
            })}
            <div className="my-2 border-t border-black/5" />
            {isConnected ? (
              <button
                onClick={() => { navigate("/dashboard"); close(); }}
                className="btn-primary w-full !rounded-xl py-3.5 text-base"
              >
                Dashboard →
              </button>
            ) : (
              <div className="[&_button]:!w-full [&_button]:!rounded-xl [&_button]:!bg-leaf [&_button]:!py-3.5 [&_button]:!text-base [&_button]:!text-white">
                <ConnectWalletButton label="Connect Wallet" />
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
