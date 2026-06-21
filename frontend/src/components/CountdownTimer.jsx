import { useEffect, useState } from "react";

function diff(target) {
  const now = Math.floor(Date.now() / 1000);
  let s = Math.max(0, Number(target) - now);
  const hrs = Math.floor(s / 3600);
  s -= hrs * 3600;
  const mins = Math.floor(s / 60);
  const secs = s - mins * 60;
  return { hrs, mins, secs, done: Number(target) - now <= 0 };
}

const pad = (n) => String(n).padStart(2, "0");

/**
 * Live countdown to `target` (unix seconds).
 * variant: "dark" (boxes on light bg) | "light" (boxes on dark header) | "inline"
 */
export default function CountdownTimer({ target, variant = "dark", onComplete }) {
  const [t, setT] = useState(() => diff(target));

  useEffect(() => {
    setT(diff(target));
    const id = setInterval(() => {
      const next = diff(target);
      setT(next);
      if (next.done) {
        clearInterval(id);
        onComplete?.();
      }
    }, 1000);
    return () => clearInterval(id);
  }, [target]); // eslint-disable-line react-hooks/exhaustive-deps

  const segs = [
    { v: t.hrs, l: "HRS" },
    { v: t.mins, l: "MINS" },
    { v: t.secs, l: "SECS" },
  ];

  if (variant === "inline") {
    return (
      <span className="font-mono text-sm font-bold tabular-nums text-ink-800">
        {pad(t.hrs)} : {pad(t.mins)} : {pad(t.secs)}
      </span>
    );
  }

  const boxCls =
    variant === "light"
      ? "bg-white/10 text-white ring-1 ring-white/15"
      : "bg-ink-800 text-white";
  const labelCls = variant === "light" ? "text-white/50" : "text-gray-400";

  return (
    <div className="flex items-end gap-1.5">
      {segs.map((s, i) => (
        <div key={s.l} className="flex items-end gap-1.5">
          <div className="flex flex-col items-center">
            <div className={`flex min-w-[46px] justify-center rounded-lg px-2.5 py-1.5 font-mono text-lg font-bold tabular-nums ${boxCls}`}>
              {pad(s.v)}
            </div>
            <div className={`mt-1 text-[9px] font-semibold tracking-wider ${labelCls}`}>{s.l}</div>
          </div>
          {i < segs.length - 1 && (
            <span className={`pb-5 text-lg font-bold ${variant === "light" ? "text-white/40" : "text-gray-300"}`}>:</span>
          )}
        </div>
      ))}
    </div>
  );
}