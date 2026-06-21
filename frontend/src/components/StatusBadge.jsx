import { STATUS } from "../lib/contract.js";

export default function StatusBadge({ status }) {
  if (status === STATUS.LIVE) {
    return (
      <span className="badge-live">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
        Live
      </span>
    );
  }
  if (status === STATUS.UPCOMING) {
    return <span className="badge-upcoming">Upcoming</span>;
  }
  return <span className="badge-ended">Ended</span>;
}