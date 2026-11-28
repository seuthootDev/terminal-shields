import assert from "node:assert/strict";
import { test } from "node:test";

import { fetchPubVersion } from "./pub.js";

test("pub reads the published version from its registry", async (t) => {
  const fetch = t.mock.method(globalThis, "fetch", async () => Response.json({ latest: { version: "1.6.0" }, versions: [{ version: "1.2.0" }] }));
  assert.deepEqual(await fetchPubVersion("http"), { label: "pub", message: "v1.6.0", color: "blue" });
  assert.equal(fetch.mock.calls[0].arguments[0], "https://pub.dev/api/packages/http");
});

test("pub reports missing resources and invalid registry responses", async (t) => {
  const fetch = t.mock.method(globalThis, "fetch", async () => Response.json({}));
  fetch.mock.mockImplementationOnce(async () => new Response(null, { status: 404 }));
  await assert.rejects(fetchPubVersion("missing"), /not found/);
  await assert.rejects(fetchPubVersion("http"), /no version found/);
});
