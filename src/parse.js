import { isValidColor } from "./colors.js";

function escapeFormat(text) {
  return String(text ?? "")
    .replace(/(^|[^_])((?:__)*)_(?!_)/g, "$1$2 ")
    .replace(/__/g, "_")
    .replace(/--/g, "-");
}

function splitDashes(raw) {
  const parts = [];
  let buf = "";
  for (let i = 0; i < raw.length; i += 1) {
    if (raw[i] === "-" && raw[i + 1] === "-") {
      buf += "-";
      i += 1;
    } else if (raw[i] === "-") {
      parts.push(buf);
      buf = "";
    } else {
      buf += raw[i];
    }
  }
  parts.push(buf);
  return parts;
}

export function parseBadgePath(rawPath) {
  let raw = String(rawPath ?? "");
  try {
    raw = decodeURIComponent(raw);
  } catch {
    // keep raw
  }
  raw = raw.replace(/\.svg$/i, "").replace(/^\/+/, "");

  const parts = splitDashes(raw).filter((part, index, all) => !(part === "" && index === all.length - 1));
  if (parts.length < 2) {
    throw new Error("Badge path must be label-message-color or message-color");
  }

  let color = parts[parts.length - 1];
  let body = parts.slice(0, -1);
  if (!isValidColor(color) && body.length >= 1) {
    body = parts;
    color = "brightgreen";
  }

  if (body.length === 1) {
    return { label: "", message: escapeFormat(body[0]), color };
  }

  return {
    label: escapeFormat(body.slice(0, -1).join("-")),
    message: escapeFormat(body[body.length - 1]),
    color
  };
}
