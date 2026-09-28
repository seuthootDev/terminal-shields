import assert from "node:assert/strict";
import { test } from "node:test";

import { parseEndpointPayload } from "./endpoint.js";
import { hacktoberfestMessage, hacktoberfestPhase, topLanguage } from "./github.js";

test("hacktoberfest phase before, during, after October (UTC)", () => {
  assert.deepEqual(hacktoberfestPhase(2026, new Date("2026-09-28T12:00:00Z")), { phase: "before", days: 3 });
  assert.deepEqual(hacktoberfestPhase(2026, new Date("2026-10-01T00:00:00Z")), { phase: "during", days: 31 });
  assert.deepEqual(hacktoberfestPhase(2026, new Date("2026-10-31T23:00:00Z")), { phase: "during", days: 1 });
  assert.deepEqual(hacktoberfestPhase(2026, new Date("2026-11-01T00:00:00Z")), { phase: "after", days: 0 });
});

test("hacktoberfest message per phase", () => {
  assert.equal(hacktoberfestMessage({ phase: "before", days: 3 }), "3 days to go");
  assert.equal(hacktoberfestMessage({ phase: "before", days: 1 }, { issues: 1 }), "1 day to go, 1 open issue");
  assert.equal(
    hacktoberfestMessage({ phase: "during", days: 12 }, { issues: 4, prs: 1 }),
    "4 open issues, 1 PR, 12 days left"
  );
  assert.equal(hacktoberfestMessage({ phase: "during", days: 5 }, { prs: 0 }), "0 PRs, 5 days left");
  assert.equal(hacktoberfestMessage({ phase: "after", days: 0 }, { prs: 7 }), "is over! (7 PRs)");
});

test("top language picks largest share", () => {
  assert.deepEqual(topLanguage({ CSS: 100, JavaScript: 900 }), { name: "JavaScript", percent: "90.0%" });
  assert.equal(topLanguage({}), null);
  assert.equal(topLanguage(undefined), null);
});

test("endpoint payload maps Shields schema", () => {
  assert.deepEqual(
    parseEndpointPayload({ schemaVersion: 1, label: "hello", message: "sweet world", color: "orange" }),
    { label: "hello", message: "sweet world", color: "orange" }
  );
  assert.deepEqual(
    parseEndpointPayload({ schemaVersion: 1, message: 42, isError: true, namedLogo: "github", cacheSeconds: 60 }),
    { label: "", message: "42", color: "red", logo: "github", maxAge: 300 }
  );
});

test("endpoint payload rejects bad input", () => {
  assert.throws(() => parseEndpointPayload({ message: "x" }), /schemaVersion/);
  assert.throws(() => parseEndpointPayload({ schemaVersion: 1 }), /message required/);
  assert.throws(() => parseEndpointPayload({ schemaVersion: 1, message: "x", label: {} }), /label/);
  assert.throws(() => parseEndpointPayload([]), /invalid/);
});
