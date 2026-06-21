import { ASSETS } from "../lib/design.js";

const COLS = [
  { title: "Platform", items: ["Features", "How It Works", "Elections", "Results"] },
  { title: "Resources", items: ["Docs", "Whitepaper", "Security", "FAQs"] },
  { title: "Company", items: ["About Us", "Blog", "Contact", "Careers"] },
];

export default function Footer() {
  return (
    <footer className="bg-ink-900 text-white">
      <div className="container-app grid grid-cols-2 gap-8 py-12 md:grid-cols-5">
        <div className="col-span-2 md:col-span-2">
          <img src={ASSETS.logoBanner} alt="Satya Vote" className="h-11 w-auto" />
          <p className="mt-4 max-w-xs text-sm text-white/60">
            Building a transparent future where every vote truly counts.
          </p>
        </div>
        {COLS.map((c) => (
          <div key={c.title}>
            <h4 className="text-sm font-bold text-white">{c.title}</h4>
            <ul className="mt-3 space-y-2">
              {c.items.map((i) => (
                <li key={i}>
                  <a href="#" className="text-sm text-white/55 transition hover:text-white">
                    {i}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div>
          <h4 className="text-sm font-bold text-white">Connect</h4>
          <div className="mt-3 flex gap-2">
            {["𝕏", "✈", "⌥", "◇"].map((s, i) => (
              <a
                key={i}
                href="#"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-sm text-white/70 transition hover:bg-leaf hover:text-white"
              >
                {s}
              </a>
            ))}
          </div>
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