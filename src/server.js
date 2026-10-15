import express from "express";

import { inferTheme, toSvgColor } from "./colors.js";
import { fetchDockerLastUpdated, fetchDockerPulls } from "./docker.js";
import { fetchDynamicJsonBadge } from "./dynamic.js";
import { fetchEndpointBadge } from "./endpoint.js";
import { formatMetric } from "./format.js";
import {
  fetchGithubBranches,
  fetchGithubCommitActivity,
  fetchGithubContributors,
  fetchGithubForks,
  fetchGithubHacktoberfest,
  fetchGithubIssues,
  fetchGithubIssuesPr,
  fetchGithubLastCommit,
  fetchGithubLicense,
  fetchGithubRelease,
  fetchGithubRepoSize,
  fetchGithubStars,
  fetchGithubTopLanguage,
  fetchGithubWatchers,
  fetchGithubWorkflowStatus,
  parseDraftFilter
} from "./github.js";
import { homePageHtml } from "./homePage.js";
import { fetchLogoPath } from "./logo.js";
import { fetchNpmDownloads, fetchNpmLicense, fetchNpmVersion } from "./npm.js";
import { parseBadgePath } from "./parse.js";
import { fetchPypiDownloads, fetchPypiVersion } from "./pypi.js";
import { renderBadge } from "./render.js";
import { resolveTheme } from "./themes.js";
import { fetchWebsiteStatus } from "./website.js";

const app = express();
const PORT = Number.parseInt(process.env.PORT ?? "8000", 10);

function pickTheme(req, color) {
  return resolveTheme(req.query.theme)?.name ?? inferTheme(color);
}

function parseBlink(query) {
  const value = String(query?.blink ?? "").trim().toLowerCase();
  return value === "1" || value === "true" || value === "on";
}

function pickBg(req) {
  const raw = String(req.query.bg ?? "").trim();
  return raw || undefined;
}

function pickLogo(req) {
  const raw = String(req.query.logo ?? "").trim();
  return raw || undefined;
}

async function sendBadge(res, { label, message, color, theme, bg, logo, blink = false, maxAge = 3600 }) {
  let logoPath = null;
  if (logo) {
    try {
      logoPath = await fetchLogoPath(logo);
    } catch {
      logoPath = null;
    }
  }

  const svg = renderBadge({
    label,
    message,
    theme,
    fg: toSvgColor(color) ?? undefined,
    bg,
    blink,
    logoPath
  });
  res.set("Cache-Control", `public, max-age=${maxAge}`);
  res.type("image/svg+xml").send(svg);
}

function sendError(res, message) {
  const svg = renderBadge({
    label: "error",
    message,
    theme: "green",
    fg: "#dd4343"
  });
  res.set("Cache-Control", "no-store");
  res.type("image/svg+xml").status(200).send(svg);
}

async function sendServiceBadge(req, res, loader) {
  try {
    const data = await loader();
    const color = String(req.query.color ?? data.color);
    await sendBadge(res, {
      label: data.label,
      message: data.message,
      color,
      theme: pickTheme(req, color),
      bg: pickBg(req),
      logo: pickLogo(req) ?? data.logo,
      blink: parseBlink(req.query),
      maxAge: data.maxAge ?? 1800
    });
  } catch (error) {
    sendError(res, String(error?.message ?? error));
  }
}

app.get(["/static/v1", "/static"], async (req, res) => {
  const message = String(req.query.message ?? "").trim();
  if (!message) {
    sendError(res, "message required");
    return;
  }
  const label = String(req.query.label ?? "").trim();
  const color = String(req.query.color ?? "brightgreen");
  await sendBadge(res, {
    label,
    message,
    color,
    theme: pickTheme(req, color),
    bg: pickBg(req),
    logo: pickLogo(req),
    blink: parseBlink(req.query)
  });
});

app.get("/badge/dynamic/json", async (req, res) => {
  const { url, query, prefix, suffix } = req.query;
  const label = req.query.label == null ? undefined : String(req.query.label);
  await sendServiceBadge(req, res, () =>
    fetchDynamicJsonBadge({ url, query, label, prefix: String(prefix ?? ""), suffix: String(suffix ?? "") })
  );
});

