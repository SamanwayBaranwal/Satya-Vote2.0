import { ASSETS } from "../lib/design.js";

const COLS = [
  { title: "Platform", items: ["Features", "How It Works", "Elections", "Results"] },
  { title: "Resources", items: ["Docs", "Whitepaper", "Security", "FAQs"] },
  { title: "Company", items: ["About Us", "Blog", "Contact", "Careers"] },
];

// Real social links only.
const SOCIALS = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/samanway-baranwal-a40886297",
    path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z",
  },
  {
    label: "X",
    href: "https://x.com/0xSamanway",
    path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.16 17.52h1.833L7.084 4.126H5.117z",
  },
  {
    label: "Telegram",
    href: "https://t.me/SamanwayDeFi",
    path: "M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z",
  },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-[#0c1a2b] text-white">
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
                  href={s.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={s.label}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.06] text-white/70 ring-1 ring-white/10 transition hover:bg-leaf hover:text-white hover:ring-leaf"
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
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
          <p className="text-white/40">Built by Samanway</p>
          <p className="flex items-center gap-1">
            Made in India <span>🪷</span> <span>🇮🇳</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
