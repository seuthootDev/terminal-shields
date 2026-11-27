const HEADERS = { Accept: "application/json", "User-Agent": "terminal-shields" };

export async function fetchHomebrewVersion(rawFormula) {
  const formula = String(rawFormula ?? "").trim();
  if (!/^[\w@+.-]+$/.test(formula) || formula === "." || formula === "..") throw new Error("invalid formula");

  const response = await fetch(`https://formulae.brew.sh/api/formula/${encodeURIComponent(formula)}.json`, { headers: HEADERS });
  if (response.status === 404) throw new Error("formula not found");
  if (!response.ok) throw new Error(`Homebrew ${response.status}`);

  const data = await response.json();
  const version = data.versions?.stable;
  if (typeof version !== "string" || !version.trim()) throw new Error("no version found");
  return { label: "homebrew", message: `v${version.trim().replace(/^v/i, "")}`, color: "blue" };
}
