import { useEffect, useMemo, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useChainId } from "wagmi";
import confetti from "canvas-confetti";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import FocusTopbar from "../components/FocusTopbar.jsx";
import MascotBubble from "../components/MascotBubble.jsx";
import AuroraBackground from "../components/AuroraBackground.jsx";
import CandidateAvatar from "../components/CandidateAvatar.jsx";
import EmptyState from "../components/EmptyState.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import { ASSETS, DIALOGUE, NETWORK } from "../lib/design.js";
import { statusOf, STATUS, getContractAddress } from "../lib/contract.js";
import { useElection, useCandidates } from "../hooks/useSatyaVote.js";

const BAR_COLORS = ["#16a34a", "#3b82f6", "#f59e0b", "#a855f7", "#ec4899"];

export default function Results() {
  const { id } = useParams();
  const navigate = useNavigate();
  const chainId = useChainId();
  const { election } = useElection(id);
  const { candidates } = useCandidates(id);
  const firedRef = useRef(false);

  const sorted = useMemo(
    () => [...candidates].sort((a, b) => Number(b.voteCount) - Number(a.voteCount)),
    [candidates]
  );
  const winner = sorted[0];
  const totalVotes = candidates.reduce((s, c) => s + Number(c.voteCount), 0);
  const status = election ? statusOf(election) : STATUS.ENDED;

  const chartData = candidates.map((c) => ({
    name: c.name.split(" ")[0],
    votes: Number(c.voteCount),
    id: Number(c.id),
  }));

  // Confetti once when an ended election has a real winner.
  useEffect(() => {
    if (firedRef.current) return;
    if (status === STATUS.ENDED && winner && Number(winner.voteCount) > 0) {
      firedRef.current = true;
      fireConfetti();
    }
  }, [status, winner]);

  const explorer = NETWORK.sepolia.explorer;
  const contractAddr = getContractAddress(chainId);

  return (
    <div className="relative min-h-screen grid-bg pb-20">
      <AuroraBackground />
      <FocusTopbar backTo="/results" />

      <main className="relative container-app py-7">
        {!election ? (
          <EmptyState image={ASSETS.empty.noElections} title="Election not found" message="This election does not exist." />
        ) : (
          <>
            <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="font-display text-2xl font-extrabold text-ink-800">{election.title}</h1>
                  <StatusBadge status={status} />
                </div>
                <p className="text-sm text-gray-500">
                  {election.organization} · {totalVotes} total votes ·{" "}
                  {status === STATUS.LIVE ? "Live results, updating in real-time" : "Final results"}
                </p>
              </div>
              {contractAddr && (
                <a
                  href={`${explorer}/address/${contractAddr}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-ghost text-sm"
                >
                  🔍 Audit on Etherscan ↗
                </a>
              )}
            </div>

            {totalVotes === 0 ? (
              <div className="mt-6">
                <EmptyState
                  image={ASSETS.empty.noVoteHistory}
                  title="No votes cast yet"
                  message="Once voting begins, live results will appear here in real-time."
                />
              </div>
            ) : (
              <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
                {/* Bar chart */}
                <section className="card p-6">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500">Vote Distribution</h2>
                  <div className="mt-4 h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef0f2" />
                        <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                        <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                        <Tooltip
                          cursor={{ fill: "rgba(22,163,74,0.06)" }}
                          contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 8px 24px rgba(12,26,43,0.12)" }}
                        />
                        <Bar dataKey="votes" radius={[8, 8, 0, 0]} maxBarSize={64}>
                          {chartData.map((entry, i) => (
                            <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Ranked list */}
                  <div className="mt-4 space-y-2">
                    {sorted.map((c, i) => {
                      const pct = totalVotes ? Math.round((Number(c.voteCount) / totalVotes) * 100) : 0;
                      return (
                        <div key={c.id} className="flex items-center gap-3">
                          <span className="w-4 text-sm font-bold text-gray-400">{i + 1}</span>
                          <CandidateAvatar name={c.name} imageURI={c.imageURI} id={c.id} />
                          <div className="flex-1">
                            <div className="flex justify-between text-sm">
                              <span className="font-semibold text-ink-800">{c.name}</span>
                              <span className="text-gray-500">{Number(c.voteCount)} · {pct}%</span>
                            </div>
                            <div className="mt-1 h-2 overflow-hidden rounded-full bg-gray-100">
                              <div
                                className="h-full rounded-full"
                                style={{ width: `${pct}%`, background: BAR_COLORS[i % BAR_COLORS.length] }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>

                {/* Winner card */}
                <aside className="space-y-6">
                  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-leaf-50 to-white p-6 text-center shadow-card ring-1 ring-leaf/15">
                    <img
                      src={ASSETS.icon.statusWinner}
                      alt=""
                      className="mx-auto h-14 w-14"
                      style={{ imageRendering: "pixelated" }}
                    />
                    <p className="mt-1 text-xs font-bold uppercase tracking-wider text-leaf">
                      {status === STATUS.ENDED ? "Winner" : "Leading"}
                    </p>
                    <div className="mt-3 flex flex-col items-center">
                      <CandidateAvatar name={winner.name} imageURI={winner.imageURI} id={winner.id} size="lg" />
                      <h3 className="mt-2 font-display text-xl font-extrabold text-ink-800">{winner.name}</h3>
                      <p className="text-sm font-semibold text-leaf">{winner.party || "Independent"}</p>
                      <p className="mt-2 font-display text-3xl font-extrabold text-ink-800">
                        {Number(winner.voteCount)}
                        <span className="text-base font-semibold text-gray-400"> votes</span>
                      </p>
                    </div>
                    <img
                      src={ASSETS.mascot.netajiCelebration}
                      alt="Netaji"
                      className="pointer-events-none absolute -bottom-2 -right-2 h-24 w-24 opacity-90"
                      style={{ imageRendering: "pixelated" }}
                    />
                  </div>

                  <div className="card p-5 text-sm">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">On-chain Audit</h3>
                    <p className="mt-2 text-gray-600">
                      Every vote is recorded immutably on Ethereum. Verify the full tally yourself.
                    </p>
                    {contractAddr && (
                      <a
                        href={`${explorer}/address/${contractAddr}#events`}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 inline-flex font-semibold text-leaf hover:text-leaf-600"
                      >
                        View all vote events ↗
                      </a>
                    )}
                  </div>

                  <button onClick={() => navigate("/dashboard")} className="btn-ghost w-full">
                    ← Back to Dashboard
                  </button>
                </aside>
              </div>
            )}
          </>
        )}
      </main>

      <MascotBubble dialogue={DIALOGUE.results} position="bottom-right" />
    </div>
  );
}

function fireConfetti() {
  const colors = ["#FF9933", "#ffffff", "#16a34a"];
  const end = Date.now() + 1200;
  (function frame() {
    confetti({ particleCount: 4, angle: 60, spread: 70, origin: { x: 0 }, colors });
    confetti({ particleCount: 4, angle: 120, spread: 70, origin: { x: 1 }, colors });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
  confetti({ particleCount: 120, spread: 90, origin: { y: 0.4 }, colors });
}