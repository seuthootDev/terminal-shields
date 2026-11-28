const HEADERS = { Accept: "application/json", "User-Agent": "terminal-shields" };

export async function fetchWordPressPluginVersion(rawName) {
  const slug = String(rawName ?? "").trim().toLowerCase();
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error("invalid WordPress plugin slug");

  const query = new URLSearchParams({ action: "plugin_information", "request[slug]": slug });
  const res = await fetch(`https://api.wordpress.org/plugins/info/1.2/?${query}`, { headers: HEADERS });
  if (res.status === 404) throw new Error("plugin not found");
  if (!res.ok) throw new Error(`WordPress.org ${res.status}`);

  const data = await res.json();
  if (data?.error) throw new Error("plugin not found");
  const version = data?.version;
  if (typeof version !== "string" || !version.trim()) throw new Error("no version found");
  return { label: "wordpress plugin", message: `v${version.trim().replace(/^v/i, "")}`, color: "blue" };
}
