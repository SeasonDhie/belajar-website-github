
const cards = document.querySelectorAll("[data-module]");

const countLabel = document.querySelector("#progress-count");
const progressBar = document.querySelector("#progress-bar");
const progressFill = document.querySelector("#progress-fill");

function updateProgress() {
  const completedCount = document.querySelectorAll(
    "[data-module] .complete-button[aria-pressed='true']"
  ).length;

  countLabel.textContent =
    `${completedCount} dari ${cards.length} selesai`;

  progressBar.setAttribute(
    "aria-valuenow",
    String(completedCount)
  );

  const percentage =
    cards.length === 0
      ? 0
      : (completedCount / cards.length) * 100;

  progressFill.style.width = `${percentage}%`;
}

cards.forEach((card) => {
  const button = card.querySelector(".complete-button");

  if (!button) return;

  button.addEventListener("click", () => {
    const isCompleted =
      button.getAttribute("aria-pressed") === "true";

    const nextState = !isCompleted;

    button.setAttribute("aria-pressed", String(nextState));

    button.textContent = nextState
      ? "Selesai ✓"
      : "Tandai selesai";

    card.classList.toggle("is-complete", nextState);

    updateProgress();
  });
});

updateProgress();
