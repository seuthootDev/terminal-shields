import assert from "node:assert/strict";
import { test } from "node:test";

import { fetchHexTotalDownloads } from "./hexpm.js";

test("Hex.pm total downloads uses the all-time count", async (t) => {
  const fetch = t.mock.method(globalThis, "fetch", async () =>
    Response.json({ downloads: { all: 90000000, day: 3, week: 15 } })
  );

  assert.deepEqual(await fetchHexTotalDownloads("phoenix"), {
    label: "downloads", message: "90M", color: "brightgreen"
  });
  assert.equal(fetch.mock.calls[0].arguments[0], "https://hex.pm/api/packages/phoenix");
});

test("Hex.pm total downloads preserves a real zero", async (t) => {
  t.mock.method(globalThis, "fetch", async () => Response.json({ downloads: { all: 0 } }));
  assert.deepEqual(await fetchHexTotalDownloads("demo"), {
    label: "downloads", message: "0", color: "lightgrey"
  });
});

test("Hex.pm total downloads reports a missing package or unavailable count", async (t) => {
  const fetch = t.mock.method(globalThis, "fetch", async () => Response.json({ downloads: {} }));
  fetch.mock.mockImplementationOnce(async () => new Response(null, { status: 404 }));

  await assert.rejects(fetchHexTotalDownloads("missing"), /package not found/);
  await assert.rejects(fetchHexTotalDownloads("demo"), /no download count found/);
});
