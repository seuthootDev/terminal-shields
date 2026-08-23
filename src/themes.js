export const THEMES = {
  amber: {
    name: "amber",
    bg: "#0c0a06",
    stroke: "#ffb000",
    fg: "#ffbe30",
    format: "prompt"
  },
  green: {
    name: "green",
    bg: "#030a05",
    stroke: "#00ff66",
    fg: "#3de878",
    format: "crt"
  },
  cyan: {
    name: "cyan",
    bg: "#040f14",
    stroke: "#00e5ff",
    fg: "#40e8e8",
    format: "meter"
  }
};

/** Terminal window backgrounds (independent of layout theme). */
export const BACKGROUNDS = {
  ubuntu: "#300A24",
  powershell: "#012456",
  macos: "#1D1F21",
  cmd: "#0C0C0C",
  matrix: "#0D0208",
  gnome: "#2E3436",
  dracula: "#282A36",
  solarized: "#002B36",
  nord: "#2E3440"
};

export function resolveTheme(input) {
  const key = String(input ?? "").trim().toLowerCase();
  return THEMES[key] ?? null;
}

export function resolveBackground(input) {
  const key = String(input ?? "").trim().toLowerCase();
  if (!key || key === "default" || key === "auto") return null;
  return BACKGROUNDS[key] ?? null;
}
