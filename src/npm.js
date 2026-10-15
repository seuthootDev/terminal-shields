const NPM_REGISTRY = "https://registry.npmjs.org";

/** Registry path segment: express -> express, @scope/name -> @scope%2fname */
function registrySlug(packageName) {
  const name = String(packageName ?? "").trim().replace(/^\/+|\/+$/g, "");
  if (!name) throw new Error("package required");
  const slug = name.startsWith("@")
    ? `${name.slice(0, name.indexOf("/"))}%2f${name.slice(name.indexOf("/") + 1)}`
    : encodeURIComponent(name);
  return { name, slug };
}

function distTagsUrl(packageName) {
  const { name, slug } = registrySlug(packageName);
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

const COPYLEFT = /^(A?GPL|LGPL|MPL|EPL|EUPL|CDDL|OSL|CC-BY-SA)/i;

/**
 * License names from a package manifest. Handles the SPDX string form
 * ("MIT", "(MIT OR Apache-2.0)"), the legacy { type } object and the
 * legacy `licenses` array.
 */
export function npmLicenses(manifest) {
  const toName = (entry) => (typeof entry === "string" ? entry : entry?.type);
  const raw = manifest?.license != null ? [manifest.license] : manifest?.licenses ?? [];
  const list = Array.isArray(raw) ? raw : [raw];
  return list.map(toName).filter((name) => typeof name === "string" && name.trim()).map((name) => name.trim());
}

export function licenseColor(licenses) {
  if (!licenses.length) return "lightgrey";
  const ids = licenses.flatMap((l) => l.replace(/[()]/g, "").split(/\s+(?:OR|AND)\s+/i));
  return ids.every((id) => COPYLEFT.test(id)) ? "orange" : "green";
}

export async function fetchNpmLicense(packageName) {
  const { slug } = registrySlug(packageName);
  const res = await fetch(`${NPM_REGISTRY}/${slug}/latest`, {
    headers: { Accept: "application/json", "User-Agent": "terminal-shields" }
  });
  if (res.status === 404) throw new Error("package not found");
  if (!res.ok) throw new Error(`npm registry ${res.status}`);

  const licenses = npmLicenses(await res.json());
  return {
    label: "license",
    message: licenses.length ? licenses.join(", ") : "missing",
    color: licenseColor(licenses)
  };
}
