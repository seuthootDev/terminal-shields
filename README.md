# terminal-shields

Shields.io-style badges, drawn as a compact terminal one-liner.

Same URL idea as [Shields](https://shields.io). Different look: monospace, glow, content-width.

**Live:** [terminal-shields.vercel.app](https://terminal-shields.vercel.app) · includes a badge generator

[![build](https://terminal-shields.vercel.app/badge/build-passing-brightgreen)](https://terminal-shields.vercel.app)
[![stars](https://terminal-shields.vercel.app/github/stars/seuthootDev/terminal-shields)](https://github.com/seuthootDev/terminal-shields)
[![license](https://terminal-shields.vercel.app/github/license/seuthootDev/terminal-shields?logo=opensourceinitiative&theme=green)](./LICENSE)
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
- last commit: ![gh last commit](https://terminal-shields.vercel.app/github/last-commit/badges/shields)
- forks: ![gh forks](https://terminal-shields.vercel.app/github/forks/badges/shields)
- watchers: ![gh watchers](https://terminal-shields.vercel.app/github/watchers/badges/shields)
- contributors: ![gh contributors](https://terminal-shields.vercel.app/github/contributors/badges/shields)
- open issues: ![gh issues](https://terminal-shields.vercel.app/github/issues/badges/shields)
- open PRs: ![gh PRs](https://terminal-shields.vercel.app/github/issues-pr/badges/shields)
- repo size: ![gh repo size](https://terminal-shields.vercel.app/github/repo-size/badges/shields)
- latest release: ![gh release](https://terminal-shields.vercel.app/github/v/release/badges/shields)
- Actions build: ![gh workflow](https://terminal-shields.vercel.app/github/actions/workflow/status/badges/shields/deploy-docs.yml)
- commit activity: ![gh commit activity](https://terminal-shields.vercel.app/github/commit-activity/m/badges/shields)
- top language: ![gh top language](https://terminal-shields.vercel.app/github/languages/top/badges/shields)
- Hacktoberfest: ![hacktoberfest](https://terminal-shields.vercel.app/github/hacktoberfest/2026/badges/shields?suggestion_label=good%20first%20issue)
- live demo: ![live demo](https://terminal-shields.vercel.app/website?url=https%3A%2F%2Fterminal-shields.vercel.app)
- npm package: ![npm](https://terminal-shields.vercel.app/npm/v/express)
- scoped npm: ![babel](https://terminal-shields.vercel.app/npm/v/@babel/core)
- npm downloads: ![npm downloads](https://terminal-shields.vercel.app/npm/dm/express)
- custom JSON endpoint: ![endpoint](https://terminal-shields.vercel.app/endpoint?url=https%3A%2F%2Fshields.redsparr0w.com%2F2473%2Fmonday)

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

### Logos (`?logo=`) — Simple Icons, monochrome

Icons from [Simple Icons](https://simpleicons.org) are painted the **same color as the text** (terminal look). Use the icon slug (`qt`, `react`, `typescript`, …).

![qt](https://terminal-shields.vercel.app/badge/qml-41CD52?logo=qt&theme=amber)
![react](https://terminal-shields.vercel.app/badge/react-18-blue?logo=react&theme=amber)
![typescript](https://terminal-shields.vercel.app/badge/typescript-5-blue?logo=typescript&theme=amber)
![github](https://terminal-shields.vercel.app/github/stars/seuthootDev/terminal-shields?logo=github&theme=amber)
![node](https://terminal-shields.vercel.app/badge/node-%3E%3D18-brightgreen?logo=nodedotjs&theme=green)
![python](https://terminal-shields.vercel.app/badge/python-3.12-blue?logo=python&theme=amber)

```
https://terminal-shields.vercel.app/badge/qml-41CD52?logo=qt&theme=amber
https://terminal-shields.vercel.app/badge/react-18-blue?logo=react
```

Brand marks belong to their owners. See the [Simple Icons disclaimer](https://github.com/simple-icons/simple-icons/blob/develop/DISCLAIMER.md).

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
![stars](https://terminal-shields.vercel.app/badge/stars-128-yellow?theme=amber)
![license](https://terminal-shields.vercel.app/github/license/USER/REPO?logo=opensourceinitiative&theme=green)
```

Named colors follow Shields: `brightgreen`, `green`, `yellow`, `orange`, `red`, `blue`, `grey`, plus hex (`8A2BE2`).

## Live services

```
https://terminal-shields.vercel.app/github/stars/:user/:repo
https://terminal-shields.vercel.app/github/license/:user/:repo
https://terminal-shields.vercel.app/github/last-commit/:user/:repo?branch=main
https://terminal-shields.vercel.app/github/forks/:user/:repo
https://terminal-shields.vercel.app/github/watchers/:user/:repo
https://terminal-shields.vercel.app/github/contributors/:user/:repo
https://terminal-shields.vercel.app/github/issues/:user/:repo
https://terminal-shields.vercel.app/github/issues-pr/:user/:repo
https://terminal-shields.vercel.app/github/repo-size/:user/:repo
https://terminal-shields.vercel.app/github/v/release/:user/:repo
https://terminal-shields.vercel.app/github/actions/workflow/status/:user/:repo/:workflow
https://terminal-shields.vercel.app/github/commit-activity/:interval/:user/:repo?branch=main
https://terminal-shields.vercel.app/github/languages/top/:user/:repo
https://terminal-shields.vercel.app/github/hacktoberfest/:year/:user/:repo?suggestion_label=good%20first%20issue
https://terminal-shields.vercel.app/website?url=https://example.com
https://terminal-shields.vercel.app/npm/v/:package
https://terminal-shields.vercel.app/npm/v/@:scope/:package
https://terminal-shields.vercel.app/npm/v/:package/:tag
https://terminal-shields.vercel.app/npm/:interval/:package
https://terminal-shields.vercel.app/endpoint?url=https://example.com/badge.json
```

```markdown
![stars](https://terminal-shields.vercel.app/github/stars/USER/REPO)
![license](https://terminal-shields.vercel.app/github/license/USER/REPO)
![last commit](https://terminal-shields.vercel.app/github/last-commit/USER/REPO)
![forks](https://terminal-shields.vercel.app/github/forks/USER/REPO)
![watchers](https://terminal-shields.vercel.app/github/watchers/USER/REPO)
![contributors](https://terminal-shields.vercel.app/github/contributors/USER/REPO)
![issues](https://terminal-shields.vercel.app/github/issues/USER/REPO)
![PRs](https://terminal-shields.vercel.app/github/issues-pr/USER/REPO)
![repo size](https://terminal-shields.vercel.app/github/repo-size/USER/REPO)
![release](https://terminal-shields.vercel.app/github/v/release/USER/REPO)
![build](https://terminal-shields.vercel.app/github/actions/workflow/status/USER/REPO/ci.yml)
![commit activity](https://terminal-shields.vercel.app/github/commit-activity/m/USER/REPO)
![top language](https://terminal-shields.vercel.app/github/languages/top/USER/REPO)
![hacktoberfest](https://terminal-shields.vercel.app/github/hacktoberfest/2026/USER/REPO)
![live demo](https://terminal-shields.vercel.app/website?url=https%3A%2F%2Fyour-demo.example.com)
![npm](https://terminal-shields.vercel.app/npm/v/express)
![babel](https://terminal-shields.vercel.app/npm/v/@babel/core)
![downloads](https://terminal-shields.vercel.app/npm/dm/express)
![custom](https://terminal-shields.vercel.app/endpoint?url=https%3A%2F%2Fexample.com%2Fbadge.json)
```

`github/last-commit` reports the tip commit's age the way GitHub itself phrases it: `today`, `yesterday`, `last sunday` (2–6 days back), then `N weeks/months/years ago`. `?branch=` picks a branch other than the default.

`github/watchers` reports subscriber count (GitHub's "Watch" button, not stargazers). `github/contributors` counts non-anonymous contributors. `github/issues`/`issues-pr` are open counts (green at zero, yellow otherwise). `github/v/release` reads the latest GitHub Release, falling back to the newest tag if the repo has no releases. `github/actions/workflow/status` takes the workflow file name (e.g. `ci.yml`) and colors by the most recent run's conclusion.

`github/commit-activity` counts commits in the last week / month / year (`w` / `m` / `y`) or all time (`t`), e.g. `58/month`. `?branch=` picks a branch other than the default. `github/languages/top` shows the repo's largest language and its share of bytes (`javascript: 99.8%`).

`github/hacktoberfest/:year` follows the October event (UTC): before it starts it counts down (`3 days to go`), during October it shows PRs opened that month plus days left, and afterwards `is over! (N PRs)`. Open issues carrying the `?suggestion_label=` label (default `hacktoberfest`) are listed before and during the event.

`npm/dw`, `npm/dm`, `npm/dy` show weekly / monthly / yearly downloads (`475M/month`). Scoped packages work too: `/npm/dm/@babel/core`.

`endpoint` renders any JSON that follows the [Shields endpoint schema](https://shields.io/badges/endpoint-badge), so you can badge whatever data you host:

```json
{ "schemaVersion": 1, "label": "hello", "message": "sweet world", "color": "orange" }
```

`label`, `color`, `namedLogo` (a Simple Icons slug), `isError` and `cacheSeconds` (300s minimum) are honored; `?theme=`, `?bg=`, `?logo=`, `?color=` still override.

`website` pings the given `url` and renders `up` (green) or `down` (red) — pass `?upMessage=` / `?downMessage=` to relabel either state. It's the "live demo" badge.

Optional: set `GITHUB_TOKEN` on Vercel for higher GitHub API limits.

## Local

```bash
npm install
npm run serve
```

Open `http://127.0.0.1:8000` — same generator UI as production.

## License

[MIT](./LICENSE) © seuthootDev
