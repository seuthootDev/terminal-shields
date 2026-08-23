const BASE = "https://terminal-shields.vercel.app";

export function homePageHtml() {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>terminal-shields</title>
  <meta name="description" content="Shields-style badges as compact terminal one-liners.">
  <style>
    :root {
      --bg: #0b0f0c;
      --panel: #121812;
      --border: #2a3a2a;
      --text: #d7e0d7;
      --muted: #7f927f;
      --amber: #ffb000;
      --green: #00ff66;
      --cyan: #00ffff;
      --input: #0a100a;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      min-height: 100vh;
      background:
        radial-gradient(ellipse 80% 50% at 50% -10%, #1a2a14 0%, transparent 55%),
        var(--bg);
      color: var(--text);
      font-family: "IBM Plex Mono", "Courier New", ui-monospace, monospace;
      line-height: 1.45;
    }
    main {
      width: min(880px, calc(100% - 32px));
      margin: 0 auto;
      padding: 40px 0 64px;
    }
    h1 {
      margin: 0 0 8px;
      font-size: clamp(1.6rem, 4vw, 2.2rem);
      color: var(--green);
      letter-spacing: -0.02em;
    }
    .sub { color: var(--muted); margin: 0 0 28px; max-width: 52ch; }
    .sub a { color: var(--amber); }
    .samples {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin: 0 0 28px;
      align-items: center;
    }
    .panel {
      border: 1px solid var(--border);
      background: var(--panel);
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 20px;
    }
    .panel h2 {
      margin: 0 0 16px;
      font-size: 0.95rem;
      color: var(--amber);
      font-weight: 600;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 12px;
    }
    @media (max-width: 700px) {
      .grid { grid-template-columns: 1fr; }
    }
    label {
      display: flex;
      flex-direction: column;
      gap: 6px;
      font-size: 0.75rem;
      color: var(--muted);
    }
    input, select {
      width: 100%;
      border: 1px solid var(--border);
      background: var(--input);
      color: var(--text);
      border-radius: 6px;
      padding: 10px 12px;
      font: inherit;
      font-size: 0.9rem;
    }
    select {
      appearance: auto;
      cursor: pointer;
    }
    select option {
      background: #0a100a;
      color: var(--text);
    }
    input:focus, select:focus {
      outline: 1px solid var(--green);
      border-color: var(--green);
    }
    .full { grid-column: 1 / -1; }
    .preview-wrap {
      display: flex;
      flex-direction: column;
      gap: 14px;
      align-items: flex-start;
    }
    .preview {
      min-height: 36px;
      display: flex;
      align-items: center;
    }
    .preview img { display: block; max-width: 100%; }
    .url-box, .md-box {
      width: 100%;
      border: 1px solid var(--border);
      background: var(--input);
      border-radius: 6px;
      padding: 10px 12px;
      font-size: 0.78rem;
      color: var(--cyan);
      word-break: break-all;
      white-space: pre-wrap;
    }
    .actions {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    button {
      border: 1px solid var(--border);
      background: #182218;
      color: var(--text);
      border-radius: 6px;
      padding: 9px 14px;
      font: inherit;
      font-size: 0.8rem;
      cursor: pointer;
    }
    button:hover { border-color: var(--green); color: var(--green); }
    button.primary {
      background: #14301a;
      border-color: #1f5a2e;
      color: var(--green);
    }
    .hint { font-size: 0.75rem; color: var(--muted); margin-top: 4px; }
    .hidden { display: none; }
    .blink-row .check-wrap {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.85rem;
      color: var(--text);
    }
    .blink-row input[type="checkbox"] {
      width: auto;
      accent-color: var(--green);
    }
    footer {
      margin-top: 28px;
      color: var(--muted);
      font-size: 0.75rem;
    }
    footer a { color: var(--amber); }
  </style>
</head>
<body>
  <main>
    <h1>$ terminal-shields</h1>
    <p class="sub">
      Shields-style badges as compact terminal one-liners.
      Same URL logic as <a href="https://shields.io">Shields.io</a>, different look.
    </p>

    <div class="samples" id="samples"></div>

    <section class="panel">
      <h2>generator</h2>
      <div class="grid">
        <label>
          type
          <select id="type">
            <option value="static">static badge</option>
            <option value="github-stars">github stars</option>
            <option value="github-license">github license</option>
            <option value="npm">npm version</option>
          </select>
        </label>
        <label>
          theme (layout)
          <select id="theme">
            <option value="">auto</option>
            <option value="amber">amber ($ prompt)</option>
            <option value="green">green (&gt;_ status)</option>
            <option value="cyan">cyan (meter)</option>
          </select>
        </label>
        <label>
          background
          <select id="bg">
            <option value="">theme default</option>
            <option value="ubuntu">ubuntu</option>
            <option value="powershell">powershell</option>
            <option value="macos">macos</option>
            <option value="cmd">cmd</option>
            <option value="matrix">matrix</option>
            <option value="gnome">gnome</option>
            <option value="dracula">dracula</option>
            <option value="solarized">solarized</option>
            <option value="nord">nord</option>
          </select>
        </label>

        <label id="field-label">
          label
          <input id="label" value="build" autocomplete="off">
        </label>
        <label id="field-message">
          message
          <input id="message" value="passing" autocomplete="off">
        </label>
        <label id="field-color">
          color
          <select id="colorNamed">
            <option value="brightgreen">brightgreen</option>
            <option value="green">green</option>
            <option value="yellow">yellow</option>
            <option value="yellowgreen">yellowgreen</option>
            <option value="orange">orange</option>
            <option value="red">red</option>
            <option value="blue">blue</option>
            <option value="grey">grey</option>
            <option value="lightgrey">lightgrey</option>
            <option value="success">success</option>
            <option value="important">important</option>
            <option value="critical">critical</option>
          </select>
        </label>
        <label id="field-color-hex">
          custom hex (optional)
          <input id="colorHex" value="" autocomplete="off" placeholder="8A2BE2 — overrides select">
        </label>

        <label id="field-user" class="hidden">
          github user
          <input id="user" value="seuthootDev" autocomplete="off" placeholder="owner username">
        </label>
        <label id="field-repo" class="hidden">
          github repo
          <input id="repo" value="terminal-shields" autocomplete="off" placeholder="repo name">
        </label>
        <label id="field-pkg" class="hidden full">
          npm package
          <input id="pkg" value="express" autocomplete="off" placeholder="express or @babel/core">
        </label>
        <label id="field-tag" class="hidden">
          npm tag
          <input id="tag" value="latest" autocomplete="off">
        </label>
        <label id="field-blink" class="full blink-row">
          <span>cursor blink</span>
          <span class="check-wrap">
            <input type="checkbox" id="blink">
            amber <code>█</code> cursor — SMIL animation, works in GitHub README
          </span>
        </label>
      </div>
      <p class="hint" id="type-hint"></p>
    </section>

    <section class="panel">
      <h2>preview</h2>
      <div class="preview-wrap">
        <div class="preview"><img id="preview" alt="badge preview"></div>
        <div>
          <div class="hint">url</div>
          <div class="url-box" id="url"></div>
        </div>
        <div>
          <div class="hint">markdown</div>
          <div class="md-box" id="markdown"></div>
        </div>
        <div class="actions">
          <button class="primary" type="button" id="copy-md">copy markdown</button>
          <button type="button" id="copy-url">copy url</button>
          <button type="button" id="open">open</button>
        </div>
        <p class="hint" id="copy-status"></p>
      </div>
    </section>

    <footer>
      <a href="https://github.com/seuthootDev/terminal-shields">github.com/seuthootDev/terminal-shields</a>
      · base <code>${BASE}</code>
    </footer>
  </main>
  <script>
    const BASE = ${JSON.stringify(BASE)};

    const samples = [
      ["/badge/build-passing-brightgreen", "build"],
      ["/badge/coverage-80%25-yellowgreen?theme=cyan", "coverage"],
      ["/badge/version-1.2.3-blue", "version"],
      ["/badge/dependencies-out_of_date-orange", "deps"],
      ["/github/stars/badges/shields", "stars"],
      ["/github/license/badges/shields", "license"],
      ["/npm/v/express", "npm"],
    ];

    const samplesEl = document.getElementById("samples");
    for (const [path, alt] of samples) {
      const img = document.createElement("img");
      img.src = path;
      img.alt = alt;
      samplesEl.appendChild(img);
    }

    const els = {
      type: document.getElementById("type"),
      theme: document.getElementById("theme"),
      bg: document.getElementById("bg"),
      label: document.getElementById("label"),
      message: document.getElementById("message"),
      colorNamed: document.getElementById("colorNamed"),
      colorHex: document.getElementById("colorHex"),
      user: document.getElementById("user"),
      repo: document.getElementById("repo"),
      pkg: document.getElementById("pkg"),
      tag: document.getElementById("tag"),
      blink: document.getElementById("blink"),
      preview: document.getElementById("preview"),
      url: document.getElementById("url"),
      markdown: document.getElementById("markdown"),
      hint: document.getElementById("type-hint"),
      status: document.getElementById("copy-status"),
    };

    function show(id, on) {
      document.getElementById(id).classList.toggle("hidden", !on);
    }

    function encodeSegment(text) {
      return String(text)
        .replaceAll("-", "--")
        .replaceAll("_", "__")
        .replaceAll(" ", "_");
    }

    function syncFields() {
      const t = els.type.value;
      show("field-label", t === "static");
      show("field-message", t === "static");
      show("field-user", t.startsWith("github"));
      show("field-repo", t.startsWith("github"));
      show("field-pkg", t === "npm");
      show("field-tag", t === "npm");
      els.hint.textContent = {
        static: "Pick a named color from the select, or type a custom hex. Background uses terminal presets.",
        "github-stars": "Enter owner + repo. Color/background optional overrides.",
        "github-license": "Enter owner + repo. Color/background optional overrides.",
        npm: "Package name (+ optional tag). Color/background optional overrides.",
      }[t];
    }

    function normalizeColor(raw) {
      return String(raw ?? "").trim().replace(/^#/, "");
    }

    function pickedColor() {
      const hex = normalizeColor(els.colorHex.value);
      if (hex) return hex;
      return els.colorNamed.value.trim() || "brightgreen";
    }

    function querySuffix(extra = {}) {
      const params = new URLSearchParams();
      if (els.theme.value) params.set("theme", els.theme.value);
      if (els.bg.value) params.set("bg", els.bg.value);
      if (els.blink.checked) params.set("blink", "1");
      const color = pickedColor();
      if (els.type.value !== "static" && color) params.set("color", color);
      for (const [key, value] of Object.entries(extra)) {
        if (value != null && value !== "") params.set(key, value);
      }
      const s = params.toString();
      return s ? "?" + s : "";
    }

    function buildPath() {
      const t = els.type.value;

      if (t === "static") {
        const label = encodeSegment(els.label.value.trim());
        const message = encodeSegment(els.message.value.trim() || "message");
        const color = pickedColor();
        const body = label ? label + "-" + message + "-" + color : message + "-" + color;
        return "/badge/" + body + querySuffix();
      }
      if (t === "github-stars") {
        return "/github/stars/" + encodeURIComponent(els.user.value.trim()) + "/" + encodeURIComponent(els.repo.value.trim()) + querySuffix();
      }
      if (t === "github-license") {
        return "/github/license/" + encodeURIComponent(els.user.value.trim()) + "/" + encodeURIComponent(els.repo.value.trim()) + querySuffix();
      }
      const pkg = els.pkg.value.trim();
      const tag = els.tag.value.trim() || "latest";
      let path;
      if (pkg.startsWith("@")) {
        const slash = pkg.indexOf("/");
        path = slash === -1
          ? "/npm/v/" + encodeURIComponent(pkg)
          : "/npm/v/" + pkg.slice(0, slash) + "/" + encodeURIComponent(pkg.slice(slash + 1));
        if (tag !== "latest") return path + querySuffix({ tag });
        return path + querySuffix();
      }
      path = "/npm/v/" + encodeURIComponent(pkg);
      if (tag !== "latest") path += "/" + encodeURIComponent(tag);
      return path + querySuffix();
    }

    function refresh() {
      const path = buildPath();
      const url = BASE + path;
      const alt = els.label.value.trim() || els.type.value;
      els.preview.src = path + (path.includes("?") ? "&" : "?") + "_=" + Date.now();
      els.url.textContent = url;
      els.markdown.textContent = "![" + alt + "](" + url + ")";
    }

    async function copy(text, ok) {
      try {
        await navigator.clipboard.writeText(text);
        els.status.textContent = ok;
      } catch {
        els.status.textContent = "copy failed — select the text manually";
      }
    }

    for (const el of Object.values(els)) {
      if (el && (el.tagName === "INPUT" || el.tagName === "SELECT")) {
        el.addEventListener("input", () => { syncFields(); refresh(); });
        el.addEventListener("change", () => { syncFields(); refresh(); });
      }
    }
    document.getElementById("copy-md").onclick = () => copy(els.markdown.textContent, "markdown copied");
    document.getElementById("copy-url").onclick = () => copy(els.url.textContent, "url copied");
    document.getElementById("open").onclick = () => window.open(els.url.textContent, "_blank");

    syncFields();
    refresh();
  </script>
</body>
</html>`;
}
