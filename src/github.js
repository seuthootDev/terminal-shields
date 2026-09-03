import { formatKbSize, formatRelativeDate } from "./format.js";

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

export async function fetchGithubForks(user, repo) {
  const data = await fetchRepo(user, repo);
  return {
    label: "forks",
    message: String(data.forks_count ?? 0),
    color: "grey"
  };
}

export async function fetchGithubWatchers(user, repo) {
  const data = await fetchRepo(user, repo);
  return {
    label: "watchers",
    message: String(data.subscribers_count ?? 0),
    color: "grey"
  };
}

export async function fetchGithubRepoSize(user, repo) {
  const data = await fetchRepo(user, repo);
  return {
    label: "repo size",
    message: formatKbSize(data.size ?? 0),
    color: "grey"
  };
}

async function fetchOpenIssueCount(user, repo, kind) {
  const q = [`repo:${encodeURIComponent(user)}/${encodeURIComponent(repo)}`, `type:${kind}`, "state:open"].join("+");
  const url = `${GITHUB_API}/search/issues?q=${q}&per_page=1`;
  const res = await fetch(url, { headers: githubHeaders() });
  if (!res.ok) {
    throw new Error(`GitHub API ${res.status}`);
  }
  const data = await res.json();
  return Number(data.total_count ?? 0);
}

export async function fetchGithubIssues(user, repo) {
  const count = await fetchOpenIssueCount(user, repo, "issue");
  return {
    label: "issues",
    message: String(count),
    color: count > 0 ? "yellow" : "brightgreen"
  };
}

export async function fetchGithubIssuesPr(user, repo) {
  const count = await fetchOpenIssueCount(user, repo, "pr");
  return {
    label: "PRs",
    message: String(count),
    color: count > 0 ? "yellow" : "brightgreen"
  };
}

function countFromLastPageLink(linkHeader, fallback) {
  const lastLink = linkHeader?.split(",").find((part) => /rel="last"/.test(part));
  const match = lastLink?.match(/[?&]page=(\d+)/);
  return match ? Number(match[1]) : fallback;
}

export async function fetchGithubContributors(user, repo) {
  const url = `${GITHUB_API}/repos/${encodeURIComponent(user)}/${encodeURIComponent(repo)}/contributors?per_page=1&anon=false`;
  const res = await fetch(url, { headers: githubHeaders() });
  if (res.status === 404) {
    throw new Error("repo not found");
  }
  if (!res.ok) {
    throw new Error(`GitHub API ${res.status}`);
  }
  const data = await res.json();
  const count = countFromLastPageLink(res.headers.get("link"), data.length);
  return {
    label: "contributors",
    message: String(count),
    color: "blue"
  };
}

export async function fetchGithubRelease(user, repo) {
  const latestUrl = `${GITHUB_API}/repos/${encodeURIComponent(user)}/${encodeURIComponent(repo)}/releases/latest`;
  const latestRes = await fetch(latestUrl, { headers: githubHeaders() });
  if (latestRes.ok) {
    const data = await latestRes.json();
    return { label: "release", message: data.tag_name, color: "blue" };
  }

  const tagsUrl = `${GITHUB_API}/repos/${encodeURIComponent(user)}/${encodeURIComponent(repo)}/tags?per_page=1`;
  const tagsRes = await fetch(tagsUrl, { headers: githubHeaders() });
  if (tagsRes.status === 404) {
    throw new Error("repo not found");
  }
  if (!tagsRes.ok) {
    throw new Error(`GitHub API ${tagsRes.status}`);
  }
  const tags = await tagsRes.json();
  if (!tags[0]?.name) {
    throw new Error("no release or tag found");
  }
  return { label: "release", message: tags[0].name, color: "blue" };
}

export async function fetchGithubWorkflowStatus(user, repo, workflow) {
  const url = `${GITHUB_API}/repos/${encodeURIComponent(user)}/${encodeURIComponent(repo)}/actions/workflows/${encodeURIComponent(workflow)}/runs?per_page=1`;
  const res = await fetch(url, { headers: githubHeaders() });
  if (res.status === 404) {
    throw new Error("workflow not found");
  }
  if (!res.ok) {
    throw new Error(`GitHub API ${res.status}`);
  }
  const data = await res.json();
  const run = data.workflow_runs?.[0];
  if (!run) {
    throw new Error("no workflow runs found");
  }
  const status = run.status === "completed" ? run.conclusion : run.status;
  const color = status === "success" ? "brightgreen" : status === "failure" ? "red" : "yellow";
  return { label: "build", message: status, color };
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
