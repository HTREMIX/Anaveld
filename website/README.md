# ANAVELD · The Sunlit Archive

A local, comparative frontend prototype. Three art directions and a hybrid use the same content. All catalogue entries, covers, and the six-page PDF are **synthetic demos**, not verified ANAVELD releases.

## Run locally

Use Node.js 22.13+ or Node.js 24 and npm:

```sh
cd website
npm ci
npm run dev
```

Open the loopback address printed by Vite, normally `http://127.0.0.1:5173`. The prototype needs a local HTTP server; opening `index.html` directly is unsupported. No backend, credentials, accounts, analytics, or remote content service is used.

```sh
npm run typecheck
npm run build
npm run preview
```

The typecheck is deliberately separate from Vite's build. The PDF is already included; regenerate the original fixture with `npm run fixture` if needed.

## Routes and reading

- `/` — introduction and equal-content visual comparison.
- `/publications` — local search, subject filtering, title/demo-sequence sorting.
- `/publications/demo-01` (also `demo-02`, `demo-03`) — demo details and provenance labels.
- `/publications/demo-01/read?page=3&mode=study` — PDF.js reader with one-based page links.

Study provides a selectable text layer, basic page-level PDF phrase search, zoom, page navigation, and direct access to the synthetic PDF. Book is an **experimental static layout**: two visible pages where space permits, one on mobile. Animated page curl is unavailable and is explicitly disabled. Page position is shared between layouts. Left/right arrows work when the PDF page area has focus. Ordinary scrolling and text inputs do not trigger page turns.

The fixture has English text, simple oscillator equations, no embedded outline, and no accessibility tags. A concise HTML alternative explains its contents. This prototype is not a full PDF viewer. Formula copying, real ANV fidelity, and PDF screen-reader reading order are unverified. Browser-native PDF tools remain available through “Open demo PDF”.

## Browser checks

```sh
npx playwright install chromium
npm run test:e2e
```

For an existing system Chromium installation, select it without a browser download:

```sh
PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium npm run test:e2e
```

Tests start a loopback production-preview server on port 4173 and stop it when finished. They capture screenshots in `docs/qa/screenshots/`, sampled contrast measurements in `docs/qa/contrast-*.json`, and an ignored raw JSON report in `.local-qa/`. They exercise 1440×900, 1280×800, 390×844, and 360×800; mobile settings emulate touch and DPR 2, not real mobile hardware. See [QA results](docs/QA_RESULTS.md) for measured outcomes and limits.

## Source, assets and rights

Read [asset provenance](docs/ASSET_PROVENANCE.md) and [design decisions](docs/DESIGN_DECISIONS.md). Self-hosted Lora and Be Vietnam Pro retain their SIL OFL notices in `public/licenses/`. PDF.js is Apache-2.0; runtime dependency notices are included there as well.

The repository's root content license covers scholarly publication content under its stated exceptions. It is **not automatically a license for this website software or demo assets**. Their separate redistribution license awaits an explicit project decision. This prototype does not alter the root README, LICENSE, or RIGHTS files. No site has been deployed.