app.get(/^\/badge\/(.+)$/, async (req, res) => {
  try {
    const parsed = parseBadgePath(req.params[0]);
    const color = String(req.query.color ?? parsed.color);
    await sendBadge(res, {
      label: parsed.label,
      message: parsed.message,
      color,
      theme: pickTheme(req, color),
      bg: pickBg(req),
      logo: pickLogo(req),
      blink: parseBlink(req.query)
    });
  } catch (error) {
    sendError(res, String(error?.message ?? error));
  }
});

app.get("/github/stars/:user/:repo", async (req, res) => {
  const { user, repo } = req.params;
  await sendServiceBadge(req, res, async () => {
    const data = await fetchGithubStars(user, repo);
    return { ...data, message: formatMetric(data.message) };
  });
});

app.get("/github/license/:user/:repo", async (req, res) => {
  const { user, repo } = req.params;
  await sendServiceBadge(req, res, () => fetchGithubLicense(user, repo));
});

app.get("/github/last-commit/:user/:repo", async (req, res) => {
  const { user, repo } = req.params;
  const branch = String(req.query.branch ?? "").trim() || undefined;
  await sendServiceBadge(req, res, () => fetchGithubLastCommit(user, repo, branch));
});

app.get("/github/forks/:user/:repo", async (req, res) => {
  const { user, repo } = req.params;
  await sendServiceBadge(req, res, async () => {
    const data = await fetchGithubForks(user, repo);
    return { ...data, message: formatMetric(data.message) };
  });
});

app.get("/github/watchers/:user/:repo", async (req, res) => {
  const { user, repo } = req.params;
  await sendServiceBadge(req, res, async () => {
    const data = await fetchGithubWatchers(user, repo);
    return { ...data, message: formatMetric(data.message) };
  });
});

app.get("/github/contributors/:user/:repo", async (req, res) => {
  const { user, repo } = req.params;
  await sendServiceBadge(req, res, async () => {
    const data = await fetchGithubContributors(user, repo);
    return { ...data, message: formatMetric(data.message) };
  });
});

app.get("/github/issues/:user/:repo", async (req, res) => {
  const { user, repo } = req.params;
  await sendServiceBadge(req, res, () => fetchGithubIssues(user, repo));
});

app.get("/github/issues-pr/:user/:repo", async (req, res) => {
  const { user, repo } = req.params;
  await sendServiceBadge(req, res, () => fetchGithubIssuesPr(user, repo, parseDraftFilter(req.query.draft)));
});

app.get("/github/branches/:user/:repo", async (req, res) => {
  const { user, repo } = req.params;
  await sendServiceBadge(req, res, () => fetchGithubBranches(user, repo));
});

app.get("/github/repo-size/:user/:repo", async (req, res) => {
  const { user, repo } = req.params;
  await sendServiceBadge(req, res, () => fetchGithubRepoSize(user, repo));
});

app.get("/github/v/release/:user/:repo", async (req, res) => {
  const { user, repo } = req.params;
  await sendServiceBadge(req, res, () => fetchGithubRelease(user, repo));
});

app.get("/github/actions/workflow/status/:user/:repo/:workflow", async (req, res) => {
  const { user, repo, workflow } = req.params;
  await sendServiceBadge(req, res, () => fetchGithubWorkflowStatus(user, repo, workflow));
});

app.get("/github/commit-activity/:interval/:user/:repo", async (req, res) => {
  const { interval, user, repo } = req.params;
  const branch = String(req.query.branch ?? "").trim() || undefined;
  await sendServiceBadge(req, res, async () => {
    const data = await fetchGithubCommitActivity(user, repo, interval, branch);
    const count = formatMetric(data.count);
    return { ...data, message: data.unit ? `${count}/${data.unit}` : count };
  });
});

app.get("/github/languages/top/:user/:repo", async (req, res) => {
  const { user, repo } = req.params;
  await sendServiceBadge(req, res, () => fetchGithubTopLanguage(user, repo));
});

