import { useNavigate } from "react-router-dom";
import PublicNavbar from "../components/PublicNavbar.jsx";
import Footer from "../components/Footer.jsx";
import ConnectWalletButton from "../components/ConnectWalletButton.jsx";
import CountdownTimer from "../components/CountdownTimer.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import Icon, { IconTile } from "../components/Icons.jsx";
import { ASSETS } from "../lib/design.js";
import { useElections } from "../hooks/useSatyaVote.js";
import { statusOf } from "../lib/contract.js";

const STATS = [
  { value: "125+", label: "Elections Conducted", sub: "Across India", icon: Icon.Ballot, tone: "leaf" },
  { value: "45,000+", label: "Registered Voters", sub: "And Growing", icon: Icon.Profile, tone: "sky" },
  { value: "320,000+", label: "Votes Cast", sub: "Secured on Blockchain", icon: Icon.Results, tone: "saffron" },
];

const FEATURES = [
  {
    title: "Secure",
    icon: Icon.Shield,
    tone: "leaf",
    desc: "Blockchain-powered security ensures your vote is safe and tamper-proof.",
  },
  {
    title: "Transparent",
    icon: Icon.Eye,
    tone: "sky",
    desc: "Every vote is verifiable on-chain. Total transparency, always.",
  },
  {
    title: "Verified",
    icon: Icon.Badge,
    tone: "violet",
    desc: "Verified voters only. One person, one vote, no exceptions.",
  },
];

const STEPS = [
  { n: 1, title: "Connect Wallet", icon: Icon.Lock, tone: "leaf" },
  { n: 2, title: "Verify Identity", icon: Icon.Badge, tone: "sky" },
  { n: 3, title: "Cast Your Vote", icon: Icon.Ballot, tone: "saffron" },
  { n: 4, title: "Stored on Blockchain", icon: Icon.Shield, tone: "violet" },
  { n: 5, title: "View Results", icon: Icon.Results, tone: "rose" },
];

