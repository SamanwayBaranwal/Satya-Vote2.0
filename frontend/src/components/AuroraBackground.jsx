/**
 * Soft color "aurora" blobs behind the UI so glass surfaces have something
 * to refract. Fixed + non-interactive; sits above the grid, below content.
 */
export default function AuroraBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
      <div className="absolute -left-24 -top-32 h-[28rem] w-[28rem] rounded-full bg-leaf/20 blur-[110px]" />
      <div className="absolute right-[-6rem] top-1/4 h-[26rem] w-[26rem] rounded-full bg-saffron/15 blur-[110px]" />
      <div className="absolute bottom-[-8rem] left-1/3 h-[26rem] w-[26rem] rounded-full bg-lotus/15 blur-[120px]" />
      <div className="absolute right-1/4 top-2/3 h-72 w-72 rounded-full bg-sky-300/15 blur-[100px]" />
    </div>
  );
}
