import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { isAddress } from "viem";
import toast from "react-hot-toast";
import AppLayout from "../components/AppLayout.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import EmptyState from "../components/EmptyState.jsx";
import Icon, { IconTile } from "../components/Icons.jsx";
import { ASSETS, DIALOGUE } from "../lib/design.js";
import { statusOf, STATUS } from "../lib/contract.js";
import {
  useIsAdmin,
  useElections,
  useApprovedVoterCount,
  useSatyaWrite,
} from "../hooks/useSatyaVote.js";

export default function Admin() {
  const navigate = useNavigate();
  const { isAdmin, admin } = useIsAdmin();
  const { elections, refetch } = useElections();
  const voterCount = useApprovedVoterCount();
  const { run } = useSatyaWrite();
  const [busy, setBusy] = useState(false);

  async function tx(fn, args, opts) {
    setBusy(true);
    try {
      const { hash, toastId, success } = await run(fn, args, opts);
      toast.success(success, { id: toastId });
      await refetch();
      return true;
    } catch {
      return false;
    } finally {
      setBusy(false);
    }
  }

  if (admin && !isAdmin) {
    return (
      <AppLayout title="Admin Panel" subtitle="Restricted area" dialogue={DIALOGUE.admin}>
        <EmptyState
          image={ASSETS.empty.noElectionsLocked}
          title="Admins only"
          message="This area is restricted to the platform admin (contract deployer)."
          action={
            <button onClick={() => navigate("/dashboard")} className="btn-primary">
              Back to Dashboard
            </button>
          }
        />
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Admin Control Panel" subtitle="Manage voters, candidates & elections" dialogue={DIALOGUE.admin}>
      <div className="flex items-center gap-3">
        <img src={ASSETS.mascot.netajiApproval} alt="" className="h-14 w-14" style={{ imageRendering: "pixelated" }} />
        <div>
          <h2 className="font-display text-xl font-extrabold text-ink-800">Netaji's Control Room</h2>
          <p className="text-sm text-gray-500">Every action here is recorded on-chain.</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <StatTile label="Approved Voters" value={voterCount} icon={Icon.Profile} tone="sky" />
        <StatTile label="Total Elections" value={elections.length} icon={Icon.Ballot} tone="leaf" />
        <StatTile
          label="Live Now"
          value={elections.filter((e) => statusOf(e) === STATUS.LIVE).length}
          icon={Icon.Results}
          tone="saffron"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <ApproveVoterCard tx={tx} busy={busy} />
        <CreateElectionCard tx={tx} busy={busy} />
      </div>

      <section className="mt-6">
        <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500">Manage Elections</h2>
        {elections.length === 0 ? (
          <EmptyState image={ASSETS.empty.noElections} title="No elections yet" message="Create your first election above." />
        ) : (
          <div className="space-y-4">
            {elections.map((e) => (
              <ManageElectionRow key={e.id} e={e} tx={tx} busy={busy} onResults={() => navigate(`/results/${e.id}`)} />
            ))}
          </div>
        )}
      </section>
    </AppLayout>
  );
}

function StatTile({ label, value, icon, tone }) {
  return (
    <div className="stat-card flex-row items-center gap-3">
      <IconTile icon={icon} tone={tone} />
      <div>
        <div className="font-display text-2xl font-extrabold text-ink-800">{value}</div>
        <div className="text-xs text-gray-500">{label}</div>
      </div>
    </div>
  );
}

function Card({ title, children }) {
  return (
    <div className="card p-6">
      <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500">{title}</h2>
      <div className="mt-4 space-y-3">{children}</div>
    </div>
  );
}

const inputCls =
  "w-full rounded-none border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-ink-800 outline-none focus:border-leaf focus:ring-2 focus:ring-leaf/20";

function ApproveVoterCard({ tx, busy }) {
  const [addr, setAddr] = useState("");
  async function submit() {
    const list = addr.split(/[\s,]+/).map((a) => a.trim()).filter(Boolean);
    if (list.length === 0) return toast.error("Enter at least one wallet address.");
    const bad = list.find((a) => !isAddress(a));
    if (bad) return toast.error(`Invalid address: ${bad.slice(0, 10)}…`);
    const ok =
      list.length === 1
        ? await tx("approveVoter", [list[0]], { pending: "Approving voter…", success: "Voter approved ✓" })
        : await tx("approveVoters", [list], { pending: `Approving ${list.length} voters…`, success: "Voters approved ✓" });
    if (ok) setAddr("");
  }
  return (
    <Card title="Approve Voters">
      <p className="text-sm text-gray-500">Whitelist wallet addresses. Paste one or many (comma / newline separated).</p>
      <textarea
        rows={3}
        value={addr}
        onChange={(e) => setAddr(e.target.value)}
        placeholder="0xabc...123, 0xdef...456"
        className={inputCls + " font-mono"}
      />
      <button onClick={submit} disabled={busy} className="btn-primary w-full">
        ✓ Approve Voter(s)
      </button>
    </Card>
  );
}

// Quick demo-friendly durations (in minutes) — starts immediately, ends after N min.
const DURATIONS = [
  { label: "1 min", min: 1 },
  { label: "5 min", min: 5 },
  { label: "30 min", min: 30 },
  { label: "1 hour", min: 60 },
  { label: "24 hours", min: 60 * 24 },
  { label: "48 hours", min: 60 * 48 },
];

const ELECTION_TYPES = [
  { value: "country",   label: "🇮🇳 Country" },
  { value: "state",     label: "🏛 State" },
  { value: "panchayat", label: "🌾 Gram Panchayat" },
  { value: "school",    label: "🎓 School / College" },
];

function CreateElectionCard({ tx, busy }) {
  const [form, setForm] = useState({ title: "", org: "", electionType: "country" });
  const [durationMin, setDurationMin] = useState(60 * 24); // default 24h
  const [custom, setCustom] = useState("");
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function submit() {
    if (!form.title.trim()) return toast.error("Election title is required.");
    const mins = custom ? Number(custom) : durationMin;
    if (!mins || mins <= 0) return toast.error("Pick a valid duration.");
    const start = Math.floor(Date.now() / 1000);
    const end = start + Math.round(mins * 60);
    const ok = await tx("createElection", [form.title, form.org, form.electionType, BigInt(start), BigInt(end)], {
      pending: "Creating election…",
      success: `Election created — live for ${custom ? custom + " min" : DURATIONS.find((d) => d.min === durationMin)?.label} ✓`,
    });
    if (ok) {
      setForm({ title: "", org: "", electionType: "country" });
      setCustom("");
    }
  }

  return (
    <Card title="Create Election">
      <input className={inputCls} placeholder="Election title (e.g. Student Council Election)" value={form.title} onChange={set("title")} />
      <input className={inputCls} placeholder="Organization (e.g. ABC University)" value={form.org} onChange={set("org")} />

      <div>
        <p className="label-mono mb-2">Election Type</p>
        <div className="flex flex-wrap gap-2">
          {ELECTION_TYPES.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setForm({ ...form, electionType: t.value })}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                form.electionType === t.value
                  ? "bg-ink-800 text-white shadow-sm"
                  : "bg-gray-100 text-ink-700 hover:bg-gray-200"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="label-mono mb-2">Duration · starts immediately</p>
        <div className="flex flex-wrap gap-2">
          {DURATIONS.map((d) => (
            <button
              key={d.min}
              type="button"
              onClick={() => {
                setDurationMin(d.min);
                setCustom("");
              }}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                !custom && durationMin === d.min
                  ? "bg-leaf text-white shadow-sm"
                  : "bg-gray-100 text-ink-700 hover:bg-gray-200"
              }`}
            >
              {d.label}
            </button>
          ))}
          <input
            type="number"
            min="1"
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            placeholder="custom min"
            className="w-28 rounded-lg border border-gray-200 px-3 py-1.5 text-xs outline-none focus:border-leaf"
          />
        </div>
        <p className="mt-2 text-xs text-gray-400">
          Tip: pick <span className="font-semibold text-leaf">1 min</span> for a live demo — vote, watch it end, then show results.
        </p>
      </div>

      <button onClick={submit} disabled={busy} className="btn-primary w-full">
        <Icon.Plus width={16} height={16} /> Create Election
      </button>
    </Card>
  );
}

function ManageElectionRow({ e, tx, busy, onResults }) {
  const status = statusOf(e);
  const [open, setOpen] = useState(false);
  const [c, setC] = useState({ name: "", party: "", tagline: "", image: "" });
  const setF = (k) => (ev) => setC({ ...c, [k]: ev.target.value });

  async function addCandidate() {
    if (!c.name.trim()) return toast.error("Candidate name is required.");
    const ok = await tx("addCandidate", [BigInt(e.id), c.name, c.party, c.tagline, c.image.trim()], {
      pending: "Adding candidate…",
      success: "Candidate added ✓",
    });
    if (ok) setC({ name: "", party: "", tagline: "", image: "" });
  }

  return (
    <div className="card p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-display text-base font-bold text-ink-800">{e.title}</h3>
            <StatusBadge status={status} />
          </div>
          <p className="text-xs text-gray-500">
            {e.organization} · {Number(e.candidateCount)} candidates · {Number(e.totalVotes)} votes
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setOpen((o) => !o)} className="btn-ghost px-3 py-2 text-xs">
            + Candidate
          </button>
          {status === STATUS.UPCOMING && (
            <button
              onClick={() => tx("startElectionNow", [BigInt(e.id)], { pending: "Starting…", success: "Election started ✓" })}
              disabled={busy}
              className="btn-primary px-3 py-2 text-xs"
            >
              ▶ Start Now
            </button>
          )}
          {status === STATUS.LIVE && (
            <button
              onClick={() => tx("endElectionNow", [BigInt(e.id)], { pending: "Ending…", success: "Election ended ✓" })}
              disabled={busy}
              className="btn-dark px-3 py-2 text-xs"
            >
              ■ End Now
            </button>
          )}
          {status === STATUS.ENDED && (
            <button onClick={onResults} className="btn-ghost px-3 py-2 text-xs">
              View Results →
            </button>
          )}
        </div>
      </div>

      {open && (
        <div className="mt-4 grid gap-2 border-t border-gray-100 pt-4 sm:grid-cols-2">
          <input className={inputCls} placeholder="Name *" value={c.name} onChange={setF("name")} />
          <input className={inputCls} placeholder="Party / Affiliation" value={c.party} onChange={setF("party")} />
          <input className={inputCls + " sm:col-span-2"} placeholder="Tagline / one-line manifesto" value={c.tagline} onChange={setF("tagline")} />
          <div className="flex items-center gap-3 sm:col-span-2">
            {c.image ? (
              <img src={c.image} alt="" className="h-11 w-11 rounded-full object-cover ring-2 ring-leaf/30" onError={(ev) => (ev.currentTarget.style.display = "none")} />
            ) : (
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-xs text-gray-400">IMG</span>
            )}
            <input className={inputCls + " flex-1"} placeholder="Candidate photo URL (optional, e.g. https://…/priya.png)" value={c.image} onChange={setF("image")} />
          </div>
          <button onClick={addCandidate} disabled={busy} className="btn-primary sm:col-span-2">
            <Icon.Plus width={16} height={16} /> Add Candidate to “{e.title}”
          </button>
        </div>
      )}
    </div>
  );
}