import { useNavigate, useLocation } from "react-router-dom";
import { useAccount, useDisconnect } from "wagmi";
import Icon, { IconTile } from "./Icons.jsx";
import { useIsAdmin } from "../hooks/useSatyaVote.js";

const short = (a) => (a ? `${a.slice(0, 6)}…${a.slice(-4)}` : "—");

const ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: Icon.Dashboard, tone: "leaf" },
  { to: "/elections", label: "Elections", icon: Icon.Ballot, tone: "saffron" },
  { to: "/results", label: "Results", icon: Icon.Results, tone: "rose" },
  { to: "/profile", label: "Profile", icon: Icon.Profile, tone: "sky" },
  { to: "/history", label: "History", icon: Icon.History, tone: "violet" },
  { to: "/settings", label: "Settings", icon: Icon.Settings, tone: "slate" },
  { to: "/help", label: "Help", icon: Icon.Help, tone: "ink" },
];

/** Modern bottom sheet (app-launcher) — replaces the left drawer on phones. */
export default function MoreSheet({ open, onClose }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { address, isConnected } = useAccount();
  const { isAdmin } = useIsAdmin();
  const { disconnect } = useDisconnect();

  const items = isAdmin
    ? [...ITEMS, { to: "/admin", label: "Admin", icon: Icon.Shield, tone: "saffron" }]
    : ITEMS;

  const go = (to) => {
    navigate(to);
    onClose();
  };

  return (
    <div className={`fixed inset-0 z-50 lg:hidden ${open ? "visible" : "invisible"}`} aria-hidden={!open}>
      {/* Scrim */}
      <div
        className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        className={`absolute inset-x-0 bottom-0 rounded-t-[28px] bg-gradient-to-b from-[#00142f] to-[#00060f] px-5 pt-3 ring-1 ring-white/10 shadow-[0_-20px_50px_-12px_rgba(0,0,0,0.6)] transition-transform duration-300 ease-out ${open ? "translate-y-0" : "translate-y-full"}`}
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 1.25rem)" }}
      >
        <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-white/20" />

        {isConnected && (
          <div className="mb-4 flex items-center gap-3 rounded-2xl bg-white/[0.05] px-3.5 py-3 ring-1 ring-white/10">
            <span className="h-9 w-9 shrink-0 rounded-full bg-gradient-to-br from-saffron via-lotus to-leaf" />
            <div className="min-w-0">
              <p className="truncate font-mono text-sm font-semibold text-white">{short(address)}</p>
              <p className="text-[11px] text-white/40">{isAdmin ? "Administrator" : "Verified Voter"}</p>
            </div>
          </div>
        )}

        <p className="mb-2 px-1 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-white/30">Menu</p>
        <div className="grid grid-cols-3 gap-2.5">
          {items.map((it) => {
            const active = pathname === it.to;
            return (
              <button
                key={it.to}
                onClick={() => go(it.to)}
                className={`flex flex-col items-center gap-2 rounded-2xl p-3 ring-1 transition active:scale-95 ${
                  active ? "bg-white/[0.1] ring-leaf/40" : "bg-white/[0.04] ring-white/10 hover:bg-white/[0.08]"
                }`}
              >
                <IconTile icon={it.icon} tone={it.tone} />
                <span className="text-[11px] font-medium text-white/80">{it.label}</span>
              </button>
            );
          })}
        </div>

        <button
          onClick={() => {
            disconnect();
            go("/");
          }}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-red-500/15 py-3 text-sm font-semibold text-red-300 ring-1 ring-red-500/20 transition hover:bg-red-500/25"
        >
          <Icon.Logout width={17} height={17} /> Disconnect Wallet
        </button>
      </div>
    </div>
  );
}
