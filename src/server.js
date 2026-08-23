import express from "express";

import { inferTheme, toSvgColor } from "./colors.js";
import { formatMetric } from "./format.js";
import { fetchGithubLicense, fetchGithubStars } from "./github.js";
import { fetchNpmVersion } from "./npm.js";
import { parseBadgePath } from "./parse.js";
import { renderBadge } from "./render.js";
import { resolveTheme } from "./themes.js";

const app = express();
const PORT = Number.parseInt(process.env.PORT ?? "8000", 10);

function pickTheme(req, color) {
  return resolveTheme(req.query.theme)?.name ?? inferTheme(color);
}

function sendBadge(res, { label, message, color, theme, maxAge = 3600 }) {
  const svg = renderBadge({
    label,
    message,
    theme,
    fg: toSvgColor(color) ?? undefined
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
    sendBadge(res, {
      label: data.label,
      message: data.message,
      color,
      theme: pickTheme(req, color),
      maxAge: 1800
    });
  } catch (error) {
    sendError(res, String(error?.message ?? error));
  }
}

app.get(["/static/v1", "/static"], (req, res) => {
  const message = String(req.query.message ?? "").trim();
  if (!message) {
    sendError(res, "message required");
    return;
  }
  const label = String(req.query.label ?? "").trim();
  const color = String(req.query.color ?? "brightgreen");
  sendBadge(res, {
    label,
    message,
    color,
    theme: pickTheme(req, color)
  });
});

app.get(/^\/badge\/(.+)$/, (req, res) => {
  try {
    const parsed = parseBadgePath(req.params[0]);
    const color = String(req.query.color ?? parsed.color);
    sendBadge(res, {
      label: parsed.label,
      message: parsed.message,
      color,
      theme: pickTheme(req, color)
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

// Unscoped: /npm/v/express
// Scoped:   /npm/v/@scope/name
// Optional tag: ?tag=next  or  /npm/v/express/next  (unscoped only)
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

app.get("/", (req, res) => {
  if (req.query.label || req.query.message) {
    const message = String(req.query.message ?? "").trim();
    if (!message) {
      sendError(res, "message required");
      return;
    }
    const label = String(req.query.label ?? "").trim();
    const color = String(req.query.color ?? "brightgreen");
    sendBadge(res, {
      label,
      message,
      color,
      theme: pickTheme(req, color)
    });
    return;
  }

  res
    .type("html")
    .send(`<!doctype html>
<meta charset="utf-8">
<title>terminal-shields</title>
<body style="background:#0d1117;color:#c9d1d9;font-family:sans-serif;padding:32px">
  <h1>terminal-shields</h1>
  <p>Shields-style URLs, terminal one-liners.</p>
  <p>
    <img alt="stars" src="/badge/stars-128-yellow">
    <img alt="build" src="/badge/build-passing-brightgreen">
    <img alt="coverage" src="/badge/coverage-75%25-blue">
  </p>
  <p>
    <img alt="gh stars" src="/github/stars/badges/shields">
    <img alt="gh license" src="/github/license/badges/shields">
    <img alt="npm" src="/npm/v/express">
  </p>
  <pre>/badge/stars-128-yellow
/github/stars/badges/shields
/github/license/badges/shields
/npm/v/express
/npm/v/@babel/core
/static/v1?label=license&message=MIT&color=green&theme=green</pre>
</body>`);
});

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`terminal-shields listening on http://127.0.0.1:${PORT}`);
  });
}

export default app;
