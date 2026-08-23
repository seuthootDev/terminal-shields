export const THEMES = {
  amber: {
    name: "amber",
    bg: "#120c02",
    stroke: "#4a3206",
    fg: "#ffb000",
    format: "prompt"
  },
  green: {
    name: "green",
    bg: "#041204",
    stroke: "#30363d",
    fg: "#00ff66",
    format: "crt"
  },
  cyan: {
    name: "cyan",
    bg: "#05131a",
    stroke: "#0e3a4e",
    fg: "#00ffff",
    format: "meter"
  }
};

export function resolveTheme(input) {
  const key = String(input ?? "").trim().toLowerCase();
  return THEMES[key] ?? null;
}
