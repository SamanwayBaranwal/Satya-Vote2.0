import { NavLink } from "react-router-dom";
import Icon from "./Icons.jsx";

/**
 * Mobile bottom tab bar (phone-style). Hidden on lg+ where the sidebar shows.
 * Five slots: four primary routes + a "More" tab that opens the full drawer.
 */
const TABS = [
  { to: "/dashboard", label: "Home", icon: Icon.Dashboard },
  { to: "/elections", label: "Vote", icon: Icon.Ballot },
  { to: "/results", label: "Results", icon: Icon.Results },
  { to: "/profile", label: "Profile", icon: Icon.Profile },
];

function Tab({ to, label, icon: I }) {
  return (
    <NavLink
      to={to}
      end={to === "/results"}
      className={({ isActive }) =>
        `ripple flex flex-1 flex-col items-center justify-center gap-1 py-2 text-[10px] font-semibold transition ${
          isActive ? "text-leaf" : "text-white/55 active:text-white"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <span
            className={`flex h-7 w-12 items-center justify-center rounded-full transition ${
              isActive ? "bg-leaf/15" : ""
            }`}
          >
            <I width={21} height={21} />
          </span>
          <span className="tracking-wide">{label}</span>
        </>
      )}
    </NavLink>
  );
}

export default function BottomNav({ onMore }) {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-[#000F26]/95 backdrop-blur-xl lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="mx-auto flex max-w-md items-stretch">
        {TABS.map((t) => (
          <Tab key={t.to} {...t} />
        ))}
        <button
          onClick={onMore}
          className="ripple flex flex-1 flex-col items-center justify-center gap-1 py-2 text-[10px] font-semibold text-white/55 transition active:text-white"
          aria-label="More menu"
        >
          <span className="flex h-7 w-12 items-center justify-center rounded-full">
            <Icon.Menu width={21} height={21} />
          </span>
          <span className="tracking-wide">More</span>
        </button>
      </div>
    </nav>
  );
}
