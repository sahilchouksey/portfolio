# Dark -> Light Replacement Map (Approved v1)

Date: 2026-02-16
Status: YOLO baseline applied (phase-1 wide pass)
Scope: Global token/literal mapping before sub-agent component refinements.

## Recommended Base Palette (Light)

- `--bg-base: #fcfcfd`
- `--bg-subtle: #f9f9fb`
- `--surface: #ffffff`
- `--surface-elevated: #f0f0f3`
- `--text-primary: #1c2024`
- `--text-secondary: #60646c`
- `--text-muted: #8b8d98`
- `--text-inverse: #ffffff`
- `--border-subtle: #e0e1e6`
- `--border-default: #d9d9e0`
- `--border-strong: #b9bbc6`
- `--accent-primary: #00a2c7`
- `--accent-hover: #0797b9`
- `--accent-soft-bg: #def7f9`
- `--accent-soft-border: rgba(0, 162, 199, 0.22)`

## Applied So Far (filesystem truth)

### 1) Global token layer + prefers-color-scheme
- Added in `public/original-styles.css`
- Dark defaults retained
- Light overrides enabled with `@media (prefers-color-scheme: light)`

### 2) Global utility remap
- Mapped common classes to tokens in `public/original-styles.css`:
  - `body`, `.background`, `.page-wrapper`
  - `.card`, `.contact-card`, `.footer-card`, `.navigation-container`, etc.
  - `.button`, `.button-submit`, `.button-small`
  - `.text-color-*`, nav links, typography utility colors

### 3) Component-level tokenization started
- `src/components/sections/Timeline.css`
  - timeline + education + project + large blog section now largely tokenized
  - keeps existing structure, swaps literals to theme vars

### 4) Meta/manifest theme sync
- `index.html` now has dual `theme-color` meta tags (dark/light media)
- `public/manifest.json` set to light-safe neutral (`#fcfcfd`)
- `public/site.webmanifest` set to light-safe neutral (`#fcfcfd`)

## Remaining after this pass

1. Fine-grained contrast tuning per component (especially hover states).
2. Replace remaining hardcoded literals in `Timeline.css` and `animations.css` special blocks where needed.
3. Sub-agent component passes (the 10 planned tracks).
4. Regression QA for dark mode parity.

## Notes

- Artistic neon ASCII/matrix colors are intentionally not force-removed in this phase.
- This is the baseline enablement pass; component polish is next.
