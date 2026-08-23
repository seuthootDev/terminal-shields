import { THEMES } from "./themes.js";

function escapeXml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

const FONT_SIZE = 11;
const CHAR_W = FONT_SIZE * 0.62;
const HEIGHT = 28;
const PAD_X = 8;
const TEXT_Y = 18;

function meterBar(percent) {
  const clamped = Math.max(0, Math.min(100, percent));
  const filled = Math.round((clamped / 100) * 8);
  return `${"█".repeat(filled)}${"░".repeat(8 - filled)}`;
}

function parsePercent(message) {
  const match = String(message).trim().match(/^(\d+(?:\.\d+)?)%$/);
  return match ? Number(match[1]) : null;
}

export function buildDisplayText({ label, message, theme }) {
  const layout = THEMES[theme]?.format ?? "prompt";
  const hasLabel = Boolean(label);

  if (layout === "crt") {
    const value = String(message).toUpperCase();
    if (hasLabel) return `>_ ${label} [${value}]`;
    return `>_ [${value}]`;
  }

  if (layout === "meter") {
    const percent = parsePercent(message);
    if (percent !== null) {
      const head = hasLabel ? label : "stat";
      return `${head} [${meterBar(percent)}] ${message}`;
    }
    if (hasLabel) return `${label}: ${message}`;
    return String(message);
  }

  if (hasLabel) return `$ ${label}: ${message} █`;
  return `$ ${message} █`;
}

function neonFilterDef(id) {
  return `<filter id="${id}" x="-35%" y="-45%" width="170%" height="190%" color-interpolation-filters="sRGB">
      <feGaussianBlur in="SourceGraphic" stdDeviation="0.5" result="glow-tight"/>
      <feGaussianBlur in="SourceGraphic" stdDeviation="1.6" result="glow-mid"/>
      <feGaussianBlur in="SourceGraphic" stdDeviation="3.2" result="glow-wide"/>
      <feMerge>
        <feMergeNode in="glow-wide"/>
        <feMergeNode in="glow-mid"/>
        <feMergeNode in="glow-tight"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>`;
}

export function renderBadge({ label = "", message, theme = "amber", fg }) {
  const palette = THEMES[theme] ?? THEMES.amber;
  const text = buildDisplayText({ label, message, theme: palette.name });
  const width = Math.max(40, Math.ceil(PAD_X * 2 + text.length * CHAR_W));
  const fill = fg ?? palette.fg;
  const filterId = `neon-${palette.name}`;
  const border = fill;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${HEIGHT}" viewBox="0 0 ${width} ${HEIGHT}" role="img" aria-label="${escapeXml(text)}">
  <title>${escapeXml(text)}</title>
  <defs>
    ${neonFilterDef(filterId)}
  </defs>
  <rect width="${width}" height="${HEIGHT}" rx="4" fill="${palette.bg}"/>
  <rect width="${width}" height="${HEIGHT}" rx="4" fill="none" stroke="${border}" stroke-opacity="0.28" stroke-width="0.75"/>
  <text x="${PAD_X}" y="${TEXT_Y}" font-family="Courier New, ui-monospace, monospace" font-size="${FONT_SIZE}" font-weight="bold" fill="${fill}" filter="url(#${filterId})">${escapeXml(text)}</text>
</svg>`;
}
