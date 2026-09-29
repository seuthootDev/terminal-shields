import { formatKbSize, formatRelativeDate } from "./format.js";

const GITHUB_API = "https://api.github.com";
const DAY_MS = 24 * 60 * 60 * 1000;

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

async function searchIssueCount(user, repo, qualifiers) {
  const q = [`repo:${user}/${repo}`, ...qualifiers].join(" ");
  const url = `${GITHUB_API}/search/issues?q=${encodeURIComponent(q)}&per_page=1`;
  const res = await fetch(url, { headers: githubHeaders() });
  if (res.status === 422) {
    throw new Error("repo not found");
  }
  if (!res.ok) {
    throw new Error(`GitHub API ${res.status}`);
  }
  const data = await res.json();
  return Number(data.total_count ?? 0);
}

function fetchOpenIssueCount(user, repo, kind) {
  return searchIssueCount(user, repo, [`type:${kind}`, "state:open"]);
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

const COMMIT_INTERVALS = {
  w: { days: 7, unit: "week" },
  m: { days: 30, unit: "month" },
  y: { days: 365, unit: "year" },
  t: { days: null, unit: null }
};

export async function fetchGithubCommitActivity(user, repo, interval, branch, now = new Date()) {
  const spec = COMMIT_INTERVALS[interval];
  if (!spec) {
    throw new Error("interval must be w, m, y or t");
  }
  const params = new URLSearchParams({ per_page: "1" });
  if (branch) params.set("sha", branch);
  if (spec.days) params.set("since", new Date(now.getTime() - spec.days * DAY_MS).toISOString());
  const url = `${GITHUB_API}/repos/${encodeURIComponent(user)}/${encodeURIComponent(repo)}/commits?${params}`;
  const res = await fetch(url, { headers: githubHeaders() });
  if (res.status === 404) {
    throw new Error("repo not found");
  }
  if (res.status === 409) {
    // empty repository
    return { label: "commit activity", count: 0, unit: spec.unit, color: "lightgrey" };
  }
  if (!res.ok) {
    throw new Error(`GitHub API ${res.status}`);
  }
  const data = await res.json();
  const count = countFromLastPageLink(res.headers.get("link"), data.length);
  return {
    label: spec.unit ? "commit activity" : "commits",
    count,
    unit: spec.unit,
    color: count > 0 ? "blue" : "lightgrey"
  };
}

export async function fetchGithubTopLanguage(user, repo) {
  const url = `${GITHUB_API}/repos/${encodeURIComponent(user)}/${encodeURIComponent(repo)}/languages`;
  const res = await fetch(url, { headers: githubHeaders() });
  if (res.status === 404) {
    throw new Error("repo not found");
  }
  if (!res.ok) {
    throw new Error(`GitHub API ${res.status}`);
  }
  const top = topLanguage(await res.json());
  if (!top) {
    return { label: "language", message: "none", color: "lightgrey" };
  }
  return { label: top.name.toLowerCase(), message: top.percent, color: "blue" };
}

/** { JavaScript: 900, CSS: 100 } -> { name: "JavaScript", percent: "90.0%" } */
export function topLanguage(bytesByLanguage) {
  const entries = Object.entries(bytesByLanguage ?? {});
  const total = entries.reduce((sum, [, bytes]) => sum + bytes, 0);
  if (!total) return null;
  const [name, bytes] = entries.reduce((best, entry) => (entry[1] > best[1] ? entry : best));
  return { name, percent: `${((bytes / total) * 100).toFixed(1)}%` };
}

function plural(n, word, suffix = "s") {
  return `${n} ${word}${n === 1 ? "" : suffix}`;
}

/** Where `now` falls relative to October of `year` (UTC). */
export function hacktoberfestPhase(year, now = new Date()) {
  const start = Date.UTC(year, 9, 1);
  const end = Date.UTC(year, 10, 1);
  const t = now.getTime();
  if (t < start) return { phase: "before", days: Math.ceil((start - t) / DAY_MS) };
  if (t < end) return { phase: "during", days: Math.ceil((end - t) / DAY_MS) };
  return { phase: "after", days: 0 };
}

export function hacktoberfestMessage({ phase, days }, { issues = 0, prs = 0 } = {}) {
  if (phase === "before") {
    const lead = `${plural(days, "day")} to go`;
    return issues > 0 ? `${lead}, ${plural(issues, "open issue")}` : lead;
  }
  if (phase === "during") {
    const parts = [];
    if (issues > 0) parts.push(plural(issues, "open issue"));
    parts.push(plural(prs, "PR"));
    parts.push(`${plural(days, "day")} left`);
    return parts.join(", ");
  }
  return `is over! (${plural(prs, "PR")})`;
}

export async function fetchGithubHacktoberfest(user, repo, year, suggestionLabel = "hacktoberfest", now = new Date()) {
  if (!/^\d{4}$/.test(String(year))) {
    throw new Error("invalid year");
  }
  const y = Number(year);
  const phase = hacktoberfestPhase(y, now);
  const [issues, prs] = await Promise.all([
    phase.phase === "after"
      ? 0
      : searchIssueCount(user, repo, ["is:issue", "is:open", `label:"${suggestionLabel.replaceAll('"', "")}"`]),
    phase.phase === "before"
      ? 0
      : searchIssueCount(user, repo, ["is:pr", `created:${y}-10-01..${y}-10-31`])
  ]);
  const color = { before: "blue", during: "orange", after: "grey" }[phase.phase];
  return {
    label: `hacktoberfest ${y}`,
    message: hacktoberfestMessage(phase, { issues, prs }),
    color
  };
}
