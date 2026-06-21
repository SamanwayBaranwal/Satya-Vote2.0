const GRADIENTS = [
  "from-rose-400 to-pink-500",
  "from-emerald-400 to-leaf",
  "from-sky-400 to-indigo-500",
  "from-amber-400 to-orange-500",
  "from-violet-400 to-purple-500",
];

export default function CandidateAvatar({ name = "", imageURI = "", id = 1, size = "md" }) {
  const dim = size === "lg" ? "h-14 w-14 text-lg" : "h-12 w-12 text-base";
  const initials = name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  if (imageURI) {
    return (
      <img
        src={imageURI}
        alt={name}
        className={`${dim} rounded-full object-cover ring-2 ring-white`}
        style={{ imageRendering: "auto" }}
      />
    );
  }
  return (
    <div
      className={`${dim} flex items-center justify-center rounded-full bg-gradient-to-br font-bold text-white ring-2 ring-white ${
        GRADIENTS[(Number(id) - 1) % GRADIENTS.length]
      }`}
    >
      {initials || "?"}
    </div>
  );
}