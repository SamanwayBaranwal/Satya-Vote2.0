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
    <header className="sticky top-0 z-30 border-b border-black/5 bg-white/85 backdrop-blur">
      <div className="container-app flex h-16 items-center justify-between gap-4">
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
              className="btn-primary hidden px-4 py-2 text-sm sm:inline-flex"
            >
              Dashboard →
            </button>
          )}
          <div className={isConnected ? "" : "[&_button]:!bg-leaf [&_button]:!text-white"}>
            <ConnectWalletButton label="Connect" />
          </div>
          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="ripple rounded-none p-2 text-ink-700 transition hover:bg-black/5 md:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <Icon.X /> : <Icon.Menu />}
          </button>
        </div>
      </div>

      {/* Mobile nav — max-h accordion slide */}
      <div className={`overflow-hidden transition-all duration-300 ease-in-out md:hidden ${mobileOpen ? "max-h-96" : "max-h-0"}`}>
        <nav className="flex flex-col gap-1 border-t border-black/5 px-4 py-3">
          {LINKS.map((l) =>
            l.type === "anchor" ? (
              <a
                key={l.label}
                href={l.to}
                onClick={close}
                className="rounded-none px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-black/5"
              >
                {l.label}
              </a>
            ) : (
              <Link
                key={l.label}
                to={l.to}
                onClick={close}
                className="rounded-none px-3 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-black/5"
              >
                {l.label}
              </Link>
            )
          )}
          {isConnected ? (
            <button
              onClick={() => { navigate("/dashboard"); close(); }}
              className="btn-primary mt-2 w-full"
            >
              Dashboard →
            </button>
          ) : (
            <div className="mt-2 [&_button]:!w-full [&_button]:!bg-leaf [&_button]:!text-white">
              <ConnectWalletButton label="Connect Wallet" />
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
