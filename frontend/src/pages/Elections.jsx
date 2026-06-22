import { useNavigate } from "react-router-dom";
import AppLayout from "../components/AppLayout.jsx";
import CountdownTimer from "../components/CountdownTimer.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import EmptyState from "../components/EmptyState.jsx";
import Icon from "../components/Icons.jsx";
import { ASSETS, DIALOGUE, electionImage } from "../lib/design.js";
import { statusOf, STATUS } from "../lib/contract.js";
import { useElections } from "../hooks/useSatyaVote.js";

/** mode: "vote" routes to the booth; "results" routes to the tally. */
export default function Elections({ mode = "vote" }) {
  const navigate = useNavigate();
  const { elections, isLoading } = useElections();
  const isResults = mode === "results";
  const go = (e) => navigate(isResults ? `/results/${e.id}` : `/vote/${e.id}`);

  return (
    <AppLayout
      title={isResults ? "Results" : "Elections"}
      subtitle={isResults ? "Browse live and final tallies" : "Cast your vote in any live election"}
      dialogue={DIALOGUE.dashboard}
    >
      {!isLoading && elections.length === 0 ? (
        <EmptyState
          image={ASSETS.empty.noElections}
          title="No elections yet"
          message="There are no elections on-chain yet. The admin can create one from the Admin panel."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {elections.map((e) => {
            const status = statusOf(e);
            const img = electionImage(e);
            return (
              <button
                key={e.id}
                onClick={() => go(e)}
                className="card overflow-hidden p-0 text-left transition hover:-translate-y-1 hover:shadow-lift"
              >
                {/* Election type image banner */}
                <div className="relative h-44 w-full overflow-hidden bg-gradient-to-b from-ink-900/[0.04] to-ink-900/[0.08]">
                  <img
                    src={img}
                    alt={e.title}
                    className="h-full w-full object-contain p-1.5 transition duration-300 hover:scale-105"
                  />
                  <div className="absolute right-3 top-3">
                    <StatusBadge status={status} />
                  </div>
                </div>

                {/* Card body */}
                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <span className="label-mono">{Number(e.totalVotes)} votes</span>
                  </div>
                  <h3 className="mt-2 font-display text-base font-bold text-ink-800">{e.title}</h3>
                  <p className="text-xs text-gray-500">{e.organization}</p>

                  {status !== STATUS.ENDED && (
                    <>
                      <p className="mt-3 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                        {status === STATUS.UPCOMING ? "Starts in" : "Ends in"}
                      </p>
                      <div className="mt-1">
                        <CountdownTimer target={status === STATUS.UPCOMING ? e.startTime : e.endTime} variant="dark" />
                      </div>
                    </>
                  )}

                  <p className="mt-4 flex items-center gap-1 text-sm font-semibold text-leaf">
                    {isResults ? "View Results" : status === STATUS.LIVE ? "Vote Now" : "View"}
                    <Icon.External width={13} height={13} />
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </AppLayout>
  );
}
