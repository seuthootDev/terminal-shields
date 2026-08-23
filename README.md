# terminal-shields

Shields.io-style badges, drawn as a compact terminal one-liner.

Same URL idea as [Shields](https://shields.io). Different look: monospace, glow, content-width.

**Live:** [terminal-shields.vercel.app](https://terminal-shields.vercel.app) · includes a badge generator

[![build](https://terminal-shields.vercel.app/badge/build-passing-brightgreen)](https://terminal-shields.vercel.app)
[![stars](https://terminal-shields.vercel.app/github/stars/seuthootDev/terminal-shields?blink=1)](https://github.com/seuthootDev/terminal-shields)
[![license](https://terminal-shields.vercel.app/badge/license-MIT-green?logo=opensourceinitiative&theme=green)](./LICENSE)
[![npm](https://terminal-shields.vercel.app/npm/v/express?blink=1)](https://terminal-shields.vercel.app)

## Examples

- code coverage: ![coverage](https://terminal-shields.vercel.app/badge/coverage-80%25-yellowgreen?theme=cyan)
- stable release: ![version](https://terminal-shields.vercel.app/badge/version-1.2.3-blue?blink=1)
- package manager release: ![gem](https://terminal-shields.vercel.app/badge/gem-2.2.0-blue?blink=1)
- dependencies: ![dependencies](https://terminal-shields.vercel.app/badge/dependencies-out_of_date-orange?blink=1)
- static analysis grade: ![codacy](https://terminal-shields.vercel.app/badge/codacy-B-green)
- SemVer: ![semver](https://terminal-shields.vercel.app/badge/semver-2.0.0-blue?blink=1)
- donations: ![receives](https://terminal-shields.vercel.app/badge/receives-2.00_USD%2Fweek-yellow?blink=1)
- downloads: ![downloads](https://terminal-shields.vercel.app/badge/downloads-13k%2Fmonth-brightgreen)
- rating: ![rating](https://terminal-shields.vercel.app/badge/rating-4%2F5-brightgreen)
- uptime: ![uptime](https://terminal-shields.vercel.app/badge/uptime-100%25-brightgreen?theme=cyan)
- build status: ![build](https://terminal-shields.vercel.app/badge/build-passing-brightgreen)
- failing build: ![failing](https://terminal-shields.vercel.app/badge/build-failing-red)
- node engine: ![node](https://terminal-shields.vercel.app/badge/node-%3E%3D18-brightgreen)
- python: ![python](https://terminal-shields.vercel.app/badge/python-3.12-blue?blink=1)
- custom hex color: ![made with](https://terminal-shields.vercel.app/badge/made_with-terminal--shields-8A2BE2?blink=1)

Live GitHub / npm:

- repo stars: ![gh stars](https://terminal-shields.vercel.app/github/stars/badges/shields?blink=1)
- repo license: ![gh license](https://terminal-shields.vercel.app/github/license/badges/shields)
- npm package: ![npm](https://terminal-shields.vercel.app/npm/v/express?blink=1)
- scoped npm: ![babel](https://terminal-shields.vercel.app/npm/v/@babel/core?blink=1)

## Themes

| theme | line |
|-------|------|
| `amber` (default) | `$ stars: 128 █` |
| `green` | `>_ build [PASSING]` |
| `cyan` | `coverage [██████░░] 75%` |

![amber](https://terminal-shields.vercel.app/badge/stars-128-yellow?theme=amber&blink=1)
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

![ubuntu](https://terminal-shields.vercel.app/badge/shell-ubuntu-yellow?theme=amber&bg=ubuntu&blink=1)
![powershell](https://terminal-shields.vercel.app/badge/shell-powershell-blue?theme=amber&bg=powershell&blink=1)
![matrix](https://terminal-shields.vercel.app/badge/shell-matrix-brightgreen?theme=green&bg=matrix)

### Logos (`?logo=`) — Simple Icons, monochrome

Icons from [Simple Icons](https://simpleicons.org) are painted the **same color as the text** (terminal look). Use the icon slug (`qt`, `react`, `typescript`, …).

![qt](https://terminal-shields.vercel.app/badge/qml-41CD52?logo=qt&theme=amber&blink=1)
![react](https://terminal-shields.vercel.app/badge/react-18-blue?logo=react&theme=amber&blink=1)
![typescript](https://terminal-shields.vercel.app/badge/typescript-5-blue?logo=typescript&theme=amber&blink=1)
![github](https://terminal-shields.vercel.app/github/stars/seuthootDev/terminal-shields?logo=github&theme=amber&blink=1)
![node](https://terminal-shields.vercel.app/badge/node-%3E%3D18-brightgreen?logo=nodedotjs&theme=green)
![python](https://terminal-shields.vercel.app/badge/python-3.12-blue?logo=python&theme=amber&blink=1)

```
https://terminal-shields.vercel.app/badge/qml-41CD52?logo=qt&theme=amber&blink=1
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
![stars](https://terminal-shields.vercel.app/badge/stars-128-yellow?theme=amber&blink=1)
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
![stars](https://terminal-shields.vercel.app/github/stars/USER/REPO?blink=1)
![license](https://terminal-shields.vercel.app/github/license/USER/REPO)
![npm](https://terminal-shields.vercel.app/npm/v/express?blink=1)
![babel](https://terminal-shields.vercel.app/npm/v/@babel/core?blink=1)
```

Optional: set `GITHUB_TOKEN` on Vercel for higher GitHub API limits.

## Local

```bash
npm install
npm run serve
```

Open `http://127.0.0.1:8000` — same generator UI as production.

## License

[MIT](./LICENSE) © seuthootDev
