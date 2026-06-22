import { ASSETS } from "../lib/design.js";

const COLS = [
  { title: "Platform", items: ["Features", "How It Works", "Elections", "Results"] },
  { title: "Resources", items: ["Docs", "Whitepaper", "Security", "FAQs"] },
  { title: "Company", items: ["About Us", "Blog", "Contact", "Careers"] },
];

// Clean brand-style social marks (replaces the old unicode glyphs).
const SOCIALS = [
  {
    label: "X",
    path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.16 17.52h1.833L7.084 4.126H5.117z",
  },
  {
    label: "Telegram",
    path: "M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z",
  },
  {
    label: "GitHub",
    path: "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.5 11.5 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222 0 1.606-.014 2.898-.014 3.293 0 .322.216.694.825.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12",
  },
  {
    label: "Website",
    path: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 0c2.5 2.5 3.5 6 3.5 10s-1 7.5-3.5 10m0-20c-2.5 2.5-3.5 6-3.5 10s1 7.5 3.5 10M2 12h20",
    stroke: true,
  },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ink-900 text-white">
      <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-leaf/60 to-transparent" />
      <div className="container-app py-12">
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-5">
          {/* Brand + socials */}
          <div className="col-span-2">
            <img src={ASSETS.logoBanner} alt="Satya Vote" className="h-11 w-auto" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
              Building a transparent future where every vote truly counts.
            </p>
            <div className="mt-5 flex gap-2.5">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.06] text-white/70 ring-1 ring-white/10 transition hover:bg-leaf hover:text-white hover:ring-leaf"
                >
                  <svg
                    width="17"
                    height="17"
                    viewBox="0 0 24 24"
                    fill={s.stroke ? "none" : "currentColor"}
                    stroke={s.stroke ? "currentColor" : "none"}
                    strokeWidth={s.stroke ? 1.7 : 0}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d={s.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {COLS.map((c) => (
            <div key={c.title}>
              <h4 className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-white/40">{c.title}</h4>
              <ul className="mt-3 space-y-2.5">
                {c.items.map((i) => (
                  <li key={i}>
                    <a href="#" className="text-sm text-white/65 transition hover:text-white">
                      {i}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-app flex flex-col items-center justify-between gap-2 py-5 text-xs text-white/50 sm:flex-row">
          <p>© 2026 Satya Vote. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made in India <span>🪷</span> <span>🇮🇳</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
