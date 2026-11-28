const HEADERS = { Accept: "application/json", "User-Agent": "terminal-shields" };

export async function fetchCranVersion(rawPkg) {
  const pkg = String(rawPkg ?? "").trim();
  if (!/^[A-Za-z][A-Za-z0-9.]*$/.test(pkg)) throw new Error("invalid package");

  const response = await fetch(`https://crandb.r-pkg.org/${encodeURIComponent(pkg)}`, { headers: HEADERS });
  if (response.status === 404) throw new Error("package not found");
  if (!response.ok) throw new Error(`CRAN ${response.status}`);

  const data = await response.json();
  const version = data.Version;
  if (typeof version !== "string" || !version.trim()) throw new Error("no version found");
  return { label: "cran", message: `v${version.trim().replace(/^v/i, "")}`, color: "blue" };
}
