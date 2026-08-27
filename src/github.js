import { formatRelativeDate } from "./format.js";

const GITHUB_API = "https://api.github.com";

function githubHeaders() {
  const headers = {
    Accept: "application/vnd.github+json",
    "User-Agent": "terminal-shields",
    "X-GitHub-Api-Version": "2022-11-28"
  };
  const token = process.env.GITHUB_TOKEN?.trim();
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

async function fetchRepo(user, repo) {
  const url = `${GITHUB_API}/repos/${encodeURIComponent(user)}/${encodeURIComponent(repo)}`;
  const res = await fetch(url, { headers: githubHeaders() });
  if (res.status === 404) {
    throw new Error("repo not found");
  }
  if (!res.ok) {
    throw new Error(`GitHub API ${res.status}`);
  }
  return res.json();
}

export async function fetchGithubStars(user, repo) {
  const data = await fetchRepo(user, repo);
  return {
    label: "stars",
    message: String(data.stargazers_count ?? 0),
    color: "yellow"
  };
}

export async function fetchGithubLicense(user, repo) {
  const data = await fetchRepo(user, repo);
  const spdx = data.license?.spdx_id;
  if (!spdx || spdx === "NOASSERTION") {
    return { label: "license", message: "unknown", color: "lightgrey" };
  }
  return { label: "license", message: spdx, color: "green" };
}

export async function fetchGithubLastCommit(user, repo, branch) {
  const params = branch ? `?sha=${encodeURIComponent(branch)}&per_page=1` : "?per_page=1";
  const url = `${GITHUB_API}/repos/${encodeURIComponent(user)}/${encodeURIComponent(repo)}/commits${params}`;
  const res = await fetch(url, { headers: githubHeaders() });
  if (res.status === 404) {
    throw new Error("repo not found");
  }
  if (!res.ok) {
    throw new Error(`GitHub API ${res.status}`);
  }
  const commits = await res.json();
  const dateStr = commits[0]?.commit?.committer?.date ?? commits[0]?.commit?.author?.date;
  if (!dateStr) {
    throw new Error("no commits found");
  }
  return {
    label: "last commit",
    message: formatRelativeDate(new Date(dateStr)),
    color: "blue"
  };
}
