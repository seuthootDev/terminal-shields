/**
 * Shields "dynamic JSON" badge: pull a value out of any JSON document with JSONPath.
 * https://shields.io/badges/dynamic-json-badge
 */
import { JSONPath } from "jsonpath-plus";

import { fetchJsonDocument } from "./endpoint.js";

/**
 * Evaluate `query` against `json` and join the matches like Shields does.
 * Script expressions are disabled (`eval: false`) — Shields switched to the
 * same setting after an RCE in its previous JSONPath library.
 */
export function queryJson(json, query) {
  const path = String(query ?? "").trim();
  if (!path) throw new Error("query required");
  let values;
  try {
    values = JSONPath({ path, json, eval: false, wrap: true });
  } catch {
    throw new Error("invalid query");
  }
  if (!values.length) throw new Error("no result");
  return values
    .map((value) => (value !== null && typeof value === "object" ? JSON.stringify(value) : String(value)))
    .join(", ");
}

export async function fetchDynamicJsonBadge({ url, query, label, prefix = "", suffix = "" }) {
  const json = await fetchJsonDocument(url, "resource");
  return {
    label: label ?? "custom badge",
    message: `${prefix}${queryJson(json, query)}${suffix}`,
    color: "blue",
    maxAge: 300
  };
}
