const THEME_KEY = "local10.theme";

function setText(id, value) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = value;
}

function setTheme(theme) {
  if (theme === "light") {
    document.documentElement.setAttribute("data-theme", "light");
  } else {
    document.documentElement.removeAttribute("data-theme");
  }
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // ignore
  }
}

function getTheme() {
  try {
    return localStorage.getItem(THEME_KEY);
  } catch {
    return null;
  }
}

function initThemeToggle() {
  const btn = document.getElementById("toggleModeBtn");
  if (!btn) return;

  const saved = getTheme();
  if (saved === "light" || saved === "dark") setTheme(saved);

  const isLight = document.documentElement.getAttribute("data-theme") === "light";
  btn.setAttribute("aria-pressed", String(isLight));

  btn.addEventListener("click", () => {
    const nextIsLight = document.documentElement.getAttribute("data-theme") !== "light";
    setTheme(nextIsLight ? "light" : "dark");
    btn.setAttribute("aria-pressed", String(nextIsLight));
  });
}

async function copyLink() {
  const url = window.location.href;
  try {
    await navigator.clipboard.writeText(url);
    setText("statusText", "Link copied");
    window.setTimeout(() => setText("statusText", "Draft"), 1500);
  } catch {
    setText("statusText", "Copy failed");
    window.setTimeout(() => setText("statusText", "Draft"), 1500);
  }
}

function initCopyButton() {
  const btn = document.getElementById("copyLinkBtn");
  if (!btn) return;
  btn.addEventListener("click", () => {
    void copyLink();
  });
}

function formatDateTime(d) {
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

function initTimestamps() {
  const now = new Date();
  setText("lastUpdated", formatDateTime(now));
  setText("footerUpdated", `Opened ${formatDateTime(now)}`);
}

function main() {
  initThemeToggle();
  initCopyButton();
  initTimestamps();
}

main();
