import { NavLink, useNavigate, Link } from "react-router-dom";
import { useAccount, useDisconnect } from "wagmi";
import Icon from "./Icons.jsx";
import { ASSETS } from "../lib/design.js";
import { useIsAdmin } from "../hooks/useSatyaVote.js";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: Icon.Dashboard },
  { to: "/elections", label: "Elections", icon: Icon.Ballot },
  { to: "/profile", label: "My Profile", icon: Icon.Profile },
  { to: "/history", label: "Vote History", icon: Icon.History },
  { to: "/results", label: "Results", icon: Icon.Results },
];

const SECONDARY = [
  { to: "/settings", label: "Settings", icon: Icon.Settings },
  { to: "/help", label: "Help & Support", icon: Icon.Help },
];

const short = (a) => (a ? `${a.slice(0, 6)}…${a.slice(-4)}` : "—");

function Item({ to, label, icon: I }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
          isActive
            ? "bg-gradient-to-r from-leaf to-leaf-600 text-white shadow-[0_10px_24px_-10px_rgba(22,163,74,0.85)]"
            : "text-white/55 hover:bg-white/[0.06] hover:text-white"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <span
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition ${
              isActive ? "bg-white/20" : "bg-white/[0.05] group-hover:bg-white/10"
            }`}
          >
            <I width={18} height={18} />
          </span>
          {label}
        </>
      )}
    </NavLink>
  );
}

export default function Sidebar({ onNavigate }) {
  const { isAdmin } = useIsAdmin();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const navigate = useNavigate();

  return (
    <div
      className="flex h-full flex-col bg-gradient-to-b from-[#00142f] via-[#000d22] to-[#00070f] px-3.5 py-5 ring-1 ring-white/[0.06]"
      onClick={onNavigate}
    >
      <Link to="/dashboard" className="block px-1.5">
        <img src={ASSETS.logoBanner} alt="Satya Vote" className="h-11 w-auto" />
      </Link>

      <p className="mt-7 px-2 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-white/30">Menu</p>
      <nav className="mt-2 space-y-1">
        {NAV.map((n) => (
          <Item key={n.to} {...n} />
        ))}
        {isAdmin && (
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-saffron to-[#f97316] text-ink-900 shadow-[0_10px_24px_-10px_rgba(255,153,51,0.85)]"
                  : "text-saffron/85 hover:bg-white/[0.06]"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${isActive ? "bg-black/15" : "bg-saffron/10"}`}>
                  <Icon.Shield width={18} height={18} />
                </span>
                Admin Panel
              </>
            )}
          </NavLink>
        )}
      </nav>

      <p className="mt-6 px-2 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-white/30">General</p>
      <nav className="mt-2 space-y-1">
        {SECONDARY.map((n) => (
          <Item key={n.to} {...n} />
        ))}
      </nav>

      <div className="mt-auto pt-5">
        {isConnected && (
          <div className="mb-2 flex items-center gap-3 rounded-xl bg-white/[0.04] px-3 py-2.5 ring-1 ring-white/10">
            <span className="h-8 w-8 shrink-0 rounded-full bg-gradient-to-br from-saffron via-lotus to-leaf" />
            <div className="min-w-0">
              <p className="truncate font-mono text-xs font-semibold text-white">{short(address)}</p>
              <p className="text-[10px] text-white/40">{isAdmin ? "Administrator" : "Verified Voter"}</p>
            </div>
          </div>
        )}
        <button
          onClick={() => {
            disconnect();
            navigate("/");
          }}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/55 transition hover:bg-red-500/15 hover:text-red-300"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.05]">
            <Icon.Logout width={18} height={18} />
          </span>
          Logout
        </button>
      </div>
    </div>
  );
}
