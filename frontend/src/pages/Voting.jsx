import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";
import toast from "react-hot-toast";
import FocusTopbar from "../components/FocusTopbar.jsx";
import MascotBubble from "../components/MascotBubble.jsx";
import CountdownTimer from "../components/CountdownTimer.jsx";
import CandidateAvatar from "../components/CandidateAvatar.jsx";
import EmptyState from "../components/EmptyState.jsx";
import Icon, { IconTile } from "../components/Icons.jsx";
import AuroraBackground from "../components/AuroraBackground.jsx";
import { ASSETS, DIALOGUE } from "../lib/design.js";
import { statusOf, STATUS } from "../lib/contract.js";
import {
  useElection,
  useCandidates,
  useHasVoted,
  useIsApprovedVoter,
  useSatyaWrite,
} from "../hooks/useSatyaVote.js";

const short = (a) => (a ? `${a.slice(0, 6)}…${a.slice(-4)}` : "—");

export default function Voting() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { address } = useAccount();
  const { election } = useElection(id);
  const { candidates, refetch } = useCandidates(id);
  const { hasVoted, refetch: refetchVoted } = useHasVoted(id);
  const { isApproved } = useIsApprovedVoter();
  const { run } = useSatyaWrite();

  const [selected, setSelected] = useState(null);
  const [busy, setBusy] = useState(false);

  const status = election ? statusOf(election) : STATUS.LIVE;
  const selectedCandidate = candidates.find((c) => Number(c.id) === selected);

  async function castVote() {
    if (!selected) return toast.error("Please select a candidate first.");
    if (!isApproved) return toast.error("You are not an approved voter yet.");
    setBusy(true);
    try {
      const { hash, toastId } = await run("castVote", [BigInt(id), BigInt(selected)], {
        pending: "Confirm your vote in wallet...",
      });
      toast.success("Vote cast on-chain! 🎉", { id: toastId });
      await Promise.all([refetch(), refetchVoted()]);
      navigate(`/results/${id}`);
    } catch {
      /* toast handled in hook */
    } finally {
      setBusy(false);
    }
  }

  const center = election && (
    <div className="flex items-center gap-3">
      <span className="font-display font-bold text-ink-800">{election.title}</span>
      {status === STATUS.LIVE && (
        <span className="badge-live">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" /> Live
        </span>
      )}
      {status === STATUS.LIVE && (
        <div className="flex items-center gap-2 text-gray-500">
          <span className="label-mono">Ends in</span>
          <CountdownTimer target={election.endTime} variant="inline" />
        </div>
      )}
    </div>
  );

  return (
    <div className="relative flex min-h-screen flex-col grid-bg">
      <AuroraBackground />
      <FocusTopbar backTo="/elections" center={center} />

      <main className="relative container-app flex-1 py-7">
        {!election ? (
          <EmptyState image={ASSETS.empty.noElections} title="Election not found" message="This election does not exist." />
        ) : hasVoted ? (
          <AlreadyVoted onResults={() => navigate(`/results/${id}`)} />
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
            {/* Candidate selection */}
            <section>
              <h1 className="font-display text-xl font-extrabold text-ink-800">Select your preferred candidate</h1>
              <p className="mt-1 text-sm text-gray-500">
                You can select only one candidate. This action cannot be undone.
              </p>

              {candidates.length === 0 ? (
                <div className="mt-5">
                  <EmptyState
                    image={ASSETS.empty.noCandidates}
                    title="No candidates yet"
                    message="The admin has not added candidates to this election."
                  />
                </div>
              ) : (
                <div className="mt-5 space-y-3">
                  {candidates.map((c) => {
                    const isSel = selected === Number(c.id);
                    return (
                      <button
                        key={c.id}
                        onClick={() => setSelected(Number(c.id))}
                        className={`flex w-full items-center gap-4 rounded-none border-2 bg-white p-4 text-left transition ${
                          isSel ? "border-leaf bg-leaf-50/40 shadow-card" : "border-transparent shadow-card ring-1 ring-black/5 hover:border-leaf/30"
                        }`}
                      >
                        <CandidateAvatar name={c.name} imageURI={c.imageURI} id={c.id} size="lg" />
                        <div className="flex-1">
                          <p className="font-display text-base font-bold text-ink-800">{c.name}</p>
                          <p className="text-sm font-semibold text-leaf">{c.party || "Independent"}</p>
                          <p className="mt-0.5 text-xs text-gray-500">{c.tagline}</p>
                        </div>
                        {isSel ? (
                          <span className="flex items-center gap-1.5 text-sm font-bold text-leaf">
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-leaf text-white">✓</span>
                            Selected
                          </span>
                        ) : (
                          <span className="h-6 w-6 rounded-full border-2 border-gray-300" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </section>

            {/* Vote summary */}
            <aside>
              <div className="card sticky top-24 p-6">
                <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500">Your Vote</h2>

                <div className="mt-4 flex flex-col items-center border border-leaf/20 bg-leaf-50/60 p-5 text-center">
                  {selectedCandidate ? (
                    <CandidateAvatar name={selectedCandidate.name} imageURI={selectedCandidate.imageURI} id={selectedCandidate.id} size="lg" />
                  ) : (
                    <IconTile icon={Icon.Ballot} tone="leaf" size="lg" />
                  )}
                  <p className="mt-2 text-xs text-gray-500">You have selected</p>
                  <p className="font-display text-lg font-bold text-leaf">
                    {selectedCandidate ? selectedCandidate.name : "—"}
                  </p>
                </div>

                <dl className="mt-5 space-y-3 text-sm">
                  <Row label="Election" value={election.title} icon="🗳" />
                  <Row label="Voter" value={short(address)} mono icon="👤" />
                  <Row
                    label="Status"
                    value={selected ? "Ready to Cast" : "Select a candidate"}
                    good={Boolean(selected)}
                    icon="●"
                  />
                </dl>

                <p className="mt-4 flex items-start gap-1.5 text-xs text-gray-500">
                  <span className="text-leaf">✓</span>
                  Once you cast your vote, it will be recorded on the blockchain and cannot be changed.
                </p>

                <button
                  onClick={castVote}
                  disabled={!selected || busy || status !== STATUS.LIVE || !isApproved}
                  className="btn-primary mt-4 w-full py-3.5 text-base"
                >
                  {busy ? "Casting…" : "🔒 Cast Your Vote"}
                </button>
                <p className="mt-2 text-center text-[11px] text-gray-400">This action is final and irreversible.</p>

                {!isApproved && (
                  <p className="mt-2 text-center text-xs text-saffron">You must be an approved voter to cast a vote.</p>
                )}
              </div>
            </aside>
          </div>
        )}
      </main>

      <div className="bg-ink-900 py-3 text-center text-xs font-medium text-white/70">
        🔒 100% Secure · Transparent · Blockchain Verified
      </div>

      <MascotBubble dialogue={DIALOGUE.voting} position="bottom-left" />
    </div>
  );
}

function Row({ label, value, mono, good, icon }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="flex items-center gap-2 text-gray-500">
        <span className="text-xs">{icon}</span>
        {label}
      </dt>
      <dd className={`font-semibold ${good ? "text-leaf" : "text-ink-800"} ${mono ? "font-mono text-xs" : ""}`}>
        {value}
      </dd>
    </div>
  );
}

function AlreadyVoted({ onResults }) {
  return (
    <div className="mx-auto max-w-md py-12 text-center">
      <div className="relative mx-auto w-fit">
        <div className="overflow-hidden rounded-none bg-white p-1.5 shadow-card ring-1 ring-black/5">
          <img
            src={ASSETS.mascot.matdataIdle}
            alt="Voted"
            className="h-40 w-40 animate-float object-contain"
            style={{ imageRendering: "pixelated" }}
          />
        </div>
        <span className="absolute -right-3 -top-3 flex h-11 w-11 items-center justify-center rounded-full bg-leaf text-lg text-white shadow-lg ring-4 ring-white">✓</span>
      </div>
      <h1 className="mt-5 font-display text-2xl font-extrabold text-ink-800">You've already voted! 🎉</h1>
      <p className="mt-2 text-gray-600">
        Your vote is permanently recorded on the blockchain. Aapne apna farz nibhaya — thank you!
      </p>
      <button onClick={onResults} className="btn-primary mt-6">
        View Live Results →
      </button>
    </div>
  );
}