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

export function resolveTheme(input) {
  const key = String(input ?? "").trim().toLowerCase();
  return THEMES[key] ?? null;
}
