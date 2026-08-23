const NAMED_COLORS = {
  brightgreen: "#55ee22",
  green: "#78d418",
  yellow: "#ffe033",
  yellowgreen: "#b8e020",
  orange: "#ff8844",
  red: "#ff5555",
  blue: "#33bbff",
  grey: "#888888",
  gray: "#888888",
  lightgrey: "#bbbbbb",
  lightgray: "#bbbbbb",
  critical: "#ff5555",
  important: "#ff8844",
  success: "#55ee22",
  informational: "#33bbff",
  inactive: "#bbbbbb"
};

const HEX = /^#?([\da-f]{3}|[\da-f]{6})$/i;

export function isNamedColor(color) {
  return Boolean(NAMED_COLORS[String(color ?? "").toLowerCase()]);
}

export function isHexColor(color) {
  return HEX.test(String(color ?? "").trim());
}

export function isValidColor(color) {
  return isNamedColor(color) || isHexColor(color);
}

export function toSvgColor(color) {
  const raw = String(color ?? "").trim();
  const named = NAMED_COLORS[raw.toLowerCase()];
  if (named) return named;
  const hex = raw.match(HEX);
  if (!hex) return undefined;
  const digits = hex[1];
  if (digits.length === 3) {
    return `#${digits.split("").map((ch) => ch + ch).join("").toLowerCase()}`;
  }
  return `#${digits.toLowerCase()}`;
}

export function inferTheme(color) {
  const key = String(color ?? "").toLowerCase();
  if (["green", "brightgreen", "success", "yellowgreen"].includes(key)) return "green";
  if (["red", "critical"].includes(key)) return "green";
  // cyan/meter is opt-in via ?theme=cyan (best for percentages)
  return "amber";
}
