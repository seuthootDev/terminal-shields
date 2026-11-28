import assert from "node:assert/strict";
import { test } from "node:test";

import { fetchCodecovCoverage } from "./codecov.js";
import { queryJson } from "./dynamic.js";
import { fetchDockerImageSize } from "./docker.js";
import { parseEndpointPayload } from "./endpoint.js";
import { formatMetric } from "./format.js";
import { fetchGithubFollowers, hacktoberfestMessage, hacktoberfestPhase, isContributorListTooLarge, issueDetailState, parseDraftFilter, topLanguage } from "./github.js";
import { fetchHomebrewVersion } from "./homebrew.js";
import { licenseColor, npmLicenses } from "./npm.js";
import { fetchRubyGemsVersion } from "./rubygems.js";
import { parseWakatimeSvg } from "./wakatime.js";

test("RubyGems version uses the published gem version", async (t) => {
  const fetch = t.mock.method(globalThis, "fetch", async () =>
    Response.json({ version: "7.1.3", downloads: 120000000 })
  );
  assert.deepEqual(await fetchRubyGemsVersion("rails"), {
    label: "gem", message: "v7.1.3", color: "blue"
  });
  assert.equal(fetch.mock.calls[0].arguments[0], "https://rubygems.org/api/v1/gems/rails.json");
});

test("RubyGems version reports a missing gem", async (t) => {
  t.mock.method(globalThis, "fetch", async () => new Response(null, { status: 404 }));
  await assert.rejects(fetchRubyGemsVersion("missing-gem"), /gem not found/);
});

test("Docker image size uses the default tag and follows the official image convention", async (t) => {
  const fetch = t.mock.method(globalThis, "fetch", async () =>
    Response.json({ full_size: 45 * 1024 ** 2 })
  );
  assert.deepEqual(await fetchDockerImageSize("_", "alpine"), {
    label: "image size", message: "45 MB", color: "blue"
  });
  assert.equal(fetch.mock.calls[0].arguments[0], "https://hub.docker.com/v2/repositories/library/alpine/tags/latest");
});

test("Docker image size requests an explicit tag and checks for a size", async (t) => {
  const fetch = t.mock.method(globalThis, "fetch", async () => Response.json({}));
  await assert.rejects(fetchDockerImageSize("team", "image", "v1.2"), /no image size found/);
  assert.equal(fetch.mock.calls[0].arguments[0], "https://hub.docker.com/v2/repositories/team/image/tags/v1.2");
});

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

test("endpoint message override, except for isError payloads", () => {
  const payload = { schemaVersion: 1, label: "hey", message: "yo" };
  assert.equal(parseEndpointPayload(payload, { message: "custom" }).message, "custom");
  assert.equal(parseEndpointPayload(payload, { message: "hello & world" }).message, "hello & world");
  assert.equal(parseEndpointPayload(payload).message, "yo");
  assert.equal(
    parseEndpointPayload({ ...payload, message: "not right", isError: true }, { message: "custom" }).message,
    "not right"
  );
  assert.throws(() => parseEndpointPayload({ schemaVersion: 1, label: "hey" }, { message: "custom" }), /message required/);
  assert.throws(() => parseEndpointPayload(payload, { message: "" }), /invalid query parameter: message/);
});

test("contributor list too large is detected only on GitHub's 403 message", () => {
  const body = '{"message":"The history or contributor list is too large to list contributors for this repository via the API."}';
  assert.equal(isContributorListTooLarge(403, body), true);
  assert.equal(isContributorListTooLarge(403, '{"message":"API rate limit exceeded"}'), false);
  assert.equal(isContributorListTooLarge(500, body), false);
});

test("draft filter parses true/false/unset", () => {
  assert.equal(parseDraftFilter(undefined), undefined);
  assert.equal(parseDraftFilter(""), undefined);
  assert.equal(parseDraftFilter("true"), true);
  assert.equal(parseDraftFilter("FALSE"), false);
  assert.throws(() => parseDraftFilter("maybe"), /draft must be/);
});

test("Homebrew formula badge reads the public version metadata", async (t) => {
  const mockedFetch = t.mock.method(globalThis, "fetch", async () =>
    new Response(JSON.stringify({"versions":{"stable":"2.45.1","head":"HEAD"}}))
  );
  assert.deepEqual(await fetchHomebrewVersion("git"), {
    label: "homebrew",
    message: "v2.45.1",
    color: "blue"
  });
  assert.equal(mockedFetch.mock.calls[0].arguments[0], "https://formulae.brew.sh/api/formula/git.json");
});

test("Homebrew formula badge reports missing resources", async (t) => {
  t.mock.method(globalThis, "fetch", async () => new Response(null, { status: 404 }));
  await assert.rejects(fetchHomebrewVersion("git"), /formula not found/);
});

