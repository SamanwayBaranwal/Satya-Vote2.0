import { ASSETS } from "../lib/design.js";

/** Inline spinner: tricolor orbiting ring around the lotus. */
export function Loader({ size = 56, label }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="relative" style={{ width: size, height: size }}>
        <div className="loader-ring absolute inset-0" />
        <img
          src={ASSETS.logoIcon}
          alt=""
          className="absolute inset-1.5"
          style={{ imageRendering: "pixelated", width: size - 12, height: size - 12 }}
        />
      </div>
      {label && (
        <p className="label-mono">
          {label}
          <span style={{ animation: "dots 1.4s infinite" }}>.</span>
          <span style={{ animation: "dots 1.4s infinite 0.2s" }}>.</span>
          <span style={{ animation: "dots 1.4s infinite 0.4s" }}>.</span>
        </p>
      )}
    </div>
  );
}

/** Full-area loading state for pages/sections. */
export function PageLoader({ label = "Reading the blockchain" }) {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <Loader size={64} label={label} />
    </div>
  );
}

/** Skeleton card placeholder. */
export function SkeletonCard() {
  return (
    <div className="card p-5">
      <div className="skeleton h-5 w-20 rounded-full" />
      <div className="skeleton mt-4 h-10 w-10 rounded-lg" />
      <div className="skeleton mt-3 h-5 w-3/4 rounded" />
      <div className="skeleton mt-2 h-4 w-1/2 rounded" />
      <div className="skeleton mt-5 h-10 w-full" />
    </div>
  );
}

export default Loader;
