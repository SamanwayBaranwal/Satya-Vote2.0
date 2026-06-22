import { useAccount, useChainId } from "wagmi";
import toast from "react-hot-toast";
import AppLayout from "../components/AppLayout.jsx";
import ConnectPrompt from "../components/ConnectPrompt.jsx";
import Icon from "../components/Icons.jsx";
import { ASSETS, DIALOGUE, NETWORK } from "../lib/design.js";
import { useIsApprovedVoter, useIsAdmin, useMyVotes } from "../hooks/useSatyaVote.js";
import { getContractAddress } from "../lib/contract.js";

export default function Profile() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { isApproved } = useIsApprovedVoter();
  const { isAdmin } = useIsAdmin();
  const { votes } = useMyVotes();
  const contractAddr = getContractAddress(chainId);

  const copy = () => {
    navigator.clipboard.writeText(address);
    toast.success("Address copied!");
  };

  return (
    <AppLayout title="My Profile" subtitle="Your on-chain voter identity" dialogue={DIALOGUE.dashboard}>
      {!isConnected ? (
        <ConnectPrompt title="Connect to view your profile" mascot={ASSETS.mascot.matdataIdle} />
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
          {/* Identity card */}
          <div className="card overflow-hidden">
            <div className="bg-gradient-to-br from-ink-800 to-ink-700 p-6 text-center text-white">
              <img
                src={ASSETS.mascot.matdataFinger}
                alt="Matdata"
                className="mx-auto h-28 w-28 object-contain drop-shadow-xl"
                style={{ imageRendering: "pixelated" }}
              />
              <h3 className="mt-2 font-display text-lg font-bold">Matdata Ji</h3>
              <p className="text-xs text-white/60">Verified Citizen Voter</p>
              <div className="mt-3 inline-flex">
                {isApproved ? (
                  <span className="badge bg-leaf text-white"><Icon.Check width={14} height={14} /> Approved</span>
                ) : (
                  <span className="badge bg-saffron/20 text-saffron">Pending</span>
                )}
              </div>
            </div>
            <button onClick={copy} className="flex w-full items-center justify-center gap-2 p-4 text-sm font-mono text-ink-700 hover:bg-gray-50">
              {address.slice(0, 10)}…{address.slice(-8)} <Icon.Copy width={15} height={15} />
            </button>
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div className="card p-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">Voter Details</h3>
              <dl className="mt-4 grid gap-4 sm:grid-cols-2">
                <Field label="Voter ID" value={`SVT-${address.slice(2, 6).toUpperCase()}-${address.slice(-5)}`} />
                <Field label="Approval Status" value={isApproved ? "Approved" : "Pending"} good={isApproved} />
                <Field label="Role" value={isAdmin ? "Administrator" : "Voter"} />
                <Field label="Member Since" value="12 May 2024" />
                <Field label="Network" value={chainId === 31337 ? "Hardhat (local)" : "Sepolia"} />
                <Field label="Votes Cast" value={String(votes.length)} />
              </dl>
            </div>

            <div className="card flex items-center gap-4 p-6">
              <img src={ASSETS.badge.firstVote} alt="" className="h-16 w-16" style={{ imageRendering: "pixelated" }} />
              <div>
                <h4 className="font-display font-bold text-ink-800">First Vote Badge 🏅</h4>
                <p className="text-sm text-gray-500">Awarded for casting your first vote on Satya Vote.</p>
              </div>
            </div>

            {contractAddr && (
              <a
                href={`${NETWORK.sepolia.explorer}/address/${contractAddr}`}
                target="_blank"
                rel="noreferrer"
                className="btn-ghost w-full"
              >
                <Icon.External width={16} height={16} /> View contract on Etherscan
              </a>
            )}
          </div>
        </div>
      )}
    </AppLayout>
  );
}

function Field({ label, value, good }) {
  return (
    <div>
      <dt className="text-xs text-gray-400">{label}</dt>
      <dd className={`mt-0.5 font-semibold ${good ? "text-leaf" : "text-ink-800"}`}>{value}</dd>
    </div>
  );
}