app.get("/github/hacktoberfest/:year/:user/:repo", async (req, res) => {
  const { year, user, repo } = req.params;
  const label = String(req.query.suggestion_label ?? "").trim() || undefined;
  await sendServiceBadge(req, res, () => fetchGithubHacktoberfest(user, repo, year, label));
});

app.get("/endpoint", async (req, res) => {
  await sendServiceBadge(req, res, () => fetchEndpointBadge(req.query.url));
});

app.get("/website", async (req, res) => {
  const upMessage = String(req.query.upMessage ?? "up").trim() || "up";
  const downMessage = String(req.query.downMessage ?? "down").trim() || "down";
  await sendServiceBadge(req, res, () =>
    fetchWebsiteStatus(req.query.url, { upMessage, downMessage })
  );
});

function downloadsBadge(data) {
  return { ...data, message: `${formatMetric(data.count)}/${data.unit}` };
}

app.get("/npm/:interval(dw|dm|dy)/@:scope/:pkg", async (req, res) => {
  const pkg = `@${req.params.scope}/${req.params.pkg}`;
  await sendServiceBadge(req, res, async () => downloadsBadge(await fetchNpmDownloads(pkg, req.params.interval)));
});

app.get("/npm/:interval(dw|dm|dy)/:pkg", async (req, res) => {
  const { interval, pkg } = req.params;
  await sendServiceBadge(req, res, async () => downloadsBadge(await fetchNpmDownloads(pkg, interval)));
});

app.get("/npm/l/@:scope/:pkg", async (req, res) => {
  const pkg = `@${req.params.scope}/${req.params.pkg}`;
  await sendServiceBadge(req, res, () => fetchNpmLicense(pkg));
});

app.get("/npm/l/:pkg", async (req, res) => {
  await sendServiceBadge(req, res, () => fetchNpmLicense(req.params.pkg));
});

app.get("/npm/v/@:scope/:pkg", async (req, res) => {
  const tag = String(req.query.tag ?? "latest").trim() || "latest";
  const pkg = `@${req.params.scope}/${req.params.pkg}`;
  await sendServiceBadge(req, res, () => fetchNpmVersion(pkg, tag));
});

app.get("/npm/v/:pkg/:tag?", async (req, res) => {
  const pkg = req.params.pkg;
  const tag = String(req.params.tag ?? req.query.tag ?? "latest").trim() || "latest";
  await sendServiceBadge(req, res, () => fetchNpmVersion(pkg, tag));
});

app.get("/pypi/v/:pkg", async (req, res) => {
  await sendServiceBadge(req, res, () => fetchPypiVersion(req.params.pkg));
});

app.get("/pypi/:interval(dd|dw|dm)/:pkg", async (req, res) => {
  const { interval, pkg } = req.params;
  await sendServiceBadge(req, res, async () => downloadsBadge(await fetchPypiDownloads(pkg, interval)));
});

app.get("/docker/pulls/:user/:repo", async (req, res) => {
  const { user, repo } = req.params;
  await sendServiceBadge(req, res, async () => {
    const data = await fetchDockerPulls(user, repo);
    return { ...data, message: formatMetric(data.count) };
  });
});

app.get("/docker/last-updated/:user/:repo/:tag?", async (req, res) => {
  const { user, repo, tag } = req.params;
  await sendServiceBadge(req, res, () => fetchDockerLastUpdated(user, repo, tag));
});

app.get("/", async (req, res) => {
  if (req.query.label || req.query.message) {
    const message = String(req.query.message ?? "").trim();
    if (!message) {
      sendError(res, "message required");
      return;
    }
    const label = String(req.query.label ?? "").trim();
    const color = String(req.query.color ?? "brightgreen");
    await sendBadge(res, {
      label,
      message,
      color,
      theme: pickTheme(req, color),
      bg: pickBg(req),
      logo: pickLogo(req),
      blink: parseBlink(req.query)
    });
    return;
  }

  res.type("html").send(homePageHtml());
});

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`terminal-shields listening on http://127.0.0.1:${PORT}`);
  });
}

export default app;
