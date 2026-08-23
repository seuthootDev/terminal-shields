# terminal-shields

Shields.io-style badges, drawn as a compact terminal one-liner.

Same URL idea as [Shields](https://shields.io). Different look: monospace, glow, content-width.

## Local

```bash
npm install
npm run serve
```

Open `http://127.0.0.1:8000`.

Optional: set `GITHUB_TOKEN` for higher GitHub API limits.

## Static badge

```
/badge/LABEL-MESSAGE-COLOR
/static/v1?label=LABEL&message=MESSAGE&color=COLOR
```

| URL input | Output |
|-----------|--------|
| `_` or `%20` | space |
| `__` | `_` |
| `--` | `-` |

```markdown
![build](https://YOUR_DEPLOY/badge/build-passing-brightgreen)
![stars](https://YOUR_DEPLOY/badge/stars-128-yellow)
![coverage](https://YOUR_DEPLOY/badge/coverage-75%25-blue)
```

## Live services

```
/github/stars/:user/:repo
/github/license/:user/:repo
/npm/v/:package
/npm/v/@:scope/:package
/npm/v/:package/:tag
```

```markdown
![stars](https://YOUR_DEPLOY/github/stars/badges/shields)
![license](https://YOUR_DEPLOY/github/license/badges/shields)
![npm](https://YOUR_DEPLOY/npm/v/express)
![babel](https://YOUR_DEPLOY/npm/v/@babel/core)
```

## Themes

`theme` picks the one-line layout. If omitted, it is inferred from Shields' color name.

| theme | line |
|-------|------|
| `amber` (default) | `$ stars: 128 █` |
| `green` | `>_ build [PASSING]` |
| `cyan` | `coverage [██████░░] 75%` |

```
/github/stars/badges/shields?theme=amber
/github/license/badges/shields?theme=green
/badge/coverage-75%25-blue?theme=cyan
```

Named colors follow Shields: `brightgreen`, `green`, `yellow`, `orange`, `red`, `blue`, `grey`, plus hex (`8A2BE2`).
