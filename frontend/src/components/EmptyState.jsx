export default function EmptyState({ image, title, message, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-white/60 px-6 py-12 text-center">
      {image && (
        <img
          src={image}
          alt=""
          className="mb-4 h-32 w-32 object-contain opacity-90"
          style={{ imageRendering: "pixelated" }}
        />
      )}
      <h3 className="font-display text-lg font-bold text-ink-800">{title}</h3>
      {message && <p className="mt-1 max-w-sm text-sm text-gray-500">{message}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}