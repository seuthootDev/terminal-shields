import express from "express";

import { inferTheme, toSvgColor } from "./colors.js";
import { formatMetric } from "./format.js";
import { fetchGithubLicense, fetchGithubStars } from "./github.js";
import { homePageHtml } from "./homePage.js";
import { fetchLogoPath } from "./logo.js";
import { fetchNpmVersion } from "./npm.js";
import { parseBadgePath } from "./parse.js";
import { renderBadge } from "./render.js";
import { resolveTheme } from "./themes.js";

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
      logo: pickLogo(req),
      blink: parseBlink(req.query),
      maxAge: 1800
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
