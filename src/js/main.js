import { POSITIONS } from "./data.js";

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("positions-container");
  if (!container) return;

  POSITIONS.forEach((pos) => {
    const div = document.createElement("div");
    div.className =
      "mc-panel flex flex-col items-center justify-center space-y-6";

    const h3 = document.createElement("h3");
    h3.className = "font-mc text-3xl uppercase";
    h3.textContent = pos;

    const a = document.createElement("a");
    a.href = `apply.html?position=${encodeURIComponent(pos)}`;
    a.className = "mc-button w-full text-center block";
    a.textContent = "Apply Now";

    div.appendChild(h3);
    div.appendChild(a);
    container.appendChild(div);
  });
});
