
const STORAGE_KEY = "belajarweb:learning-progress:v1";

const cards = [...document.querySelectorAll("[data-module]")];

const countLabel = document.querySelector("#progress-count");
const progressBar = document.querySelector("#progress-bar");
const progressFill = document.querySelector("#progress-fill");
const storageMessage = document.querySelector("#storage-message");
const resetButton = document.querySelector("#reset-progress");

const validModuleIds = new Set(
  cards
    .map((card) => card.dataset.module)
    .filter(Boolean)
);

function showStorageMessage(message) {
  if (storageMessage) {
    storageMessage.textContent = message;
  }
}

// Membaca dan memvalidasi progres tersimpan.
function loadProgress() {
  try {
    const savedData = localStorage.getItem(STORAGE_KEY);

    if (savedData === null) {
      return new Set();
    }

    const parsedData = JSON.parse(savedData);

    if (!Array.isArray(parsedData)) {
      showStorageMessage(
        "Data progres tidak valid. Mulai dari progres kosong."
      );

      return new Set();
    }

    return new Set(
      parsedData.filter(
        (id) =>
          typeof id === "string" &&
          validModuleIds.has(id)
      )
    );
  } catch (error) {
    console.warn("Progres gagal dibaca:", error);

    showStorageMessage(
      "Penyimpanan tidak tersedia. Progres mungkin tidak tersimpan."
    );

    return new Set();
  }
}

let completedModules = loadProgress();

// Menyimpan hanya ID materi yang selesai.
function saveProgress() {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([...completedModules])
    );

    showStorageMessage("Progres tersimpan di browser ini.");
    return true;
  } catch (error) {
    console.warn("Progres gagal disimpan:", error);

    showStorageMessage(
      "Progres berubah, tetapi gagal disimpan di browser."
    );

    return false;
  }
}

// Memperbarui tombol, warna kartu, dan progress bar.
function updateUI() {
  cards.forEach((card) => {
    const moduleId = card.dataset.module;
    const button = card.querySelector(".complete-button");

    if (!moduleId || !button) {
      return;
    }

    const isCompleted = completedModules.has(moduleId);

    button.setAttribute(
      "aria-pressed",
      String(isCompleted)
    );

    button.textContent = isCompleted
      ? "Selesai ✓"
      : "Tandai selesai";

    card.classList.toggle("is-complete", isCompleted);
  });

  const completedCount = cards.filter(
    (card) =>
      validModuleIds.has(card.dataset.module) &&
      completedModules.has(card.dataset.module)
  ).length;

  const percentage =
    cards.length === 0
      ? 0
      : (completedCount / cards.length) * 100;

  if (countLabel) {
    countLabel.textContent =
      `${completedCount} dari ${cards.length} selesai`;
  }

  if (progressBar) {
    progressBar.setAttribute(
      "aria-valuemax",
      String(cards.length)
    );

    progressBar.setAttribute(
      "aria-valuenow",
      String(completedCount)
    );
  }

  if (progressFill) {
    progressFill.style.width = `${percentage}%`;
  }
}

// Menghubungkan setiap tombol dengan status materi.
cards.forEach((card) => {
  const moduleId = card.dataset.module;
  const button = card.querySelector(".complete-button");

  if (!moduleId || !button) {
    return;
  }

  button.addEventListener("click", () => {
    if (completedModules.has(moduleId)) {
      completedModules.delete(moduleId);
    } else {
      completedModules.add(moduleId);
    }

    saveProgress();
    updateUI();
  });
});

// Memulihkan status saat halaman pertama kali dibuka.
updateUI();

// Menghapus progres belajar setelah konfirmasi pengguna.
resetButton?.addEventListener("click", () => {
  const confirmed = window.confirm(
    "Apakah kamu yakin ingin menghapus semua progres belajar?"
  );

  if (!confirmed) {
    return;
  }

  try {
    localStorage.removeItem(STORAGE_KEY);
    completedModules = new Set();

    updateUI();

    showStorageMessage("Progres belajar berhasil direset.");
  } catch (error) {
    console.warn("Progres gagal direset:", error);

    showStorageMessage(
      "Progres gagal direset. Penyimpanan browser mungkin tidak tersedia."
    );
  }
});