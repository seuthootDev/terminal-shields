const ICON_CDN = "https://cdn.jsdelivr.net/npm/simple-icons/icons";
const cache = new Map();

function normalizeSlug(raw) {
  return String(raw ?? "")
    .trim()
    .toLowerCase()
    .replace(/\.svg$/i, "")
    .replace(/[^a-z0-9+-]/g, "");
}

function extractPath(svg) {
  const match = String(svg).match(/\bd="([^"]+)"/);
  return match?.[1] ?? null;
}

/** Load a Simple Icons path by slug (e.g. qt, react, typescript). */
export async function fetchLogoPath(slug) {
  const key = normalizeSlug(slug);
  if (!key) return null;
  if (cache.has(key)) return cache.get(key);

  const res = await fetch(`${ICON_CDN}/${encodeURIComponent(key)}.svg`, {
    headers: { Accept: "image/svg+xml", "User-Agent": "terminal-shields" }
  });
  if (!res.ok) {
    cache.set(key, null);
    return null;
  }

  const path = extractPath(await res.text());
  cache.set(key, path);
  return path;
}
