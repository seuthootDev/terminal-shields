const NPM_REGISTRY = "https://registry.npmjs.org";

function distTagsUrl(packageName) {
  const name = String(packageName ?? "").trim().replace(/^\/+|\/+$/g, "");
  if (!name) throw new Error("package required");
  // /-/package/@scope%2fname/dist-tags
  const slug = name.startsWith("@")
    ? `${name.slice(0, name.indexOf("/"))}%2f${name.slice(name.indexOf("/") + 1)}`
    : encodeURIComponent(name);
  return { name, url: `${NPM_REGISTRY}/-/package/${slug}/dist-tags` };
}

export async function fetchNpmVersion(packageName, tag = "latest") {
  const { url } = distTagsUrl(packageName);
  const res = await fetch(url, {
    headers: { Accept: "application/json", "User-Agent": "terminal-shields" }
  });
  if (res.status === 404) throw new Error("package not found");
  if (!res.ok) throw new Error(`npm registry ${res.status}`);

  const tags = await res.json();
  const version = tags[tag];
  if (!version) throw new Error(`tag '${tag}' not found`);

  return {
    label: tag === "latest" ? "npm" : `npm@${tag}`,
    message: `v${String(version).replace(/^v/i, "")}`,
    color: "blue"
  };
}

const NPM_DOWNLOADS = "https://api.npmjs.org/downloads/point";

const DOWNLOAD_PERIODS = {
  dw: { period: "last-week", unit: "week" },
  dm: { period: "last-month", unit: "month" },
  dy: { period: "last-year", unit: "year" }
};

export async function fetchNpmDownloads(packageName, interval) {
  const spec = DOWNLOAD_PERIODS[interval];
  if (!spec) throw new Error("interval must be dw, dm or dy");
  const name = String(packageName ?? "").trim().replace(/^\/+|\/+$/g, "");
  if (!name) throw new Error("package required");

  // point API takes scoped names as-is: /last-month/@scope/name
  const slug = name.startsWith("@") ? name : encodeURIComponent(name);
  const res = await fetch(`${NPM_DOWNLOADS}/${spec.period}/${slug}`, {
    headers: { Accept: "application/json", "User-Agent": "terminal-shields" }
  });
  if (res.status === 404) throw new Error("package not found");
  if (!res.ok) throw new Error(`npm downloads ${res.status}`);

  const data = await res.json();
  const count = Number(data.downloads ?? 0);
  return {
    label: "downloads",
    count,
    unit: spec.unit,
    color: count > 0 ? "brightgreen" : "lightgrey"
  };
}
