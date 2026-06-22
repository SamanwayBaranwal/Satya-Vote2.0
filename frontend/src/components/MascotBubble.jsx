import { useEffect, useState } from "react";

/**
 * Fixed-position mascot with a rotating hardcoded speech bubble.
 * `dialogue` = { mascot, name, lines: [] }
 */
export default function MascotBubble({ dialogue, position = "bottom-right" }) {
  const [idx, setIdx] = useState(0);
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % dialogue.lines.length), 6000);
    return () => clearInterval(id);
  }, [dialogue]);

  const pos =
    position === "bottom-left"
      ? "left-4 sm:left-6 flex-row"
      : "right-4 sm:right-6 flex-row-reverse";

  return (
    <div className={`pointer-events-none fixed bottom-24 z-40 hidden items-start gap-2 md:flex lg:bottom-8 ${pos}`}>
      {open && (
        <div className="pointer-events-auto relative max-w-[260px] animate-bubble-in rounded-none bg-white px-4 py-3 shadow-lift ring-1 ring-black/5">
          <p className="label-mono !text-leaf">{dialogue.name}</p>
          <p className="mt-0.5 text-sm leading-snug text-ink-800">{dialogue.lines[idx]}</p>
          <button
            onClick={() => setOpen(false)}
            className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-ink-800 text-[10px] text-white hover:bg-ink-700"
            aria-label="dismiss"
          >
            ✕
          </button>
          <span
            className={`absolute top-5 h-3 w-3 rotate-45 bg-white ${
              position === "bottom-left" ? "-right-1.5" : "-left-1.5"
            }`}
          />
        </div>
      )}
      <img
        src={dialogue.mascot}
        alt={dialogue.name}
        onClick={() => setOpen((o) => !o)}
        className="pointer-events-auto h-24 w-auto animate-float cursor-pointer drop-shadow-xl"
        style={{ imageRendering: "pixelated" }}
      />
    </div>
  );
}