import { useAccount, useChainId } from "wagmi";
import AppLayout from "../components/AppLayout.jsx";
import EmptyState from "../components/EmptyState.jsx";
import ConnectPrompt from "../components/ConnectPrompt.jsx";
import { PageLoader } from "../components/Loader.jsx";
import Icon from "../components/Icons.jsx";
import { ASSETS, DIALOGUE } from "../lib/design.js";
import { txUrl } from "../lib/contract.js";
import { useMyVotes, useElections } from "../hooks/useSatyaVote.js";

export default function History() {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { votes, loading } = useMyVotes();
  const { elections } = useElections();

  const titleOf = (id) => elections.find((e) => Number(e.id) === id)?.title || `Election #${id}`;
  const candidateNote = (v) => `Candidate #${v.candidateId}`;

  return (
    <AppLayout title="Vote History" subtitle="Every vote you've cast, on-chain" dialogue={DIALOGUE.dashboard}>
      {!isConnected ? (
        <ConnectPrompt title="Connect to view your vote history" mascot={ASSETS.mascot.matdataIdle} />
      ) : loading ? (
        <PageLoader label="Fetching your votes from chain" />
      ) : votes.length === 0 ? (
        <EmptyState
          image={ASSETS.empty.noVoteHistory}
          title="No votes yet"
          message="Once you cast a vote, it will appear here with a link to the on-chain transaction."
        />
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50/80 text-gray-400">
              <tr>
                <th className="label-mono px-5 py-3">Election</th>
                <th className="label-mono px-5 py-3">Choice</th>
                <th className="label-mono px-5 py-3">Transaction</th>
                <th className="label-mono px-5 py-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {votes.map((v) => {
                const url = txUrl(chainId, v.txHash);
                return (
                  <tr key={v.txHash} className="hover:bg-gray-50/60">
                    <td className="px-5 py-4">
                      <div className="font-semibold text-ink-800">{titleOf(v.electionId)}</div>
                      <div className="label-mono">Block #{v.block}</div>
                    </td>
                    <td className="px-5 py-4 text-gray-600">{candidateNote(v)}</td>
                    <td className="px-5 py-4">
                      {url ? (
                        <a href={url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 font-mono text-xs text-leaf hover:underline">
                          {v.txHash.slice(0, 10)}…{v.txHash.slice(-6)} <Icon.External width={13} height={13} />
                        </a>
                      ) : (
                        <span className="font-mono text-xs text-gray-500" title="No explorer on local chain">
                          {v.txHash.slice(0, 10)}…{v.txHash.slice(-6)}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <span className="badge-approved"><Icon.Check width={13} height={13} /> Confirmed</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="flex items-start gap-2 border-t border-gray-100 bg-leaf-50/50 p-4 text-xs text-leaf-700">
            <Icon.Shield width={16} height={16} />
            All votes are stored immutably on the blockchain and are publicly verifiable. Click any transaction to view it on the explorer.
          </div>
        </div>
      )}
    </AppLayout>
  );
}
