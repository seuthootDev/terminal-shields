# terminal-shields

Shields.io-style badges, drawn as a compact terminal one-liner.

Same URL idea as [Shields](https://shields.io). Different look: monospace, glow, content-width.

**Live:** [terminal-shields.vercel.app](https://terminal-shields.vercel.app) · includes a badge generator

[![build](https://terminal-shields.vercel.app/badge/build-passing-brightgreen)](https://terminal-shields.vercel.app)
[![stars](https://terminal-shields.vercel.app/github/stars/seuthootDev/terminal-shields)](https://github.com/seuthootDev/terminal-shields)
[![license](https://terminal-shields.vercel.app/github/license/seuthootDev/terminal-shields)](https://github.com/seuthootDev/terminal-shields)
[![npm](https://terminal-shields.vercel.app/npm/v/express)](https://terminal-shields.vercel.app)

## Examples

- code coverage: ![coverage](https://terminal-shields.vercel.app/badge/coverage-80%25-yellowgreen?theme=cyan)
- stable release: ![version](https://terminal-shields.vercel.app/badge/version-1.2.3-blue)
- package manager release: ![gem](https://terminal-shields.vercel.app/badge/gem-2.2.0-blue)
- dependencies: ![dependencies](https://terminal-shields.vercel.app/badge/dependencies-out_of_date-orange)
- static analysis grade: ![codacy](https://terminal-shields.vercel.app/badge/codacy-B-green)
- SemVer: ![semver](https://terminal-shields.vercel.app/badge/semver-2.0.0-blue)
- donations: ![receives](https://terminal-shields.vercel.app/badge/receives-2.00_USD%2Fweek-yellow)
- downloads: ![downloads](https://terminal-shields.vercel.app/badge/downloads-13k%2Fmonth-brightgreen)
- rating: ![rating](https://terminal-shields.vercel.app/badge/rating-4%2F5-brightgreen)
- uptime: ![uptime](https://terminal-shields.vercel.app/badge/uptime-100%25-brightgreen?theme=cyan)
- build status: ![build](https://terminal-shields.vercel.app/badge/build-passing-brightgreen)
- failing build: ![failing](https://terminal-shields.vercel.app/badge/build-failing-red)
- node engine: ![node](https://terminal-shields.vercel.app/badge/node-%3E%3D18-brightgreen)
- python: ![python](https://terminal-shields.vercel.app/badge/python-3.12-blue)
- custom hex color: ![made with](https://terminal-shields.vercel.app/badge/made_with-terminal--shields-8A2BE2)

Live GitHub / npm:

- repo stars: ![gh stars](https://terminal-shields.vercel.app/github/stars/badges/shields)
- repo license: ![gh license](https://terminal-shields.vercel.app/github/license/badges/shields)
- npm package: ![npm](https://terminal-shields.vercel.app/npm/v/express)
- scoped npm: ![babel](https://terminal-shields.vercel.app/npm/v/@babel/core)

## Themes

| theme | line |
|-------|------|
| `amber` (default) | `$ stars: 128 █` |
| `green` | `>_ build [PASSING]` |
| `cyan` | `coverage [██████░░] 75%` |

![amber](https://terminal-shields.vercel.app/badge/stars-128-yellow?theme=amber)
![green](https://terminal-shields.vercel.app/badge/build-passing-brightgreen?theme=green)
![cyan](https://terminal-shields.vercel.app/badge/coverage-75%25-blue?theme=cyan)

### Background (`?bg=`)

Terminal window presets (independent of layout theme):

| bg | look |
|----|------|
| `ubuntu` | classic aubergine |
| `powershell` | blue console |
| `macos` | dark graphite |
| `cmd` | near-black |
| `matrix` | deep black-green |
| `gnome` / `dracula` / `solarized` / `nord` | popular terminal palettes |

Also accepts hex: `?bg=1a1a2e`

![ubuntu](https://terminal-shields.vercel.app/badge/shell-ubuntu-yellow?theme=amber&bg=ubuntu)
![powershell](https://terminal-shields.vercel.app/badge/shell-powershell-blue?theme=amber&bg=powershell)
![matrix](https://terminal-shields.vercel.app/badge/shell-matrix-brightgreen?theme=green&bg=matrix)

### Cursor blink (amber `█` only)

Add `?blink=1` for a SMIL opacity toggle on the block cursor. Works in GitHub README `<img>` tags (no JS).

![blink](https://terminal-shields.vercel.app/badge/build-passing-brightgreen?theme=amber&blink=1)

```
https://terminal-shields.vercel.app/badge/build-passing-brightgreen?theme=amber&blink=1
```

## Static badge

```
https://terminal-shields.vercel.app/badge/LABEL-MESSAGE-COLOR
https://terminal-shields.vercel.app/static/v1?label=LABEL&message=MESSAGE&color=COLOR
```

| URL input | Output |
|-----------|--------|
| `_` or `%20` | space |
| `__` | `_` |
| `--` | `-` |

```markdown
![build](https://terminal-shields.vercel.app/badge/build-passing-brightgreen)
![coverage](https://terminal-shields.vercel.app/badge/coverage-80%25-yellowgreen?theme=cyan)
![license](https://terminal-shields.vercel.app/static/v1?label=license&message=MIT&color=green&theme=green)
```

Named colors follow Shields: `brightgreen`, `green`, `yellow`, `orange`, `red`, `blue`, `grey`, plus hex (`8A2BE2`).

## Live services

```
https://terminal-shields.vercel.app/github/stars/:user/:repo
https://terminal-shields.vercel.app/github/license/:user/:repo
https://terminal-shields.vercel.app/npm/v/:package
https://terminal-shields.vercel.app/npm/v/@:scope/:package
https://terminal-shields.vercel.app/npm/v/:package/:tag
```

```markdown
![stars](https://terminal-shields.vercel.app/github/stars/USER/REPO)
![license](https://terminal-shields.vercel.app/github/license/USER/REPO)
![npm](https://terminal-shields.vercel.app/npm/v/express)
![babel](https://terminal-shields.vercel.app/npm/v/@babel/core)
```

Optional: set `GITHUB_TOKEN` on Vercel for higher GitHub API limits.

## Local

```bash
npm install
npm run serve
```

Open `http://127.0.0.1:8000` — same generator UI as production.
