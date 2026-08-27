import assert from "node:assert/strict";
import { test } from "node:test";

import { formatMetric, formatRelativeDate } from "./format.js";
import { parseBadgePath } from "./parse.js";
import { buildDisplayText, renderBadge, splitCursor } from "./render.js";

test("parses label-message-color", () => {
  assert.deepEqual(parseBadgePath("build-passing-brightgreen"), {
    label: "build",
    message: "passing",
    color: "brightgreen"
  });
});

test("parses message-color only", () => {
  assert.deepEqual(parseBadgePath("just_the_message-8A2BE2"), {
    label: "",
    message: "just the message",
    color: "8A2BE2"
  });
});

test("decodes dashes and underscores", () => {
  assert.deepEqual(parseBadgePath("any_text-you_like-blue"), {
    label: "any text",
    message: "you like",
    color: "blue"
  });
  assert.equal(parseBadgePath("hello--world-ok-green").label, "hello-world");
});

test("formats one-line themes", () => {
  assert.equal(
    buildDisplayText({ label: "stars", message: "128", theme: "amber" }),
    "$ stars: 128 █"
  );
  assert.equal(
    buildDisplayText({ label: "build", message: "passing", theme: "green" }),
    ">_ build [PASSING]"
  );
  assert.equal(
    buildDisplayText({ label: "coverage", message: "75%", theme: "cyan" }),
    "coverage [██████░░] 75%"
  );
});

test("formatMetric compact numbers", () => {
  assert.equal(formatMetric(128), "128");
  assert.equal(formatMetric(999), "999");
  assert.equal(formatMetric(1000), "1k");
  assert.equal(formatMetric(1280), "1.3k");
  assert.equal(formatMetric(12800), "13k");
  assert.equal(formatMetric(1_200_000), "1.2M");
});

test("formatRelativeDate shields-style buckets", () => {
  const now = new Date("2026-08-27T12:00:00Z"); // a thursday
  assert.equal(formatRelativeDate(new Date("2026-08-27T01:00:00Z"), now), "today");
  assert.equal(formatRelativeDate(new Date("2026-08-26T12:00:00Z"), now), "yesterday");
  assert.equal(formatRelativeDate(new Date("2026-08-23T12:00:00Z"), now), "last sunday");
  assert.equal(formatRelativeDate(new Date("2026-08-13T12:00:00Z"), now), "2 weeks ago");
  assert.equal(formatRelativeDate(new Date("2026-06-27T12:00:00Z"), now), "2 months ago");
  assert.equal(formatRelativeDate(new Date("2024-08-27T12:00:00Z"), now), "2 years ago");
});

test("splits amber cursor suffix", () => {
  assert.deepEqual(splitCursor("$ stars: 128 █"), {
    main: "$ stars: 128",
    cursor: " █"
  });
  assert.deepEqual(splitCursor(">_ build [PASSING]"), {
    main: ">_ build [PASSING]",
    cursor: null
  });
});

test("renders SMIL blink when requested", () => {
  const svg = renderBadge({
    label: "build",
    message: "passing",
    theme: "amber",
    blink: true
  });
  assert.match(svg, /<animate attributeName="opacity"/);
  assert.match(svg, /<tspan>/);
});

test("applies terminal background presets", () => {
  const ubuntu = renderBadge({
    label: "shell",
    message: "ubuntu",
    theme: "amber",
    bg: "ubuntu"
  });
  assert.match(ubuntu, /fill="#300A24"/);

  const hex = renderBadge({
    label: "shell",
    message: "custom",
    theme: "amber",
    bg: "1a1a2e"
  });
  assert.match(hex, /fill="#1a1a2e"/);
});

test("renders monochrome logo path matching text color", () => {
  const path = "M12 0L24 24H0z";
  const svg = renderBadge({
    label: "qml",
    message: "ok",
    theme: "amber",
    fg: "#ffbe30",
    logoPath: path
  });
  assert.match(svg, new RegExp(`<path d="${path}" fill="#ffbe30"/>`));
  assert.match(svg, /transform="scale\(/);
});
