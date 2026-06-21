import { NavLink, useNavigate, Link } from "react-router-dom";
import { useDisconnect } from "wagmi";
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

function Item({ to, label, icon: I }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${
          isActive ? "bg-leaf text-white shadow-sm" : "text-white/65 hover:bg-white/5 hover:text-white"
        }`
      }
    >
      <I />
      {label}
    </NavLink>
  );
}

export default function Sidebar({ onNavigate }) {
  const { isAdmin } = useIsAdmin();
  const { disconnect } = useDisconnect();
  const navigate = useNavigate();

  return (
    <div className="flex h-full flex-col bg-ink-900 px-4 py-6" onClick={onNavigate}>
      <Link to="/dashboard" className="block px-1">
        <img src={ASSETS.logoBanner} alt="Satya Vote" className="h-12 w-auto" />
      </Link>

      <nav className="mt-8 space-y-1">
        {NAV.map((n) => (
          <Item key={n.to} {...n} />
        ))}
        {isAdmin && (
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition ${
                isActive ? "bg-saffron text-ink-900" : "text-saffron/85 hover:bg-white/5"
              }`
            }
          >
            <Icon.Shield />
            Admin Panel
          </NavLink>
        )}
      </nav>

      <div className="my-5 border-t border-white/10" />

      <nav className="space-y-1">
        {SECONDARY.map((n) => (
          <Item key={n.to} {...n} />
        ))}
      </nav>

      <div className="mt-auto">
        <button
          onClick={() => {
            disconnect();
            navigate("/");
          }}
          className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-white/65 transition hover:bg-red-500/15 hover:text-red-300"
        >
          <Icon.Logout />
          Logout
        </button>
      </div>
    </div>
  );
}
