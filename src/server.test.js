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

test("?logoColor= paints the logo without changing the text colour", async (t) => {
  const server = app.listen(0, "127.0.0.1");
  t.after(() => new Promise((resolve) => server.close(resolve)));
  await once(server, "listening");
  const base = `http://127.0.0.1:${server.address().port}`;

  await t.test("named colour overrides the logo fill", async () => {
    const response = await fetch(base + "/?label=test&message=ok&logo=github&logoColor=red");
    assert.equal(response.status, 200);
    const body = await response.text();
    assert.match(body, /<path[^>]*fill="#ff5555"/);
    assert.match(body, /<text[^>]*fill="#ffe08a"/);
  });

  await t.test("hex value overrides the logo fill", async () => {
    const response = await fetch(base + "/?label=test&message=ok&logo=github&logoColor=00ff00");
    assert.equal(response.status, 200);
    const body = await response.text();
    assert.match(body, /<path[^>]*fill="#00ff00"/);
  });

  await t.test("unknown colour falls back to the text colour", async () => {
    const response = await fetch(base + "/?label=test&message=ok&logo=github&logoColor=banana");
    assert.equal(response.status, 200);
    const body = await response.text();
    assert.doesNotMatch(body, /#ff5555/);
    assert.match(body, /<path[^>]*fill="#ffe08a"/);
  });

  await t.test("missing logoColor keeps the text colour", async () => {
    const response = await fetch(base + "/?label=test&message=ok&logo=github");
    assert.equal(response.status, 200);
    const body = await response.text();
    assert.match(body, /<path[^>]*fill="#ffe08a"/);
  });
});
