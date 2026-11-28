const HEADERS = { Accept: "application/json", "User-Agent": "terminal-shields" };

export async function fetchPubVersion(rawName) {
  const name = String(rawName ?? "").trim();
  if (!/^[a-z_][a-z0-9_]*$/.test(name)) throw new Error("invalid pub package name");

  const res = await fetch(`https://pub.dev/api/packages/${name}`, { headers: HEADERS });
  if (res.status === 404) throw new Error("package not found");
  if (!res.ok) throw new Error(`pub.dev ${res.status}`);

  const data = await res.json();
  const version = data?.latest?.version;
  if (typeof version !== "string" || !version.trim()) throw new Error("no version found");
  return { label: "pub", message: `v${version.trim().replace(/^v/i, "")}`, color: "blue" };
}
