const NAMED_COLORS = {
  brightgreen: "#44cc00",
  green: "#67ac09",
  yellow: "#d8b800",
  yellowgreen: "#95991a",
  orange: "#ea7233",
  red: "#dd4343",
  blue: "#007ec6",
  grey: "#555555",
  gray: "#555555",
  lightgrey: "#939393",
  lightgray: "#939393",
  critical: "#dd4343",
  important: "#ea7233",
  success: "#44cc00",
  informational: "#007ec6",
  inactive: "#939393"
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
