import assert from "node:assert/strict";
import { test } from "node:test";

import { fetchWordPressPluginVersion } from "./wordpress.js";

test("wordpress reads the published version from its registry", async (t) => {
  const fetch = t.mock.method(globalThis, "fetch", async () => Response.json({ version: "5.7.2", name: "Akismet" }));
  assert.deepEqual(await fetchWordPressPluginVersion("akismet"), { label: "wordpress plugin", message: "v5.7.2", color: "blue" });
  const url = new URL(fetch.mock.calls[0].arguments[0]);
  assert.equal(url.origin, "https://api.wordpress.org");
  assert.equal(url.searchParams.get("action"), "plugin_information");
  assert.equal(url.searchParams.get("request[slug]"), "akismet");
});

test("wordpress reports missing resources and invalid registry responses", async (t) => {
  const fetch = t.mock.method(globalThis, "fetch", async () => Response.json({}));
  fetch.mock.mockImplementationOnce(async () => new Response(null, { status: 404 }));
  await assert.rejects(fetchWordPressPluginVersion("missing"), /not found/);
  await assert.rejects(fetchWordPressPluginVersion("akismet"), /no version found/);
});