test("npm licenses from every manifest shape", () => {
  assert.deepEqual(npmLicenses({ license: "MIT" }), ["MIT"]);
  assert.deepEqual(npmLicenses({ license: "(MIT OR Apache-2.0)" }), ["(MIT OR Apache-2.0)"]);
  assert.deepEqual(npmLicenses({ license: { type: "ISC" } }), ["ISC"]);
  assert.deepEqual(npmLicenses({ licenses: [{ type: "MIT" }, { type: "GPL-2.0" }] }), ["MIT", "GPL-2.0"]);
  assert.deepEqual(npmLicenses({}), []);
});

test("license color: copyleft orange, permissive green, none grey", () => {
  assert.equal(licenseColor(["MIT"]), "green");
  assert.equal(licenseColor(["GPL-3.0-only"]), "orange");
  assert.equal(licenseColor(["(GPL-2.0 OR MIT)"]), "green");
  assert.equal(licenseColor(["LGPL-2.1", "MPL-2.0"]), "orange");
  assert.equal(licenseColor([]), "lightgrey");
});

test("dynamic json query joins matches", () => {
  const doc = { name: "x", version: "1.2.3", tags: ["a", "b"], nested: { n: 0 } };
  assert.equal(queryJson(doc, "$.version"), "1.2.3");
  assert.equal(queryJson(doc, "$.tags[*]"), "a, b");
  assert.equal(queryJson(doc, "$.nested.n"), "0");
  assert.equal(queryJson(doc, "$.nested"), '{"n":0}');
  assert.throws(() => queryJson(doc, "$.missing"), /no result/);
  assert.throws(() => queryJson(doc, ""), /query required/);
});

test("dynamic json query refuses script expressions", () => {
  const doc = { items: [{ v: 1 }, { v: 2 }] };
  assert.throws(() => queryJson(doc, "$.items[?(@.v > 1)]"));
});

test("issue/PR detail state mirrors Shields, including drafts", () => {
  const pr = (extra) => issueDetailState({ pull_request: {}, ...extra }, "pulls", 7);
  assert.deepEqual(pr({ state: "open", draft: true }), { label: "pull request 7", message: "draft", color: "gray" });
  assert.deepEqual(pr({ state: "open", draft: false }), { label: "pull request 7", message: "open", color: "2cbe4e" });
  assert.equal(pr({ state: "closed", merged_at: "2026-11-01T00:00:00Z" }).message, "merged");
  assert.equal(pr({ state: "closed", draft: true, merged_at: null }).message, "rejected");

  const issue = (extra) => issueDetailState(extra, "issues", 3);
  assert.deepEqual(issue({ state: "closed" }), { label: "issue 3", message: "closed", color: "6f42c1" });
  assert.equal(issue({ state: "closed", state_reason: "not_planned" }).message, "not planned");
  // /issues/:n also serves PRs; the pull_request key marks them
  assert.equal(issueDetailState({ state: "open", pull_request: { draft: true } }, "issues", 3).message, "draft");
});

test("wakatime value is the visible text before the link", () => {
  const svg = '<text x="1">shadow</text><text x="1">wakatime</text><text>75 hrs 6 mins</text><text>75 hrs 6 mins</text><a href="x"></a>';
  assert.equal(parseWakatimeSvg(svg), "75 hrs 6 mins");
  assert.throws(() => parseWakatimeSvg("<svg></svg>"), /unparseable/);
});

test("github followers fetcher returns the count and reports a missing user", async () => {
  const realFetch = globalThis.fetch;
  try {
    globalThis.fetch = async (url) => {
      assert.equal(url, "https://api.github.com/users/torvalds");
      return { status: 200, ok: true, json: async () => ({ followers: 230000 }) };
    };
    assert.deepEqual(await fetchGithubFollowers("torvalds"), { label: "followers", message: "230000", color: "grey" });
    assert.equal(formatMetric(230000), "230k");
    globalThis.fetch = async () => ({ status: 404, ok: false, json: async () => ({}) });
    await assert.rejects(() => fetchGithubFollowers("ghost"), /user not found/);
  } finally {
    globalThis.fetch = realFetch;
  }
});


test("Codecov coverage reports the rounded percentage and colours it by band", async (t) => {
  const coverages = [55, 75, 87.4, 95];
  const fetch = t.mock.method(globalThis, "fetch", async () => Response.json({ totals: { coverage: coverages.shift() } }));
  assert.deepEqual(await fetchCodecovCoverage("octocat", "low"), {
    label: "coverage", message: "55%", color: "red"
  });
  assert.deepEqual(await fetchCodecovCoverage("octocat", "mid"), {
    label: "coverage", message: "75%", color: "yellow"
  });
  assert.deepEqual(await fetchCodecovCoverage("octocat", "hello-world"), {
    label: "coverage", message: "87%", color: "yellowgreen"
  });
  assert.deepEqual(await fetchCodecovCoverage("octocat", "high"), {
    label: "coverage", message: "95%", color: "brightgreen"
  });
  assert.equal(fetch.mock.calls[0].arguments[0], "https://api.codecov.io/api/v2/github/octocat/repos/low/");
});

test("Codecov coverage reports a missing repo", async (t) => {
  t.mock.method(globalThis, "fetch", async () => new Response(null, { status: 404 }));
  await assert.rejects(fetchCodecovCoverage("octocat", "missing"), /repo not found/);
});
