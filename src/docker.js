import { formatRelativeDate } from "./format.js";

const DOCKER_HUB = "https://hub.docker.com/v2/repositories";
const HEADERS = { Accept: "application/json", "User-Agent": "terminal-shields" };

/** Shields convention: `_` means an official image (Docker Hub `library/`). */
function repoPath(user, repo) {
  const owner = String(user ?? "").trim();
  const name = String(repo ?? "").trim();
  if (!owner || !name) throw new Error("user and repo required");
  return `${owner === "_" ? "library" : encodeURIComponent(owner)}/${encodeURIComponent(name)}`;
}

async function fetchDockerJson(url, notFound) {
  const res = await fetch(url, { headers: HEADERS });
  if (res.status === 404) throw new Error(notFound);
  if (!res.ok) throw new Error(`Docker Hub ${res.status}`);
  return res.json();
}

export async function fetchDockerPulls(user, repo) {
  const data = await fetchDockerJson(`${DOCKER_HUB}/${repoPath(user, repo)}/`, "repository not found");
  return { label: "docker pulls", count: Number(data.pull_count ?? 0), color: "blue" };
}

/**
 * Newest push across all tags, or a single tag's push date when `tag` is set
 * (mirrors Shields' DockerLastUpdated).
 */
export async function fetchDockerLastUpdated(user, repo, tag, now = new Date()) {
  const base = `${DOCKER_HUB}/${repoPath(user, repo)}/tags`;
  const url = tag ? `${base}/${encodeURIComponent(tag)}` : `${base}?page_size=1&ordering=last_updated`;
  const data = await fetchDockerJson(url, "repository or tag not found");
  const dateStr = tag ? data.last_updated : data.results?.[0]?.last_updated;
  if (!dateStr) throw new Error("no tags found");
  return {
    label: "last updated",
    message: formatRelativeDate(new Date(dateStr), now),
    color: "blue"
  };
}
