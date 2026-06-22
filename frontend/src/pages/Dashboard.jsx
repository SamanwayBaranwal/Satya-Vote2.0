import { useNavigate } from "react-router-dom";
import { useAccount } from "wagmi";
import AppLayout from "../components/AppLayout.jsx";
import CountdownTimer from "../components/CountdownTimer.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import EmptyState from "../components/EmptyState.jsx";
import ConnectPrompt from "../components/ConnectPrompt.jsx";
import Icon, { IconTile } from "../components/Icons.jsx";
import { Link } from "react-router-dom";
import { useChainId } from "wagmi";
import { ASSETS, DIALOGUE, electionImage } from "../lib/design.js";
import { statusOf, STATUS, txUrl } from "../lib/contract.js";
import { useElections, useIsApprovedVoter, useIsAdmin, useMyVotes } from "../hooks/useSatyaVote.js";

const short = (a) => (a ? `${a.slice(0, 6)}…${a.slice(-4)}` : "—");

export default function Dashboard() {
  const navigate = useNavigate();
  const { address, isConnected } = useAccount();
  const { isApproved } = useIsApprovedVoter();
  const { isAdmin } = useIsAdmin();
  const { elections } = useElections();
  const { votes } = useMyVotes();

  const active = elections.filter((e) => statusOf(e) !== STATUS.ENDED);
  const live = elections.filter((e) => statusOf(e) === STATUS.LIVE);

  return (
    <AppLayout title="Dashboard" subtitle="Ek Vote, Ek Sach" dialogue={DIALOGUE.dashboard}>
      {/* Welcome banner — sharp, bracketed */}
      <section className="card overflow-hidden bg-gradient-to-r from-leaf-50 via-leaf-50/50 to-white p-6">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="label-mono mb-1 text-leaf">▸ WELCOME BACK</p>
            <h2 className="font-display text-2xl font-extrabold text-ink-800">
              Namaste, <span className="font-mono text-xl">{isConnected ? short(address) : "Matdata"}</span> 👋
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              {!isConnected
                ? "Connect your wallet to verify your voter status."
                : isApproved
                ? "You are a verified voter."
                : "Your voter approval is pending."}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {isConnected &&
                (isApproved ? (
                  <span className="badge-approved"><Icon.Check width={14} height={14} /> Approved</span>
                ) : (
                  <span className="badge-upcoming">Pending approval</span>
                ))}
              {isAdmin && (
                <button onClick={() => navigate("/admin")} className="badge bg-saffron/15 text-saffron hover:bg-saffron/25">
                  <Icon.Shield width={14} height={14} /> Admin Panel
                </button>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <img src={ASSETS.mascot.matdataHappy} alt="Matdata" className="h-24 w-24 drop-shadow-lg" style={{ imageRendering: "pixelated" }} />
            <div className="hidden sm:block">
              <p className="font-display font-bold text-ink-800">Matdata Ji</p>
              <p className="max-w-[140px] text-xs text-gray-500">Every vote shapes our future.</p>
            </div>
          </div>
        </div>
      </section>

      {/* VOID-style stat tiles */}
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile label="Total Elections" value={elections.length} hint="all time" icon={Icon.Ballot} tone="leaf" />
        <StatTile label="Live Now" value={live.length} hint={live.length ? "vote open" : "none active"} icon={Icon.Results} tone="saffron" />
        <StatTile label="My Votes" value={votes.length} hint="on-chain" icon={Icon.History} tone="sky" />
        <StatTile
          label="Voter Status"
          value={isApproved ? "✓" : "—"}
          hint={isApproved ? "approved" : isConnected ? "pending" : "connect"}
          icon={Icon.Profile}
          tone={isApproved ? "leaf" : "slate"}
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* Active elections */}
        <section>
          <h3 className="section-head">Active Elections</h3>
          {active.length === 0 ? (
            <EmptyState
              image={ASSETS.empty.noElections}
              title="No active elections"
              message="There are no live elections right now. Check back soon!"
            />
          ) : (
            <div className="space-y-4">
              {active.map((e) => (
                <ActiveElectionCard key={e.id} e={e} onVote={() => navigate(`/vote/${e.id}`)} />
              ))}
            </div>
          )}
        </section>

        {/* Profile + history */}
        <aside className="space-y-6">
          {isConnected ? <ProfileCard address={address} isApproved={isApproved} /> : <ConnectPrompt title="Connect to see your profile" />}
          <VoteHistoryCard />
        </aside>
      </div>
    </AppLayout>
  );
}

function StatTile({ label, value, hint, icon, tone }) {
  return (
    <div className="card flex flex-col gap-2 p-5">
      <div className="flex items-center justify-between">
        <span className="label-mono">{label}</span>
        <IconTile icon={icon} tone={tone} size="sm" />
      </div>
      <div className="font-display text-3xl font-extrabold leading-none text-ink-800">{value}</div>
      <div className="font-mono text-[11px] text-gray-400">{hint}</div>
    </div>
  );
}

function ActiveElectionCard({ e, onVote }) {
  const status = statusOf(e);
  return (
    <div className="card flex items-stretch overflow-hidden p-0">
      <div className="hidden w-48 shrink-0 self-stretch p-3 sm:block">
        <img src={electionImage(e)} alt="" className="h-full w-full object-contain object-bottom" />
      </div>
      <div className="flex flex-1 items-center gap-4 p-5">
        <div className="flex-1">
          <StatusBadge status={status} />
          <h4 className="mt-2 font-display text-lg font-bold text-ink-800">{e.title}</h4>
          <p className="text-xs text-gray-500">{e.organization}</p>
          <p className="mt-3 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
            {status === STATUS.UPCOMING ? "Starts in" : "Ends in"}
          </p>
          <div className="mt-1">
            <CountdownTimer target={status === STATUS.UPCOMING ? e.startTime : e.endTime} variant="dark" />
          </div>
        </div>
        <button onClick={onVote} disabled={status !== STATUS.LIVE} className="btn-primary self-end whitespace-nowrap">
          Vote Now →
        </button>
      </div>
    </div>
  );
}

function ProfileCard({ address, isApproved }) {
  const rows = [
    { label: "Wallet Address", value: short(address), mono: true },
    { label: "Approval Status", value: isApproved ? "Approved" : "Pending", good: isApproved },
    { label: "Voter ID", value: address ? `SVT-${address.slice(2, 6).toUpperCase()}-${address.slice(-5)}` : "—" },
    { label: "Member Since", value: "12 May 2024" },
  ];
  return (
    <div className="card p-5">
      <h3 className="section-head">My Profile</h3>
      <dl className="space-y-3">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center justify-between">
            <dt className="text-sm text-gray-500">{r.label}</dt>
            <dd className={`text-sm font-semibold ${r.good ? "text-leaf" : "text-ink-800"} ${r.mono ? "font-mono" : ""}`}>{r.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function VoteHistoryCard() {
  const chainId = useChainId();
  const { votes, loading } = useMyVotes();
  const { elections } = useElections();
  const titleOf = (id) => elections.find((e) => Number(e.id) === id)?.title || `Election #${id}`;

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <h3 className="section-head">My Vote History</h3>
        <Link to="/history" className="label-mono text-leaf hover:underline">View all</Link>
      </div>

      {loading ? (
        <div className="space-y-2">
          <div className="skeleton h-8 w-full" />
          <div className="skeleton h-8 w-full" />
        </div>
      ) : votes.length === 0 ? (
        <div className="flex flex-col items-center py-6 text-center">
          <img src={ASSETS.empty.noVoteHistory} alt="" className="h-20 w-20 opacity-90" style={{ imageRendering: "pixelated" }} />
          <p className="mt-2 text-sm text-gray-500">No votes yet. Cast your first vote!</p>
        </div>
      ) : (
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-gray-400">
              <th className="label-mono pb-2">Election</th>
              <th className="label-mono pb-2">Tx</th>
              <th className="label-mono pb-2 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {votes.slice(0, 4).map((v) => {
              const url = txUrl(chainId, v.txHash);
              return (
                <tr key={v.txHash}>
                  <td className="py-2.5 font-medium text-ink-800">{titleOf(v.electionId)}</td>
                  <td className="py-2.5">
                    {url ? (
                      <a href={url} target="_blank" rel="noreferrer" className="font-mono text-xs text-leaf hover:underline">
                        {v.txHash.slice(0, 6)}…{v.txHash.slice(-4)}
                      </a>
                    ) : (
                      <span className="font-mono text-xs text-gray-500">{v.txHash.slice(0, 6)}…{v.txHash.slice(-4)}</span>
                    )}
                  </td>
                  <td className="py-2.5 text-right">
                    <span className="badge-approved">✓</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      <div className="mt-4 flex items-start gap-2 border border-leaf/20 bg-leaf-50 p-3 text-xs text-leaf-700">
        <Icon.Shield width={16} height={16} />
        <div>Your votes are secured and verifiable on the blockchain.</div>
      </div>
    </div>
  );
}
