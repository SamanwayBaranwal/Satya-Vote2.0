import { useNavigate } from "react-router-dom";
import Logo from "./Logo.jsx";
import ConnectWalletButton from "./ConnectWalletButton.jsx";

/** Light glass header for the voting / results pages. */
export default function FocusTopbar({ backTo = "/elections", center, action }) {
  const navigate = useNavigate();
  return (
    <header className="glass-nav sticky top-0 z-30 border-b border-white/30">
      <div className="container-app flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(backTo)}
            className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium text-ink-700 transition hover:bg-white/60"
          >
            ← Back
          </button>
          <span className="hidden h-7 w-px bg-ink-900/10 sm:block" />
          <div className="hidden sm:block">
            <Logo to="/dashboard" />
          </div>
        </div>

        {center && <div className="hidden flex-1 items-center justify-center md:flex">{center}</div>}

        <div className="flex items-center gap-2">
          {action}
          <ConnectWalletButton />
        </div>
      </div>
    </header>
  );
}
