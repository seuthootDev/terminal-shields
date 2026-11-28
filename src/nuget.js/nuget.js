const HEADERS = { Accept: "application/json", "User-Agent": "terminal-shields" };

function packageName(raw) {
  const name = String(raw ?? "").trim();
  if (!name) throw new Error("package required");
  return name;
}

export function pickLatestStableVersion(versions) {
  const list = Array.isArray(versions) ? versions : [];
  for (let index = list.length - 1; index >= 0; index -= 1) {
    const version = String(list[index] ?? "").trim();
    if (version && !version.includes("-")) return version;
  }
  return null;
}

export async function fetchNugetVersion(pkg) {
  const name = packageName(pkg).toLowerCase();
  const res = await fetch(`https://api.nuget.org/v3-flatcontainer/${encodeURIComponent(name)}/index.json`, { headers: HEADERS });
  if (res.status === 404) throw new Error("package not found");
  if (!res.ok) throw new Error(`NuGet ${res.status}`);

  const data = await res.json();
  const version = pickLatestStableVersion(data.versions);
  if (!version) throw new Error("no version found");
  return { label: "nuget", message: `v${String(version).replace(/^v/i, "")}`, color: "blue" };
}
