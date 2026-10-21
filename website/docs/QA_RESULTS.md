# Local prototype QA · 21 October 2026

**Final browser run: 20 passed, 0 failed, 0 skipped, 0 flaky (59.4 seconds).** These are Chromium prototype checks, not WCAG conformance, real-device qualification, or verified ANV PDF fidelity.

Environment: Debian GNU/Linux 13.6, Node 24.19.0, npm 11.9.0, Playwright 1.56.1, system Chromium 154.0.8037.57. Desktop viewports were 1440×900 and 1280×800; mobile used 390×844 and 360×800 with touch/DPR 2 emulation. The browser ran against a loopback production-preview server, which Playwright stopped afterward.

| Check | Observed result |
| --- | --- |
| `npm install` with pinned package versions | PASS; final install after dependency fixes succeeded |
| `npm run typecheck` | PASS, separate `tsc --noEmit` |
| `npm run build` | PASS, Vite 7.3.7 |
| `npm audit --json` | PASS, 0 known vulnerabilities in the final lockfile at query time |
| Art directions | PASS, same heading, publication titles and CTA in hybrid/A/B/C, all four viewports |
| Discovery | PASS, accent-insensitive catalogue search (`dao dong`), empty/reset state, subject filtering, title sorting, detail navigation |
| Reader | PASS, real six-page PDF render; actual phrase search to page 3; programmatic DOM selection of English text-layer content; 200% zoom; first/last bounds; PDF-page URL survives reload |
| Book / Study | PASS, one-based page 3 preserved; Book two-page desktop/one-page mobile; animated page curl visibly unavailable; no StPageFlip integration claimed |
| Keyboard | PASS, Tab/Enter/Space path from home through catalogue/detail/reader; focused page-area arrow navigation; route heading focus; return retains query; mobile-menu Escape restores focus |
| Responsive and motion | PASS, no whole-page horizontal overflow in tested routes, plus 320×640 and 800×360 reader checks; page preserved; sampled core targets ≥44 CSS px; reduced-motion setting has no active animations |
| Failure recovery | PASS, intercepted PDF request fails visibly, direct PDF link remains, retry restores the page after interception is removed |
| Console / network | PASS in happy-path journeys: no unexpected console/page errors or third-party browser requests. The intentional failure-recovery test aborts its PDF request. |
| Text / focus contrast | PASS for sampled opaque HTML colors and states: 60 text samples per viewport, minimum **4.7586:1**; 4 keyboard-focus samples per viewport, minimum **5.4524:1**. Artwork, PDF pixels, all possible states and manual perception are outside this sample. |

Earlier runs caught and corrected a theme control name, a missing favicon request, lost catalogue navigation state, dropped rapid search keystrokes, and a deferred route-focus race. The contrast test was corrected to enter keyboard modality before measuring `:focus-visible`; a pointer-focused element is not the keyboard focus-ring state. The table above reports the final unchanged application build.

## Reproducible evidence

- [Run summary](qa/run-summary.json): per-project test status, duration, tool/environment data.
- [Screenshot manifest](qa/screenshot-manifest.json): 36 actual browser screenshots, paths and SHA-256 values.
- Contrast JSON: [1440](qa/contrast-desktop-1440.json), [1280](qa/contrast-desktop-1280.json), [390](qa/contrast-mobile-390.json), [360](qa/contrast-mobile-360.json).

| Viewport | Hybrid | A · Grand Library | B · Conservatory | C · Editorial |
| --- | --- | --- | --- | --- |
| 1440×900 | [Image](qa/screenshots/desktop-1440-home-hybrid.png) | [Image](qa/screenshots/desktop-1440-home-library.png) | [Image](qa/screenshots/desktop-1440-home-conservatory.png) | [Image](qa/screenshots/desktop-1440-home-editorial.png) |
| 1280×800 | [Image](qa/screenshots/desktop-1280-home-hybrid.png) | [Image](qa/screenshots/desktop-1280-home-library.png) | [Image](qa/screenshots/desktop-1280-home-conservatory.png) | [Image](qa/screenshots/desktop-1280-home-editorial.png) |
| 390×844 | [Image](qa/screenshots/mobile-390-home-hybrid.png) | [Image](qa/screenshots/mobile-390-home-library.png) | [Image](qa/screenshots/mobile-390-home-conservatory.png) | [Image](qa/screenshots/mobile-390-home-editorial.png) |
| 360×800 | [Image](qa/screenshots/mobile-360-home-hybrid.png) | [Image](qa/screenshots/mobile-360-home-library.png) | [Image](qa/screenshots/mobile-360-home-conservatory.png) | [Image](qa/screenshots/mobile-360-home-editorial.png) |

The same screenshot directory includes catalogue, detail, Study, Book and 320 px reader images for every project. These are full-page captures after fonts and PDF rendering, not stored image-diff baselines or user testing.

## Explicitly not run / unavailable

NOT_RUN: manual NVDA, VoiceOver or TalkBack; tagged/untagged real ANV reading order; formula clipboard fidelity; Vietnamese text inside the English-only PDF; actual Windows/Android/iOS font fallback; manual 200% HTML text scaling; real touch pinch/long-press; native PDF toolbar interaction; Firefox/WebKit; throttled/offline full-load tests; large legal PDF cancellation/memory stress and 50 turns on a mid-range phone; human five-second visual comprehension and final art-direction selection.

Unavailable by design: animated page curl, PDF annotation/outline UI, persistent user bookmarks, real ANV content, backend, authentication, analytics and deployment. The fixture has no embedded outline or accessibility tags. A concise HTML description and direct demo-PDF link remain available; they do not turn the PDF into an accessible tagged document.

Next bounded review: select an art direction from matched screenshots, manually test screen readers and real-device reading, and evaluate a separately rights-cleared representative PDF before approving more reader scope or any real-content publication. Software/demo-asset redistribution licensing remains a separate project decision.
