import PublicNavbar from "../components/PublicNavbar.jsx";
import Footer from "../components/Footer.jsx";
import Icon from "../components/Icons.jsx";
import { ASSETS } from "../lib/design.js";

const PILLARS = [
  {
    title: "Our Mission",
    icon: Icon.Shield,
    text: "To build a future where every vote is secure, transparent and truly counts.",
  },
  {
    title: "Our Vision",
    icon: Icon.Eye,
    text: "A world where democracy is stronger, fairer and powered by truth.",
  },
  {
    title: "Our Values",
    icon: Icon.Trophy,
    text: "Transparency, integrity, security and service to the nation.",
  },
];

const STATS = [
  { value: "100%", label: "Transparent" },
  { value: "Secure", label: "by Design" },
  { value: "Built for", label: "Democracy" },
];

export default function About() {
  return (
    <div className="min-h-screen bg-canvas">
      <PublicNavbar />

      <section className="container-app grid items-center gap-10 py-14 lg:grid-cols-2 lg:py-20">
        <div>
          <p className="font-display text-sm font-bold uppercase tracking-widest text-leaf">About Satya Vote</p>
          <h1 className="mt-2 font-display text-4xl font-extrabold leading-tight text-ink-800 sm:text-5xl">
            Vote With Truth.
            <br />
            Vote With Blockchain.
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-gray-600">
            Satya Vote is built to ensure transparency, security and trust in every election using the power of
            blockchain technology. Ek Vote, Ek Sach.
          </p>
          <div className="mt-6 h-[3px] w-28 tricolor-rule" />
        </div>

        <div className="relative flex justify-center">
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-leaf-50 to-saffron/10 blur-2xl" />
          <div className="rounded-none bg-gradient-to-b from-sky-50 to-leaf-50 p-8 shadow-card ring-1 ring-black/5">
            <img src={ASSETS.illustration.tamperProof} alt="" className="h-56 w-56 animate-float" style={{ imageRendering: "pixelated" }} />
          </div>
        </div>
      </section>

      <section className="container-app grid gap-5 pb-10 md:grid-cols-3">
        {PILLARS.map((p) => (
          <div key={p.title} className="card p-7">
            <div className="flex h-12 w-12 items-center justify-center rounded-none bg-leaf-50 text-leaf">
              <p.icon width={24} height={24} />
            </div>
            <h3 className="mt-4 font-display text-lg font-bold text-ink-800">{p.title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-gray-600">{p.text}</p>
          </div>
        ))}
      </section>

      <section className="container-app pb-16">
        <div className="card grid gap-4 bg-ink-800 p-8 text-center sm:grid-cols-3">
          {STATS.map((s) => (
            <div key={s.label}>
              <div className="font-display text-3xl font-extrabold text-white">{s.value}</div>
              <div className="text-sm text-white/60">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
