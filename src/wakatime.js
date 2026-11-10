const WAKATIME_BADGE = "https://wakatime.com/badge";
const HEADERS = { Accept: "image/svg+xml", "User-Agent": "terminal-shields" };

// WakaTime draws the value twice (shadow + visible text); the visible one is the
// last <text>, immediately followed by an <a> element (same matcher as Shields).
const VALUE_MATCHER = />([^<>]+)<\/text><a/;

function segment(raw, name) {
  const value = String(raw ?? "").trim();
  if (!value) throw new Error(`${name} required`);
  return encodeURIComponent(value);
}

/** Pull the coding-time text out of a WakaTime SVG badge. */
export function parseWakatimeSvg(svg) {
  const match = String(svg ?? "").match(VALUE_MATCHER);
  const value = match?.[1]?.trim();
  if (!value) throw new Error("unparseable wakatime badge");
  return value;
}

async function fetchCodingTime(path) {
  const res = await fetch(`${WAKATIME_BADGE}/${path}.svg`, { headers: HEADERS });
  if (res.status === 404) throw new Error("not found");
  if (!res.ok) throw new Error(`WakaTime ${res.status}`);
  return { label: "wakatime", message: parseWakatimeSvg(await res.text()), color: "blue" };
}

/** `user` is the UUID from the WakaTime profile badge snippet, not the username. */
export function fetchWakatimeUser(user) {
  return fetchCodingTime(`user/${segment(user, "user")}`);
}

export function fetchWakatimeUserProject(user, project) {
  return fetchCodingTime(`user/${segment(user, "user")}/project/${segment(project, "project")}`);
}

export function fetchWakatimeRepo(owner, repo) {
  return fetchCodingTime(`github/${segment(owner, "owner")}/${segment(repo, "repo")}`);
}
