const HEADERS = { Accept: "application/xml", "User-Agent": "terminal-shields" };

export async function fetchMavenVersion(rawGroup, rawArtifact) {
  const group = String(rawGroup ?? "").trim();
  const artifact = String(rawArtifact ?? "").trim();
  if (!/^[A-Za-z0-9_-]+(?:\.[A-Za-z0-9_-]+)*$/.test(group)) throw new Error("invalid group");
  if (!/^[A-Za-z0-9_-][A-Za-z0-9_.-]*$/.test(artifact)) throw new Error("invalid artifact");

  const groupPath = group.replaceAll(".", "/");
  const response = await fetch(
    `https://repo1.maven.org/maven2/${groupPath}/${artifact}/maven-metadata.xml`,
    { headers: HEADERS }
  );
  if (response.status === 404) throw new Error("artifact not found");
  if (!response.ok) throw new Error(`Maven Central ${response.status}`);

  const xml = await response.text();
  const versioning = xml.match(/<versioning>([\s\S]*?)<\/versioning>/)?.[1] ?? "";
  const release = versioning.match(/<release>\s*([^<]+?)\s*<\/release>/)?.[1]?.trim();
  const latest = versioning.match(/<latest>\s*([^<]+?)\s*<\/latest>/)?.[1]?.trim();
  const version = release || latest;
  if (!version) throw new Error("no version found");
  return { label: "maven-central", message: `v${version.replace(/^v/i, "")}`, color: "blue" };
}