export default function Landing() {
  const navigate = useNavigate();
  const { elections } = useElections();
  const live = elections.filter((e) => statusOf(e) !== 2).slice(0, 3);

  return (
    <div className="min-h-screen bg-canvas">
      <PublicNavbar />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="container-app grid items-center gap-10 py-14 lg:grid-cols-2 lg:py-20">
          <div>
            <h1 className="font-display text-4xl font-extrabold leading-[1.1] tracking-tight text-ink-800 sm:text-5xl lg:text-6xl">
              Vote With Truth.
              <br />
              Vote With Blockchain.
            </h1>
            <p className="mt-4 font-display text-2xl font-bold text-leaf sm:text-3xl">Ek Vote, Ek Sach</p>
            <p className="mt-5 max-w-md text-base leading-relaxed text-gray-600">
              Satya Vote is a transparent, tamper-proof and decentralized voting platform built on
              blockchain for a stronger democracy.
            </p>
            <div className="mt-7 [&_button]:!bg-leaf [&_button]:!text-white">
              <ConnectWalletButton size="lg" label="Connect Wallet & Vote" />
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm font-medium text-gray-600">
              <span className="flex items-center gap-1.5">
                <Dot /> 100% Secure
              </span>
              <span className="flex items-center gap-1.5">
                <Dot /> Transparent
              </span>
              <span className="flex items-center gap-1.5">
                <Dot /> Verifiable
              </span>
            </div>
          </div>

          {/* Hero visual */}
          <div className="relative">
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-leaf-50 via-white to-saffron/10 blur-2xl" />
            <div className="relative overflow-hidden rounded-none shadow-lift ring-1 ring-black/5">
              <img
                src={ASSETS.heroMain}
                alt="Adhyaksh presiding over the election at Parliament"
                className="h-full w-full animate-float object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* STATS + FEATURES */}
      <section id="features" className="container-app pb-6">
        <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
          {STATS.map((s) => (
            <div key={s.label} className="card-soft flex items-center gap-4 p-4 sm:p-5">
              <IconTile icon={s.icon} tone={s.tone} size="lg" />
              <div className="min-w-0">
                <div className="font-display text-2xl font-extrabold leading-none text-ink-800">{s.value}</div>
                <div className="mt-1 text-sm font-semibold text-ink-800">{s.label}</div>
                <div className="text-xs text-gray-500">{s.sub}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-3 grid gap-3 sm:mt-4 sm:grid-cols-3 sm:gap-4">
          {FEATURES.map((f) => (
            <div key={f.title} className="card-soft flex items-start gap-4 p-5 hover:-translate-y-0.5 hover:shadow-lift sm:block">
              <IconTile icon={f.icon} tone={f.tone} size="lg" />
              <div className="min-w-0 sm:mt-3">
                <h3 className="text-base font-bold text-ink-800">{f.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-gray-500">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="container-app py-10 sm:py-12">
        <div className="card-soft p-5 sm:p-8">
          <h2 className="text-center font-display text-2xl font-extrabold text-ink-800">How It Works</h2>
          <div className="mx-auto mt-1 h-[3px] w-24 tricolor-rule" />

          {/* Mobile: modern vertical timeline */}
          <ol className="relative mt-7 space-y-3 md:hidden">
            <span
              aria-hidden
              className="absolute bottom-5 left-[19px] top-5 w-0.5 bg-gradient-to-b from-leaf via-saffron to-lotus/50"
            />
            {STEPS.map((s) => (
              <li key={s.n} className="relative flex items-center gap-3.5">
                <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink-800 font-display text-sm font-bold text-white ring-4 ring-white">
                  {s.n}
                </span>
                <div className="flex flex-1 items-center gap-3 rounded-xl bg-gray-50 p-3 ring-1 ring-black/5">
                  <IconTile icon={s.icon} tone={s.tone} size="sm" />
                  <p className="text-sm font-semibold text-ink-800">{s.title}</p>
                </div>
              </li>
            ))}
          </ol>

          {/* Desktop: horizontal flow */}
          <div className="mt-8 hidden items-center justify-between gap-4 md:flex">
            {STEPS.map((s, i) => (
              <div key={s.n} className="flex flex-1 items-center">
                <div className="flex flex-1 flex-col items-center text-center">
                  <IconTile icon={s.icon} tone={s.tone} size="lg" />
                  <p className="mt-2 text-sm font-semibold text-ink-800">
                    {s.n}. {s.title}
                  </p>
                </div>
                {i < STEPS.length - 1 && <span className="text-2xl text-gray-300">→</span>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LIVE ELECTIONS */}
      <section id="elections" className="container-app pb-16">
        <div className="card-soft p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl font-extrabold text-ink-800">Live Elections</h2>
            <button onClick={() => navigate("/elections")} className="text-sm font-semibold text-leaf hover:text-leaf-600">
              View All Elections →
            </button>
          </div>

          {live.length === 0 ? (
            <div className="mt-6 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/60 px-6 py-10 text-center">
              <img src={ASSETS.empty.noElections} alt="" className="mx-auto h-44 w-44 opacity-95 sm:h-52 sm:w-52" style={{ imageRendering: "pixelated" }} />
              <p className="mt-3 font-display font-bold text-ink-800">No live elections right now</p>
              <p className="text-sm text-gray-500">Connect your wallet — new elections will appear here the moment they go live.</p>
            </div>
          ) : (
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {live.map((e) => (
                <button
                  key={e.id}
                  onClick={() => navigate(`/vote/${e.id}`)}
                  className="card-soft bg-gradient-to-b from-white to-gray-50 p-5 text-left hover:-translate-y-0.5 hover:shadow-lift"
                >
                  <StatusBadge status={statusOf(e)} />
                  <h3 className="mt-3 font-display text-base font-bold text-ink-800">{e.title}</h3>
                  <p className="text-xs text-gray-500">{e.organization}</p>
                  <p className="mt-4 text-[11px] font-semibold uppercase tracking-wide text-gray-400">Ends in</p>
                  <div className="mt-1">
                    <CountdownTimer target={e.endTime} variant="dark" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

function Dot() {
  return <span className="flex h-4 w-4 items-center justify-center rounded-full bg-leaf text-[9px] text-white">✓</span>;
}