# Prototype design and boundaries

The visual system pairs an editorial grid with restrained daylight, an original imagined reading room, and a limited walnut architectural frame. Text navigation and an editorial publication list remain primary. There is no simulated bookshelf navigation or Knowledge Garden graph.

The visible art-direction selector compares **Sunlit Archive** (hybrid), **A Grand Library**, **B Sunlit Conservatory**, and **C Scholarly Editorial**. It changes only CSS variables and illustration treatment. Titles, hierarchy, sample records, CTA and routes are identical. It is a local aesthetic comparison, not a permanent multi-theme product commitment or aesthetic approval.

| Token | Hybrid value | Use |
| --- | --- | --- |
| Paper | `#F6F1E6` | Warm page background |
| Surface | `#FFFBF2` | Plain reading/control surfaces |
| Ink | `#061A31` | Body, controls, primary action |
| Walnut | `#493527` | Hero heading / architecture |
| Accent | `#496450` | Secondary text, focus ring, controls |
| Muted | `#5A6058` | Supporting copy |
| Gold candidate | `#A87933` | Not used for ordinary UI text; insufficient contrast on paper |

Lora supplies serif editorial headings; Be Vietnam Pro supplies UI text, with Georgia/Noto Sans/Arial system fallbacks. Unmodified Latin and Vietnamese subsets are self-hosted with OFL notices. Actual computed HTML text/hover/focus colors are sampled by tests; decorative illustration pixels and PDF pixels are excluded from those calculations. No accessibility conformance claim follows.

React + Vite + TypeScript + Tailwind CSS run entirely in the local browser. PDF.js and its worker load only on entering the Reader route. Only the one or two visible pages have canvases; changing pages cancels old render/text tasks, and leaving the Reader destroys the document worker. Text indexing is lazy on the first search and covers this six-page fixture only. There is no whole-document raster cache or claim of large-document/mobile memory qualification.

One-based PDF page and reading mode live in URL query parameters, outside the page renderer. Experimental Book is a static one/two-page layout of actual PDF pages, not a page-flip engine. There is no 0-based adapter, hard-cover simulation, swipe capture or page-curl claim. The animated control is explicitly disabled. Study remains the default and supports tested basic text-layer selection, phrase-to-page search and zoom for the synthetic fixture. Native PDF access is independent of custom rendering. A concise HTML alternative describes the fixture; its PDF has no accessibility tags or outline.

All sample IDs start with `demo-`. ANV identifiers are not issued, and chronology never becomes a prerequisite/difficulty chain. Unknown author/release/version data remain visibly unverified. Each sample detail explains its scope and the shared PDF fixture. No backend, authentication, analytics, CMS, database, sync, deployment configuration, CI workflow, secret, or package publication is included.
