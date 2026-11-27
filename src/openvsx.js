const HEADERS = { Accept: "application/json", "User-Agent": "terminal-shields" };

export async function fetchOpenVsxVersion(rawNamespace, rawExtension) {
  const namespace = String(rawNamespace ?? "").trim();
  if (!/^[A-Za-z0-9_-]+$/.test(namespace)) throw new Error("invalid namespace");
  const extension = String(rawExtension ?? "").trim();
  if (!/^[A-Za-z0-9_-]+$/.test(extension)) throw new Error("invalid extension");

  const response = await fetch(`https://open-vsx.org/api/${encodeURIComponent(namespace)}/${encodeURIComponent(extension)}`, { headers: HEADERS });
  if (response.status === 404) throw new Error("extension not found");
  if (!response.ok) throw new Error(`Open VSX ${response.status}`);

  const data = await response.json();
  const version = data.version;
  if (typeof version !== "string" || !version.trim()) throw new Error("no version found");
  return { label: "open vsx", message: `v${version.trim().replace(/^v/i, "")}`, color: "blue" };
}
