/**
 * Shields "endpoint" badge: fetch a JSON document and render it.
 * https://shields.io/badges/endpoint-badge
 */
const MIN_CACHE_SECONDS = 300;
const MAX_BODY_BYTES = 64 * 1024;

function normalizeUrl(raw) {
  const url = String(raw ?? "").trim();
  if (!url) throw new Error("url required");
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error("invalid url");
  }
  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    throw new Error("url must be http(s)");
  }
  return parsed.toString();
}

/** Validate a Shields endpoint payload and map it to our badge fields. */
export function parseEndpointPayload(json) {
  if (!json || typeof json !== "object" || Array.isArray(json)) {
    throw new Error("invalid endpoint json");
  }
  if (json.schemaVersion !== 1) {
    throw new Error("schemaVersion must be 1");
  }
  const isText = (v) => typeof v === "string" || typeof v === "number";
  if (!isText(json.message)) {
    throw new Error("message required");
  }
  if (json.label != null && !isText(json.label)) {
    throw new Error("label must be a string");
  }

  const result = {
    label: json.label == null ? "" : String(json.label),
    message: String(json.message),
    color: typeof json.color === "string" && json.color.trim()
      ? json.color.trim()
      : json.isError === true ? "red" : "lightgrey"
  };
  if (typeof json.namedLogo === "string" && json.namedLogo.trim()) {
    result.logo = json.namedLogo.trim();
  }
  const cacheSeconds = Number(json.cacheSeconds);
  if (Number.isFinite(cacheSeconds) && cacheSeconds > 0) {
    result.maxAge = Math.max(MIN_CACHE_SECONDS, Math.round(cacheSeconds));
  }
  return result;
}

export async function fetchEndpointBadge(rawUrl) {
  const url = normalizeUrl(rawUrl);
  let res;
  try {
    res = await fetch(url, {
      headers: { Accept: "application/json", "User-Agent": "terminal-shields" },
      signal: AbortSignal.timeout(5000)
    });
  } catch {
    throw new Error("endpoint unreachable");
  }
  if (!res.ok) throw new Error(`endpoint ${res.status}`);

  const text = await res.text();
  if (text.length > MAX_BODY_BYTES) throw new Error("endpoint response too large");
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error("endpoint did not return json");
  }
  return parseEndpointPayload(json);
}
