export function setupRipple() {
  document.addEventListener(
    "click",
    (e) => {
      const target = e.target.closest(".btn, .ripple");
      if (!target) return;
      if (target.disabled || target.getAttribute("aria-disabled") === "true") return;

      const rect = target.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 2.4;
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      const drop = document.createElement("span");
      drop.className = "ripple-drop";
      drop.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px`;
      target.appendChild(drop);
      drop.addEventListener("animationend", () => drop.remove(), { once: true });
    },
    true
  );
}
