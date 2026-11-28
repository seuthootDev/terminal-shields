const HEADERS = { Accept: "application/json", "User-Agent": "terminal-shields" };

function coverageColor(pct) {
  if (pct < 70) return "red";
  if (pct < 80) return "yellow";
  if (pct < 90) return "yellowgreen";
  return "brightgreen";
}

export async function fetchCodecovCoverage(user, repo) {
  const owner = String(user ?? "").trim();
  const name = String(repo ?? "").trim();
  if (!owner || !name) throw new Error("user and repo required");
  const res = await fetch(
    `https://api.codecov.io/api/v2/github/${encodeURIComponent(owner)}/repos/${encodeURIComponent(name)}/`,
    { headers: HEADERS }
  );
  if (res.status === 404) throw new Error("repo not found");
  if (!res.ok) throw new Error(`Codecov ${res.status}`);
  const data = await res.json();
  const coverage = Number(data.totals?.coverage);
  if (!Number.isFinite(coverage)) throw new Error("no coverage found");
  const pct = Math.round(coverage);
  return { label: "coverage", message: `${pct}%`, color: coverageColor(pct) };
}
