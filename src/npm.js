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
