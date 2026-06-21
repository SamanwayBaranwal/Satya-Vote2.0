import { Link } from "react-router-dom";
import { ASSETS } from "../lib/design.js";

export default function Logo({ light = false, to = "/" }) {
  return (
    <Link to={to} className="flex items-center gap-2.5 group">
      <img
        src={ASSETS.logoIcon}
        alt="Satya Vote"
        className="h-9 w-9 transition-transform group-hover:scale-105"
        style={{ imageRendering: "pixelated" }}
      />
      <div className="leading-none">
        <div className="font-display text-lg font-extrabold tracking-tight">
          <span className={light ? "text-white" : "text-ink-800"}>SATYA</span>{" "}
          <span className="text-leaf">VOTE</span>
        </div>
        <div className={`text-[10px] font-medium ${light ? "text-white/60" : "text-gray-500"}`}>
          Ek Vote, Ek Sach
        </div>
      </div>
    </Link>
  );
}