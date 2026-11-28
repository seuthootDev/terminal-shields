import { formatMetric } from "./format.js";

const HEADERS = { Accept: "application/json", "User-Agent": "terminal-shields" };

export async function fetchHexTotalDownloads(pkg) {
  const name = String(pkg ?? "").trim();
  if (!/^[a-z][a-z0-9_]*$/.test(name)) throw new Error("invalid Hex package name");

  const res = await fetch(`https://hex.pm/api/packages/${name}`, { headers: HEADERS });
  if (res.status === 404) throw new Error("package not found");
  if (!res.ok) throw new Error(`Hex.pm ${res.status}`);

  const data = await res.json();
  const count = data?.downloads?.all;
  if (!Number.isSafeInteger(count) || count < 0) throw new Error("no download count found");

  return {
    label: "downloads",
    message: formatMetric(count),
    color: count > 0 ? "brightgreen" : "lightgrey"
  };
}
