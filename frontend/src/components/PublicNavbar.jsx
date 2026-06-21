import { Link, useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";
import Logo from "./Logo.jsx";
import ConnectWalletButton from "./ConnectWalletButton.jsx";

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

  return (
    <header className="sticky top-0 z-30 border-b border-black/5 bg-white/85 backdrop-blur">
      <div className="container-app flex h-16 items-center justify-between gap-4">
        <Logo />
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
            <button onClick={() => navigate("/dashboard")} className="btn-primary px-4 py-2 text-sm">
              Dashboard →
            </button>
          )}
          <div className={isConnected ? "" : "[&_button]:!bg-leaf [&_button]:!text-white"}>
            <ConnectWalletButton label="Connect Wallet" />
          </div>
        </div>
      </div>
    </header>
  );
}
