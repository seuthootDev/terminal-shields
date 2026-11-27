import assert from "node:assert/strict";
import { once } from "node:events";
import { test } from "node:test";

// Import the serverless app without binding the development port.
process.env.VERCEL = "1";
const { default: app } = await import("./server.js");

test("unknown routes render an error badge and known routes still work", async (t) => {
  const server = app.listen(0, "127.0.0.1");
  t.after(() => new Promise((resolve) => server.close(resolve)));
  await once(server, "listening");
  const base = `http://127.0.0.1:${server.address().port}`;

  for (const path of ["/pypi/dy/requests", "/npm/dd/express", "/github/stars/onlyuser", "/unknown"]) {
    await t.test(path, async () => {
      const response = await fetch(base + path);
      assert.match(response.headers.get("content-type"), /^image\/svg\+xml/);
      assert.equal(response.headers.get("cache-control"), "no-store");
      const body = await response.text();
      assert.match(body, /<svg/);
      assert.match(body, /UNKNOWN BADGE/);
    });
  }

  const home = await fetch(base + "/");
  assert.equal(home.status, 200);
  assert.match(home.headers.get("content-type"), /^text\/html/);
  const badge = await fetch(base + "/?label=test&message=ok");
  assert.equal(badge.status, 200);
  assert.match(badge.headers.get("content-type"), /^image\/svg\+xml/);
});

test("?label= overrides the label on a live service badge", async (t) => {
  const realFetch = globalThis.fetch;
  t.mock.method(globalThis, "fetch", async (url, ...args) => {
    if (String(url).startsWith("http://127.0.0.1")) {
      return realFetch(url, ...args);
    }
    return Response.json({ version: "7.1.3", downloads: 12000000 });
  });

  const server = app.listen(0, "127.0.0.1");
  t.after(() => new Promise((resolve) => server.close(resolve)));
  await once(server, "listening");
  const base = `http://127.0.0.1:${server.address().port}`;
  const res = await fetch(`${base}/gem/v/rails?label=likes`);
  assert.equal(res.status, 200);
  const body = await res.text();
  assert.match(body, /\$ likes: v7\.1\.3/);
  assert.doesNotMatch(body, /gem:/);
  const fallback = await fetch(`${base}/gem/v/rails`);
  assert.equal(fallback.status, 200);
  const fallbackBody = await fallback.text();
  assert.match(fallbackBody, /\$ gem: v7\.1\.3/);
});
