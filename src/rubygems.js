const HEADERS = { Accept: "application/json", "User-Agent": "terminal-shields" };

export async function fetchRubyGemsVersion(gem) {
  const name = String(gem ?? "").trim();
  if (!name) throw new Error("gem required");

  const res = await fetch(`https://rubygems.org/api/v1/gems/${encodeURIComponent(name)}.json`, {
    headers: HEADERS
  });
  if (res.status === 404) throw new Error("gem not found");
  if (!res.ok) throw new Error(`RubyGems ${res.status}`);

  const { version } = await res.json();
  if (typeof version !== "string" || !version) throw new Error("no version found");
  return { label: "gem", message: `v${version.replace(/^v/i, "")}`, color: "blue" };
}
