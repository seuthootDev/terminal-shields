import { resolveBackground, THEMES } from "./themes.js";
import { toSvgColor } from "./colors.js";

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
const HEIGHT = 20;
const PAD_X = 6;
const TEXT_Y = 14;
const LOGO_SIZE = 12;
const LOGO_GAP = 4;
const LOGO_VIEW = 24;

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

const CURSOR_SUFFIX = " █";

export function splitCursor(text) {
  if (text.endsWith(CURSOR_SUFFIX)) {
    return { main: text.slice(0, -CURSOR_SUFFIX.length), cursor: " █" };
  }
  return { main: text, cursor: null };
}

function cursorBlinkMarkup() {
  return ` █<animate attributeName="opacity" values="1;0" dur="1.06s" repeatCount="indefinite" calcMode="discrete"/>`;
}

function renderText({ x, y, fill, filterId, main, cursor, blink }) {
  const attrs = `x="${x}" y="${y}" font-family="Courier New, ui-monospace, monospace" font-size="${FONT_SIZE}" font-weight="bold" fill="${fill}" filter="url(#${filterId})"`;
  if (cursor && blink) {
    return `<text ${attrs}>${escapeXml(main)}<tspan>${cursorBlinkMarkup()}</tspan></text>`;
  }
  return `<text ${attrs}>${escapeXml(main + (cursor ?? ""))}</text>`;
}

function neonFilterDef(id) {
  return `<filter id="${id}" x="-18%" y="-22%" width="136%" height="144%" color-interpolation-filters="sRGB">
      <feGaussianBlur in="SourceGraphic" stdDeviation="0.35" result="glow-soft"/>
      <feGaussianBlur in="SourceGraphic" stdDeviation="0.85" result="glow-mid"/>
      <feMerge>
        <feMergeNode in="glow-mid"/>
        <feMergeNode in="glow-soft"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>`;
}

function renderLogo({ path, x, y, size, fill, filterId }) {
  const scale = size / LOGO_VIEW;
  return `<g transform="translate(${x}, ${y})" filter="url(#${filterId})">
    <g transform="scale(${scale})">
      <path d="${path}" fill="${fill}"/>
    </g>
  </g>`;
}

export function renderBadge({
  label = "",
  message,
  theme = "amber",
  fg,
  bg,
  blink = false,
  logoPath = null
}) {
  const palette = THEMES[theme] ?? THEMES.amber;
  const text = buildDisplayText({ label, message, theme: palette.name });
  const { main, cursor } = splitCursor(text);
  const hasLogo = Boolean(logoPath);
  const logoOffset = hasLogo ? LOGO_SIZE + LOGO_GAP : 0;
  const width = Math.max(
    40,
    Math.ceil(PAD_X * 2 + logoOffset + text.length * CHAR_W)
  );
  const fill = fg ?? palette.fg;
  const background = resolveBackground(bg) ?? toSvgColor(bg) ?? palette.bg;
  const filterId = `neon-${palette.name}`;
  const border = fill;
  const textX = PAD_X + logoOffset;
  const logoY = (HEIGHT - LOGO_SIZE) / 2;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${HEIGHT}" viewBox="0 0 ${width} ${HEIGHT}" role="img" aria-label="${escapeXml(text)}">
  <title>${escapeXml(text)}</title>
  <defs>
    ${neonFilterDef(filterId)}
  </defs>
  <rect width="${width}" height="${HEIGHT}" rx="3" fill="${background}"/>
  <rect width="${width}" height="${HEIGHT}" rx="3" fill="none" stroke="${border}" stroke-opacity="0.16" stroke-width="0.5"/>
  ${hasLogo ? renderLogo({ path: logoPath, x: PAD_X, y: logoY, size: LOGO_SIZE, fill, filterId }) : ""}
  ${renderText({ x: textX, y: TEXT_Y, fill, filterId, main, cursor, blink: blink && Boolean(cursor) })}
</svg>`;
}
