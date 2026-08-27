function normalizeUrl(raw) {
  const url = String(raw ?? "").trim();
  if (!url) throw new Error("url required");
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

export async function fetchWebsiteStatus(rawUrl, { upMessage = "up", downMessage = "down" } = {}) {
  const url = normalizeUrl(rawUrl);
  let up = false;
  try {
    const res = await fetch(url, { method: "GET", redirect: "follow" });
    up = res.ok;
  } catch {
    up = false;
  }
  return up
    ? { label: "website", message: upMessage, color: "brightgreen" }
    : { label: "website", message: downMessage, color: "red" };
}
